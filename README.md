# HOTSPOT PLUS (هوت سبوت بلس) 📱⚡
> **تطبيق تعديل وتصميم صفحات MikroTik Hotspot الذكي لأجهزة iPhone & iPad**

---

### 👨‍💻 معلومات المطور والتطبيق (Developer Info)
- **المطور (Developer):** عمار أحمد (Ammar Ahmed)
- **رقم التواصل والدعم الفني (Phone):** `782727242`
- **معرف الحزمة (Bundle ID):** `com.hotspotplus.app`
- **المنصة المستهدفة (Target Platform):** iOS (iPhone & iPad)
- **الجهاز الأساسي للاختبار:** `iPhone 13 Pro Max` (iOS 26 Fully Compatible)
- **الحد الأدنى لنظام التشغيل (Deployment Target):** `iOS 15.0`
- **أحدث Xcode SDK:** متوافق مع بيئة البناء والتوقيع الرسمية

---

## 🌟 مميزات التطبيق الرئيسية (Core Features)

1. **استيراد ملفات ZIP آمن (Safe ZIP Import):**
   - حماية كاملة من ثغرات `Zip Slip` ومسارات `Path Traversal` (`../`).
   - استخراج وتصنيف تلقائي لملفات HTML, CSS, JavaScript والصور.

2. **تحليل DOM حقيقي وحماية متغيرات MikroTik (100% Protection):**
   - اكتشاف وحماية تلقائية لكافة متغيرات التوثيق: `$(username)`, `$(password)`, `$(link-login-only)`, `$(error)`, `$(ip)`, `$(mac)`, `$(identity)`...
   - تنبيه فوري عند محاولة حذف أو تعديل المتغيرات الحساسة لمنع تعطل تسجيل الدخول.

3. **المحرر البصري التفاعلي (Visual Editor):**
   - تعديل اسم الشبكة، رقم الاتصال، ورقم الواتساب بنقرة واحدة.
   - أطقم ألوان جاهزة ومخصص ألوان متقدم.
   - استبدال الشعار وخلفيات البنرات والسلايدر مباشرة من الاستوديو والكاميرا.
   - تعديل أشكال الأزرار (Pill كبسولة / Rounded منحنية / Square مربعة).

4. **محاكي iPhone 13 Pro Max فائق الدقة (Device Simulator):**
   - محاكاة أبعاد شاشة iPhone 13 Pro Max (428x926) ونظام iOS 26.
   - شريط حالة تفاعلي (Status Bar)، Safe Area، وNotch / Dynamic Island.
   - تدوير الشاشة (Portrait / Landscape)، وتكبير/تصغير (Zoom).
   - محاكاة أخطاء الراوتر وحالة الاتصال التجريبي (Trial).

5. **محرر الكود الاحترافي (Code Editor):**
   - ترقيم الأسطر، تلوين الكود البرمجي (Syntax Highlighting).
   - أدوات البحث والاستبدال (Search & Replace).
   - سجل التراجع والإعادة (Undo / Redo).
   - شريط إدراج متغيرات المايكروتك السريعة.

6. **مساعد الذكاء الاصطناعي الذكي (Gemini AI Assistant):**
   - تحليل صفحات الهوتسبوت وتطبيق التعديلات المطلوبة بذكاء.
   - عرض مقارنة قبل وبعد (**Before / After Diff**) مع ملخص دقيق قبل التطبيق.
   - حماية كاملة ومضمونة لمتغيرات MikroTik أثناء التوليد.

7. **فاحص جودة وصحة الصفحة (Health Checker):**
   - فحص وجود عناصر النموذج `form`, `username`, `password`, `$(error)`.
   - فحص الروابط المكسورة والصور المفقودة.
   - تقييم من 100% وزر **إصلاح تلقائي بنقرة واحدة**.

8. **تصدير نظيف لراوتر المايكروتك (MikroTik ZIP Export):**
   - إنتاج حزمة ZIP مهيأة للرفع المباشر عبر Winbox أو FTP دون ملفات زائدة.
   - دليل توضيحي خطوة بخطوة للربط مع `RouterOS`.

9. **5 قوالب احترافية جاهزة:**
   - **Hotspot Modern** (مودرن زجاجي)
   - **Hotspot Basic** (كلاسيكي خفيف وفائق السرعة)
   - **Hotspot Fiber** (ألياف ضوئية وجيجابت)
   - **Hotspot Gaming** (ألعاب وPing منخفض)
   - **Hotspot Dark** (دارك ليلي فاخر)

---

## 🛠️ هيكلية المشروع التقنية (Architecture)

```text
HOTSPOT PLUS
├── codemagic.yaml                  # إعدادات البناء التلقائي لإنتاج IPA
├── capacitor.config.ts             # إعدادات Capacitor لـ iOS
├── server.ts                       # سيرفر وسيط آمن للـ Gemini AI
├── ios/
│   └── App/
│       ├── Podfile                 # إعدادات CocoaPods مع iOS 15.0
│       ├── App.xcworkspace         # مساحة عمل Xcode
│       └── App/
│           ├── Info.plist          # إعدادات الأذونات والهوية
│           ├── AppDelegate.swift   # نقطة الدخول الأصلية لتطبيق iOS
│           └── ViewController.swift
├── src/
│   ├── types.ts                    # نماذج البيانات وأنواع TypeScript
│   ├── App.tsx                     # إدارة الحالة والشاشات الرئيسية
│   ├── components/                 # المكونات والواجهات التفاعلية
│   │   ├── SplashView.tsx          # شاشة البداية وهوية المطور
│   │   ├── Header.tsx              # شريط التنقل والأدوات
│   │   ├── HomeView.tsx            # لوحة التحكم وإدارة المشاريع
│   │   ├── VisualEditor.tsx        # المحرر البصري السريع
│   │   ├── CodeEditor.tsx          # محرر الأكواد والبحث
│   │   ├── DeviceSimulator.tsx     # محاكي iPhone 13 Pro Max
│   │   ├── FileManager.tsx         # مستعرض الملفات والصور
│   │   ├── AIAssistantModal.tsx    # مساعد الذكاء الاصطناعي مع Diff
│   │   ├── HealthCheckModal.tsx    # فاحص الصحة والإصلاح التلقائي
│   │   ├── ExportModal.tsx         # تصدير حزمة ZIP للمايكروتك
│   │   ├── TemplateGalleryModal.tsx# معرض القوالب الخمسة
│   │   ├── VersionHistoryModal.tsx # سجل النسخ ونقاط الاستعادة
│   │   ├── HelpModal.tsx           # دليل الاستخدام وقاموس المتغيرات
│   │   └── SettingsModal.tsx       # بطاقة المطور والإعدادات
│   ├── utils/
│   │   ├── security.ts             # مكافحة Zip Slip و Path Traversal
│   │   ├── zipHandler.ts           # فك وضغط ملفات الهوتسبوت
│   │   ├── mikrotik.ts             # قاموس وتحقق متغيرات المايكروتك
│   │   ├── htmlParser.ts           # محلل DOM ومعدل الأنماط الحقيقي
│   │   ├── healthChecker.ts        # مدقق سلامة عناصر وصفحات الراوتر
│   │   └── storage.ts              # الحفظ الدائم وإدارة النسخ
│   └── data/
│       └── templates.ts            # بيانات القوالب الخمسة الجاهزة
```

---

## 🚀 تعليمات البناء وإنتاج ملف الـ IPA (Build & Packaging)

### 1. تثبيت الاعتمادات وبناء واجهات الويب:
```bash
npm install
npm run build
```

### 2. مزامنة أصول المشروع مع تطبيق iOS الأصلي (Capacitor Sync):
```bash
npx cap sync ios
```

### 3. تثبيت مكتبات CocoaPods الأصلية:
```bash
cd ios/App
pod install
```

### 4. البناء عبر Xcode أو Codemagic لإنتاج IPA حقيقي:
في بيئة Codemagic، يتم تشغيل الأمر التالي لإنتاج ملف IPA غير موقع (`Unsigned IPA`) ليتم توقيعه خارجياً عبر شهادتك:
```bash
xcode-project build-ipa \
  --workspace "ios/App/App.xcworkspace" \
  --scheme "App" \
  --config Release
```
المسار الناتج للملف:
`build/ios/ipa/App.ipa`

---

## 💡 خطوات رفع صفحة الهوتسبوت إلى MikroTik RouterOS

1. انقر على زر **تصدير ZIP** من داخل التطبيق.
2. فك ضغط الملف الناتج على جهازك لتحصل على مجلد يحتوي على `login.html`.
3. افتح برنامج **Winbox** وادخل إلى الراوتر، ثم افتح قائمة **Files**.
4. اسحب المجلد وأفلته داخل **Files**.
5. من القائمة: **IP > Hotspot > Server Profiles**، اختر البروفايل وضع اسم المجلد في حقل **HTML Directory**.
6. اضغط **Apply** وتمتع بصفحة احترافية متوافقة وسريعة!
