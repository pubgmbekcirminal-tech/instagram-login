# Vantly — Login sahifasi + Auth backend

Instagram uslubidagi UX (floating label, "ko'z" tugmasi, loading animatsiyasi) asosida qurilgan **original** login sahifasi va Node.js/Express backend shabloni.

## Loyiha tuzilishi
```
vantly-login/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
├── package.json
├── .env.example
└── README.md
```

## 1. Lokal ishga tushirish

```bash
npm install
cp .env.example .env      # .env faylini oching va JWT_SECRET ni o'zgartiring
npm run dev                # yoki: npm start
```

Brauzerda oching: `http://localhost:3000`

**Demo hisob:** username `demo`, parol `demo1234`

## 2. Brendni o'zingizga moslashtirish

- `public/index.html` — 8-qatordagi `<div class="logo">Vantly</div>` matnini va sarlavhani o'zgartiring
- Ikonka/logotip qo'shish uchun `logo` divini `<img src="/logo.svg" ...>` ga almashtiring va rasmni `public/` papkasiga joylang
- Ranglarni `public/style.css` faylining boshidagi `:root { }` bo'limidan o'zgartirasiz

## 3. Cloud'ga bepul joylashtirish

### Variant A — Render.com (backend + frontend birga, tavsiya etiladi)
1. Loyihani GitHub'ga yuklang: `git init && git add . && git commit -m "init" && git remote add origin <repo-url> && git push -u origin main`
2. [render.com](https://render.com) da ro'yxatdan o'ting → **New +** → **Web Service**
3. GitHub repongizni ulang
4. Sozlamalar:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. **Environment Variables** bo'limida `JWT_SECRET` qiymatini qo'shing
6. **Deploy** tugmasini bosing — bir necha daqiqada `https://sizning-loyiha.onrender.com` manzili tayyor bo'ladi

### Variant B — Vercel (frontend uchun tez, backend uchun Serverless Functions kerak bo'ladi)
1. `npm i -g vercel`
2. Loyiha papkasida: `vercel`
3. Express serverni Vercel Serverless Function formatiga o'tkazish kerak (`api/login.js` kabi), chunki Vercel doimiy ishlaydigan serverni emas, funksiyalarni qo'llab-quvvatlaydi
4. Muqobil: faqat statik frontend (`public/`) ni Vercelga, backendni esa Renderga alohida joylashtiring

### Variant C — Railway.app
1. [railway.app](https://railway.app) da **New Project** → **Deploy from GitHub repo**
2. Railway avtomatik `package.json` dagi `start` skriptini aniqlaydi
3. **Variables** bo'limida `JWT_SECRET` qo'shing
4. Deploy tugagach havola avtomatik beriladi

## 4. Xavfsizlik bo'yicha eslatmalar (production uchun)

- `users` massivini haqiqiy bazaga (PostgreSQL, MongoDB va h.k.) almashtiring
- `.env` faylini **hech qachon** Git'ga yubormang (`.gitignore` ga qo'shing)
- HTTPS majburiy bo'lishi kerak (Render/Railway buni avtomatik ta'minlaydi)
- `express-rate-limit` allaqachon brute-force hujumlardan himoya qiladi, lekin production'da Redis-based limiter ko'proq tavsiya etiladi
- Parollarni hech qachon oddiy matnda saqlamang — shablonda `bcryptjs` bilan xeshlash allaqachon qo'llangan
