import { HotspotProject, HealthReport, HealthIssue } from '../types';
import { extractMikroTikVariables } from './mikrotik';

export function runHotspotHealthCheck(project: HotspotProject): HealthReport {
  const issues: HealthIssue[] = [];
  const files = project.files || {};
  let score = 100;

  // 1. Locate primary HTML file
  let mainHtmlFile = files['index.html'] || files['login.html'];
  if (!mainHtmlFile) {
    const firstHtmlKey = Object.keys(files).find(k => k.endsWith('.html'));
    if (firstHtmlKey) {
      mainHtmlFile = files[firstHtmlKey];
    }
  }

  if (!mainHtmlFile) {
    issues.push({
      id: 'missing-main-html',
      type: 'error',
      title: 'الملف الرئيسي مفقود',
      description: 'لم يتم العثور على ملف login.html أو index.html في المشروع.',
      fixSuggestion: 'أضف ملف login.html يحتوي على نموذج تسجيل الدخول.',
    });
    score -= 40;
  } else {
    const htmlContent = mainHtmlFile.content;

    // Check MikroTik Form Action
    const hasForm = htmlContent.includes('<form');
    if (!hasForm) {
      issues.push({
        id: 'no-login-form',
        type: 'error',
        title: 'نموذج الدخول غير موجود',
        description: 'الصفحة لا تحتوي على عنصر <form> لتسجيل الدخول في المايكروتك.',
        file: mainHtmlFile.name,
        fixSuggestion: 'تأكد من وجود <form name="login" action="$(link-login-only)" method="post">',
      });
      score -= 25;
    } else {
      const hasAction = htmlContent.includes('$(link-login-only)') || htmlContent.includes('$(link-login)');
      if (!hasAction) {
        issues.push({
          id: 'invalid-form-action',
          type: 'warning',
          title: 'رابط إرسال النموذج غير مطابق للمايكروتك',
          description: 'يفضل أن يكون action الخاص بالنموذج هو $(link-login-only) أو $(link-login).',
          file: mainHtmlFile.name,
          fixSuggestion: 'قم بتعيين action="$(link-login-only)" في وسم <form>.',
          autoFixable: true,
        });
        score -= 10;
      }

      // Check Username Input
      const hasUserField = htmlContent.includes('name="username"') || htmlContent.includes("name='username'");
      if (!hasUserField) {
        issues.push({
          id: 'missing-username-field',
          type: 'error',
          title: 'حقل اسم المستخدم مفقود',
          description: 'المايكروتك يتطلب حقل إدخال باسم username لتوثيق المشترك.',
          file: mainHtmlFile.name,
          fixSuggestion: 'أضف <input name="username" type="text" placeholder="اسم المستخدم" />',
        });
        score -= 20;
      }

      // Check Password Input
      const hasPassField = htmlContent.includes('name="password"') || htmlContent.includes("name='password'");
      if (!hasPassField) {
        issues.push({
          id: 'missing-password-field',
          type: 'info',
          title: 'حقل كلمة المرور غير موجود',
          description: 'إذا كانت شبكتك تعمل بنظام الكروت المدمجة (User only) فهذا طبيعي، أما إذا كانت بكلمة سر فيجب إضافته.',
          file: mainHtmlFile.name,
          fixSuggestion: 'أضف <input name="password" type="password" placeholder="كلمة المرور" /> إذا كنت تستخدم كلمات مرور.',
        });
        score -= 5;
      }

      // Check Error Variable
      const hasErrorVar = htmlContent.includes('$(error)');
      if (!hasErrorVar) {
        issues.push({
          id: 'missing-error-tag',
          type: 'warning',
          title: 'متغير عرض الأخطاء $(error) غير موجود',
          description: 'لن يتمكن المشترك من معرفة سبب فشل تسجيل الدخول (مثل انتهاء الكرت أو الرصيد).',
          file: mainHtmlFile.name,
          fixSuggestion: 'أضف <div class="error">$(error)</div> لعرض رسائل الراوتر.',
          autoFixable: true,
        });
        score -= 10;
      }
    }

    // 2. Check Missing Local Assets & Broken Links
    const missingAssets: string[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Check <img> tags
    const imgElements = Array.from(doc.querySelectorAll('img'));
    imgElements.forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('data:')) {
        const cleanPath = src.replace(/^\.\//, '').replace(/^\//, '');
        // Search in project files
        const exists = Object.keys(files).some(k => k === cleanPath || k.endsWith('/' + cleanPath) || k.endsWith(cleanPath));
        if (!exists) {
          missingAssets.push(src);
          issues.push({
            id: `missing-img-${src}`,
            type: 'error',
            title: `الصورة "${src}" غير موجودة`,
            description: `الملف المشار إليه في وسم <img> غير متوفر في مجلدات المشروع.`,
            file: mainHtmlFile.name,
            fixSuggestion: 'قم برفع الصورة المفقودة أو استبدالها عبر المحرر البصري.',
          });
          score -= 8;
        }
      }
    });

    // Check CSS link tags
    const cssLinks = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
    cssLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http://') && !href.startsWith('https://')) {
        const cleanPath = href.replace(/^\.\//, '').replace(/^\//, '');
        const exists = Object.keys(files).some(k => k === cleanPath || k.endsWith('/' + cleanPath) || k.endsWith(cleanPath));
        if (!exists) {
          issues.push({
            id: `missing-css-${href}`,
            type: 'warning',
            title: `ملف الأنماط "${href}" غير موجود`,
            description: `تم تضمين ملف CSS في الرأس لكنه غير موجود داخل المشروع.`,
            file: mainHtmlFile.name,
            fixSuggestion: 'أنشئ الملف أو أزل وسم <link> غير الضروري.',
          });
          score -= 5;
        }
      }
    });
  }

  // 3. Status File check
  const hasStatusHtml = Object.keys(files).some(k => k.toLowerCase().includes('status.html'));
  if (!hasStatusHtml) {
    issues.push({
      id: 'missing-status-page',
      type: 'info',
      title: 'صفحة الحالة status.html مستحسنة',
      description: 'صفحة status.html تعرض للمشترك الوقت المتبقي ورصيد الباقة بعد تسجيل الدخول.',
      fixSuggestion: 'يمكنك إنشاء صفحة status.html لعرض استهلاك وبيانات المشترك.',
    });
  }

  // Calculate stats
  let totalBytes = 0;
  Object.values(files).forEach(f => {
    totalBytes += f.size || 0;
  });

  const totalSizeFormatted = totalBytes > 1024 * 1024
    ? `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`
    : `${(totalBytes / 1024).toFixed(0)} KB`;

  // Discovered MikroTik tags
  const combinedContent = Object.values(files).map(f => f.content).join(' ');
  const mikrotikFound = extractMikroTikVariables(combinedContent);

  // Normalize score
  score = Math.max(0, Math.min(100, score));

  let status: 'excellent' | 'good' | 'warning' | 'critical' = 'excellent';
  if (score < 60) status = 'critical';
  else if (score < 80) status = 'warning';
  else if (score < 95) status = 'good';

  return {
    score,
    status,
    issues,
    mikrotikFound,
    missingAssets: Array.from(new Set(issues.filter(i => i.id.startsWith('missing-img')).map(i => i.title))),
    totalFiles: Object.keys(files).length,
    totalSizeFormatted,
  };
}
