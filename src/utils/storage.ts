import { Preferences } from '@capacitor/preferences';
import { HotspotProject, ProjectVersion } from '../types';
import { TEMPLATES } from '../data/templates';

const PROJECTS_STORAGE_KEY = 'hotspot_plus_projects_v1';
const ACTIVE_PROJECT_KEY = 'hotspot_plus_active_id';

/**
 * Loads all saved projects from local storage
 */
export async function loadProjects(): Promise<HotspotProject[]> {
  try {
    const { value } = await Preferences.get({ key: PROJECTS_STORAGE_KEY });
    if (!value) {
      // Seed default project if first time
      return await seedInitialProjects();
    }
    const parsed: HotspotProject[] = JSON.parse(value);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return await seedInitialProjects();
    }
    return parsed;
  } catch (err) {
    console.warn('Storage read failed, using localStorage fallback:', err);
    const local = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        return seedInitialProjects();
      }
    }
    return seedInitialProjects();
  }
}

/**
 * Saves or updates a project in local storage
 */
export async function saveProject(project: HotspotProject): Promise<void> {
  const projects = await loadProjects();
  const existingIdx = projects.findIndex(p => p.id === project.id);

  project.updatedAt = Date.now();

  if (existingIdx >= 0) {
    projects[existingIdx] = project;
  } else {
    projects.unshift(project);
  }

  const serialized = JSON.stringify(projects);
  try {
    await Preferences.set({
      key: PROJECTS_STORAGE_KEY,
      value: serialized,
    });
  } catch {
    localStorage.setItem(PROJECTS_STORAGE_KEY, serialized);
  }
}

/**
 * Deletes a project by id
 */
export async function deleteProject(id: string): Promise<void> {
  const projects = await loadProjects();
  const filtered = projects.filter(p => p.id !== id);
  const serialized = JSON.stringify(filtered);
  try {
    await Preferences.set({
      key: PROJECTS_STORAGE_KEY,
      value: serialized,
    });
  } catch {
    localStorage.setItem(PROJECTS_STORAGE_KEY, serialized);
  }
}

/**
 * Creates a version snapshot for undo / restore history
 */
export async function saveVersionSnapshot(project: HotspotProject, note?: string): Promise<HotspotProject> {
  const snapshotVersion: ProjectVersion = {
    id: `ver-${Date.now()}`,
    timestamp: Date.now(),
    name: `نسخة ${new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
    note: note || 'حفظ يدوي',
    snapshot: {
      networkName: project.networkName,
      phone: project.phone,
      whatsapp: project.whatsapp,
      primaryColor: project.primaryColor,
      secondaryColor: project.secondaryColor,
      bgColor: project.bgColor,
      buttonShape: project.buttonShape,
      files: JSON.parse(JSON.stringify(project.files)),
    },
  };

  const updatedVersions = [snapshotVersion, ...(project.versions || [])].slice(0, 15); // keep last 15 versions
  const updatedProject = {
    ...project,
    versions: updatedVersions,
    updatedAt: Date.now(),
  };

  await saveProject(updatedProject);
  return updatedProject;
}

/**
 * Restores a snapshot version into the project
 */
export async function restoreVersion(project: HotspotProject, versionId: string): Promise<HotspotProject> {
  const version = project.versions?.find(v => v.id === versionId);
  if (!version) throw new Error('النسخة المطلوبة غير موجودة.');

  const restoredProject: HotspotProject = {
    ...project,
    networkName: version.snapshot.networkName,
    phone: version.snapshot.phone,
    whatsapp: version.snapshot.whatsapp,
    primaryColor: version.snapshot.primaryColor,
    secondaryColor: version.snapshot.secondaryColor,
    bgColor: version.snapshot.bgColor,
    buttonShape: version.snapshot.buttonShape,
    files: JSON.parse(JSON.stringify(version.snapshot.files)),
    updatedAt: Date.now(),
  };

  await saveProject(restoredProject);
  return restoredProject;
}

/**
 * Seeds initial projects if storage is empty
 */
async function seedInitialProjects(): Promise<HotspotProject[]> {
  const initial = [TEMPLATES[0].createProject()];
  const serialized = JSON.stringify(initial);
  try {
    await Preferences.set({
      key: PROJECTS_STORAGE_KEY,
      value: serialized,
    });
  } catch {
    localStorage.setItem(PROJECTS_STORAGE_KEY, serialized);
  }
  return initial;
}

export async function getActiveProjectId(): Promise<string | null> {
  try {
    const { value } = await Preferences.get({ key: ACTIVE_PROJECT_KEY });
    return value || localStorage.getItem(ACTIVE_PROJECT_KEY);
  } catch {
    return localStorage.getItem(ACTIVE_PROJECT_KEY);
  }
}

export async function setActiveProjectId(id: string): Promise<void> {
  try {
    await Preferences.set({ key: ACTIVE_PROJECT_KEY, value: id });
  } catch {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  }
}
