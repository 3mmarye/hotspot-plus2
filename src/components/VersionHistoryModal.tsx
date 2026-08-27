import React, { useState } from 'react';
import {
  History,
  RotateCcw,
  PlusCircle,
  Clock,
  FileCheck,
  X,
  CheckCircle2,
  Trash2,
  Calendar
} from 'lucide-react';
import { HotspotProject, ProjectVersion } from '../types';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: HotspotProject;
  onCreateSnapshot: (note?: string) => void;
  onRestoreVersion: (versionId: string) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  project,
  onCreateSnapshot,
  onRestoreVersion,
}) => {
  const [snapshotNote, setSnapshotNote] = useState('');
  const versions = project.versions || [];

  if (!isOpen) return null;

  const handleCreate = () => {
    onCreateSnapshot(snapshotNote || 'نقطة استعادة يدوية');
    setSnapshotNote('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">سجل النسخ ونقاط الاستعادة</h2>
              <p className="text-xs text-slate-400">الرجوع لأي إصدار سابق من الصفحة بنقرة واحدة</p>
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
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Create new snapshot */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300">إنشاء نقطة استعادة جديدة الآن</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={snapshotNote}
                onChange={(e) => setSnapshotNote(e.target.value)}
                placeholder="ملاحظة النسخة (مثال: قبل تغيير الألوان)"
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>حفظ نقطة</span>
              </button>
            </div>
          </div>

          {/* Versions List */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400">النسخ السابقة المحفوظة ({versions.length}):</h4>

            {versions.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800 text-xs text-slate-500">
                لا توجد نقاط استعادة سابقة حتى الآن. يمكنك إنشاء نسخة يدوياً في الأعلى.
              </div>
            ) : (
              versions.map((ver) => (
                <div
                  key={ver.id}
                  className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 hover:border-slate-700 transition"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{ver.name}</span>
                      {ver.note && (
                        <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 truncate">
                          {ver.note}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                      <Clock className="w-3 h-3 text-slate-600" />
                      <span>{new Date(ver.timestamp).toLocaleString('ar-YE')}</span>
                      <span>•</span>
                      <span>{ver.snapshot.networkName}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من استعادة النسخة "${ver.name}"؟ سيتم استبدال التعديلات الحالية.`)) {
                        onRestoreVersion(ver.id);
                        onClose();
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>استعادة</span>
                  </button>
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
