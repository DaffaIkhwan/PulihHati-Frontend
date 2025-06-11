# 🚀 Deploy Frontend Guide

## ✅ **Persiapan Selesai**
- ✅ Debug components dihapus
- ✅ Console.log dibersihkan
- ✅ Environment variables di-set untuk production
- ✅ CORS configuration di backend sudah diperbaiki
- ✅ Build test berhasil

## 🎯 **Pilihan Platform Deployment**

### **Option 1: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd PulihHati-Frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? pulih-hati-frontend
# - Directory? ./
# - Override settings? No
```

### **Option 2: Netlify**
```bash
# Build first
npm run build

# Option A: Drag & drop dist/ folder to netlify.com
# Option B: Use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### **Option 3: Railway**
```bash
# Push to GitHub, then:
# 1. Go to railway.app
# 2. New Project → Deploy from GitHub
# 3. Select PulihHati-Frontend repo
# 4. Railway will auto-detect Vite and deploy
```

## 🔧 **Environment Variables untuk Deployment**

Setelah deploy, tambahkan environment variables di platform:

```
VITE_API_BASE_URL=https://pulih-hati-backend-production.up.railway.app/api
VITE_API_TIMEOUT=10000
VITE_APP_ENV=production
VITE_DEBUG=false
```

## 🧪 **Test Setelah Deploy**

1. **Upload test-cors.html** ke deployment Anda
2. **Akses** `https://your-frontend-url.com/test-cors.html`
3. **Klik semua tombol test** untuk memastikan CORS berfungsi
4. **Cek browser console** untuk error messages

## 🚨 **Troubleshooting CORS Issues**

### **Jika masih ada CORS error:**

1. **Cek URL frontend yang actual** setelah deploy
2. **Update CORS di backend** dengan URL yang benar:
   ```bash
   # Di Railway dashboard, tambahkan environment variable:
   FRONTEND_URL=https://your-actual-frontend-url.com
   ```

3. **Restart backend** di Railway dashboard

### **Common Issues:**
- ❌ **Mixed Content**: Pastikan frontend menggunakan HTTPS
- ❌ **Wrong URL**: Cek apakah frontend URL sudah benar di CORS config
- ❌ **Credentials**: Pastikan `withCredentials: true` di axios

## 📋 **Checklist Deploy**
- [ ] Frontend berhasil di-deploy
- [ ] test-cors.html berfungsi
- [ ] Login/register berfungsi
- [ ] Popular posts muncul
- [ ] Mood tracker berfungsi
- [ ] SafeSpace berfungsi
- [ ] Chatbot berfungsi

## 🎉 **Setelah Deploy Berhasil**
1. Hapus file `test-cors.html` dari production
2. Update README.md dengan URL deployment
3. Test semua fitur end-to-end
