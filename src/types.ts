export interface HotspotFile {
  path: string;
  name: string;
  mimeType: string;
  content: string; // text content or base64 data URL
  isBinary: boolean;
  size: number;
}

export interface ProjectVersion {
  id: string;
  timestamp: number;
  name: string;
  note?: string;
  snapshot: {
    networkName: string;
    phone: string;
    whatsapp: string;
    primaryColor: string;
    secondaryColor: string;
    bgColor: string;
    buttonShape: 'rounded' | 'pill' | 'square';
    files: Record<string, HotspotFile>;
  };
}

export interface HotspotProject {
  id: string;
  name: string;
  networkName: string;
  phone: string;
  whatsapp: string;
  headline: string;
  subheadline: string;
  welcomeText: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  textColor: string;
  buttonShape: 'rounded' | 'pill' | 'square';
  fontFamily: string;
  fontSize: 'sm' | 'md' | 'lg';
  textAlign: 'right' | 'center' | 'left';
  logoPath?: string;
  backgroundPath?: string;
  sliderImages: string[];
  customCss: string;
  customJs: string;
  files: Record<string, HotspotFile>;
  versions: ProjectVersion[];
  notes: string;
  createdAt: number;
  updatedAt: number;
  templateId?: string;
  mikrotikVariables: string[];
}

export interface MikroTikVariable {
  tag: string;
  description: string;
  category: 'auth' | 'session' | 'system' | 'stats';
  isSensitive: boolean;
}

export interface HealthIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  file?: string;
  fixSuggestion?: string;
  autoFixable?: boolean;
}

export interface HealthReport {
  score: number; // 0 - 100
  status: 'excellent' | 'good' | 'warning' | 'critical';
  issues: HealthIssue[];
  mikrotikFound: string[];
  missingAssets: string[];
  totalFiles: number;
  totalSizeFormatted: string;
}

export interface AIDiffChange {
  field: string;
  label: string;
  before: string;
  after: string;
}

export interface AIDiffResponse {
  summary: string;
  changes: AIDiffChange[];
  networkName?: string;
  phone?: string;
  primaryColor?: string;
  secondaryColor?: string;
  bgColor?: string;
  buttonShape?: 'rounded' | 'pill' | 'square';
  newHtml?: string;
  newCss?: string;
  newJs?: string;
  mikrotikVariablesPreserved: string[];
}
