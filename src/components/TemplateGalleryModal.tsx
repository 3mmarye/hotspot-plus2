import React from 'react';
import {
  LayoutGrid,
  PlusCircle,
  CheckCircle2,
  X,
  Zap,
  Sparkles,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { TEMPLATES, TemplateDefinition } from '../data/templates';
import { HotspotProject } from '../types';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (project: HotspotProject) => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>معرض قوالب هوت سبوت الجاهزة</span>
                <span className="text-[10px] bg-blue-950 text-cyan-300 border border-blue-800/60 px-2 py-0.5 rounded-full font-bold">
                  MikroTik Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">قوالب احترافية مجهزة بكافة ملفات الدخول والحالة ومتغيرات المايكروتك</p>
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
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/60 p-5 flex flex-col justify-between transition group shadow-md"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-slate-800">
                      {tmpl.badge}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: tmpl.primaryColor }} />
                      <span className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: tmpl.secondaryColor }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: tmpl.bgColor }} />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition mb-1.5">
                    {tmpl.name}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {tmpl.description}
                  </p>

                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 font-mono mb-4">
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">login.html</span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">status.html</span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">style.css</span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">app.js</span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">logo.svg</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const project = tmpl.createProject();
                    onSelectTemplate(project);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition active:scale-[0.99]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>إنشاء مشروع من هذا القالب</span>
                </button>
              </div>
            ))}
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
