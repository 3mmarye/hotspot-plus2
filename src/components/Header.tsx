import React from 'react';
import {
  ChevronRight,
  Sliders,
  Code2,
  FolderTree,
  Smartphone,
  Sparkles,
  HeartPulse,
  Download,
  History,
  Save,
  HelpCircle,
  Settings,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { HealthReport } from '../types';

interface HeaderProps {
  projectName?: string;
  networkName?: string;
  activeTab: 'visual' | 'code' | 'files' | 'simulator';
  onTabChange: (tab: 'visual' | 'code' | 'files' | 'simulator') => void;
  onBackToHome?: () => void;
  onOpenAI: () => void;
  onOpenHealth: () => void;
  onOpenExport: () => void;
  onOpenHistory: () => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
  onSaveSnapshot: () => void;
  healthReport?: HealthReport | null;
  isSaved?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  projectName,
  networkName,
  activeTab,
  onTabChange,
  onBackToHome,
  onOpenAI,
  onOpenHealth,
  onOpenExport,
  onOpenHistory,
  onOpenHelp,
  onOpenSettings,
  onSaveSnapshot,
  healthReport,
  isSaved = true,
}) => {
  const isInsideProject = !!projectName;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Left Side: Brand or Back Button + Project Name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {isInsideProject && onBackToHome ? (
            <button
              id="header-back-button"
              onClick={onBackToHome}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-medium"
              title="العودة للرئيسية"
            >
              <ChevronRight className="w-4 h-4" />
              <span className="hidden sm:inline">الرئيسية</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-md flex items-center justify-center">
                <span className="font-black text-xs text-white">H+</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-wide">HOTSPOT PLUS</h1>
                <span className="text-[10px] text-slate-400 block -mt-1" dir="rtl">هوت سبوت بلس</span>
              </div>
            </div>
          )}

          {isInsideProject && (
            <div className="min-w-0 pr-2 border-r border-slate-700/60" dir="rtl">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-slate-100 truncate max-w-[140px] sm:max-w-[200px]">
                  {networkName || projectName}
                </span>
                {isSaved && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded-md hidden md:inline-flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> محفوظ
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Center: Editor Mode Switcher (When inside project) */}
        {isInsideProject && (
          <div className="hidden lg:flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800" dir="rtl">
            <button
              id="tab-visual"
              onClick={() => onTabChange('visual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'visual'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>المحرر البصري</span>
            </button>

            <button
              id="tab-code"
              onClick={() => onTabChange('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'code'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>محرر الكود</span>
            </button>

            <button
              id="tab-files"
              onClick={() => onTabChange('files')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'files'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>إدارة الملفات</span>
            </button>

            <button
              id="tab-simulator"
              onClick={() => onTabChange('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'simulator'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>محاكي iPhone</span>
            </button>
          </div>
        )}

        {/* Right Side: Tools & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {isInsideProject ? (
            <>
              {/* Gemini AI Assistant Button */}
              <button
                id="header-ai-btn"
                onClick={onOpenAI}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/90 to-indigo-600/90 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-sm transition border border-purple-400/30"
                title="مساعد الذكاء الاصطناعي Gemini"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                <span className="hidden sm:inline">مساعد AI</span>
              </button>

              {/* Health Check Badge */}
              <button
                id="header-health-btn"
                onClick={onOpenHealth}
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  (healthReport?.score || 100) >= 90
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900/60'
                    : (healthReport?.score || 100) >= 70
                    ? 'bg-amber-950/60 border-amber-800 text-amber-300 hover:bg-amber-900/60'
                    : 'bg-rose-950/60 border-rose-800 text-rose-300 hover:bg-rose-900/60'
                }`}
                title="فاحص صحة الصفحة"
              >
                <HeartPulse className="w-3.5 h-3.5" />
                <span className="font-mono font-bold">{healthReport?.score ?? 100}%</span>
                <span className="hidden xl:inline text-[11px]">فحص</span>
              </button>

              {/* Save Snapshot / History */}
              <button
                id="header-history-btn"
                onClick={onOpenHistory}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-medium flex items-center gap-1"
                title="سجل النسخ المحفوظة"
              >
                <History className="w-4 h-4" />
                <span className="hidden xl:inline">النسخ</span>
              </button>

              {/* Quick Save Snapshot */}
              <button
                id="header-save-btn"
                onClick={onSaveSnapshot}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-medium flex items-center gap-1"
                title="حفظ نسخة استعادة سريعة"
              >
                <Save className="w-4 h-4" />
                <span className="hidden xl:inline">حفظ</span>
              </button>

              {/* Export to MikroTik */}
              <button
                id="header-export-btn"
                onClick={onOpenExport}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition"
                title="تصدير إلى MikroTik"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير ZIP</span>
              </button>
            </>
          ) : (
            <>
              {/* Home Mode Help & Settings */}
              <button
                id="home-help-btn"
                onClick={onOpenHelp}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-medium"
              >
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">دليل الاستخدام</span>
              </button>

              <button
                id="home-settings-btn"
                onClick={onOpenSettings}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-medium"
              >
                <Settings className="w-4 h-4 text-slate-300" />
                <span className="hidden sm:inline">الإعدادات</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation for Tabs */}
      {isInsideProject && (
        <div className="lg:hidden flex items-center justify-around bg-slate-950 border-t border-slate-800/80 px-2 py-1.5" dir="rtl">
          <button
            onClick={() => onTabChange('visual')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[10px] font-semibold transition ${
              activeTab === 'visual' ? 'text-blue-400 bg-blue-950/40' : 'text-slate-400'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>بصري</span>
          </button>

          <button
            onClick={() => onTabChange('code')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[10px] font-semibold transition ${
              activeTab === 'code' ? 'text-blue-400 bg-blue-950/40' : 'text-slate-400'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>كود</span>
          </button>

          <button
            onClick={() => onTabChange('files')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[10px] font-semibold transition ${
              activeTab === 'files' ? 'text-blue-400 bg-blue-950/40' : 'text-slate-400'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>ملفات</span>
          </button>

          <button
            onClick={() => onTabChange('simulator')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[10px] font-semibold transition ${
              activeTab === 'simulator' ? 'text-blue-400 bg-blue-950/40' : 'text-slate-400'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>محاكي iPhone</span>
          </button>
        </div>
      )}
    </header>
  );
};
