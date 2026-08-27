import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  RotateCw,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  Sliders,
  ShieldAlert,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import { HotspotProject, HotspotFile } from '../types';
import { updateHtmlWithProjectData } from '../utils/htmlParser';

interface DeviceSimulatorProps {
  project: HotspotProject;
  activeFile?: string;
}

type DeviceModel = 'iphone13promax' | 'iphone16pro' | 'ipadmini' | 'fluid';

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  project,
  activeFile = 'index.html',
}) => {
  const [deviceModel, setDeviceModel] = useState<DeviceModel>('iphone13promax');
  const [isLandscape, setIsLandscape] = useState(false);
  const [zoomScale, setZoomScale] = useState(0.85);
  const [showSafeArea, setShowSafeArea] = useState(false);
  const [simulatedError, setSimulatedError] = useState<string | null>(null);
  const [showTrial, setShowTrial] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate device dimensions based on model and orientation
  const dimensions = useMemo(() => {
    let width = 428;
    let height = 926;

    if (deviceModel === 'iphone13promax') {
      width = 428;
      height = 926;
    } else if (deviceModel === 'iphone16pro') {
      width = 402;
      height = 874;
    } else if (deviceModel === 'ipadmini') {
      width = 744;
      height = 1133;
    } else if (deviceModel === 'fluid') {
      width = 1000;
      height = 800;
    }

    if (isLandscape && deviceModel !== 'fluid') {
      return { width: height, height: width };
    }
    return { width, height };
  }, [deviceModel, isLandscape]);

  // Construct self-contained HTML bundle for iframe preview
  const iframeSrcDoc = useMemo(() => {
    const files = project.files || {};
    let targetHtml = files[activeFile]?.content || files['index.html']?.content || files['login.html']?.content;

    if (!targetHtml) {
      const anyHtml = (Object.values(files) as HotspotFile[]).find(f => f.mimeType?.includes('html') || f.name?.endsWith('.html'));
      targetHtml = anyHtml?.content || '<h1>لا يوجد ملف HTML صالح للمعاينة</h1>';
    }

    // Apply visual editor updates to the HTML
    let renderedHtml = updateHtmlWithProjectData(targetHtml, project);

    // Replace MikroTik variables with realistic preview values
    renderedHtml = renderedHtml
      .replace(/\$\(identity\)/g, project.networkName || 'شبكة النور')
      .replace(/\$\(link-login-only\)/g, '#login-action')
      .replace(/\$\(link-login\)/g, '#login-action')
      .replace(/\$\(link-orig\)/g, 'https://google.com')
      .replace(/\$\(link-orig-esc\)/g, 'https%3A%2F%2Fgoogle.com')
      .replace(/\$\(link-logout\)/g, '#logout-action')
      .replace(/\$\(link-status\)/g, '#status-action')
      .replace(/\$\(ip\)/g, '192.168.88.105')
      .replace(/\$\(mac\)/g, '4C:5E:0C:8A:2B:1F')
      .replace(/\$\(mac-esc\)/g, '4C%3A5E%3A0C%3A8A%3A2B%3A1F')
      .replace(/\$\(username\)/g, 'user7788')
      .replace(/\$\(session-time-left\)/g, '4 ساعات و 20 دقيقة')
      .replace(/\$\(uptime\)/g, '1 ساعة و 15 دقيقة')
      .replace(/\$\(bytes-in-nice\)/g, '350 MB')
      .replace(/\$\(bytes-out-nice\)/g, '45 MB')
      .replace(/\$\(remain-bytes-total-nice\)/g, '1.2 GB');

    // Simulate MikroTik conditionals $(if error) ... $(endif)
    if (simulatedError) {
      renderedHtml = renderedHtml.replace(
        /\$\(if error\)([\s\S]*?)\$\(endif\)/g,
        `$1`.replace(/\$\(error\)/g, simulatedError)
      );
    } else {
      renderedHtml = renderedHtml.replace(/\$\(if error\)[\s\S]*?\$\(endif\)/g, '');
    }

    // Simulate $(if trial == 'yes') ... $(endif)
    if (showTrial) {
      renderedHtml = renderedHtml.replace(/\$\(if trial == 'yes'\)([\s\S]*?)\$\(endif\)/g, '$1');
    } else {
      renderedHtml = renderedHtml.replace(/\$\(if trial == 'yes'\)[\s\S]*?\$\(endif\)/g, '');
    }

    // Embed local CSS files directly
    const parser = new DOMParser();
    const doc = parser.parseFromString(renderedHtml, 'text/html');

    // Inline CSS
    const linkTags = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
    linkTags.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http://') && !href.startsWith('https://')) {
        const cleanHref = href.replace(/^\.\//, '').replace(/^\//, '');
        const matchingFile = files[cleanHref] || (Object.values(files) as HotspotFile[]).find(f => f.path.endsWith(cleanHref));
        if (matchingFile) {
          const styleTag = doc.createElement('style');
          styleTag.textContent = matchingFile.content;
          link.parentNode?.replaceChild(styleTag, link);
        }
      }
    });

    // Inline JS
    const scriptTags = Array.from(doc.querySelectorAll('script[src]'));
    scriptTags.forEach(script => {
      const src = script.getAttribute('src');
      if (src && !src.startsWith('http://') && !src.startsWith('https://')) {
        const cleanSrc = src.replace(/^\.\//, '').replace(/^\//, '');
        const matchingFile = files[cleanSrc] || (Object.values(files) as HotspotFile[]).find(f => f.path.endsWith(cleanSrc));
        if (matchingFile) {
          const newScript = doc.createElement('script');
          newScript.textContent = matchingFile.content;
          script.parentNode?.replaceChild(newScript, script);
        }
      }
    });

    // Inline Images
    const imgTags = Array.from(doc.querySelectorAll('img'));
    imgTags.forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('data:')) {
        const cleanSrc = src.replace(/^\.\//, '').replace(/^\//, '');
        const matchingFile = files[cleanSrc] || (Object.values(files) as HotspotFile[]).find(f => f.path.endsWith(cleanSrc));
        if (matchingFile && matchingFile.isBinary) {
          img.setAttribute('src', matchingFile.content);
        }
      }
    });

    return doc.documentElement.outerHTML;
  }, [project, activeFile, simulatedError, showTrial]);

  return (
    <div id="device-simulator" className="h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden" dir="rtl">
      {/* Simulator Toolbar Controls */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Device Model Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDeviceModel('iphone13promax')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition ${
              deviceModel === 'iphone13promax' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone 13 Pro Max</span>
          </button>

          <button
            onClick={() => setDeviceModel('iphone16pro')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition ${
              deviceModel === 'iphone16pro' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone 16 Pro</span>
          </button>

          <button
            onClick={() => setDeviceModel('ipadmini')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition ${
              deviceModel === 'ipadmini' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>iPad Mini</span>
          </button>

          <button
            onClick={() => setDeviceModel('fluid')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition ${
              deviceModel === 'fluid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>عرض حر</span>
          </button>
        </div>

        {/* Orientation & Zoom & Refresh */}
        <div className="flex items-center gap-2">
          {deviceModel !== 'fluid' && (
            <button
              onClick={() => setIsLandscape(!isLandscape)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1"
              title="تدوير الشاشة أفقي / رأسي"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isLandscape ? 'رأسي' : 'أفقي'}</span>
            </button>
          )}

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 p-0.5">
            <button
              onClick={() => setZoomScale(Math.max(0.4, zoomScale - 0.1))}
              className="p-1.5 text-slate-400 hover:text-white transition"
              title="تصغير"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-slate-300">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale(Math.min(1.5, zoomScale + 0.1))}
              className="p-1.5 text-slate-400 hover:text-white transition"
              title="تكبير"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIframeKey(k => k + 1)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="إعادة تحميل المعاينة"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Safe area toggle */}
          <button
            onClick={() => setShowSafeArea(!showSafeArea)}
            className={`p-1.5 rounded-lg border transition ${
              showSafeArea
                ? 'bg-cyan-950 border-cyan-700 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="إظهار حدود Safe Area لأجهزة iOS"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* MikroTik Error simulation pill */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400">محاكاة خطأ المايكروتك:</span>
          <select
            value={simulatedError || ''}
            onChange={(e) => setSimulatedError(e.target.value || null)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
          >
            <option value="">لا يوجد خطأ (حالة طبيعية)</option>
            <option value="invalid username or password">خطأ في اسم المستخدم أو كلمة السر</option>
            <option value="user credit has expired">انتهت صلاحية الكرت أو الرصيد</option>
            <option value="simultaneous session limit reached">تم الوصول للحد الأقصى للأجهزة المتصلة</option>
          </select>
        </div>
      </div>

      {/* Simulator Workspace Body */}
      <div
        ref={containerRef}
        className="flex-1 bg-slate-950 overflow-auto p-4 sm:p-8 flex items-center justify-center relative"
      >
        <div
          style={{
            transform: `scale(${zoomScale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease, width 0.3s ease, height 0.3s ease',
          }}
          className="relative shadow-2xl transition-all"
        >
          {deviceModel === 'fluid' ? (
            /* Fluid Full View Frame */
            <div className="w-[850px] h-[600px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              <iframe
                key={iframeKey}
                srcDoc={iframeSrcDoc}
                title="Fluid Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-forms allow-same-origin"
              />
            </div>
          ) : (
            /* Realistic iOS Device Body (iPhone 13 Pro Max frame) */
            <div
              style={{ width: dimensions.width, height: dimensions.height }}
              className="relative bg-black rounded-[54px] p-3.5 shadow-2xl border-[4px] border-slate-800 ring-1 ring-slate-700/60 overflow-hidden flex flex-col"
            >
              {/* iOS Screen Canvas */}
              <div className="relative w-full h-full bg-slate-950 rounded-[42px] overflow-hidden flex flex-col border border-slate-900">
                {/* iOS 26 High-Fidelity Status Bar */}
                <div
                  className="w-full h-11 px-7 flex items-center justify-between text-white text-[12px] font-bold select-none z-30 shrink-0 bg-transparent"
                  dir="ltr"
                >
                  <span className="tracking-tight">9:41</span>

                  {/* Notch or Dynamic Island */}
                  {deviceModel === 'iphone16pro' ? (
                    <div className="w-28 h-7 bg-black rounded-full mx-auto flex items-center justify-end px-2 border border-slate-900 shadow-inner">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900/80 border border-slate-800" />
                    </div>
                  ) : (
                    <div className="w-36 h-6 bg-black rounded-b-2xl mx-auto flex items-center justify-center border-b border-x border-slate-900">
                      <div className="w-12 h-1 bg-slate-800 rounded-full mb-1" />
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-slate-200">
                    <Signal className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-extrabold tracking-tighter">5G</span>
                    <Wifi className="w-3.5 h-3.5" />
                    <Battery className="w-4 h-4 fill-white" />
                  </div>
                </div>

                {/* Safe Area Visualizer overlay */}
                {showSafeArea && (
                  <div className="absolute inset-0 pointer-events-none z-40 border-4 border-dashed border-cyan-400/40 m-2 rounded-[32px] flex items-center justify-center">
                    <span className="bg-cyan-950/80 text-cyan-300 text-[10px] font-mono px-2 py-1 rounded-md border border-cyan-700">
                      iOS Safe Area ({dimensions.width} x {dimensions.height})
                    </span>
                  </div>
                )}

                {/* Iframe Viewport */}
                <div className="flex-1 w-full h-full overflow-hidden bg-slate-950">
                  <iframe
                    key={iframeKey}
                    srcDoc={iframeSrcDoc}
                    title="iPhone Preview"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-forms allow-same-origin"
                  />
                </div>

                {/* iOS Home Indicator Bar */}
                <div className="w-full h-5 flex items-center justify-center shrink-0 z-30 bg-transparent">
                  <div className="w-32 h-1 bg-slate-400/80 rounded-full" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
