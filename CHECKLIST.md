# ✅ Pre-Launch Checklist

## 🚨 CRITICAL - Làm trước khi deploy

### 1. Install Dependencies
```bash
npm install
```

**Check**: Đảm bảo không có error trong console

---

### 2. Test Development Mode
```bash
npm run dev
```

**Check list**:
- [ ] Trang chủ load được
- [ ] Navigation hoạt động
- [ ] Projects hiển thị và filter
- [ ] Contact form hiển thị
- [ ] Console không có error nghiêm trọng
- [ ] Scroll smooth
- [ ] Theme switcher hoạt động

---

### 3. Fix Module Imports (Nếu có lỗi)

Nếu gặp lỗi "Cannot find module", kiểm tra:

**File: `index.html`**
- Đảm bảo script tags đúng thứ tự
- `type="module"` cho main.js

**File: `js/main.js`**
- Tất cả imports có đường dẫn đúng
- `.js` extension ở cuối mỗi import

---

### 4. Setup Environment (Cho contact form)

```bash
# Copy file mẫu
cp .env.example .env

# Hoặc trên Windows
copy .env.example .env
```

**Edit `.env`**:
```env
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
```

**Lấy credentials từ**: https://dashboard.emailjs.com/

---

### 5. Test Production Build

```bash
npm run build
```

**Check**:
- [ ] Build thành công (no errors)
- [ ] Folder `dist/` được tạo
- [ ] Files được minified
- [ ] Size hợp lý (~100-200KB total)

---

### 6. Test Production Server

```bash
npm run preview
# hoặc
npm run serve:prod
```

**Check list**:
- [ ] Mở http://localhost:4173 (hoặc 3000)
- [ ] Tất cả features hoạt động
- [ ] Contact form gửi được email
- [ ] Images load đúng
- [ ] No console errors

---

### 7. Test Offline Mode (PWA)

1. Mở DevTools (F12)
2. Application tab → Service Workers
3. Check "Offline" mode
4. Refresh trang
5. **Check**: Trang offline đẹp xuất hiện

---

### 8. Cross-Browser Testing

Test trên:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (nếu có Mac)
- [ ] Mobile browsers

---

### 9. Performance Check

```bash
npm run lighthouse
```

**Target scores**:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

---

### 10. Security Check

**Check CSP**:
1. Mở DevTools → Console
2. Không có CSP violations
3. Inline scripts có nonce

**Check API**:
- [ ] EmailJS credentials không exposed trong frontend
- [ ] API endpoint `/api/contact` hoạt động

---

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot use import statement outside a module"

**Fix**:
```html
<!-- index.html -->
<script type="module" src="js/main.js"></script>
```

---

### Issue 2: "Failed to fetch module"

**Fix**: Check đường dẫn import
```javascript
// ✅ Correct
import { Navigation } from './modules/navigation.js';

// ❌ Wrong
import { Navigation } from './modules/navigation';
```

---

### Issue 3: "Vite not found"

**Fix**:
```bash
npm install vite --save-dev
```

---

### Issue 4: Contact form không gửi được

**Options**:
1. Setup backend API (`/api/contact`)
2. Hoặc dùng EmailJS direct (update `js/config.js`)
3. Hoặc tạm thời comment CSP để test

---

### Issue 5: Images không load

**Fix**:
```bash
# Generate responsive images (optional)
npm install sharp
npm run images
```

Hoặc tạm dùng original images trong `assets/images/`

---

## 📋 Deployment Checklist

### Before Deploy:

- [ ] `npm run build` thành công
- [ ] Test local với `npm run preview`
- [ ] `.env` variables set đúng
- [ ] Remove console.logs (production)
- [ ] Update sitemap.xml (if needed)
- [ ] robots.txt configured

### Deploy to Vercel:

```bash
vercel --prod
```

Set environment variables:
- EMAILJS_SERVICE_ID
- EMAILJS_TEMPLATE_ID
- EMAILJS_PUBLIC_KEY
- EMAILJS_PRIVATE_KEY

### Deploy to Netlify:

```bash
netlify deploy --prod
```

### Traditional Hosting:

1. Build: `npm run build`
2. Upload `dist/` folder
3. Configure server (if needed)

---

## 🎯 Final Checks

- [ ] All pages load correctly
- [ ] Forms work
- [ ] Links work
- [ ] Images load
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Performance good (Lighthouse)
- [ ] SEO meta tags present
- [ ] Favicon loads
- [ ] PWA installable

---

## 🚀 You're Ready to Launch!

If all checks pass, your portfolio is:
- ✅ Fast
- ✅ Secure  
- ✅ Modern
- ✅ Production-ready

**Good luck! 🎉**
