import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  UploadCloud,
  PlusCircle,
  LayoutGrid,
  FileArchive,
  Search,
  Calendar,
  Layers,
  Trash2,
  Copy,
  Download,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { HotspotProject } from '../types';
import { TEMPLATES } from '../data/templates';

interface HomeViewProps {
  projects: HotspotProject[];
  onOpenProject: (project: HotspotProject) => void;
  onNewProject: () => void;
  onImportZip: (file: File) => void;
  onOpenTemplates: () => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
  onDuplicateProject: (project: HotspotProject) => void;
  onDeleteProject: (projectId: string) => void;
  onQuickExport: (project: HotspotProject) => void;
  isImporting?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  projects,
  onOpenProject,
  onNewProject,
  onImportZip,
  onOpenTemplates,
  onOpenHelp,
  onOpenSettings,
  onDuplicateProject,
  onDeleteProject,
  onQuickExport,
  isImporting = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.networkName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.phone && p.phone.includes(searchQuery))
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith('.zip') || file.type.includes('zip') || file.type.includes('compressed')) {
        onImportZip(file);
      } else {
        alert('الرجاء اختيار ملف مضغوط بصيغة ZIP يحتوي على صفحة الهوتسبوت.');
      }
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onImportZip(file);
    }
  };

  return (
    <div id="home-view" className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hidden File Input for iOS / Web Picker */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".zip,application/zip,application/x-zip-compressed"
          className="hidden"
          id="ios-zip-picker"
        />

        {/* Top Banner / Welcome */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>HOTSPOT PLUS • MikroTik Studio</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                مرحباً بك في هوت سبوت بلس
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                استورد صفحة شبكتك بصيغة ZIP وعدلها بصرياً وبكل سهولة مع حماية كاملة لمتغيرات MikroTik ومحاكاة iPhone 13 Pro Max في الوقت الفعلي.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                id="btn-import-zip"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition transform active:scale-95 disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isImporting ? 'جاري فك واستيراد الـ ZIP...' : 'استيراد صفحة (ZIP)'}</span>
              </button>

              <button
                id="btn-new-project"
                onClick={onNewProject}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition"
              >
                <PlusCircle className="w-4 h-4 text-cyan-400" />
                <span>مشروع جديد</span>
              </button>

              <button
                id="btn-open-templates"
                onClick={onOpenTemplates}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition"
              >
                <LayoutGrid className="w-4 h-4 text-purple-400" />
                <span>القوالب الجاهزة</span>
              </button>
            </div>
          </div>
        </div>

        {/* Drag & Drop Import Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? 'border-cyan-400 bg-cyan-950/20 shadow-inner'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-900/30 border border-blue-500/20 flex items-center justify-center text-cyan-400">
            <UploadCloud className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">اسحب وأفلت ملف ZIP لصفحة الهوتسبوت هنا</h3>
            <p className="text-xs text-slate-400 mt-1">أو انقر لاختيار الملف من تطبيق الملفات (Files) بجهازك</p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> حماية ZIP Slip</span>
            <span>•</span>
            <span>استخراج آمن للـ HTML والـ CSS والصور</span>
          </div>
        </div>

        {/* Templates Quick Carousel / Highlights */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">قوالب احترافية جاهزة</h2>
            </div>
            <button
              onClick={onOpenTemplates}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>عرض جميع القوالب ({TEMPLATES.length})</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => {
                  const p = tmpl.createProject();
                  onOpenProject(p);
                }}
                className="group cursor-pointer rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-950 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {tmpl.badge}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tmpl.primaryColor }} />
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tmpl.secondaryColor }} />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition mb-1">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-400">
                  <span>إنشاء الآن</span>
                  <PlusCircle className="w-4 h-4 group-hover:scale-110 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Projects Section */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold text-white">مشاريعي المحفوظة</h2>
              <span className="text-xs px-2 py-0.5 bg-slate-800 rounded-full text-slate-400 font-mono">
                {projects.length}
              </span>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث عن مشروع أو شبكة..."
                className="w-full pl-3 pr-9 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
              <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
                <FileArchive className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-300">لا توجد مشاريع مطابقة</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                ابدأ باستيراد ملف ZIP لصفحة شبكتك أو اختر قالباً جاهزاً من القوالب في الأعلى.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  id={`project-card-${project.id}`}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-5 flex flex-col justify-between transition group shadow-md"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-800/40">
                          {project.networkName || 'شبكة بدون اسم'}
                        </span>
                        <h3 className="text-base font-bold text-white truncate mt-1.5 group-hover:text-blue-400 transition">
                          {project.name}
                        </h3>
                      </div>
                      <div className="w-4 h-4 rounded-full border border-slate-700 shadow-sm" style={{ backgroundColor: project.primaryColor }} />
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>آخر تعديل: {new Date(project.updatedAt).toLocaleDateString('ar-YE')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileArchive className="w-3.5 h-3.5 text-slate-500" />
                        <span>{Object.keys(project.files || {}).length} ملفات داخل المشروع</span>
                      </div>
                      {project.phone && (
                        <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]" dir="ltr">
                          <span>📞 {project.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      id={`open-project-${project.id}`}
                      onClick={() => onOpenProject(project)}
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition text-center"
                    >
                      فتح وتعديل
                    </button>

                    <button
                      onClick={() => onQuickExport(project)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="تصدير سريع لـ ZIP"
                    >
                      <Download className="w-4 h-4 text-cyan-400" />
                    </button>

                    <button
                      onClick={() => onDuplicateProject(project)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="تكرار المشروع"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف المشروع "${project.name}"؟`)) {
                          onDeleteProject(project.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition"
                      title="حذف المشروع"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Credit */}
        <div className="pt-8 pb-4 text-center border-t border-slate-900 text-xs text-slate-500 space-y-1">
          <p>تطبيق <b className="text-slate-300">HOTSPOT PLUS</b> • المطور <b className="text-white">عمار أحمد</b> • هاتف: <span className="text-cyan-400 font-mono" dir="ltr">782727242</span></p>
          <p className="text-[11px] text-slate-600">iOS Deployment Target: 15.0 • Xcode SDK Ready • Codemagic CI/CD Ready</p>
        </div>
      </div>
    </div>
  );
};
