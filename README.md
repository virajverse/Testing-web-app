## Taliyo Marketplace

Digital Services, Delivered Like Products. Browse and order websites, mobile apps, digital marketing, and branding services via WhatsApp.

### 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup Supabase (see SUPABASE_SETUP.md)
# - Create project at supabase.com
# - Run migrations in SQL Editor
# - Copy API keys

# 3. Update environment variables
# Copy .env.example to .env.local and add your Supabase keys

# 4. Start development server
npm run dev
```

### 📱 Features

- ✅ PWA with offline support
- ✅ Bilingual (English/Hindi)
- ✅ WhatsApp ordering
- ✅ Supabase backend
- ✅ PostgreSQL database

### 📚 Documentation

- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Supabase configuration (START HERE)
- **[INSTALL_SETUP.md](INSTALL_SETUP.md)** - PWA installation guide

### 🔧 Available Scripts

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### 🌐 URLs

- Main App: http://localhost:5173
- PWA Test: http://localhost:5173/test-pwa.html

### 🎯 Next Steps

1. Follow **SUPABASE_SETUP.md** to setup database
2. Update `.env.local` with your Supabase keys
3. Generate PWA icons (open `scripts/generate-icons.html`)
4. Customize branding in `src/react-app/components/Header.tsx`

### 🚀 Deploy

Deploy to Vercel, Netlify, or any static hosting:

```bash
npm run build
# Upload dist/ folder
```
