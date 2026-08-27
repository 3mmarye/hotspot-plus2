import React from 'react';
import {
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Wrench,
  ShieldCheck,
  FileCheck,
  X,
  Zap
} from 'lucide-react';
import { HotspotProject, HealthReport } from '../types';

interface HealthCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: HotspotProject;
  report: HealthReport;
  onAutoFix: () => void;
}

export const HealthCheckModal: React.FC<HealthCheckModalProps> = ({
  isOpen,
  onClose,
  project,
  report,
  onAutoFix,
}) => {
  if (!isOpen) return null;

  const autoFixableCount = report.issues.filter(i => i.autoFixable).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
              report.score >= 90
                ? 'bg-emerald-600 shadow-emerald-600/30'
                : report.score >= 70
                ? 'bg-amber-600 shadow-amber-600/30'
                : 'bg-rose-600 shadow-rose-600/30'
            }`}>
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>فاحص صحة صفحة الهوتسبوت</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400">
                  {report.score} / 100
                </span>
              </h2>
              <p className="text-xs text-slate-400">فحص شامل للتوافق مع سيرفر المايكروتك وسلامة العناصر والروابط</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Score Overview Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-slate-900 border-2 border-slate-700 font-mono font-black text-xl text-white">
                <span>{report.score}%</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {report.score >= 90
                    ? 'الصفحة ممتازة وجاهزة تماماً للتصدير والتشغيل'
                    : report.score >= 70
                    ? 'الصفحة جيدة مع بعض التحذيرات الطفيفة'
                    : 'توجد أخطاء حرجة يجب معالجتها قبل التصدير'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  إجمالي الملفات: {report.totalFiles} • الحجم: {report.totalSizeFormatted} • المتغيرات المكتشفة: {report.mikrotikFound.length}
                </p>
              </div>
            </div>

            {autoFixableCount > 0 && (
              <button
                onClick={onAutoFix}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-2 transition shrink-0"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>إصلاح تلقائي ({autoFixableCount})</span>
              </button>
            )}
          </div>

          {/* Issue List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300">تفاصيل الفحص والنتائج:</h4>

            {report.issues.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>تهانينا! لم يتم العثور على أي أخطاء أو مشاكل في صفحة الهوتسبوت.</span>
              </div>
            ) : (
              report.issues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-3.5 rounded-xl border space-y-1.5 ${
                    issue.type === 'error'
                      ? 'bg-rose-950/30 border-rose-800/60'
                      : issue.type === 'warning'
                      ? 'bg-amber-950/30 border-amber-800/60'
                      : 'bg-blue-950/30 border-blue-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {issue.type === 'error' ? (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      ) : issue.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      )}
                      <span className="text-xs font-bold text-slate-100">{issue.title}</span>
                    </div>
                    {issue.file && (
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800" dir="ltr">
                        {issue.file}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 pr-6">{issue.description}</p>

                  {issue.fixSuggestion && (
                    <div className="pr-6 pt-1 text-[11px] text-cyan-400 flex items-center gap-1">
                      <span>💡 نصيحة الحل:</span>
                      <span className="text-slate-300">{issue.fixSuggestion}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
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
