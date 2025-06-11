# 🚀 Vercel Deployment Fix - Offline Issue

## 🔍 **Problem**
Frontend deployed di Vercel menampilkan halaman "Anda Sedang Offline" saat login karena:
1. Environment variables tidak terbaca dengan benar di production
2. Service worker mengarahkan ke offline page ketika API request gagal
3. Timeout terlalu pendek untuk koneksi ke Railway backend

## ✅ **Solutions Applied**

### 1. **Vercel Configuration** (`vercel.json`)
- ✅ Explicit environment variables untuk build
- ✅ Service worker headers configuration
- ✅ Proper routing untuk SPA

### 2. **Production Environment** (`.env.production`)
- ✅ Railway backend URL
- ✅ Increased timeout (30 seconds)
- ✅ Production-specific settings

### 3. **API Configuration Fallback** (`src/config/api.js`)
- ✅ Automatic fallback ke Railway untuk production
- ✅ Enhanced logging untuk debugging
- ✅ Environment-specific timeouts

### 4. **Service Worker Updates** (`vite.config.js`)
- ✅ Increased timeout untuk Railway API
- ✅ Proper cache configuration
- ✅ Exclude login pages dari offline fallback

## 🚀 **Deployment Steps**

### **Step 1: Push Changes**
```bash
git add .
git commit -m "Fix Vercel deployment offline issue"
git push origin main
```

### **Step 2: Vercel Environment Variables**
Di Vercel Dashboard → Project Settings → Environment Variables, tambahkan:

```
VITE_API_BASE_URL=https://pulih-hati-backend-production.up.railway.app/api
VITE_API_TIMEOUT=30000
VITE_APP_ENV=production
VITE_DEBUG=false
```

### **Step 3: Force Redeploy**
- Go to Vercel Dashboard
- Click "Redeploy" pada deployment terakhir
- Atau push commit baru untuk trigger auto-deploy

### **Step 4: Clear Browser Cache**
Setelah deployment selesai:
1. Buka https://pulih-hati-frontend.vercel.app/
2. Hard refresh (Ctrl+Shift+R atau Cmd+Shift+R)
3. Clear browser cache dan service worker:
   - DevTools → Application → Storage → Clear storage
   - DevTools → Application → Service Workers → Unregister

## 🧪 **Testing**

### **1. Check Configuration**
Buka browser console di https://pulih-hati-frontend.vercel.app/:
```
🔧 API Configuration: {
  baseUrl: "https://pulih-hati-backend-production.up.railway.app/api",
  timeout: 30000,
  environment: "production",
  ...
}
```

### **2. Test Login**
1. Go to /signin
2. Enter credentials
3. Check Network tab untuk API calls
4. Should NOT redirect to offline page

### **3. Check Service Worker**
DevTools → Application → Service Workers:
- Should show active service worker
- Check cache entries untuk Railway API

## 🔧 **Troubleshooting**

### **If Still Shows Offline:**

#### **1. Check Environment Variables**
```javascript
// Di browser console
console.log(import.meta.env);
```

#### **2. Check API Configuration**
```javascript
// Di browser console
import('./src/config/api.js').then(api => console.log(api.API_CONFIG));
```

#### **3. Manual Service Worker Clear**
```javascript
// Di browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});
```

#### **4. Check Network Requests**
- DevTools → Network
- Try login
- Look for requests to Railway API
- Check response status and timing

## 📞 **Next Steps**

If issue persists:
1. Check Vercel build logs
2. Verify Railway backend is accessible
3. Consider using different deployment platform (Netlify, etc.)
4. Test with different browser/incognito mode
