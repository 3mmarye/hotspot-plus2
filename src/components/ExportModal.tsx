import React, { useState } from 'react';
import {
  Download,
  FileArchive,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Server,
  FolderOpen,
  HelpCircle,
  X,
  Sparkles
} from 'lucide-react';
import { HotspotProject, HealthReport } from '../types';
import { packHotspotZip } from '../utils/zipHandler';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: HotspotProject;
  healthReport: HealthReport;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  healthReport,
}) => {
  const defaultName = `HotspotPlus_${(project.networkName || project.name || 'Hotspot').replace(/\s+/g, '_')}`;
  const [archiveName, setArchiveName] = useState(defaultName);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const { blob, filename } = await packHotspotZip(project.files, archiveName);

      // Create download link in browser / iOS
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
    } catch (err: any) {
      alert(`حدث خطأ أثناء حزم ملف ZIP: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950/60 via-slate-900 to-cyan-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>تصدير صفحة الهوتسبوت (MikroTik ZIP)</span>
              </h2>
              <p className="text-xs text-slate-400">حزم مشروعك في ملف ZIP نظيف وجاهز للرفع الفوري إلى راوتر المايكروتك</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1">
          {/* Health Status check badge */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
            healthReport.score >= 80
              ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
              : 'bg-amber-950/30 border-amber-800/60 text-amber-300'
          }`}>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="text-xs font-bold text-slate-100">فحص الجودة: {healthReport.score}%</h4>
                <p className="text-[11px] text-slate-300">
                  {healthReport.score >= 80
                    ? 'الملفات سليمة والمتغيرات مؤمنة بنسبة 100%.'
                    : 'يوجد بعض التنبيهات، يفضل مراجعة فاحص الصحة.'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              {Object.keys(project.files).length} ملفات
            </span>
          </div>

          {/* Archive Name Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              اسم ملف الـ ZIP المصدر:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={archiveName}
                onChange={(e) => setArchiveName(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                dir="ltr"
              />
              <span className="text-xs font-mono text-slate-400">.zip</span>
            </div>
          </div>

          {/* Download Action */}
          <button
            id="btn-confirm-export"
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'جاري حزم وضغط ملفات المشروع...' : 'تحميل وتنزيل ملف ZIP الآن'}</span>
          </button>

          {exportSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>تم تجهيز وتحميل ملف الـ ZIP بنجاح! يمكنك الآن رفعه إلى راوتر المايكروتك.</span>
            </div>
          )}

          {/* MikroTik Upload Guide */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Server className="w-4 h-4" />
              <span>طريقة رفع الصفحة إلى راوتر المايكروتك (MikroTik RouterOS):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-blue-400 block">1. فك ضغط الملف</span>
                <p className="text-[11px] text-slate-400">
                  قم بفك ضغط ملف الـ ZIP على جهازك لتحصل على مجلد يحتوي على ملفات الهوتسبوت (مثل `login.html`).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-blue-400 block">2. الفتح عبر Winbox</span>
                <p className="text-[11px] text-slate-400">
                  افتح برنامج Winbox وسجل دخولك للراوتر، ثم توجه إلى قائمة <b>Files</b> من القائمة الجانبية.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-blue-400 block">3. سحب وإفلات المجلد</span>
                <p className="text-[11px] text-slate-400">
                  اسحب مجلد الصفحة وأفلته داخل قائمة <b>Files</b> أو ارفعه عبر عميل FTP.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-blue-400 block">4. تعيين المجلد كصفحة هوتسبوت</span>
                <p className="text-[11px] text-slate-400">
                  من <b>IP &gt; Hotspot &gt; Server Profiles</b>، اختر البروفايل وضع اسم المجلد في خانة <b>HTML Directory</b>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            HOTSPOT PLUS • Developer: Ammar Ahmed (782727242)
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
