# 📚 Dokumentasi Admin Panel - Suroloyo Booking

## Overview

Admin Panel untuk mengelola sistem booking pendakian Gunung Suroloyo. Dibangun dengan **Next.js 15**, **Supabase**, dan **TypeScript**.

---

## 🎯 Fitur yang Sudah Diimplementasi

### ✅ Phase 1: Foundation (SELESAI)

#### 1. Backend & Database Setup
- **Supabase Integration**
  - Client configuration (`lib/supabase.ts`)
  - Admin client untuk server-side operations
  
- **Database Schema** (6 tabel)
  - `users` - User data dengan role (user/admin/super_admin)
  - `bookings` - Data booking pendakian
  - `booking_members` - Anggota per booking
  - `daily_quota` - Kuota harian
  - `activity_logs` - Log aktivitas admin
  - `news_articles` - Artikel berita
  
- **Security**
  - Row Level Security (RLS) policies
  - Role-based access control
  - Auto-update timestamps dengan triggers

#### 2. Authentication System
- **Admin Login** (`/admin/login`)
  - Email + password authentication
  - Role validation (hanya admin yang bisa akses)
  - Auto-redirect setelah login
  
- **Admin Context** (`context/AdminContext.tsx`)
  - Global admin state management
  - Session checking
  - Auto-logout jika bukan admin
  
- **Protected Routes**
  - Admin layout dengan auth guard
  - Loading state
  - Auto-redirect ke login

#### 3. Dashboard
- **Statistics Cards** (placeholder)
  - Total Booking
  - Pending Verifikasi
  - Total Pendaki
  - Total Revenue
  
- **Quick Access Links**
  - Booking Management
  - Payment Verification
  - User Management
  - Kuota & Jadwal

---

## 📁 Struktur File

```
t:\web1\suroloyo-booking\
├── .env.local.example          # Template environment variables
├── SETUP_ADMIN.md              # Setup guide
├── lib/
│   └── supabase.ts             # Supabase client
├── supabase/
│   ├── schema.sql              # Database schema
│   └── seed.sql                # Seed data
├── context/
│   ├── BookingContext.tsx      # User booking state
│   └── AdminContext.tsx        # Admin auth state
└── app/
    ├── layout.tsx              # Root layout + Toaster
    └── admin/
        ├── layout.tsx          # Protected admin layout
        ├── page.tsx            # Dashboard
        └── login/
            └── page.tsx        # Admin login
```

---

## 🔐 Authentication Flow

```
1. User buka /admin → Redirect ke /admin/login
2. User input email + password
3. Supabase Auth verify credentials
4. Check user role di tabel users
5. Jika role = admin/super_admin → Login berhasil
6. Jika role = user → Logout + error
7. Redirect ke /admin (dashboard)
```

---

## 🗄️ Database Schema

### Users Table
```sql
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- name (VARCHAR)
- role (VARCHAR) - 'user' | 'admin' | 'super_admin'
- phone, nik, gender, address, dob
- ktp_photo_url
- emergency_contact (JSONB)
- is_banned (BOOLEAN)
- created_at, updated_at
```

### Bookings Table
```sql
- id (VARCHAR, PK)
- user_id (UUID, FK → users)
- booking_date (DATE)
- status (VARCHAR) - 'pending' | 'verified' | 'approved' | 'rejected' | 'cancelled'
- total_participants, total_price
- payment_method, payment_proof_url
- payment_status - 'pending' | 'verified' | 'failed'
- admin_notes, rejection_reason
- created_at, updated_at
```

### Daily Quota Table
```sql
- date (DATE, PK)
- total_quota (INTEGER) - default 150
- filled (INTEGER)
- is_open (BOOLEAN)
- notes (TEXT)
```

---

## 🚀 Next Steps (Belum Diimplementasi)

### Phase 2: Core Features

#### 1. Booking Management
- [ ] List semua booking dengan table
- [ ] Filter & search
- [ ] Detail booking page
- [ ] Approve/reject booking
- [ ] View KTP photos
- [ ] Generate e-ticket
- [ ] Send notifications

#### 2. Payment Verification
- [ ] List pending payments
- [ ] Preview bukti transfer
- [ ] Approve/reject payment
- [ ] Payment history

#### 3. User Management
- [ ] List users
- [ ] User detail & history
- [ ] Ban/unban user
- [ ] Edit user data

#### 4. Kuota Management
- [ ] Calendar view dengan kuota
- [ ] Edit kuota per tanggal
- [ ] Bulk edit kuota
- [ ] Close/open jalur

### Phase 3: Advanced Features

#### 5. Content Management
- [ ] CRUD news articles
- [ ] Rich text editor
- [ ] Upload images
- [ ] Gallery management

#### 6. Reports & Analytics
- [ ] Booking reports
- [ ] Revenue reports
- [ ] Export to Excel/PDF
- [ ] Charts & graphs

#### 7. Settings
- [ ] General settings
- [ ] Booking settings (harga, dll)
- [ ] Payment settings
- [ ] Email templates
- [ ] Admin management

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth)
- **File Upload**: Cloudinary (planned)
- **Charts**: Recharts (planned)
- **Data Fetching**: SWR
- **Notifications**: React Hot Toast

---

## 📝 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🔒 Security Features

1. **Row Level Security (RLS)**
   - Users hanya bisa lihat data sendiri
   - Admin bisa lihat semua data
   
2. **Role-Based Access Control**
   - Middleware check role di setiap admin route
   - Auto-logout jika role berubah
   
3. **Protected Routes**
   - Admin layout dengan auth guard
   - Redirect ke login jika belum auth

4. **Activity Logging**
   - Log semua admin actions
   - Track IP address & user agent

---

## 📊 Default Credentials

**Admin Login:**
- Email: `admin@suroloyo.com`
- Password: `admin123`

⚠️ **PENTING**: Ganti password setelah login pertama!

---

## 🐛 Troubleshooting

Lihat file `SETUP_ADMIN.md` untuk troubleshooting lengkap.

---

**Last Updated**: 2026-02-11
**Version**: 1.0.0 (Foundation)
