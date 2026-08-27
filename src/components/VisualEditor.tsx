import React, { useRef, useState } from 'react';
import {
  Palette,
  Type,
  Image as ImageIcon,
  Smartphone,
  Phone,
  MessageCircle,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Upload,
  RefreshCw,
  Sliders,
  Check,
  Sparkles,
  Plus
} from 'lucide-react';
import { HotspotProject } from '../types';
import { MIKROTIK_KNOWN_VARIABLES } from '../utils/mikrotik';

interface VisualEditorProps {
  project: HotspotProject;
  onChange: (updated: HotspotProject) => void;
  onOpenAI: () => void;
}

const COLOR_PRESETS = [
  { name: 'أزرق كلاسيك', primary: '#2563eb', secondary: '#06b6d4', bg: '#090d16' },
  { name: 'كحلي ملكي', primary: '#1e3a8a', secondary: '#3b82f6', bg: '#0b1120' },
  { name: 'أخضر زمردي', primary: '#059669', secondary: '#10b981', bg: '#022c22' },
  { name: 'بنفسجي جيمينج', primary: '#7c3aed', secondary: '#ec4899', bg: '#0f0728' },
  { name: 'ذهبي نخبوي', primary: '#d97706', secondary: '#f59e0b', bg: '#1c1917' },
  { name: 'أحمر ناري', primary: '#dc2626', secondary: '#f87171', bg: '#180404' },
  { name: 'داكن مونوكروم', primary: '#475569', secondary: '#94a3b8', bg: '#020617' },
];

export const VisualEditor: React.FC<VisualEditorProps> = ({
  project,
  onChange,
  onOpenAI,
}) => {
  const [activeSection, setActiveSection] = useState<'info' | 'style' | 'media' | 'mikrotik'>('info');
  const [mikrotikWarning, setMikrotikWarning] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const sliderInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (field: keyof HotspotProject, value: any) => {
    // Check if user is typing a mikrotik variable and modifying it incorrectly
    if (typeof value === 'string' && value.includes('$(')) {
      setMikrotikWarning('⚠️ تنبيه: تم اكتشاف محاولة إدخال كود متغير MikroTik. تأكد من سلامة المتغيرات لتجنب تعطل تسجيل الدخول.');
    } else {
      setMikrotikWarning(null);
    }

    const updated = {
      ...project,
      [field]: value,
      updatedAt: Date.now(),
    };
    onChange(updated);
  };

  // Image replacement handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'bg' | 'slider') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const ext = file.name.split('.').pop() || 'png';
        const updatedFiles = { ...project.files };

        if (target === 'logo') {
          const logoPath = `img/logo.${ext}`;
          updatedFiles[logoPath] = {
            path: logoPath,
            name: `logo.${ext}`,
            mimeType: file.type || 'image/png',
            content: base64,
            isBinary: true,
            size: file.size,
          };
          onChange({
            ...project,
            logoPath,
            files: updatedFiles,
            updatedAt: Date.now(),
          });
        } else if (target === 'bg') {
          const bgPath = `img/bg.${ext}`;
          updatedFiles[bgPath] = {
            path: bgPath,
            name: `bg.${ext}`,
            mimeType: file.type || 'image/jpeg',
            content: base64,
            isBinary: true,
            size: file.size,
          };
          onChange({
            ...project,
            backgroundPath: bgPath,
            files: updatedFiles,
            updatedAt: Date.now(),
          });
        } else if (target === 'slider') {
          const sliderIdx = (project.sliderImages?.length || 0) + 1;
          const slidePath = `img/slide_${sliderIdx}.${ext}`;
          updatedFiles[slidePath] = {
            path: slidePath,
            name: `slide_${sliderIdx}.${ext}`,
            mimeType: file.type || 'image/jpeg',
            content: base64,
            isBinary: true,
            size: file.size,
          };
          const updatedSliders = [...(project.sliderImages || []), slidePath];
          onChange({
            ...project,
            sliderImages: updatedSliders,
            files: updatedFiles,
            updatedAt: Date.now(),
          });
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  return (
    <div id="visual-editor" className="h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto" dir="rtl">
      {/* Hidden file inputs */}
      <input type="file" ref={logoInputRef} onChange={(e) => handleImageUpload(e, 'logo')} accept="image/*" className="hidden" />
      <input type="file" ref={bgInputRef} onChange={(e) => handleImageUpload(e, 'bg')} accept="image/*" className="hidden" />
      <input type="file" ref={sliderInputRef} onChange={(e) => handleImageUpload(e, 'slider')} accept="image/*" className="hidden" />

      {/* Warning banner for MikroTik safety */}
      {mikrotikWarning && (
        <div className="bg-amber-950/80 border-b border-amber-800/80 text-amber-200 text-xs px-4 py-2 flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{mikrotikWarning}</span>
          </div>
          <button onClick={() => setMikrotikWarning(null)} className="text-amber-400 hover:text-white text-xs font-bold">إغلاق</button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveSection('info')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeSection === 'info' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              بيانات الشبكة
            </button>
            <button
              onClick={() => setActiveSection('style')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeSection === 'style' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الألوان والمظهر
            </button>
            <button
              onClick={() => setActiveSection('media')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeSection === 'media' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الشعار والصور
            </button>
            <button
              onClick={() => setActiveSection('mikrotik')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 ${
                activeSection === 'mikrotik' ? 'bg-cyan-600 text-white' : 'text-cyan-400 hover:text-cyan-300'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>متغيرات MikroTik</span>
            </button>
          </div>

          <button
            onClick={onOpenAI}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 border border-purple-600/40 text-purple-300 text-xs font-bold transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span>طلب تعديل بالـ AI</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full">
        {/* 1. Network Info Section */}
        {activeSection === 'info' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span>المعلومات الأساسية للشبكة</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    اسم الشبكة (Network Name)
                  </label>
                  <input
                    type="text"
                    value={project.networkName || ''}
                    onChange={(e) => handleFieldChange('networkName', e.target.value)}
                    placeholder="مثال: شبكة النور"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    عنوان المشروع
                  </label>
                  <input
                    type="text"
                    value={project.name || ''}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>رقم الاتصال / الدعم الفني</span>
                  </label>
                  <input
                    type="text"
                    value={project.phone || ''}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    placeholder="782727242"
                    dir="ltr"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white font-mono focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>رقم واتساب (WhatsApp)</span>
                  </label>
                  <input
                    type="text"
                    value={project.whatsapp || ''}
                    onChange={(e) => handleFieldChange('whatsapp', e.target.value)}
                    placeholder="782727242"
                    dir="ltr"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white font-mono focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    العنوان الترحيبي (Headline)
                  </label>
                  <input
                    type="text"
                    value={project.headline || ''}
                    onChange={(e) => handleFieldChange('headline', e.target.value)}
                    placeholder="مرحباً بكم في شبكة النور"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    النص الترحيبي / الوصف (Welcome Text)
                  </label>
                  <textarea
                    rows={2}
                    value={project.welcomeText || ''}
                    onChange={(e) => handleFieldChange('welcomeText', e.target.value)}
                    placeholder="سجل دخولك الآن واستمتع بأقوى تغطية وأعلى سرعة إنترنت..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-blue-500 focus:outline-none transition resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Styling & Colors Section */}
        {activeSection === 'style' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Color Presets */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span>أطقم الألوان الجاهزة</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      onChange({
                        ...project,
                        primaryColor: preset.primary,
                        secondaryColor: preset.secondary,
                        bgColor: preset.bg,
                        updatedAt: Date.now(),
                      });
                    }}
                    className={`p-3 rounded-xl border text-right transition flex flex-col justify-between ${
                      project.primaryColor === preset.primary
                        ? 'border-blue-500 bg-blue-950/30'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }} />
                      <span className="w-4 h-4 rounded-full border border-slate-700" style={{ backgroundColor: preset.bg }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">تخصيص الألوان يدوياً</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    اللون الأساسي (Primary)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={project.primaryColor || '#2563eb'}
                      onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                      className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={project.primaryColor || '#2563eb'}
                      onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    اللون الثانوي (Secondary)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={project.secondaryColor || '#06b6d4'}
                      onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                      className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={project.secondaryColor || '#06b6d4'}
                      onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    لون الخلفية (Background)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={project.bgColor || '#090d16'}
                      onChange={(e) => handleFieldChange('bgColor', e.target.value)}
                      className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={project.bgColor || '#090d16'}
                      onChange={(e) => handleFieldChange('bgColor', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Button Shapes */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">شكل الأزرار (Button Style)</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleFieldChange('buttonShape', 'rounded')}
                  className={`p-3 rounded-xl border text-center transition ${
                    project.buttonShape === 'rounded'
                      ? 'border-blue-500 bg-blue-950/40 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="w-full h-8 bg-blue-600 rounded-xl mb-2 flex items-center justify-center text-xs font-bold text-white">
                    تسجيل الدخول
                  </div>
                  <span className="text-xs font-semibold">حواف منحنية (Rounded)</span>
                </button>

                <button
                  onClick={() => handleFieldChange('buttonShape', 'pill')}
                  className={`p-3 rounded-xl border text-center transition ${
                    project.buttonShape === 'pill'
                      ? 'border-blue-500 bg-blue-950/40 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="w-full h-8 bg-blue-600 rounded-full mb-2 flex items-center justify-center text-xs font-bold text-white">
                    تسجيل الدخول
                  </div>
                  <span className="text-xs font-semibold">كبسولة دائرية (Pill)</span>
                </button>

                <button
                  onClick={() => handleFieldChange('buttonShape', 'square')}
                  className={`p-3 rounded-xl border text-center transition ${
                    project.buttonShape === 'square'
                      ? 'border-blue-500 bg-blue-950/40 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="w-full h-8 bg-blue-600 rounded-none mb-2 flex items-center justify-center text-xs font-bold text-white">
                    تسجيل الدخول
                  </div>
                  <span className="text-xs font-semibold">حواف مربعة (Square)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Media & Images Section */}
        {activeSection === 'media' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Logo replacement */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>شعار الشبكة (Network Logo)</span>
              </h3>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2 overflow-hidden shadow-inner">
                  {project.logoPath && project.files[project.logoPath] ? (
                    <img
                      src={project.files[project.logoPath].content}
                      alt="Logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-600" />
                  )}
                </div>

                <div className="space-y-2 text-center sm:text-right">
                  <h4 className="text-xs font-bold text-white">استبدال الشعار بصورة من جهازك</h4>
                  <p className="text-xs text-slate-400">
                    يدعم ملفات PNG, SVG, JPG. سيتم تحديث الروابط في صفحة الهوتسبوت تلقائياً.
                  </p>
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>اختيار شعار جديد</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Slider Banners */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">صور السلايدر والبنرات الإعلانية</h3>
                <button
                  onClick={() => sliderInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة شريحة</span>
                </button>
              </div>

              {(!project.sliderImages || project.sliderImages.length === 0) ? (
                <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
                  لا توجد صور سلايدر مضافة حالياً. يمكنك رفع صور لعروض الباقات والإعلانات.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {project.sliderImages.map((imgPath, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group h-24">
                      {project.files[imgPath] && (
                        <img src={project.files[imgPath].content} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
                      )}
                      <button
                        onClick={() => {
                          const updatedSliders = project.sliderImages.filter((_, i) => i !== idx);
                          onChange({
                            ...project,
                            sliderImages: updatedSliders,
                            updatedAt: Date.now(),
                          });
                        }}
                        className="absolute top-1 right-1 bg-rose-600 text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition text-[10px]"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. Protected MikroTik Variables Section */}
        {activeSection === 'mikrotik' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-900/70 border border-cyan-900/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">متغيرات MikroTik النشطة والمحمية</h3>
                </div>
                <span className="text-xs font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-800">
                  {project.mikrotikVariables?.length || 0} متغيرات
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                يقوم التطبيق بحماية هذه المتغيرات تلقائياً لمنع أي كسر في آلية تسجيل الدخول أو إرسال بيانات المشتركين إلى راوتر المايكروتك.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MIKROTIK_KNOWN_VARIABLES.map((v) => {
                  const isPresent = project.mikrotikVariables?.includes(v.tag);
                  return (
                    <div
                      key={v.tag}
                      className={`p-3 rounded-xl border flex items-start justify-between gap-2 ${
                        isPresent
                          ? 'bg-slate-950 border-cyan-900/60'
                          : 'bg-slate-950/40 border-slate-800 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono font-bold text-cyan-400" dir="ltr">{v.tag}</code>
                          {v.isSensitive && (
                            <span className="text-[9px] bg-amber-950 text-amber-300 border border-amber-800/60 px-1 rounded">حساس</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{v.description}</p>
                      </div>
                      <span className="text-xs">
                        {isPresent ? (
                          <span className="text-emerald-400 font-bold">✓ نشط</span>
                        ) : (
                          <span className="text-slate-600">غير مستخدم</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
