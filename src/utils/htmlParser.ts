import { HotspotProject } from '../types';
import { extractMikroTikVariables } from './mikrotik';

export interface ParsedHotspotData {
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
  logoPath?: string;
  backgroundPath?: string;
  sliderImages: string[];
  mikrotikVariables: string[];
  hasLoginForm: boolean;
  formAction?: string;
  imagesFound: string[];
  linksFound: string[];
}

/**
 * Robust HTML parser utilizing DOMParser (real HTML AST/DOM)
 */
export function parseHotspotHtml(html: string, cssContent: string = ''): ParsedHotspotData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Discovered MikroTik Variables
  const mikrotikVariables = extractMikroTikVariables(html + ' ' + cssContent);

  // 1. Extract Network Name
  let networkName = 'شبكة النور';
  const titleEl = doc.querySelector('title');
  if (titleEl && titleEl.textContent?.trim()) {
    const rawTitle = titleEl.textContent.trim();
    // Clean common prefixes
    networkName = rawTitle.replace(/(?:مرحباً بكم في|أهلاً بكم في|تسجيل الدخول|Hotspot|Mikrotik|صفحة الدخول)\s*[-:|–]?\s*/gi, '').trim() || rawTitle;
  }

  const brandEl = doc.querySelector('.network-name, .brand-name, .logo-text, #network-name, [data-field="network-name"]');
  if (brandEl && brandEl.textContent?.trim()) {
    networkName = brandEl.textContent.trim();
  }

  // 2. Extract Phone & WhatsApp
  let phone = '782727242';
  let whatsapp = '782727242';

  // Search links
  const telLink = doc.querySelector('a[href^="tel:"]');
  if (telLink) {
    const href = telLink.getAttribute('href') || '';
    const cleanPhone = href.replace('tel:', '').replace(/[^\d+]/g, '');
    if (cleanPhone) phone = cleanPhone;
  }

  const waLink = doc.querySelector('a[href*="wa.me"], a[href*="whatsapp.com"], a[href*="api.whatsapp.com"]');
  if (waLink) {
    const href = waLink.getAttribute('href') || '';
    const waMatch = href.match(/(?:wa\.me\/|phone=)(\+?\d+)/);
    if (waMatch && waMatch[1]) {
      whatsapp = waMatch[1].replace(/[^\d+]/g, '');
      if (phone === '782727242') phone = whatsapp;
    }
  }

  // Text search fallback for phone numbers
  if (phone === '782727242') {
    const bodyText = doc.body?.textContent || '';
    const phoneMatch = bodyText.match(/(?:رقم|هاتف|تواصل|خدمة العملاء|واتساب)\s*[:：]?\s*(\+?\d{7,14})/i);
    if (phoneMatch && phoneMatch[1]) {
      phone = phoneMatch[1].trim();
      whatsapp = phone;
    }
  }

  // 3. Extract Headings & Welcome text
  const h1 = doc.querySelector('h1, .headline, [data-field="headline"]');
  const h2 = doc.querySelector('h2, .subheadline, [data-field="subheadline"]');
  const p = doc.querySelector('p, .welcome-text, [data-field="welcome-text"]');

  const headline = h1?.textContent?.trim() || 'مرحباً بكم في شبكتنا';
  const subheadline = h2?.textContent?.trim() || 'إنترنت فائق السرعة وباقات متنوعة تناسب الجميع';
  const welcomeText = p?.textContent?.trim() || 'سجل دخولك الآن واستمتع بأقوى تغطية وأعلى سرعة إنترنت';

  // 4. Extract Images & Logo
  const allImgs = Array.from(doc.querySelectorAll('img')).map(img => img.getAttribute('src') || '').filter(Boolean);
  let logoPath: string | undefined = undefined;
  const logoEl = doc.querySelector('img.logo, img#logo, .logo img, [data-field="logo"]');
  if (logoEl) {
    logoPath = logoEl.getAttribute('src') || undefined;
  } else if (allImgs.length > 0) {
    logoPath = allImgs[0];
  }

  // Slider images
  const sliderImgs = Array.from(
    doc.querySelectorAll('.slider img, .carousel img, .swiper img, .slides img, [data-slider] img')
  ).map(img => img.getAttribute('src') || '').filter(Boolean);

  // 5. Colors extraction from CSS / styles
  let primaryColor = '#2563eb';
  let secondaryColor = '#06b6d4';
  let bgColor = '#090d16';
  let textColor = '#f8fafc';

  const combinedStyles = (doc.querySelector('style')?.textContent || '') + ' ' + cssContent;

  const hexColors = combinedStyles.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g) || [];
  if (hexColors.length > 0) {
    primaryColor = hexColors[0];
    if (hexColors.length > 1) secondaryColor = hexColors[1];
  }

  // Detect button shape
  let buttonShape: 'rounded' | 'pill' | 'square' = 'rounded';
  if (combinedStyles.includes('border-radius: 9999px') || combinedStyles.includes('border-radius: 50px') || combinedStyles.includes('rounded-full')) {
    buttonShape = 'pill';
  } else if (combinedStyles.includes('border-radius: 0') || combinedStyles.includes('rounded-none')) {
    buttonShape = 'square';
  }

  // 6. Check login form
  const formEl = doc.querySelector('form');
  const hasLoginForm = !!formEl;
  const formAction = formEl?.getAttribute('action') || '$(link-login-only)';

  // 7. Links
  const linksFound = Array.from(doc.querySelectorAll('a')).map(a => a.getAttribute('href') || '').filter(Boolean);

  return {
    networkName,
    phone,
    whatsapp,
    headline,
    subheadline,
    welcomeText,
    primaryColor,
    secondaryColor,
    bgColor,
    textColor,
    buttonShape,
    logoPath,
    backgroundPath: undefined,
    sliderImages: sliderImgs.length > 0 ? sliderImgs : allImgs.slice(1, 4),
    mikrotikVariables,
    hasLoginForm,
    formAction,
    imagesFound: allImgs,
    linksFound,
  };
}

/**
 * Safely updates HTML with new visual project settings while strictly preserving MikroTik tags
 */
export function updateHtmlWithProjectData(html: string, project: Partial<HotspotProject>): string {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Update Title
  if (project.networkName) {
    const titleEl = doc.querySelector('title');
    if (titleEl) {
      titleEl.textContent = `تسجيل الدخول - ${project.networkName}`;
    }
  }

  // Update Network Name Text
  if (project.networkName) {
    const nameEls = doc.querySelectorAll('.network-name, .brand-name, .logo-text, #network-name, [data-field="network-name"]');
    nameEls.forEach(el => {
      // Don't replace if it's a dynamic tag
      if (!el.textContent?.includes('$(')) {
        el.textContent = project.networkName!;
      }
    });
  }

  // Update Headlines
  if (project.headline) {
    const h1 = doc.querySelector('h1, .headline, [data-field="headline"]');
    if (h1 && !h1.textContent?.includes('$(')) {
      h1.textContent = project.headline;
    }
  }

  if (project.subheadline) {
    const h2 = doc.querySelector('h2, .subheadline, [data-field="subheadline"]');
    if (h2 && !h2.textContent?.includes('$(')) {
      h2.textContent = project.subheadline;
    }
  }

  if (project.welcomeText) {
    const p = doc.querySelector('p.welcome-text, .welcome-text, [data-field="welcome-text"]');
    if (p && !p.textContent?.includes('$(')) {
      p.textContent = project.welcomeText;
    }
  }

  // Update Phone & WhatsApp links
  if (project.phone) {
    const telLinks = doc.querySelectorAll('a[href^="tel:"]');
    telLinks.forEach(a => a.setAttribute('href', `tel:${project.phone}`));

    const phoneTexts = doc.querySelectorAll('.phone-number, .contact-phone, [data-field="phone"]');
    phoneTexts.forEach(el => {
      el.textContent = project.phone!;
    });
  }

  if (project.whatsapp) {
    const waClean = project.whatsapp.replace(/[^\d]/g, '');
    const waLinks = doc.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"], a[href*="api.whatsapp.com"]');
    waLinks.forEach(a => a.setAttribute('href', `https://wa.me/${waClean}`));
  }

  // Update Logo
  if (project.logoPath) {
    const logoImgs = doc.querySelectorAll('img.logo, img#logo, .logo img, [data-field="logo"]');
    logoImgs.forEach(img => {
      img.setAttribute('src', project.logoPath!);
    });
  }

  // Update Dynamic Style Injection
  let styleEl = doc.querySelector('style#hotspotplus-dynamic-styles');
  if (!styleEl) {
    styleEl = doc.createElement('style');
    styleEl.setAttribute('id', 'hotspotplus-dynamic-styles');
    doc.head.appendChild(styleEl);
  }

  const primary = project.primaryColor || '#2563eb';
  const secondary = project.secondaryColor || '#06b6d4';
  const bg = project.bgColor || '#090d16';
  const text = project.textColor || '#f8fafc';

  let btnRadius = '12px';
  if (project.buttonShape === 'pill') btnRadius = '9999px';
  if (project.buttonShape === 'square') btnRadius = '4px';

  styleEl.textContent = `
    :root {
      --primary-color: ${primary};
      --secondary-color: ${secondary};
      --bg-color: ${bg};
      --text-color: ${text};
      --btn-radius: ${btnRadius};
    }
    body {
      background-color: var(--bg-color) !important;
      color: var(--text-color) !important;
      direction: rtl;
      font-family: ${project.fontFamily || 'system-ui, -apple-system, sans-serif'};
    }
    .btn-primary, button[type="submit"], input[type="submit"], .login-btn {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)) !important;
      border-radius: var(--btn-radius) !important;
      color: #ffffff !important;
    }
    .text-primary, .highlight {
      color: var(--primary-color) !important;
    }
  `;

  // Serialize back to HTML string cleanly
  let output = doc.documentElement.outerHTML;

  // Add DOCTYPE if missing
  if (!output.startsWith('<!DOCTYPE') && !output.startsWith('<!doctype')) {
    output = '<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n' + doc.documentElement.innerHTML + '\n</html>';
  }

  return output;
}
