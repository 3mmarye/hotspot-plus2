import JSZip from 'jszip';
import { HotspotFile } from '../types';
import { sanitizeArchivePath, getMimeType, isBinaryFile, MAX_PROJECT_SIZE } from './security';

/**
 * Extracts a ZIP archive safely, defending against Zip Slip & Traversal
 */
export async function unpackHotspotZip(zipFile: Blob | File | ArrayBuffer): Promise<{
  files: Record<string, HotspotFile>;
  rootHtmlPath: string;
  totalSize: number;
}> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(zipFile);

  const files: Record<string, HotspotFile> = {};
  let totalSize = 0;
  let rootHtmlPath = 'index.html';
  let foundHtml = false;

  const entries = Object.keys(loadedZip.files);

  for (const rawPath of entries) {
    const entry = loadedZip.files[rawPath];
    if (entry.dir) continue;

    // Secure path sanitization against Zip Slip
    const safePath = sanitizeArchivePath(rawPath);
    if (!safePath) {
      console.warn(`[ZIP Import] Skipped unsafe entry: ${rawPath}`);
      continue;
    }

    const mime = getMimeType(safePath);
    const isBinary = isBinaryFile(safePath);

    let content: string;
    let size = 0;

    if (isBinary) {
      const base64Data = await entry.async('base64');
      content = `data:${mime};base64,${base64Data}`;
      size = base64Data.length * 0.75;
    } else {
      content = await entry.async('string');
      size = new Blob([content]).size;
    }

    totalSize += size;
    if (totalSize > MAX_PROJECT_SIZE) {
      throw new Error(`حجم ملفات المشروع يتجاوز الحد المسموح به (60MB).`);
    }

    const fileName = safePath.split('/').pop() || safePath;

    files[safePath] = {
      path: safePath,
      name: fileName,
      mimeType: mime,
      content,
      isBinary,
      size,
    };

    // Locate primary entry HTML
    if (!foundHtml) {
      if (fileName.toLowerCase() === 'login.html' || fileName.toLowerCase() === 'index.html') {
        rootHtmlPath = safePath;
        foundHtml = true;
      } else if (fileName.toLowerCase().endsWith('.html') && !fileName.toLowerCase().includes('status')) {
        rootHtmlPath = safePath;
      }
    }
  }

  // If no html file was in zip, provide a fallback index.html
  if (Object.keys(files).length === 0) {
    throw new Error('الملف المضغوط فارغ أو لا يحتوي على ملفات صالحة.');
  }

  return {
    files,
    rootHtmlPath,
    totalSize,
  };
}

/**
 * Packs the project files into a genuine, clean MikroTik ZIP archive
 */
export async function packHotspotZip(
  files: Record<string, HotspotFile>,
  archiveName: string = 'HotspotPlus'
): Promise<{ blob: Blob; filename: string }> {
  const zip = new JSZip();

  for (const filePath in files) {
    const file = files[filePath];
    const safePath = sanitizeArchivePath(filePath);
    if (!safePath) continue;

    if (file.isBinary) {
      // Decode base64 data URL
      const commaIdx = file.content.indexOf(',');
      const base64 = commaIdx >= 0 ? file.content.substring(commaIdx + 1) : file.content;
      zip.file(safePath, base64, { base64: true });
    } else {
      zip.file(safePath, file.content);
    }
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const cleanName = archiveName.replace(/[^a-zA-Z0-9_\-\u0600-\u06FF]/g, '_');
  const filename = `${cleanName}.zip`;

  return { blob, filename };
}
