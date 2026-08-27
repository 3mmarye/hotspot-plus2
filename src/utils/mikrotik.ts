import { MikroTikVariable } from '../types';

export const MIKROTIK_KNOWN_VARIABLES: MikroTikVariable[] = [
  { tag: '$(username)', description: 'اسم المستخدم لعملية الدخول', category: 'auth', isSensitive: true },
  { tag: '$(password)', description: 'كلمة المرور لعملية الدخول', category: 'auth', isSensitive: true },
  { tag: '$(link-login)', description: 'رابط تسجيل الدخول في المايكروتك', category: 'auth', isSensitive: true },
  { tag: '$(link-login-only)', description: 'رابط تسجيل الدخول المباشر بدون إرجاع', category: 'auth', isSensitive: true },
  { tag: '$(link-orig)', description: 'الرابط الأصلي الذي طلبه المستخدم', category: 'auth', isSensitive: false },
  { tag: '$(link-orig-esc)', description: 'الرابط الأصلي المرمز (URL-encoded)', category: 'auth', isSensitive: false },
  { tag: '$(link-logout)', description: 'رابط تسجيل الخروج من الشبكة', category: 'session', isSensitive: true },
  { tag: '$(link-status)', description: 'رابط صفحة حالة الاتصال (Status)', category: 'session', isSensitive: true },
  { tag: '$(error)', description: 'رسالة الخطأ المترجمة من المايكروتك', category: 'auth', isSensitive: false },
  { tag: '$(error-orig)', description: 'نص الخطأ الأصلي القادم من الراوتر', category: 'auth', isSensitive: false },
  { tag: '$(ip)', description: 'عنوان IP الخاص بجهاز المشترك', category: 'system', isSensitive: false },
  { tag: '$(mac)', description: 'عنوان MAC الخاص بجهاز المشترك', category: 'system', isSensitive: false },
  { tag: '$(identity)', description: 'اسم الراوتر أو هوية شبكة المايكروتك', category: 'system', isSensitive: false },
  { tag: '$(chap-id)', description: 'معرف تشفير CHAP الخاص بالدخول', category: 'auth', isSensitive: true },
  { tag: '$(chap-challenge)', description: 'رمز تحدي CHAP الآمن', category: 'auth', isSensitive: true },
  { tag: '$(popup)', description: 'التحكم في ظهور النوافذ المنبثقة', category: 'system', isSensitive: false },
  { tag: '$(trial)', description: 'رابط الدخول التجريبي المجاني (Trial)', category: 'auth', isSensitive: false },
  { tag: '$(domain)', description: 'اسم النطاق أو خادم الهوتسبوت', category: 'system', isSensitive: false },
  { tag: '$(interface-name)', description: 'اسم المنفذ أو كرت الشبكة', category: 'system', isSensitive: false },
  { tag: '$(uptime)', description: 'مدة الاتصال والوقت المستغرق', category: 'stats', isSensitive: false },
  { tag: '$(bytes-in-nice)', description: 'حجم البيانات المستلمة (تنزيل)', category: 'stats', isSensitive: false },
  { tag: '$(bytes-out-nice)', description: 'حجم البيانات المرسلة (رفع)', category: 'stats', isSensitive: false },
  { tag: '$(session-time-left)', description: 'الوقت المتبقي لانتهاء الجلسة', category: 'stats', isSensitive: false },
  { tag: '$(remain-bytes-total-nice)', description: 'الرصيد أو حجم الباقة المتبقي', category: 'stats', isSensitive: false },
  { tag: '$(logged-in)', description: 'حالة تسجيل دخول المشترك (yes/no)', category: 'session', isSensitive: false },
];

/**
 * Discovers all MikroTik variables in a given text/HTML string
 */
export function extractMikroTikVariables(content: string): string[] {
  if (!content) return [];
  const regex = /\$\([a-zA-Z0-9_-]+\)/g;
  const matches = content.match(regex);
  if (!matches) return [];
  return Array.from(new Set(matches));
}

/**
 * Checks if a string contains critical auth variables
 */
export function validateMikroTikAuthVariables(html: string): {
  hasUsername: boolean;
  hasPassword: boolean;
  hasLoginLink: boolean;
  missingRequired: string[];
} {
  const hasUsername = html.includes('$(username)') || html.includes('name="username"');
  const hasPassword = html.includes('$(password)') || html.includes('name="password"');
  const hasLoginLink = html.includes('$(link-login)') || html.includes('$(link-login-only)');

  const missingRequired: string[] = [];
  if (!hasUsername) missingRequired.push('حقل اسم المستخدم (username)');
  if (!hasPassword) missingRequired.push('حقل كلمة المرور (password)');
  if (!hasLoginLink) missingRequired.push('رابط الدخول $(link-login) أو $(link-login-only)');

  return {
    hasUsername,
    hasPassword,
    hasLoginLink,
    missingRequired,
  };
}
