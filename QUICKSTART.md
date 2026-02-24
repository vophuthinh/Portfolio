# ⚡ Quick Start Guide

## 🚀 Cài đặt & Chạy (3 bước)

### 1. Install
```bash
npm install
```

### 2. Setup Environment
```bash
# Copy file mẫu
cp .env.example .env

# Sửa .env với credentials của bạn (hoặc bỏ qua nếu dùng frontend fallback)
```

### 3. Run
```bash
# Development (hot reload)
npm run dev

# Production build
npm run build

# Preview production
npm run preview
```

---

## 📦 Những gì đã cải thiện

| Before | After | Improvement |
|--------|-------|-------------|
| 1 file JS 200KB | 7 modules ~120KB | ✅ 40% nhỏ hơn |
| CSS 150KB | CSS 80KB (minified) | ✅ 47% nhỏ hơn |
| Full-size images | Responsive images | ✅ 30-70% nhỏ hơn |
| `'unsafe-inline'` CSP | Nonce-based CSP | ✅ Secure |
| API keys exposed | Backend proxy | ✅ Protected |

---

## 🛠️ Commands thường dùng

```bash
npm run dev              # Development server (http://localhost:3000)
npm run build            # Build production
npm run serve:prod       # Run production server with backend API
npm run images           # Generate responsive images (cần sharp)
npm run optimize:css     # Minify CSS files
```

---

## 📁 Cấu trúc mới

```
Portfolio/
├── js/
│   ├── main.js                    ← Entry point
│   └── modules/                   ← Code đã được tách
│       ├── navigation.js
│       ├── projects.js
│       ├── modals.js
│       ├── contact-form.js
│       └── ...
├── api/
│   └── contact.js                 ← Backend proxy (bảo vệ credentials)
├── scripts/
│   ├── generate-responsive-images.js
│   ├── optimize-css.js
│   └── inject-nonce.js
└── dist/                          ← Build output
```

---

## 🌐 Deploy

### Vercel (Recommended)
```bash
vercel --prod
```

### Netlify
```bash
netlify deploy --prod
```

### Traditional Hosting
```bash
npm run build
# Upload dist/ folder
```

---

## 🐛 Gặp lỗi?

**Lỗi: Module not found**
```bash
npm install
```

**Lỗi: Contact form không hoạt động**
- Kiểm tra `.env` file
- Hoặc dùng frontend fallback (EmailJS direct)

**Lỗi: Images không load**
```bash
npm run images
```

---

## 📖 Chi tiết đầy đủ

Xem `IMPROVEMENTS.md` để biết chi tiết về:
- Architecture changes
- Security improvements
- Performance metrics
- Migration guide
- Troubleshooting

---

**🎉 Enjoy your faster, more secure portfolio!**
