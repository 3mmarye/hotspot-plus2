/**
 * Security utilities for Hotspot Plus:
 * - Anti-Zip Slip defense
 * - Path traversal sanitation
 * - File integrity and size checks
 */

export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB max per single file
export const MAX_PROJECT_SIZE = 60 * 1024 * 1024; // 60MB max total project

const FORBIDDEN_EXTENSIONS = new Set([
  'exe', 'bat', 'sh', 'cmd', 'vbs', 'dll', 'so', 'dylib', 'bin', 'msi', 'apk', 'ipa'
]);

/**
 * Sanitizes a path inside a ZIP archive to prevent Zip Slip and path traversal.
 * Returns null if the path is invalid or malicious.
 */
export function sanitizeArchivePath(rawPath: string): string | null {
  if (!rawPath || typeof rawPath !== 'string') return null;

  // Replace backslashes with forward slashes
  let clean = rawPath.replace(/\\/g, '/');

  // Strip null bytes and non-printable control characters
  clean = clean.replace(/[\x00-\x1f\x7f]/g, '');

  // Strip leading slashes to prevent absolute paths
  clean = clean.replace(/^\/+/, '');

  // Split and validate every segment
  const segments = clean.split('/');
  const safeSegments: string[] = [];

  for (const seg of segments) {
    const trimmed = seg.trim();
    if (!trimmed || trimmed === '.') {
      continue; // ignore empty or current dir
    }
    if (trimmed === '..' || trimmed.includes('..') || trimmed.includes('%2e%2e')) {
      // Path traversal attempt detected!
      console.warn(`[Security Alert] Blocked traversal segment: ${seg}`);
      return null;
    }
    // Block windows drive letters like C:
    if (/^[a-zA-Z]:$/.test(trimmed)) {
      console.warn(`[Security Alert] Blocked drive letter segment: ${seg}`);
      return null;
    }
    safeSegments.push(trimmed);
  }

  if (safeSegments.length === 0) return null;

  const finalPath = safeSegments.join('/');

  // Check file extension
  const ext = finalPath.split('.').pop()?.toLowerCase();
  if (ext && FORBIDDEN_EXTENSIONS.has(ext)) {
    console.warn(`[Security Alert] Blocked forbidden executable extension: .${ext}`);
    return null;
  }

  return finalPath;
}

/**
 * Determines MIME type from file extension
 */
export function getMimeType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'html':
    case 'htm':
      return 'text/html;charset=utf-8';
    case 'css':
      return 'text/css;charset=utf-8';
    case 'js':
      return 'application/javascript;charset=utf-8';
    case 'json':
      return 'application/json';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'svg':
      return 'image/svg+xml';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'ico':
      return 'image/x-icon';
    case 'woff':
      return 'font/woff';
    case 'woff2':
      return 'font/woff2';
    case 'ttf':
      return 'font/ttf';
    case 'eot':
      return 'application/vnd.ms-fontobject';
    case 'txt':
      return 'text/plain;charset=utf-8';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Determines whether a file path is considered binary
 */
export function isBinaryFile(filePath: string): boolean {
  const ext = filePath.split('.').pop()?.toLowerCase();
  const binaryExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'woff', 'woff2', 'ttf', 'eot', 'otf', 'mp3', 'wav'];
  return !!ext && binaryExts.includes(ext);
}
