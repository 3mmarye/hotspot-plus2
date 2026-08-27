import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Wifi, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';

interface SplashViewProps {
  onComplete: () => void;
}

export const SplashView: React.FC<SplashViewProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 4;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div id="splash-screen" className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-950 text-white p-8 select-none overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Tag */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-6 flex items-center gap-2 text-xs text-blue-400 font-semibold tracking-wider uppercase bg-blue-950/60 px-4 py-1.5 rounded-full border border-blue-800/40 backdrop-blur-md"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>MikroTik Hotspot Studio</span>
        <span className="text-slate-500">•</span>
        <span>iOS Edition</span>
      </motion.div>

      {/* Center Main Identity */}
      <div className="flex flex-col items-center text-center my-auto">
        {/* Animated App Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, type: 'spring', bounce: 0.4 }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-2xl shadow-blue-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900/90 rounded-[22px] flex items-center justify-center backdrop-blur-xl">
              <Wifi className="w-12 h-12 sm:w-14 sm:h-14 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-900 shadow-md">
            PRO
          </div>
        </motion.div>

        {/* Titles */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent mb-1"
        >
          HOTSPOT PLUS
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl sm:text-2xl font-bold text-slate-100 mb-3"
          dir="rtl"
        >
          هوت سبوت بلس
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xs sm:text-sm text-slate-400 max-w-xs leading-relaxed"
          dir="rtl"
        >
          تطبيق تعديل وتصميم صفحات مايكروتك هوت سبوت الذكي لأجهزة iPhone & iPad
        </motion.p>
      </div>

      {/* Bottom Developer & Progress Info */}
      <div className="w-full max-w-xs flex flex-col items-center pb-4">
        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-5 border border-slate-700/40">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Developer Credit & Phone */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col items-center text-center space-y-1"
          dir="rtl"
        >
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <span>تطوير:</span>
            <span className="text-white font-bold">عمار أحمد</span>
            <span className="text-slate-500">•</span>
            <span className="text-cyan-400 font-mono font-semibold" dir="ltr">782727242</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <Smartphone className="w-3 h-3 text-slate-400" />
            <span>iOS 15.0+ | iPhone 13 Pro Max & iOS 26 Ready</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
