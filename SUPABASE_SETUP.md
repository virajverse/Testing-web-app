# 🚀 Supabase Setup Guide - Taliyo Marketplace

## ✅ Setup Complete!

Aapka project ab **Supabase** use kar raha hai (Mocha aur Cloudflare remove ho gaya).

---

## 📋 Supabase Project Setup

### 1. Create Supabase Project

1. Visit: https://supabase.com
2. Sign up / Login
3. Click "New Project"
4. Fill details:
   - **Name**: Taliyo Marketplace
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to you
5. Wait for project to be ready (~2 minutes)

### 2. Get API Keys

1. Go to **Project Settings** > **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...`

### 3. Update Environment Variables

Update `.env.local` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_WHATSAPP_NUMBER=919876543210
```

---

## 🗄️ Database Setup

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to **SQL Editor** in Supabase Dashboard
2. Click "New Query"
3. Copy content from `supabase/migrations/001_initial_schema.sql`
4. Paste and click "Run"
5. Wait for success message
6. Repeat for `supabase/migrations/002_sample_data.sql`

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

---

## 📊 Verify Database

1. Go to **Table Editor** in Supabase
2. You should see 3 tables:
   - ✅ categories (4 rows)
   - ✅ services (8 rows)
   - ✅ orders (0 rows)

---

## 🔧 Install Dependencies

```bash
# Remove old packages and install new ones
npm install

# This will install @supabase/supabase-js
```

---

## 🚀 Run Development Server

```bash
npm run dev
```

Open: http://localhost:5173

---

## 📱 Features Working

- ✅ Service catalog (fetches from Supabase)
- ✅ Category filtering
- ✅ Bilingual UI (EN/HI)
- ✅ WhatsApp ordering
- ✅ PWA with offline support
- ✅ Install prompts

---

## 🔐 Authentication (Optional - For Admin Panel)

### Enable Google Auth in Supabase:

1. Go to **Authentication** > **Providers**
2. Enable **Google**
3. Add OAuth credentials:
   - Get from: https://console.cloud.google.com
   - Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### Update Admin Panel:

Admin panel code needs to be updated to use Supabase auth.
For now, admin features are disabled (isAdmin = false).

---

## 📁 Project Structure (Updated)

```
taliyo-marketplace/
├── src/
│   ├── lib/
│   │   └── supabase.ts          # Supabase client
│   ├── react-app/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── App.tsx
│   └── shared/
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       └── 002_sample_data.sql
├── public/
├── .env.local                   # Your environment variables
├── .env.example                 # Template
└── package.json
```

---

## 🗑️ Removed Files

- ❌ `wrangler.json` (Cloudflare config)
- ❌ `.dev.vars` (Cloudflare env)
- ❌ `src/worker/` (Cloudflare Worker)
- ❌ `@getmocha/*` packages
- ❌ `@cloudflare/*` packages
- ❌ Mocha authentication

---

## ✅ What Changed

### Before (Mocha + Cloudflare):
- Cloudflare Workers for backend
- D1 Database (SQLite)
- Mocha for authentication
- Wrangler for deployment

### After (Supabase):
- Supabase for backend + database
- PostgreSQL database
- Standard React + Vite
- Deploy anywhere (Vercel, Netlify, etc.)

---

## 🚀 Deployment Options

### Vercel (Recommended):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Netlify:

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Add environment variables in Netlify dashboard
```

### Manual Build:

```bash
npm run build

# Upload dist/ folder to any static hosting
```

---

## 🔧 Environment Variables for Production

Add these in your hosting platform:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_WHATSAPP_NUMBER=919876543210
VITE_APP_NAME=Taliyo Marketplace
VITE_APP_URL=https://yourdomain.com
```

---

## 📝 Database Queries (Examples)

### Fetch all services:

```javascript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase
  .from('services')
  .select('*, categories(*)')
  .eq('is_active', true);
```

### Fetch services by category:

```javascript
const { data } = await supabase
  .from('services')
  .select('*')
  .eq('category_id', categoryId)
  .eq('is_active', true);
```

### Create order:

```javascript
const { data, error } = await supabase
  .from('orders')
  .insert({
    client_name: 'John Doe',
    whatsapp: '919876543210',
    service_id: 1,
    status: 'contacted'
  });
```

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"

**Fix**: Update `.env.local` with your Supabase URL and key

### Database tables not found

**Fix**: Run migrations in Supabase SQL Editor

### CORS errors

**Fix**: Supabase handles CORS automatically, check your API keys

### Build errors

```bash
# Clean install
rm -rf node_modules
rm package-lock.json
npm install
```

---

## 🎯 Next Steps

1. ✅ Create Supabase project
2. ✅ Run database migrations
3. ✅ Update .env.local
4. ✅ Install dependencies
5. ✅ Test locally
6. ✅ Deploy to production

---

## 📚 Resources

- Supabase Docs: https://supabase.com/docs
- Supabase JS Client: https://supabase.com/docs/reference/javascript
- React + Supabase: https://supabase.com/docs/guides/getting-started/quickstarts/reactjs

---

**Setup Status: ✅ Supabase Ready!**

Run `npm run dev` to start! 🚀
