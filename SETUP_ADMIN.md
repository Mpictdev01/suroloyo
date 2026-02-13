# 🚀 Setup Guide: Admin Panel Suroloyo Booking

## Langkah 1: Setup Supabase Project

### 1.1 Buat Supabase Project
1. Buka [https://supabase.com](https://supabase.com)
2. Sign up / Login
3. Click "New Project"
4. Isi:
   - **Name**: Suroloyo Booking
   - **Database Password**: (simpan password ini!)
   - **Region**: Southeast Asia (Singapore)
5. Tunggu project selesai dibuat (~2 menit)

### 1.2 Dapatkan API Keys
1. Di dashboard Supabase, buka **Settings** → **API**
2. Copy nilai berikut:
   - **Project URL** (contoh: `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (secret!)

---

## Langkah 2: Setup Database Schema

### 2.1 Jalankan Schema SQL
1. Di Supabase dashboard, buka **SQL Editor**
2. Click "New Query"
3. Copy seluruh isi file `supabase/schema.sql`
4. Paste ke SQL Editor
5. Click **Run** (atau tekan F5)
6. Tunggu sampai selesai (akan ada notifikasi "Success")

### 2.2 Jalankan Seed Data
1. Masih di SQL Editor, buat query baru
2. Copy isi file `supabase/seed.sql`
3. Paste dan Run
4. Ini akan membuat:
   - 1 admin user (email: `admin@suroloyo.com`)
   - Sample daily quota untuk 30 hari

### 2.3 Setup Authentication
1. Di Supabase dashboard, buka **Authentication** → **Providers**
2. Enable **Email** provider
3. Disable "Confirm email" (untuk development)
4. Save

### 2.4 Buat Admin User
1. Buka **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Isi:
   - **Email**: `admin@suroloyo.com`
   - **Password**: `admin123` (ganti setelah login pertama!)
   - **Auto Confirm User**: ✅ Centang
4. Click "Create user"
5. Copy **User UID** yang muncul

### 2.5 Update User Role
1. Buka **SQL Editor**
2. Jalankan query ini (ganti `USER_UID` dengan UID yang di-copy):
```sql
UPDATE users 
SET role = 'admin', 
    name = 'Admin Suroloyo',
    email = 'admin@suroloyo.com'
WHERE id = 'USER_UID';
```

---

## Langkah 3: Setup Environment Variables

### 3.1 Buat File .env.local
1. Di root folder project, buat file `.env.local`
2. Copy isi dari `.env.local.example`
3. Isi dengan nilai dari Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Cloudinary (opsional untuk sekarang)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Langkah 4: Setup Cloudinary (Opsional)

### 4.1 Buat Cloudinary Account
1. Buka [https://cloudinary.com](https://cloudinary.com)
2. Sign up gratis
3. Verify email

### 4.2 Dapatkan Credentials
1. Di dashboard, buka **Dashboard**
2. Copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Paste ke `.env.local`

---

## Langkah 5: Jalankan Development Server

```bash
npm run dev
```

Buka browser:
- **User Website**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login

**Login Credentials:**
- Email: `admin@suroloyo.com`
- Password: `admin123`

---

## Langkah 6: Verifikasi Setup

### ✅ Checklist:
- [ ] Supabase project sudah dibuat
- [ ] Database schema sudah dijalankan (6 tabel)
- [ ] Seed data sudah dijalankan
- [ ] Admin user sudah dibuat di Auth
- [ ] User role sudah di-update ke 'admin'
- [ ] Environment variables sudah diisi
- [ ] Dev server berjalan tanpa error
- [ ] Bisa login ke admin panel
- [ ] Dashboard admin muncul

---

## Troubleshooting

### ❌ Error: "Invalid login credentials"
**Solusi:**
1. Pastikan user sudah dibuat di **Authentication → Users**
2. Pastikan email dan password benar
3. Pastikan "Auto Confirm User" sudah dicentang

### ❌ Error: "Akses ditolak. Anda bukan admin"
**Solusi:**
1. Buka SQL Editor
2. Cek role user:
```sql
SELECT id, email, role FROM users WHERE email = 'admin@suroloyo.com';
```
3. Jika role bukan 'admin', update:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@suroloyo.com';
```

### ❌ Error: "relation 'users' does not exist"
**Solusi:**
- Schema belum dijalankan. Jalankan `supabase/schema.sql` di SQL Editor

### ❌ Error: "Missing environment variables"
**Solusi:**
- Pastikan file `.env.local` ada di root folder
- Restart dev server setelah menambah env variables

---

## Next Steps

Setelah setup berhasil, Anda bisa:
1. ✅ Login ke admin panel
2. ✅ Lihat dashboard (masih kosong karena belum ada data)
3. ⏭️ Lanjut implementasi fitur:
   - Booking Management
   - Payment Verification
   - User Management
   - Kuota Management

---

## File Structure yang Sudah Dibuat

```
t:\web1\suroloyo-booking\
├── .env.local.example          # Template environment variables
├── lib/
│   └── supabase.ts             # Supabase client config
├── supabase/
│   ├── schema.sql              # Database schema
│   └── seed.sql                # Seed data
├── context/
│   └── AdminContext.tsx        # Admin auth state management
└── app/
    └── admin/
        ├── layout.tsx          # Protected admin layout
        ├── page.tsx            # Dashboard
        └── login/
            └── page.tsx        # Admin login page
```

---

**Butuh bantuan?** Hubungi developer atau buka issue di GitHub.
