# 📘 مرجع المشروع وقواعد كتابة الكود | Project Reference & Guidelines

هذا الملف مخصص ليكون المرجع الأساسي والدائم لمساعد الذكاء الاصطناعي (AI Assistant) والمطور في هذا المشروع (`node-level1-lesson9`). يحتوي على تحليل شامل لبنية المشروع، طريقة كتابة الكود، التقاليد البرمجية المتبعة، الموديلز، التوجيه (Routing)، وسجل التغييرات.

---

## 1. نظرة عامة على المشروع (Project Overview)
- **نوع المشروع:** تطبيق ويب متكامل لإدارة العملاء والمستخدمين (Customer Management System & Auth).
- **بيئة التشغيل والتقنيات الأساسية:**
  - **Node.js** و **Express.js** (v4.18.2).
  - **قاعدة البيانات:** MongoDB باستخدام **Mongoose** (v7.4.0).
  - **محرك القوالب:** **EJS** (v3.1.9) لتقديم واجهات السيرفر (Server-Side Rendering).
  - **التشفير والحماية:** **Bcrypt** (v6.0.0) لتشفير كلمات المرور مع Salt.
  - **الواجهات والتصميم:** Bootstrap 5، مع أيقونات **Bootstrap Icons** وأيقونات متحركة **LordIcon**.
  - **الأدوات المساعدة:** `dotenv` لإدارة المتغيرات البيئية، `method-override` لدعم طرق `PUT` و `DELETE` داخل نماذج HTML، و `moment` للتعامل مع التواريخ وتنسيقها.

---

## 2. بنية المجلدات وهيكل الملفات (Directory Structure)

```text
node-level1-lesson9/
├── app.js                   # ملف التشغيل الرئيسي المعتمد (Modular App Entry Point)
├── index.js                 # نموذج تشغيل أولي مدمج (Monolithic / Prototype)
├── package.json             # تعريف الحزم والتبعيات ومخطط السكربتات
├── .env                     # المتغيرات البيئية (PORT, MONGO_URI)
├── models/                  # نماذج وقواعد بيانات Mongoose
│   ├── Schema.js            # نموذج مستخدم النظام للمصادقة (Auth User)
│   └── customerSchema.js    # نموذج العميل/الزبون (Customer Data)
├── routes/                  # مسارات التطبيق
│   └── routes.js            # تجميع كامل لمسارات المصادقة والـ CRUD
├── views/                   # قوالب EJS
│   ├── index.ejs            # الصفحة الرئيسية (جدول عرض العملاء)
│   ├── log-in.ejs           # صفحة تسجيل الدخول
│   ├── sign-up.ejs          # صفحة إنشاء حساب جديد
│   ├── Components/          # المكونات الجزئية القابلة لإعادة الاستخدام (Partials)
│   │   ├── dark-light.ejs   # مبدل الوضع الليلي/النهاري
│   │   ├── loading.ejs      # شاشة/مؤشر التحميل
│   │   ├── navbar.ejs       # شريط التنقل العلوي مع البحث
│   │   └── sidebar.ejs      # القائمة الجانبية مع إبراز الصفحة النشطة
│   └── user/                # صفحات العمليات الخاصة بالعميل
│       ├── add.ejs          # إضافة عميل جديد
│       ├── edit.ejs         # تعديل بيانات عميل
│       ├── view.ejs         # تفاصيل عميل محدد
│       ├── search.ejs       # نتائج البحث عن عملاء
│       └── error.ejs        # صفحة عرض الأخطاء و404
└── public/                  # الملفات الثابتة (Static Assets)
    ├── css/                 # ملفات التنسيق (Bootstrap, dark-light.css, myStyle.css)
    ├── js/                  # ملفات الجافاسكريبت للواجهة (color-modes.js, sidebars.js, main.js)
    ├── img/                 # الصور واللوجو والأيقونات
    └── style.css            # استايل صفحات المصادقة (Login / Signup)
```

---

## 3. أسلوب واصطلاحات كتابة الكود (Code Conventions & Patterns)

### أ. نظام الوحدات (Module System)
- استخدام نمط **CommonJS** بالكامل:
  ```javascript
  const express = require("express");
  module.exports = router;
  ```

### ب. الدوال غير المتزامنة والتعامل مع العمليات (Async / Promise Patterns)
- **المفضل والأحدث في المشروع:** استخدام `async / await` محاطاً بكتلة `try / catch` للتعامل مع أخطاء Mongoose والمصادقة.
- **في بعض العمليات البسيطة / الاتصال:** استخدام سلاسل الوعود (`.then().catch()`) مثل اتصال Mongoose وحفظ البيانات.

### ج. قواعد التسمية (Naming Conventions)
- **المتغيرات والدوال:** `camelCase` (مثل: `existingUser`, `isMatch`, `searchText`, `lowerSearch`).
- **نماذج Mongoose (Models):** `PascalCase` (مثل: `User`, `AuthUser`).
- **تنبيه خاص بالنموذج (Schema Attribute Quirk):**
  > **مهم جداً:** حقل الاسم الأول في `customerSchema` وفي جميع حقول الإدخال والبحث يسمى **`fireName`** (وليس `firstName`). يجب الالتزام بهذا الاسم لضمان عدم كسر قاعدة البيانات والتوافق مع القوالب الموجودة.

### د. أسلوب التوجيه والـ HTTP Methods
- يتم استخدام `methodOverride('_method')` لدعم:
  - التعديل: `POST` مع `?_method=PUT`
  - الحذف: `POST` مع `?_method=DELETE`
- **التوجيه التلقائي (Redirects):**
  - المسار الرئيسي `/` يعيد التوجيه إلى `/login`.
  - نجاح تسجيل الدخول أو التسجيل يعيد التوجيه إلى `/home`.
  - العمليات الناجحة (إضافة / تعديل / حذف) تعيد التوجيه إلى `/home`.

---

## 4. نماذج البيانات (Data Schemas)

### أ. مستخدم النظام للمصادقة (`models/Schema.js`)
```javascript
const userSchema = new Schema({
    userName: String,
    password: String, // كلمة مرور مشفرة بـ bcrypt
});
const User = mongoose.model("User", userSchema);
```

### ب. بيانات العميل (`models/customerSchema.js`)
```javascript
const userSchema = new Schema({
  fireName: String,     // الاسم الأول (الاسم المعتمد في المشروع)
  lastName: String,     // اسم العائلة
  email: String,        // البريد الإلكتروني
  phoneNumber: String,  // رقم الهاتف
  age: Number,          // العمر
  country: String,      // الدولة
  gender: String,       // الجنس (Male / Female)
}, { timestamps: true }); // يوفر createdAt و updatedAt تلقائياً
```

---

## 5. خريطة المسارات (Endpoints Map)

| المسار (Path) | الطريقة (Method) | الغرض (Purpose) | الصفحة أو الاستجابة |
|---|---|---|---|
| `/` | `GET` | تحويل تلقائي | Redirect إلى `/login` |
| `/login` | `GET` | عرض صفحة الدخول | `views/log-in.ejs` |
| `/login` | `POST` | التحقق من المستخدم وتشفير الباسورد | Redirect `/home` أو رسالة خطأ |
| `/signup` | `GET` | عرض صفحة التسجيل | `views/sign-up.ejs` |
| `/signup` | `POST` | تشفير وإنشاء مستخدم جديد | Redirect `/home` أو رسالة خطأ |
| `/home` | `GET` | عرض جدول جميع العملاء | `views/index.ejs` مع كائن `{ arr }` |
| `/user/add` | `GET` | عرض نموذج إضافة عميل | `views/user/add.ejs` |
| `/user/add` | `POST` | حفظ عميل جديد في قاعدة البيانات | Redirect إلى `/home` |
| `/view/:id` | `GET` | عرض تفاصيل عميل بالكامل | `views/user/view.ejs` |
| `/edit/:id` | `GET` | عرض نموذج تعديل بيانات عميل | `views/user/edit.ejs` |
| `/edit/:id` | `PUT` | تحديث بيانات العميل في Mongoose | Redirect إلى `/home` |
| `/edit/:id` | `DELETE` | حذف عميل من قاعدة البيانات | Redirect إلى `/home` |
| `/search` | `POST` | البحث بالاسم الأول أو الأخير | `views/user/search.ejs` |
| `*` (أي مسار غير معرف) | `ALL` | التعامل مع الصفحات المفقودة | `views/user/error.ejs` (404) |

---

## 6. قواعد تصميم الواجهات (Frontend & UI Conventions)

1. **تقسيم القوالب (EJS Partials):**
   - استخدام `<%- include(...) %>` لتضمين المكونات الثابتة.
   - تمرير المتغير `currentPage` للـ sidebar لتفعيل علامة التبويب النشطة (مثل `{ currentPage: "index" }` أو `"add"`).
2. **الوضع الليلي والنهاري (Color Modes):**
   - تضمين `color-modes.js` في الـ `<head>` ومكون `dark-light.ejs` في بداية الـ `<body>`.
3. **أيقونات LordIcon التفاعلية:**
   - استخدام وسم `<lord-icon>` المرفق مع CDN لأيقونات الإجراءات (عرض، تعديل، حذف).
4. **تنسيق التواريخ:**
   - استخدام مكتبة `moment` عبر `app.locals.moment = moment` لتوفيرها مباشرة داخل قوالب EJS (مثل `moment(item.updatedAt).fromNow()`).
5. **تجربة المستخدم (UX Feedback):**
   - أزرار النماذج تحتوي على كود لتغيير النص إلى `"Please Wait..."` وتعطيل الزر لمنع تكرار الإرسال.

---

## 7. سجل التطور والتغييرات (Git History & Changes Log)

- **Commit `4ccdc66` (Initial commit):**
  - إنشاء البنية الأساسية للتطبيق وربط Express بقاعدة البيانات Mongoose ومحرك القوالب EJS ونماذج البيانات الأولية.
- **Commit `39f09b2` (sidebar component for navigation and theme toggling):**
  - نقل القوائم إلى مكونات جزئية مستقلة (`sidebar.ejs` و `dark-light.ejs`).
  - تحسين تجربة التنقل وإضافة مبدل الثيمات والوضع الداكن.
  - تنظيم بنية مجلد `views/user/` وصفحات العرض والبحث والتعديل.

---

## 8. نقاط هامة وتنبيهات للمطور والذكاء الاصطناعي (Important Gotchas & Best Practices)

1. **ملف التشغيل المعتمد:**
   - ملف `app.js` هو الملف المنظم والحديث الذي يعتمد على `routes/routes.js` واستدعاء `moment` عبر `app.locals`.
   - `index.js` هو ملف أولي سابق، وعند تشغيل التطبيق أو إجراء تعديلات معمارية، يجب أن تتم التعديلات داخل `app.js` و `routes/routes.js`.
2. **انتبه لحالة الأحرف في المتغيرات داخل المسارات:**
   - في مسار `/edit/:id` ومسار `/view/:id` داخل `routes/routes.js`، المتغير المسترجع من `User.findById` اسمه `user` (صغير)، وتمريره للقالب يجب أن يكون `{ user: user }`.
3. **التطابق مع قاعدة البيانات:**
   - أي حقل يخص الاسم الأول للعميل يجب أن يطابق `fireName`.
4. **المتغيرات البيئية:**
   - يجب وجود ملف `.env` يحتوي على `PORT` و `MONGO_URI`.
5. **الكوكيز:**
   - يجب استخدام `cookie-parser` لحفظ وتخزين الكوكيز وتمريرها بين المسارات.
6. **أسلوب عمل الذكاء الاصطناعي (تنفيذ مباشر أولاً):**
   - عندما يطلب المستخدم ميزة أو تعديل ("عايز اعمل كذا..."): يجب على المساعد كتابة الكود وتطبيقه مباشرة في ملفات المشروع أولاً، ثم شرح ما تم وكيفية عمله بعد الانتهاء، وتجنب الاكتفاء بتقديم خطوات نظرية أو السؤال قبل التنفيذ ما لم تكن هناك ضرورة قصوى.
7. **منع استخدام الأيقونات المدمجة (Emoji / Keyboard Icons):**
   - يُمنع منعاً باتاً استخدام إيموجيات الكيبورد (مثل ⚡ أو 🏠 أو غيرها) داخل واجهات المشروع. يجب دائماً الاعتماد على مكتبات الأيقونات الرسمية المعتمدة في المشروع (Bootstrap Icons، Material Symbols، LordIcon).
8. **الالتزام بالتصميم وعدم الخروج عنه دون اقتراح مسبق:**
   - يجب الالتزام الصارم بتصميم الواجهات الحالي وعدم تغيير فلسفة الشكل أو إضافة عناصر جمالية عشوائية أو بطاقات وخلفيات من تلقاء نفسك؛ إذا كانت هناك فكرة تحسينية جيدة، يجب تقديمها كاقتراح أولاً وانتظار موافقة المستخدم قبل تطبيقها.

