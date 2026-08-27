import React from 'react';
import {
  Settings,
  Smartphone,
  ShieldCheck,
  User,
  Phone,
  Code2,
  Trash2,
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAllProjects?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onClearAllProjects,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center">
              <Settings className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">إعدادات التطبيق ومعلومات المطور</h2>
              <p className="text-xs text-slate-400">HOTSPOT PLUS iOS Edition</p>
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
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Developer Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-800/40 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 font-bold text-base">
                <User className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">عمار أحمد</h3>
                <span className="text-[11px] text-cyan-400 font-semibold">مطور ومبرمج التطبيق</span>
              </div>
            </div>

            <div className="pt-2 border-t border-blue-900/40 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>رقم التواصل والدعم:</span>
              </div>
              <a href="tel:782727242" className="text-white font-mono font-bold hover:text-cyan-300" dir="ltr">
                782727242
              </a>
            </div>
          </div>

          {/* Technical App Specifications */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <h4 className="font-bold text-slate-200">مواصفات حزمة التطبيق (App Specs):</h4>

            <div className="space-y-2 text-slate-400 font-mono text-[11px]" dir="ltr">
              <div className="flex justify-between pb-1 border-b border-slate-900">
                <span className="text-slate-500">App Name:</span>
                <span className="text-white font-bold">HOTSPOT PLUS (هوت سبوت بلس)</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-900">
                <span className="text-slate-500">Bundle Identifier:</span>
                <span className="text-cyan-400">com.hotspotplus.app</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-900">
                <span className="text-slate-500">Target Device:</span>
                <span className="text-white">iPhone 13 Pro Max (iOS 26 Compatible)</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-900">
                <span className="text-slate-500">Deployment Target:</span>
                <span className="text-emerald-400">iOS 15.0</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-900">
                <span className="text-slate-500">Backend AI Engine:</span>
                <span className="text-purple-400">Gemini 2.5 Server-Side Proxy</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CI/CD Automation:</span>
                <span className="text-white">Codemagic (xcode-project build-ipa)</span>
              </div>
            </div>
          </div>

          {/* Data Reset */}
          {onClearAllProjects && (
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2">
              <h4 className="font-bold text-rose-400 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4" />
                <span>إدارة الذاكرة والمشاريع</span>
              </h4>
              <p className="text-slate-400 text-[11px]">
                يمكنك إعادة تعيين وحذف كافة المشاريع المحلية واسترجاع القوالب الافتراضية.
              </p>
              <button
                onClick={() => {
                  if (confirm('هل أنت متأكد من رغبتك في حذف جميع المشاريع المحفوظة؟')) {
                    onClearAllProjects();
                    onClose();
                  }
                }}
                className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition"
              >
                مسح جميع المشاريع المحفوظة
              </button>
            </div>
          )}
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
