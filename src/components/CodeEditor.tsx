import React, { useState, useEffect, useRef } from 'react';
import {
  Code2,
  FileCode,
  Save,
  Undo,
  Redo,
  Search,
  Replace,
  AlertTriangle,
  Lock,
  Sparkles,
  CheckCircle2,
  Copy,
  Plus
} from 'lucide-react';
import { HotspotProject, HotspotFile } from '../types';
import { extractMikroTikVariables, MIKROTIK_KNOWN_VARIABLES } from '../utils/mikrotik';

interface CodeEditorProps {
  project: HotspotProject;
  activeFilePath?: string;
  onSaveFile: (filePath: string, newContent: string) => void;
  onSelectFile?: (filePath: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  project,
  activeFilePath: initialFilePath = 'index.html',
  onSaveFile,
  onSelectFile,
}) => {
  const files = project.files || {};
  const [selectedFile, setSelectedFile] = useState<string>(initialFilePath);
  const [codeContent, setCodeContent] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  // Search & Replace state
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [mikrotikWarning, setMikrotikWarning] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load selected file content
  useEffect(() => {
    let filePath = selectedFile;
    if (!files[filePath]) {
      const firstKey = Object.keys(files)[0] || 'index.html';
      filePath = firstKey;
      setSelectedFile(filePath);
    }
    const current = files[filePath]?.content || '';
    setCodeContent(current);
    setHistory([current]);
    setHistoryIdx(0);
    setIsSaved(true);
    setMikrotikWarning(null);
  }, [selectedFile, project.updatedAt]);

  const handleCodeChange = (newText: string) => {
    setCodeContent(newText);
    setIsSaved(false);

    // MikroTik variable removal detection
    const oldVars = extractMikroTikVariables(files[selectedFile]?.content || '');
    const newVars = extractMikroTikVariables(newText);
    const removedVars = oldVars.filter(v => !newVars.includes(v));

    if (removedVars.length > 0) {
      setMikrotikWarning(`⚠️ تحذير: لقد قمت بحذف متغير MikroTik مهم: ${removedVars.join(', ')}. قد يؤدي ذلك لتعطل تسجيل الدخول.`);
    } else {
      setMikrotikWarning(null);
    }

    // Update history stack
    const newHist = history.slice(0, historyIdx + 1);
    newHist.push(newText);
    if (newHist.length > 30) newHist.shift();
    setHistory(newHist);
    setHistoryIdx(newHist.length - 1);
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prevIdx = historyIdx - 1;
      setHistoryIdx(prevIdx);
      setCodeContent(history[prevIdx]);
      setIsSaved(false);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const nextIdx = historyIdx + 1;
      setHistoryIdx(nextIdx);
      setCodeContent(history[nextIdx]);
      setIsSaved(false);
    }
  };

  const handleSave = () => {
    onSaveFile(selectedFile, codeContent);
    setIsSaved(true);
  };

  const handleSearchReplace = (replaceAll: boolean = false) => {
    if (!searchTerm) return;
    if (replaceAll) {
      const newText = codeContent.split(searchTerm).join(replaceTerm);
      handleCodeChange(newText);
    } else {
      const newText = codeContent.replace(searchTerm, replaceTerm);
      handleCodeChange(newText);
    }
  };

  const insertMikroTikVariable = (varTag: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newText = codeContent.substring(0, start) + varTag + codeContent.substring(end);
    handleCodeChange(newText);
  };

  const textFiles = Object.keys(files).filter(k => !files[k].isBinary);
  const lineCount = codeContent.split('\n').length;

  return (
    <div id="code-editor" className="h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden" dir="rtl">
      {/* Warning banner */}
      {mikrotikWarning && (
        <div className="bg-rose-950/90 border-b border-rose-800 text-rose-200 text-xs px-4 py-2 flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{mikrotikWarning}</span>
          </div>
          <button onClick={() => setMikrotikWarning(null)} className="text-rose-400 hover:text-white font-bold">إغلاق</button>
        </div>
      )}

      {/* File Tabs Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-0">
          {textFiles.map((filePath) => {
            const fileName = filePath.split('/').pop() || filePath;
            const isCurrent = filePath === selectedFile;
            return (
              <button
                key={filePath}
                onClick={() => {
                  if (!isSaved) {
                    if (confirm('هل ترغب في حفظ التعديلات السابقة قبل التبديل؟')) {
                      handleSave();
                    }
                  }
                  setSelectedFile(filePath);
                  onSelectFile?.(filePath);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span dir="ltr">{fileName}</span>
                {isCurrent && !isSaved && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="غير محفوظ" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action buttons on the left */}
        <div className="flex items-center gap-1.5 shrink-0" dir="ltr">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1.5 rounded-lg border transition ${
              showSearch ? 'bg-blue-950 border-blue-700 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="البحث والاستبدال"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleUndo}
            disabled={historyIdx <= 0}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 transition"
            title="تراجع (Undo)"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRedo}
            disabled={historyIdx >= history.length - 1}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 transition"
            title="إعادة (Redo)"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
              isSaved
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaved ? 'محفوظ' : 'حفظ الكود'}</span>
          </button>
        </div>
      </div>

      {/* Search & Replace Floating Bar */}
      {showSearch && (
        <div className="bg-slate-900 border-b border-slate-800 p-2.5 flex flex-wrap items-center gap-2 text-xs">
          <input
            type="text"
            placeholder="بحث عن..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-blue-500"
            dir="ltr"
          />
          <input
            type="text"
            placeholder="استبدال بـ..."
            value={replaceTerm}
            onChange={(e) => setReplaceTerm(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-blue-500"
            dir="ltr"
          />
          <button
            onClick={() => handleSearchReplace(false)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold"
          >
            استبدال
          </button>
          <button
            onClick={() => handleSearchReplace(true)}
            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold"
          >
            استبدال الكل
          </button>
        </div>
      )}

      {/* Quick MikroTik Variables Insertion Bar */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-[11px] text-slate-400 font-semibold shrink-0 flex items-center gap-1">
          <Lock className="w-3 h-3 text-cyan-400" />
          <span>إدراج متغير مايكروتك:</span>
        </span>
        {MIKROTIK_KNOWN_VARIABLES.slice(0, 8).map((v) => (
          <button
            key={v.tag}
            onClick={() => insertMikroTikVariable(v.tag)}
            className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-blue-950 border border-slate-800 hover:border-blue-700 text-cyan-400 font-mono text-[11px] shrink-0 transition"
            title={v.description}
            dir="ltr"
          >
            {v.tag}
          </button>
        ))}
      </div>

      {/* Code Editor Body with Line Numbers */}
      <div className="flex-1 flex overflow-hidden font-mono text-xs" dir="ltr">
        {/* Line Numbers */}
        <div className="w-12 bg-slate-950/80 border-r border-slate-800/80 text-slate-600 select-none py-3 px-2 text-right leading-5 shrink-0 overflow-hidden font-mono">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={codeContent}
          onChange={(e) => handleCodeChange(e.target.value)}
          spellCheck={false}
          className="flex-1 w-full h-full p-3 bg-slate-950 text-slate-100 border-0 focus:outline-none resize-none leading-5 font-mono selection:bg-blue-600 selection:text-white"
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-1 flex items-center justify-between text-[11px] text-slate-400 font-mono" dir="ltr">
        <div className="flex items-center gap-3">
          <span>{selectedFile}</span>
          <span>•</span>
          <span>{lineCount} lines</span>
          <span>•</span>
          <span>{(new Blob([codeContent]).size / 1024).toFixed(1)} KB</span>
        </div>
        <div>
          <span>UTF-8</span>
          <span className="ml-2">{selectedFile.endsWith('.css') ? 'CSS' : selectedFile.endsWith('.js') ? 'JavaScript' : 'HTML'}</span>
        </div>
      </div>
    </div>
  );
};
