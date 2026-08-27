import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Check,
  X,
  ArrowRight,
  Send,
  AlertTriangle,
  Layers,
  Wand2,
  Lock
} from 'lucide-react';
import { HotspotProject, AIDiffResponse } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: HotspotProject;
  onApplyDiff: (diff: AIDiffResponse) => void;
}

const QUICK_PROMPTS = [
  'اجعل الثيم باللون الكحلي الملكي مع أزرار كبسولة دائرية',
  'غيّر رقم التواصل إلى 782727242 والاسم إلى شبكة النور',
  'حسّن مظهر الصفحة لتبدو عصرية وفخمة على iPhone 13 Pro Max',
  'اجعل التصميم نيون فايبر أخضر مع خلفية داكنة جداً',
  'صمم ثيم دارك مريح للعين مع تحسين نصوص الترحيب',
];

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  project,
  onApplyDiff,
}) => {
  const [promptText, setPromptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diffResult, setDiffResult] = useState<AIDiffResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendPrompt = async (textToSend?: string) => {
    const finalPrompt = textToSend || promptText;
    if (!finalPrompt.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setDiffResult(null);

    try {
      const response = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          project,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'فشل الاتصال بمساعد الذكاء الاصطناعي.');
      }

      const data: AIDiffResponse = await response.json();
      setDiffResult(data);
    } catch (err: any) {
      console.error('AI Error:', err);
      setErrorMessage(err.message || 'حدث خطأ أثناء معالجة الطلب.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (diffResult) {
      onApplyDiff(diffResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-slate-900 border border-purple-500/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>مساعد الذكاء الاصطناعي الذكي</span>
                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-700/60 px-2 py-0.5 rounded-full font-bold">
                  Gemini AI
                </span>
              </h2>
              <p className="text-xs text-slate-400">تعديل وتطوير صفحة الهوتسبوت مع حماية تامة لمتغيرات MikroTik</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* MikroTik Safety Assurance */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <b>نظام الحماية الفولاذي:</b> يتم التحقق تلقائياً من صيانة كافة وسوم وروابط تسجيل دخول المايكروتك بنسبة 100%.
            </span>
          </div>

          {/* Quick Prompts */}
          {!diffResult && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">أوامر سريعة مقترحة:</span>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    disabled={isLoading}
                    onClick={() => {
                      setPromptText(prompt);
                      handleSendPrompt(prompt);
                    }}
                    className="text-xs text-slate-300 bg-slate-950 hover:bg-purple-950/60 hover:text-purple-300 border border-slate-800 hover:border-purple-700 px-3 py-1.5 rounded-xl transition text-right"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Input */}
          {!diffResult && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                أدخل ما تريد تعديله في صفحة الهوتسبوت:
              </label>
              <div className="flex gap-2">
                <textarea
                  rows={3}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="مثال: اجعل التصميم مريح للعين بالألوان الكحلية وغير اسم الشبكة إلى شبكة النور ورقم التواصل إلى 782727242..."
                  className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition resize-none"
                />
              </div>
              <button
                onClick={() => handleSendPrompt()}
                disabled={isLoading || !promptText.trim()}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Wand2 className="w-4 h-4 animate-spin" />
                    <span>جاري تحليل وتعديل الصفحة بذكاء...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>توليد التعديلات بالذكاء الاصطناعي</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Before & After Diff Review */}
          {diffResult && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-purple-950/30 border border-purple-800/60 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Wand2 className="w-4 h-4 text-yellow-300" />
                    <span>ملخص التعديلات المقترحة</span>
                  </h3>
                  <span className="text-[11px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> تم الحفاظ على المتغيرات
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {diffResult.summary}
                </p>
              </div>

              {/* Changes Comparison Table */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800 bg-slate-950">
                <div className="p-2.5 bg-slate-900 text-slate-400 text-[11px] font-semibold grid grid-cols-3">
                  <span>العنصر</span>
                  <span>قبل (Before)</span>
                  <span>بعد (After)</span>
                </div>
                {diffResult.changes.map((chg, idx) => (
                  <div key={idx} className="p-2.5 text-xs grid grid-cols-3 items-center">
                    <span className="font-bold text-slate-200">{chg.label}</span>
                    <span className="text-slate-400 truncate pr-1" dir="ltr">{String(chg.before || '-')}</span>
                    <span className="text-cyan-400 font-bold truncate pr-1" dir="ltr">{String(chg.after || '-')}</span>
                  </div>
                ))}
              </div>

              {/* Preserved MikroTik tags badge */}
              {diffResult.mikrotikVariablesPreserved && diffResult.mikrotikVariablesPreserved.length > 0 && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[11px] text-slate-400 block mb-1">المتغيرات التي تم فحصها وحمايتها:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {diffResult.mikrotikVariablesPreserved.map(v => (
                      <code key={v} className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800">
                        {v}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions: Apply or Discard */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleApply}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>تطبيق هذه التعديلات على المشروع</span>
                </button>

                <button
                  onClick={() => setDiffResult(null)}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                >
                  تعديل الطلب
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
