import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  Server,
  ShieldCheck,
  Code,
  X,
  ExternalLink,
  ChevronDown,
  Smartphone,
  Copy,
  Check
} from 'lucide-react';
import { MIKROTIK_KNOWN_VARIABLES } from '../utils/mikrotik';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'variables' | 'routeros' | 'codemagic' | 'troubleshooting'>('variables');
  const [copiedYaml, setCopiedYaml] = useState(false);

  const codemagicYamlContent = `workflows:
  ios-hotspot-plus:
    name: HOTSPOT PLUS iOS Build
    instance_type: mac_mini_m1
    max_build_duration: 60
    environment:
      node: 20
      xcode: latest
      cocoapods: default
      vars:
        BUNDLE_ID: "com.hotspotplus.app"
        APP_NAME: "HOTSPOT PLUS"
    scripts:
      - name: Install npm dependencies
        script: npm install --legacy-peer-deps
      - name: Build Web Application
        script: npm run build
      - name: Capacitor Sync iOS
        script: npx cap sync ios
      - name: Install CocoaPods dependencies
        script: |
          cd ios/App
          pod repo update || true
          pod install
      - name: Build iOS Application & Package Unsigned IPA
        script: |
          xcode-project build-ipa \\
            --workspace "ios/App/App.xcworkspace" \\
            --scheme "App" \\
            --config Release
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
    publishing:
      email:
        recipients:
          - mjrmiky@gmail.com
        notify:
          success: true
          failure: true`;

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(codemagicYamlContent);
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-600/30">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">دليل استخدام هوت سبوت بلس وبناء iOS</h2>
              <p className="text-xs text-slate-400">مرجع شامل لمتغيرات MikroTik وطرق الرفع للراوتر والبناء في Codemagic</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 border-b border-slate-800 bg-slate-950/50 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('variables')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'variables'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            قاموس متغيرات MikroTik
          </button>
          <button
            onClick={() => setActiveTab('routeros')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'routeros'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            طريقة الرفع إلى RouterOS
          </button>
          <button
            onClick={() => setActiveTab('codemagic')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'codemagic'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>بناء IPA عبر Codemagic</span>
          </button>
          <button
            onClick={() => setActiveTab('troubleshooting')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'troubleshooting'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            حل المشاكل الشائعة
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'variables' && (
            <div className="space-y-3 animate-fadeIn">
              <p className="text-xs text-slate-300">
                هذه المتغيرات يتم استبدالها تلقائياً من قبل سيرفر MikroTik عند طلب المشترك للصفحة. يجب الحفاظ على صيغتها الدقيقة:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MIKROTIK_KNOWN_VARIABLES.map((v) => (
                  <div key={v.tag} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-mono font-bold text-cyan-400" dir="ltr">{v.tag}</code>
                      <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800 font-mono">
                        {v.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{v.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'routeros' && (
            <div className="space-y-4 animate-fadeIn text-xs text-slate-300">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">خطوات الرفع عبر Winbox:</h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed">
                  <li>قم بتصدير المشروع كملف ZIP من زر <b>Export</b>.</li>
                  <li>فك الضغط عن الملف في جهاز الكمبيوتر ليكون لديك مجلد (مثلاً باسم <code>hotspot-alnoor</code>).</li>
                  <li>افتح برنامج <b>Winbox</b> وسجل دخولك لراوتر المايكروتك.</li>
                  <li>افتح قائمة <b>Files</b> من القائمة الجانبية اليسرى.</li>
                  <li>اسحب المجلد من سطح المكتب وأفلته داخل نافذة Files.</li>
                  <li>توجه إلى <b>IP &gt; Hotspot &gt; Server Profiles</b>.</li>
                  <li>انقر نقراً مزدوجاً على بروفايل الهوتسبوت الخاص بك، وضع اسم المجلد في حقل <b>HTML Directory</b>.</li>
                  <li>انقر Apply ثم OK، وستعمل الصفحة فوراً!</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'codemagic' && (
            <div className="space-y-4 animate-fadeIn text-xs text-slate-300">
              <div className="p-4 bg-purple-950/40 border border-purple-800/60 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-purple-300 text-sm flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-purple-400" />
                    <span>حل مشكلة "No configuration file found" في موقع Codemagic:</span>
                  </h4>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  سبب هذه الرسالة في موقع <b>Codemagic.io</b> هو أن المستودع (GitHub Repository) المتصل لم يجد ملف <code>codemagic.yaml</code> في المجلد الرئيسي (Root) للفرع الافتراضي (main).
                </p>
                <div className="space-y-2 pt-1">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-cyan-400 block">الحل والخطوات الصحيحة:</span>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                      <li>تأكد من رفع كامل ملفات المشروع إلى مستودع GitHub الخاص بك بما فيها ملف <code>codemagic.yaml</code> الموجود في المجلد الرئيسي.</li>
                      <li>في موقع Codemagic، ادخل إلى إعدادات التطبيق وانقر على <b>"Check for configuration file"</b> أو اختر الفرع <b>main</b>.</li>
                      <li>إذا كنت تستخدم الواجهة المرئية، يمكنك النقر على <b>"Switch to Codemagic YAML"</b>.</li>
                      <li>انقر على <b>"Start new build"</b> وسيقوم Codemagic ببناء ملف الـ <code>.ipa</code> وإرساله إلى إيميلك (mjrmiky@gmail.com).</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Code viewer for codemagic.yaml */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">محتوى ملف <code>codemagic.yaml</code> الجاهز للبناء:</span>
                  <button
                    onClick={handleCopyYaml}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-xl border border-slate-700 transition"
                  >
                    {copiedYaml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedYaml ? 'تم النسخ!' : 'نسخ الكود'}</span>
                  </button>
                </div>

                <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-56 leading-relaxed" dir="ltr">
                  {codemagicYamlContent}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'troubleshooting' && (
            <div className="space-y-3 animate-fadeIn text-xs text-slate-300">
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <h4 className="font-bold text-amber-400">المشكلة: رسالة "No configuration file found" في Codemagic</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  <b>الحل:</b> انسخ محتوى <code>codemagic.yaml</code> من تبويب "بناء IPA عبر Codemagic" وضعه في المجلد الرئيسي في GitHub أو انقر على <b>Check for configuration file</b> في لوحة Codemagic.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <h4 className="font-bold text-amber-400">المشكلة: صفحة الدخول لا تقبل إرسال الكرت</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  <b>الحل:</b> تأكد من أن وسم النموذج يحتوي على <code>action="$(link-login-only)"</code> و <code>method="post"</code>، وأن حقل الإدخال يحمل <code>name="username"</code>.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <h4 className="font-bold text-amber-400">المشكلة: رسائل الخطأ لا تظهر للمشترك</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  <b>الحل:</b> تأكد من تضمين كود الشرط <code>$(if error) &lt;div class="error"&gt;$(error)&lt;/div&gt; $(endif)</code> في ملف <code>login.html</code>.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <h4 className="font-bold text-amber-400">المشكلة: الصور تظهر مكسورة بعد الرفع للراوتر</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  <b>الحل:</b> تأكد من أن مسار الصورة نسبي مثل <code>img/logo.png</code> وليس مساراً مطلقاً، وتأكد من رفع مجلد <code>img</code> كاملاً مع الصفحة.
                </p>
              </div>
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

