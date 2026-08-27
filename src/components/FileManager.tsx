import React, { useRef, useState } from 'react';
import {
  FolderTree,
  FileCode,
  Image as ImageIcon,
  FileText,
  File,
  Plus,
  Upload,
  Trash2,
  Edit2,
  Eye,
  Download,
  AlertTriangle,
  FolderPlus,
  Check
} from 'lucide-react';
import { HotspotProject, HotspotFile } from '../types';
import { getMimeType, isBinaryFile, sanitizeArchivePath } from '../utils/security';

interface FileManagerProps {
  project: HotspotProject;
  onOpenFileInEditor: (filePath: string) => void;
  onUpdateFiles: (updatedFiles: Record<string, HotspotFile>) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({
  project,
  onOpenFileInEditor,
  onUpdateFiles,
}) => {
  const files = project.files || {};
  const [newFileName, setNewFileName] = useState('');
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ path: string; src: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group files by directory
  const fileList = Object.keys(files).sort();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const updated = { ...files };
      const selectedFiles = Array.from(e.target.files) as File[];

      selectedFiles.forEach((file: File) => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        let targetDir = '';
        if (['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp', 'ico'].includes(ext || '')) {
          targetDir = 'img/';
        } else if (ext === 'css') {
          targetDir = 'css/';
        } else if (ext === 'js') {
          targetDir = 'js/';
        } else if (['woff', 'woff2', 'ttf', 'eot'].includes(ext || '')) {
          targetDir = 'fonts/';
        }

        const safePath = sanitizeArchivePath(`${targetDir}${file.name}`) || file.name;
        const isBinary = isBinaryFile(safePath);
        const mime = getMimeType(safePath);

        const reader = new FileReader();
        if (isBinary) {
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            updated[safePath] = {
              path: safePath,
              name: file.name,
              mimeType: mime,
              content: base64,
              isBinary: true,
              size: file.size,
            };
            onUpdateFiles(updated);
          };
          reader.readAsDataURL(file);
        } else {
          reader.onload = (event) => {
            const text = event.target?.result as string;
            updated[safePath] = {
              path: safePath,
              name: file.name,
              mimeType: mime,
              content: text,
              isBinary: false,
              size: file.size,
            };
            onUpdateFiles(updated);
          };
          reader.readAsText(file);
        }
      });

      e.target.value = '';
    }
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    const safePath = sanitizeArchivePath(newFileName.trim());
    if (!safePath) {
      alert('اسم الملف غير صالح.');
      return;
    }

    if (files[safePath]) {
      alert('الملف موجود بالفعل.');
      return;
    }

    const mime = getMimeType(safePath);
    const updated = {
      ...files,
      [safePath]: {
        path: safePath,
        name: safePath.split('/').pop() || safePath,
        mimeType: mime,
        content: safePath.endsWith('.html') ? '<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n<head><title>صفحة جديدة</title></head>\n<body>\n</body>\n</html>' : '',
        isBinary: false,
        size: 0,
      },
    };

    onUpdateFiles(updated);
    setNewFileName('');
    setShowNewFileModal(false);
    onOpenFileInEditor(safePath);
  };

  const handleDeleteFile = (filePath: string) => {
    if (filePath === 'index.html' || filePath === 'login.html') {
      if (!confirm(`⚠️ تحذير: هذا الملف (${filePath}) هو ملف الدخول الرئيسي. حذفه قد يعطل الهوتسبوت. هل أنت متأكد من الحذف؟`)) {
        return;
      }
    } else {
      if (!confirm(`هل أنت متأكد من حذف الملف "${filePath}"؟`)) {
        return;
      }
    }

    const updated = { ...files };
    delete updated[filePath];
    onUpdateFiles(updated);
  };

  return (
    <div id="file-manager" className="h-full flex flex-col bg-slate-950 text-slate-100 p-4 sm:p-6 overflow-y-auto" dir="rtl">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        className="hidden"
      />

      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-cyan-400" />
              <span>مستعرض ملفات الهوتسبوت</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              إجمالي {fileList.length} ملفات داخل مجلد صفحة المايكروتك
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>رفع ملفات / صور</span>
            </button>

            <button
              onClick={() => setShowNewFileModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إنشاء ملف جديد</span>
            </button>
          </div>
        </div>

        {/* Files Grid / List */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
          {fileList.map((filePath) => {
            const file = files[filePath];
            const isImg = file.isBinary && file.mimeType.startsWith('image/');

            return (
              <div
                key={filePath}
                className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/40 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {filePath.endsWith('.html') ? (
                      <FileCode className="w-4 h-4 text-blue-400" />
                    ) : filePath.endsWith('.css') ? (
                      <FileText className="w-4 h-4 text-cyan-400" />
                    ) : filePath.endsWith('.js') ? (
                      <FileCode className="w-4 h-4 text-yellow-400" />
                    ) : isImg ? (
                      <ImageIcon className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <File className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-100 truncate" dir="ltr">
                        {filePath}
                      </span>
                      {(filePath === 'index.html' || filePath === 'login.html') && (
                        <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/60 px-1.5 py-0.2 rounded font-semibold">
                          رئيسي
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono" dir="ltr">
                      {(file.size / 1024).toFixed(1)} KB • {file.mimeType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isImg ? (
                    <button
                      onClick={() => setPreviewImage({ path: filePath, src: file.content })}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="معاينة الصورة"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenFileInEditor(filePath)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-semibold transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>تعديل الكود</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteFile(filePath)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 transition"
                    title="حذف الملف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for New File */}
        {showNewFileModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
              <h3 className="text-sm font-bold text-white">إنشاء ملف جديد في المشروع</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  مسار الملف (مثال: css/custom.css أو login2.html)
                </label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="custom.css"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowNewFileModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleCreateFile}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl"
                >
                  إنشاء الملف
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Preview Modal */}
        {previewImage && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 max-w-md w-full space-y-3" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between text-xs font-mono text-slate-300" dir="ltr">
                <span>{previewImage.path}</span>
                <button onClick={() => setPreviewImage(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <div className="w-full h-64 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-2 overflow-hidden">
                <img src={previewImage.src} alt={previewImage.path} className="max-w-full max-h-full object-contain" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
