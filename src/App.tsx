import React, { useEffect, useMemo, useState } from 'react';
import { HotspotProject, HealthReport, AIDiffResponse } from './types';
import { SplashView } from './components/SplashView';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { VisualEditor } from './components/VisualEditor';
import { CodeEditor } from './components/CodeEditor';
import { FileManager } from './components/FileManager';
import { DeviceSimulator } from './components/DeviceSimulator';
import { AIAssistantModal } from './components/AIAssistantModal';
import { HealthCheckModal } from './components/HealthCheckModal';
import { ExportModal } from './components/ExportModal';
import { TemplateGalleryModal } from './components/TemplateGalleryModal';
import { VersionHistoryModal } from './components/VersionHistoryModal';
import { HelpModal } from './components/HelpModal';
import { SettingsModal } from './components/SettingsModal';

import { loadProjects, saveProject, deleteProject, saveVersionSnapshot, restoreVersion } from './utils/storage';
import { unpackHotspotZip } from './utils/zipHandler';
import { parseHotspotHtml, updateHtmlWithProjectData } from './utils/htmlParser';
import { runHotspotHealthCheck } from './utils/healthChecker';
import { TEMPLATES } from './data/templates';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [projects, setProjects] = useState<HotspotProject[]>([]);
  const [activeProject, setActiveProject] = useState<HotspotProject | null>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'files' | 'simulator'>('visual');
  const [activeFilePath, setActiveFilePath] = useState<string>('index.html');
  const [isImporting, setIsImporting] = useState(false);

  // Modals state
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Load projects from storage on mount
  useEffect(() => {
    async function initProjects() {
      try {
        const loaded = await loadProjects();
        setProjects(loaded);
      } catch (err) {
        console.error('Failed to load projects:', err);
      }
    }
    initProjects();
  }, []);

  // Compute live health report for active project
  const healthReport: HealthReport | null = useMemo(() => {
    if (!activeProject) return null;
    return runHotspotHealthCheck(activeProject);
  }, [activeProject]);

  // Import ZIP Handler with Safe Extraction
  const handleImportZip = async (file: File) => {
    setIsImporting(true);
    try {
      const { files, rootHtmlPath, totalSize } = await unpackHotspotZip(file);

      // Parse HTML
      const rootHtmlContent = files[rootHtmlPath]?.content || Object.values(files)[0]?.content || '';
      const styleContent = files['css/style.css']?.content || files['style.css']?.content || '';
      const parsedData = parseHotspotHtml(rootHtmlContent, styleContent);

      const now = Date.now();
      const baseName = file.name.replace(/\.zip$/i, '');

      const newProject: HotspotProject = {
        id: `project-${now}`,
        name: baseName || `مشروع ${parsedData.networkName}`,
        networkName: parsedData.networkName,
        phone: parsedData.phone,
        whatsapp: parsedData.whatsapp,
        headline: parsedData.headline,
        subheadline: parsedData.subheadline,
        welcomeText: parsedData.welcomeText,
        primaryColor: parsedData.primaryColor,
        secondaryColor: parsedData.secondaryColor,
        bgColor: parsedData.bgColor,
        textColor: parsedData.textColor,
        buttonShape: parsedData.buttonShape,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: 'md',
        textAlign: 'center',
        logoPath: parsedData.logoPath,
        backgroundPath: parsedData.backgroundPath,
        sliderImages: parsedData.sliderImages,
        customCss: '',
        customJs: '',
        files,
        versions: [],
        notes: `مستورد من ملف ${file.name}`,
        createdAt: now,
        updatedAt: now,
        mikrotikVariables: parsedData.mikrotikVariables,
      };

      // Save version snapshot
      const projectWithVersion = await saveVersionSnapshot(newProject, 'النسخة الأصلية عند الاستيراد');

      // Update state
      await saveProject(projectWithVersion);
      const updatedList = await loadProjects();
      setProjects(updatedList);
      setActiveProject(projectWithVersion);
      setActiveFilePath(rootHtmlPath);
      setActiveTab('visual');
    } catch (err: any) {
      alert(`فشل استيراد ملف ZIP: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  // Create duplicate of project
  const handleDuplicateProject = async (project: HotspotProject) => {
    const now = Date.now();
    const duplicated: HotspotProject = {
      ...JSON.parse(JSON.stringify(project)),
      id: `project-${now}`,
      name: `${project.name} (نسخة مكررة)`,
      createdAt: now,
      updatedAt: now,
    };
    await saveProject(duplicated);
    const updated = await loadProjects();
    setProjects(updated);
  };

  // Delete project
  const handleDeleteProject = async (projectId: string) => {
    await deleteProject(projectId);
    const updated = await loadProjects();
    setProjects(updated);
    if (activeProject?.id === projectId) {
      setActiveProject(null);
    }
  };

  // Update project state and persist
  const handleUpdateProject = async (updated: HotspotProject) => {
    setActiveProject(updated);
    await saveProject(updated);
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  // Save file from code editor
  const handleSaveFile = async (filePath: string, newContent: string) => {
    if (!activeProject) return;
    const updatedFiles = {
      ...activeProject.files,
      [filePath]: {
        ...activeProject.files[filePath],
        content: newContent,
        size: new Blob([newContent]).size,
      },
    };

    const updatedProject = {
      ...activeProject,
      files: updatedFiles,
      updatedAt: Date.now(),
    };

    await handleUpdateProject(updatedProject);
  };

  // Create Snapshot
  const handleCreateSnapshot = async (note?: string) => {
    if (!activeProject) return;
    const updated = await saveVersionSnapshot(activeProject, note);
    setActiveProject(updated);
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  // Restore Snapshot
  const handleRestoreVersion = async (versionId: string) => {
    if (!activeProject) return;
    const restored = await restoreVersion(activeProject, versionId);
    setActiveProject(restored);
    setProjects(prev => prev.map(p => p.id === restored.id ? restored : p));
  };

  // Apply AI Diff
  const handleApplyAIDiff = async (diff: AIDiffResponse) => {
    if (!activeProject) return;

    // Create snapshot before applying AI changes
    await saveVersionSnapshot(activeProject, `قبل تطبيق تعديلات AI: ${diff.summary}`);

    const updated: HotspotProject = {
      ...activeProject,
      networkName: diff.networkName || activeProject.networkName,
      phone: diff.phone || activeProject.phone,
      primaryColor: diff.primaryColor || activeProject.primaryColor,
      secondaryColor: diff.secondaryColor || activeProject.secondaryColor,
      bgColor: diff.bgColor || activeProject.bgColor,
      buttonShape: diff.buttonShape || activeProject.buttonShape,
      updatedAt: Date.now(),
    };

    // If new HTML or CSS was generated, update the files
    if (diff.newHtml) {
      const htmlKey = Object.keys(updated.files).find(k => k === 'index.html' || k === 'login.html') || 'index.html';
      if (updated.files[htmlKey]) {
        updated.files[htmlKey].content = diff.newHtml;
      }
    }

    if (diff.newCss) {
      const cssKey = Object.keys(updated.files).find(k => k.endsWith('.css')) || 'css/style.css';
      if (updated.files[cssKey]) {
        updated.files[cssKey].content = diff.newCss;
      }
    }

    await handleUpdateProject(updated);
  };

  // Auto-Fix Health issues
  const handleAutoFixHealth = async () => {
    if (!activeProject) return;
    const htmlKey = Object.keys(activeProject.files).find(k => k === 'index.html' || k === 'login.html');
    if (!htmlKey) return;

    let html = activeProject.files[htmlKey].content;

    // Fix form action if missing
    if (html.includes('<form') && !html.includes('$(link-login-only)') && !html.includes('$(link-login)')) {
      html = html.replace(/<form\b([^>]*?)action="[^"]*"/i, '<form$1action="$(link-login-only)"');
      if (!html.includes('action="$(link-login-only)"')) {
        html = html.replace(/<form\b([^>]*)>/i, '<form$1 action="$(link-login-only)" method="post">');
      }
    }

    // Fix missing $(error)
    if (!html.includes('$(error)')) {
      if (html.includes('</form>')) {
        html = html.replace('</form>', '\n      $(if error)\n      <div class="alert alert-error">$(error)</div>\n      $(endif)\n      </form>');
      }
    }

    const updatedFiles = {
      ...activeProject.files,
      [htmlKey]: {
        ...activeProject.files[htmlKey],
        content: html,
      },
    };

    await handleUpdateProject({
      ...activeProject,
      files: updatedFiles,
    });
  };

  if (showSplash) {
    return <SplashView onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Application Header */}
      <Header
        projectName={activeProject?.name}
        networkName={activeProject?.networkName}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBackToHome={() => setActiveProject(null)}
        onOpenAI={() => setIsAIModalOpen(true)}
        onOpenHealth={() => setIsHealthModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onSaveSnapshot={() => handleCreateSnapshot('حفظ يدوي سريع')}
        healthReport={healthReport}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {!activeProject ? (
          /* Home Dashboard */
          <HomeView
            projects={projects}
            onOpenProject={(proj) => {
              setActiveProject(proj);
              setActiveTab('visual');
            }}
            onNewProject={() => setIsTemplatesModalOpen(true)}
            onImportZip={handleImportZip}
            onOpenTemplates={() => setIsTemplatesModalOpen(true)}
            onOpenHelp={() => setIsHelpModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onDuplicateProject={handleDuplicateProject}
            onDeleteProject={handleDeleteProject}
            onQuickExport={(proj) => {
              setActiveProject(proj);
              setIsExportModalOpen(true);
            }}
            isImporting={isImporting}
          />
        ) : (
          /* Project Workspace Split/Tab View */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left/Main Column: Active Editor Tool */}
            <div className={`flex-1 flex flex-col overflow-hidden ${activeTab === 'simulator' ? 'lg:flex' : ''}`}>
              {activeTab === 'visual' && (
                <VisualEditor
                  project={activeProject}
                  onChange={handleUpdateProject}
                  onOpenAI={() => setIsAIModalOpen(true)}
                />
              )}

              {activeTab === 'code' && (
                <CodeEditor
                  project={activeProject}
                  activeFilePath={activeFilePath}
                  onSaveFile={handleSaveFile}
                  onSelectFile={setActiveFilePath}
                />
              )}

              {activeTab === 'files' && (
                <FileManager
                  project={activeProject}
                  onOpenFileInEditor={(file) => {
                    setActiveFilePath(file);
                    setActiveTab('code');
                  }}
                  onUpdateFiles={(files) => handleUpdateProject({ ...activeProject, files })}
                />
              )}

              {activeTab === 'simulator' && (
                <DeviceSimulator
                  project={activeProject}
                  activeFile={activeFilePath}
                />
              )}
            </div>

            {/* Split Screen Live iPhone 13 Pro Max Simulator for Desktop View */}
            {activeTab !== 'simulator' && (
              <div className="hidden xl:flex w-[480px] border-r border-slate-800 flex-col bg-slate-950/60 shrink-0">
                <DeviceSimulator
                  project={activeProject}
                  activeFile={activeFilePath}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Global Modals */}
      {activeProject && (
        <>
          <AIAssistantModal
            isOpen={isAIModalOpen}
            onClose={() => setIsAIModalOpen(false)}
            project={activeProject}
            onApplyDiff={handleApplyAIDiff}
          />

          {healthReport && (
            <HealthCheckModal
              isOpen={isHealthModalOpen}
              onClose={() => setIsHealthModalOpen(false)}
              project={activeProject}
              report={healthReport}
              onAutoFix={handleAutoFixHealth}
            />
          )}

          {healthReport && (
            <ExportModal
              isOpen={isExportModalOpen}
              onClose={() => setIsExportModalOpen(false)}
              project={activeProject}
              healthReport={healthReport}
            />
          )}

          <VersionHistoryModal
            isOpen={isHistoryModalOpen}
            onClose={() => setIsHistoryModalOpen(false)}
            project={activeProject}
            onCreateSnapshot={handleCreateSnapshot}
            onRestoreVersion={handleRestoreVersion}
          />
        </>
      )}

      <TemplateGalleryModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelectTemplate={(proj) => {
          handleUpdateProject(proj);
          setActiveProject(proj);
          setActiveTab('visual');
        }}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onClearAllProjects={async () => {
          localStorage.clear();
          const fresh = await loadProjects();
          setProjects(fresh);
          setActiveProject(null);
        }}
      />
    </div>
  );
}
