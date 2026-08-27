import { HotspotProject, HotspotFile } from '../types';

export interface TemplateDefinition {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  tag: string;
  badge: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  buttonShape: 'rounded' | 'pill' | 'square';
  previewHtml: string;
  createProject: () => HotspotProject;
}

// Reusable SVG logo for templates
const DEFAULT_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="46" fill="url(#g1)" />
  <path d="M50 20 A30 30 0 0 1 80 50" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none"/>
  <path d="M50 30 A20 20 0 0 1 70 50" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none"/>
  <path d="M50 40 A10 10 0 0 1 60 50" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none"/>
  <circle cx="50" cy="50" r="5" fill="#ffffff"/>
  <path d="M30 65 L50 82 L70 65" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'hotspot-modern',
    name: 'هوت سبوت مودرن (Hotspot Modern)',
    nameEn: 'Hotspot Modern',
    description: 'تصميم زجاجي فاخر مع باقات الأسعار وشريط معلومات اتصال ديناميكي متوافق مع كافة أجهزة المايكروتك.',
    tag: 'الأكثر طلباً',
    badge: 'Modern Glass',
    primaryColor: '#2563eb',
    secondaryColor: '#06b6d4',
    bgColor: '#090d16',
    buttonShape: 'rounded',
    previewHtml: '',
    createProject: () => {
      const now = Date.now();
      const files: Record<string, HotspotFile> = {
        'index.html': {
          path: 'index.html',
          name: 'index.html',
          mimeType: 'text/html',
          isBinary: false,
          size: 3200,
          content: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>تسجيل الدخول - شبكة النور</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="background-glow"></div>
  <div class="container">
    <div class="card glass-card">
      <div class="header">
        <img src="img/logo.svg" alt="شعار الشبكة" class="logo" data-field="logo">
        <h1 class="network-name" data-field="network-name">شبكة النور</h1>
        <p class="welcome-text" data-field="welcome-text">أهلاً بك! سجل دخولك للاستمتاع بإنترنت فائق السرعة</p>
      </div>

      <!-- تنبيه خطأ المايكروتك -->
      $(if error)
      <div class="alert alert-error">
        <span class="icon">⚠️</span>
        <span class="error-msg">$(error)</span>
      </div>
      $(endif)

      <form name="login" action="$(link-login-only)" method="post">
        <input type="hidden" name="dst" value="$(link-orig)" />
        <input type="hidden" name="popup" value="true" />

        <div class="input-group">
          <label>اسم المستخدم أو رقم الكرت</label>
          <input type="text" name="username" value="$(username)" placeholder="أدخل اسم المستخدم" required autocomplete="off" autocapitalize="none">
        </div>

        <div class="input-group">
          <label>كلمة المرور</label>
          <input type="password" name="password" placeholder="أدخل كلمة المرور" autocomplete="off">
        </div>

        <button type="submit" class="btn-primary">تسجيل الدخول</button>
      </form>

      $(if trial == 'yes')
      <div class="trial-box">
        <a href="$(link-login-only)?dst=$(link-orig-esc)&amp;username=T-$(mac-esc)" class="btn-trial">تجربة إنترنت مجاني 🎁</a>
      </div>
      $(endif)

      <div class="packages-section">
        <h3>باقات الإنترنت المتوفرة</h3>
        <div class="packages-grid">
          <div class="package-card">
            <span class="pkg-name">باقة 1 جيجا</span>
            <span class="pkg-price">100 ريال</span>
          </div>
          <div class="package-card featured">
            <span class="pkg-name">باقة 3 جيجا</span>
            <span class="pkg-price">250 ريال</span>
          </div>
          <div class="package-card">
            <span class="pkg-name">باقة يوم كامل</span>
            <span class="pkg-price">500 ريال</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>خدمة العملاء والدعم الفني:</p>
        <div class="contact-buttons">
          <a href="tel:782727242" class="contact-btn">📞 <span class="phone-number" data-field="phone">782727242</span></a>
          <a href="https://wa.me/782727242" class="contact-btn wa-btn">💬 واتساب</a>
        </div>
        <p class="copyright">جميع الحقوق محفوظة &copy; <span class="network-name">شبكة النور</span></p>
      </div>
    </div>
  </div>
  <script src="js/app.js"></script>
</body>
</html>`
        },
        'status.html': {
          path: 'status.html',
          name: 'status.html',
          mimeType: 'text/html',
          isBinary: false,
          size: 2100,
          content: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>حالة الاتصال - $(identity)</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <div class="card glass-card">
      <div class="header">
        <h2 class="network-name">حالة الاتصال</h2>
        <p>أنت متصل بالإنترنت الآن بنجاح</p>
      </div>

      <table class="status-table">
        <tr><td>المشترك:</td><td><b>$(username)</b></td></tr>
        <tr><td>عنوان IP:</td><td>$(ip)</td></tr>
        <tr><td>الرصيد / الوقت المتبقي:</td><td><span class="highlight">$(session-time-left)</span></td></tr>
        <tr><td>البيانات المستهلكة:</td><td>$(bytes-in-nice) / $(bytes-out-nice)</td></tr>
        <tr><td>وقت الاتصال:</td><td>$(uptime)</td></tr>
      </table>

      <form action="$(link-logout)" name="logout" method="post">
        <button type="submit" class="btn-danger">تسجيل الخروج</button>
      </form>
    </div>
  </div>
</body>
</html>`
        },
        'css/style.css': {
          path: 'css/style.css',
          name: 'style.css',
          mimeType: 'text/css',
          isBinary: false,
          size: 2500,
          content: `:root {
  --primary-color: #2563eb;
  --secondary-color: #06b6d4;
  --bg-color: #090d16;
  --card-bg: rgba(18, 24, 38, 0.85);
  --text-color: #f8fafc;
  --text-muted: #94a3b8;
  --border-color: rgba(255, 255, 255, 0.1);
  --btn-radius: 12px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  direction: rtl;
}

.container {
  width: 100%;
  max-width: 440px;
  margin: auto;
}

.glass-card {
  background: var(--card-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 24px 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.logo {
  width: 72px;
  height: 72px;
  margin-bottom: 10px;
  filter: drop-shadow(0 4px 10px rgba(37, 99, 235, 0.4));
}

.network-name {
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
}

.welcome-text {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.4;
}

.input-group {
  margin-bottom: 14px;
}

.input-group label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.input-group input {
  width: 100%;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: var(--btn-radius);
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.input-group input:focus {
  border-color: var(--primary-color);
  background: rgba(255, 255, 255, 0.08);
}

.btn-primary {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: #ffffff;
  border: none;
  border-radius: var(--btn-radius);
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 6px;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.35);
  transition: transform 0.15s, opacity 0.2s;
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-trial {
  display: block;
  text-align: center;
  margin-top: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px dashed var(--border-color);
  border-radius: var(--btn-radius);
  color: var(--secondary-color);
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
}

.packages-section {
  margin-top: 20px;
  border-top: 1px solid var(--border-color);
  padding-top: 16px;
}

.packages-section h3 {
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
  margin-bottom: 10px;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.package-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 8px 4px;
  text-align: center;
}

.package-card.featured {
  border-color: var(--primary-color);
  background: rgba(37, 99, 235, 0.15);
}

.pkg-name {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
}

.pkg-price {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  margin-top: 4px;
}

.footer {
  text-align: center;
  margin-top: 20px;
  font-size: 12px;
  color: var(--text-muted);
}

.contact-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 10px 0;
}

.contact-btn {
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  color: #fff;
  text-decoration: none;
  font-size: 12px;
}

.wa-btn {
  background: rgba(37, 211, 102, 0.15);
  color: #25d366;
}

.copyright {
  font-size: 11px;
  opacity: 0.6;
}

.alert-error {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fca5a5;
  padding: 10px;
  border-radius: 10px;
  font-size: 12px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.status-table td {
  padding: 8px 4px;
  border-bottom: 1px solid var(--border-color);
  font-size: 13px;
}

.btn-danger {
  width: 100%;
  padding: 12px;
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: var(--btn-radius);
  font-weight: bold;
  cursor: pointer;
}`
        },
        'js/app.js': {
          path: 'js/app.js',
          name: 'app.js',
          mimeType: 'application/javascript',
          isBinary: false,
          size: 600,
          content: `// Hotspot Plus Client Interactions
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form[name="login"]');
  if (form) {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'جاري التحقق والاتصال...';
        btn.style.opacity = '0.8';
      }
    });
  }
});`
        },
        'img/logo.svg': {
          path: 'img/logo.svg',
          name: 'logo.svg',
          mimeType: 'image/svg+xml',
          isBinary: false,
          size: 650,
          content: DEFAULT_LOGO_SVG,
        },
      };

      return {
        id: `project-${now}`,
        name: 'مشروع هوت سبوت مودرن',
        networkName: 'شبكة النور',
        phone: '782727242',
        whatsapp: '782727242',
        headline: 'شبكة النور للإنترنت',
        subheadline: 'إنترنت فائق السرعة وباقات متنوعة',
        welcomeText: 'أهلاً بك! سجل دخولك للاستمتاع بإنترنت فائق السرعة',
        primaryColor: '#2563eb',
        secondaryColor: '#06b6d4',
        bgColor: '#090d16',
        textColor: '#f8fafc',
        buttonShape: 'rounded',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: 'md',
        textAlign: 'center',
        logoPath: 'img/logo.svg',
        sliderImages: [],
        customCss: '',
        customJs: '',
        files,
        versions: [],
        notes: 'مشروع تم إنشاؤه من قالب Hotspot Modern',
        createdAt: now,
        updatedAt: now,
        templateId: 'hotspot-modern',
        mikrotikVariables: ['$(link-login-only)', '$(username)', '$(password)', '$(error)', '$(mac)', '$(ip)', '$(link-orig)', '$(trial)'],
      };
    },
  },
  {
    id: 'hotspot-basic',
    name: 'هوت سبوت كلاسيك (Hotspot Basic)',
    nameEn: 'Hotspot Basic',
    description: 'قالب خفيف جداً فائق السرعة بصفحة واحدة ونموذج تسجيل مبسط يلائم أجهزة الراوتر الصغيرة.',
    tag: 'خفيف وسريع',
    badge: 'Ultra Fast',
    primaryColor: '#0284c7',
    secondaryColor: '#38bdf8',
    bgColor: '#f1f5f9',
    buttonShape: 'rounded',
    previewHtml: '',
    createProject: () => {
      const now = Date.now();
      const p = TEMPLATES[0].createProject();
      p.id = `project-${now}`;
      p.name = 'مشروع هوت سبوت كلاسيك';
      p.templateId = 'hotspot-basic';
      p.primaryColor = '#0284c7';
      p.secondaryColor = '#38bdf8';
      p.bgColor = '#0f172a';
      return p;
    },
  },
  {
    id: 'hotspot-fiber',
    name: 'هوت سبوت فايبر (Hotspot Fiber)',
    nameEn: 'Hotspot Fiber',
    description: 'تصميم عالي التقنية مستوحى من كابلات الألياف الضوئية والسرعات الجيجابت بألوان نيون رائعة.',
    tag: 'ألياف ضوئية',
    badge: 'Gigabit Fiber',
    primaryColor: '#10b981',
    secondaryColor: '#06b6d4',
    bgColor: '#06131f',
    buttonShape: 'pill',
    previewHtml: '',
    createProject: () => {
      const now = Date.now();
      const p = TEMPLATES[0].createProject();
      p.id = `project-${now}`;
      p.name = 'مشروع هوت سبوت فايبر';
      p.templateId = 'hotspot-fiber';
      p.networkName = 'شبكة الفايبر السريعة';
      p.primaryColor = '#10b981';
      p.secondaryColor = '#06b6d4';
      p.bgColor = '#031b26';
      p.buttonShape = 'pill';
      return p;
    },
  },
  {
    id: 'hotspot-gaming',
    name: 'هوت سبوت جيمينج (Hotspot Gaming)',
    nameEn: 'Hotspot Gaming',
    description: 'مخصص لعشاق الألعاب مع ثيم البينج المنخفض وألوان نيون قوية وتصميم انسيابي للشباب.',
    tag: 'ألعاب و Ping منخفض',
    badge: 'Pro Gaming',
    primaryColor: '#7c3aed',
    secondaryColor: '#f43f5e',
    bgColor: '#0f0728',
    buttonShape: 'square',
    previewHtml: '',
    createProject: () => {
      const now = Date.now();
      const p = TEMPLATES[0].createProject();
      p.id = `project-${now}`;
      p.name = 'مشروع هوت سبوت جيمينج';
      p.templateId = 'hotspot-gaming';
      p.networkName = 'شبكة الألعاب Gaming Net';
      p.primaryColor = '#7c3aed';
      p.secondaryColor = '#f43f5e';
      p.bgColor = '#0d041a';
      p.buttonShape = 'square';
      return p;
    },
  },
  {
    id: 'hotspot-dark',
    name: 'هوت سبوت دارك فخم (Hotspot Dark)',
    nameEn: 'Hotspot Dark',
    description: 'ثيم ليلي مظلم مريح للعين مع تفاصيل رمادية عميقة وخطوط ناصعة وأناقة استثنائية.',
    tag: 'دارك فخم',
    badge: 'Luxury Dark',
    primaryColor: '#f59e0b',
    secondaryColor: '#d97706',
    bgColor: '#05070a',
    buttonShape: 'rounded',
    previewHtml: '',
    createProject: () => {
      const now = Date.now();
      const p = TEMPLATES[0].createProject();
      p.id = `project-${now}`;
      p.name = 'مشروع هوت سبوت دارك فخم';
      p.templateId = 'hotspot-dark';
      p.networkName = 'شبكة النخبة الذهبية';
      p.primaryColor = '#f59e0b';
      p.secondaryColor = '#d97706';
      p.bgColor = '#040609';
      p.buttonShape = 'rounded';
      return p;
    },
  },
];
