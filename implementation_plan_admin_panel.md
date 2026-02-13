# Implementation Plan: Admin Panel Suroloyo Booking

## Ringkasan

Membuat **Admin Panel** lengkap untuk mengelola sistem booking pendakian Suroloyo. Admin panel akan mencakup dashboard analytics, manajemen booking, user management, pengaturan kuota, verifikasi pembayaran, dan laporan.

---

## User Review Required

> [!IMPORTANT]
> **Keputusan Arsitektur yang Memerlukan Review:**
>
> 1. **Route Structure:** Admin panel akan menggunakan route `/admin/*` dengan middleware auth khusus admin
> 2. **Role System:** Akan ada 2 role: `admin` dan `user` (saat ini hanya ada `user`)
> 3. **Database:** Implementasi ini **memerlukan backend API** dan database (saat ini masih menggunakan Context API lokal)
> 4. **Authentication:** Perlu sistem auth terpisah untuk admin dengan credentials berbeda
> 5. **Real-time Updates:** Apakah perlu real-time notification untuk booking baru? (WebSocket/Polling)

> [!WARNING]
> **Breaking Changes:**
>
> - Struktur `BookingContext` akan diperluas untuk support admin features
> - Perlu migrasi data dari localStorage ke database
> - User interface akan terpisah total dari admin interface

---

## Proposed Changes

### Modul 1: Dashboard & Analytics

Dashboard utama dengan statistik dan overview sistem.

#### [NEW] [app/admin/page.tsx](file:///t:/web1/suroloyo-booking/app/admin/page.tsx)

**Fitur:**

- **Statistics Cards:**
  - Total Booking (Hari ini, Minggu ini, Bulan ini)
  - Total Pendaki
  - Total Revenue
  - Pending Verifikasi
- **Charts & Graphs:**
  - Line chart: Booking trend (7 hari terakhir)
  - Bar chart: Pendaki per bulan
  - Pie chart: Status booking (Berhasil/Diproses/Dibatalkan)
  - Donut chart: Payment methods
- **Recent Activities:**
  - 10 booking terbaru dengan status
  - Quick action buttons (Approve/Reject)
- **Quick Stats:**
  - Kuota hari ini (tersedia/terisi)
  - Pending payments
  - Unverified KTP

**Teknologi:**

- Recharts atau Chart.js untuk visualisasi
- Real-time data fetching dengan SWR/React Query
- Auto-refresh setiap 30 detik

---

### Modul 2: Manajemen Booking

Kelola semua booking pendakian dengan filter dan search.

#### [NEW] [app/admin/booking/page.tsx](file:///t:/web1/suroloyo-booking/app/admin/booking/page.tsx)

**Fitur:**

- **Table View:**
  - Columns: Booking ID, Tanggal Pendakian, Leader, Jumlah Peserta, Status, Total, Actions
  - Sortable columns
  - Pagination (20 items per page)
- **Filter & Search:**
  - Search by: Booking ID, Nama, Email, Phone
  - Filter by: Status, Tanggal, Payment Method
  - Date range picker
- **Bulk Actions:**
  - Select multiple bookings
  - Bulk approve/reject
  - Bulk export to Excel/PDF
- **Quick Actions:**
  - View detail
  - Edit booking
  - Cancel booking
  - Send notification
  - Print ticket

#### [NEW] [app/admin/booking/[id]/page.tsx](file:///t:/web1/suroloyo-booking/app/admin/booking/[id]/page.tsx)

**Fitur Detail Booking:**

- **Informasi Booking:**
  - Booking ID, Status, Tanggal dibuat
  - Tanggal pendakian
  - Total harga, Payment method
- **Data Leader:**
  - Nama, NIK, HP, Email
  - Alamat, Tanggal lahir, Jenis kelamin
  - Foto KTP (preview + download)
  - Kontak darurat
- **Daftar Anggota:**
  - Table dengan semua anggota
  - Data lengkap per anggota
- **Payment Info:**
  - Bukti transfer (preview)
  - Status pembayaran
  - Tanggal bayar
  - Metode pembayaran
- **Admin Actions:**
  - Approve booking
  - Reject booking (dengan alasan)
  - Request revision (KTP tidak jelas, dll)
  - Generate e-ticket
  - Send email/WhatsApp notification
  - Add admin notes
- **Timeline/History:**
  - Log semua aktivitas booking
  - Siapa yang approve/reject
  - Kapan status berubah

---

### Modul 3: User Management

Kelola data user/pendaki yang terdaftar.

#### [NEW] [app/admin/users/page.tsx](file:///t:/web1/suroloyo-booking/app/admin/users/page.tsx)

**Fitur:**

- **User Table:**
  - Columns: Avatar, Nama, Email, Phone, Total Booking, Status, Join Date
  - Search by nama/email/phone
  - Filter by status (Active/Banned)
- **User Actions:**
  - View profile
  - Edit user data
  - Ban/Unban user
  - Reset password
  - View booking history
- **Statistics:**
  - Total users
  - New users (this month)
  - Active users (pernah booking)

#### [NEW] [app/admin/users/[id]/page.tsx](file:///t:/web1/suroloyo-booking/app/admin/users/[id]/page.tsx)

**Fitur Detail User:**

- Profile lengkap
- Booking history
- Payment history
- Admin notes
- Activity log

---

### Modul 4: Kuota & Jadwal Management

Kelola kuota pendakian per hari dan pengaturan jadwal.

#### [NEW] [app/admin/kuota/page.tsx](file:///t:/web1/suroloyo-booking/app/admin/kuota/page.tsx)

**Fitur:**

- **Calendar View:**
  - Kalender bulanan dengan kuota per hari
  - Color coding: Hijau (aman), Kuning (terbatas), Merah (penuh)
  - Click untuk edit kuota
- **Bulk Edit:**
  - Set kuota untuk range tanggal
  - Set kuota default
  - Close/Open jalur untuk tanggal tertentu
- **Settings:**
  - Kuota default per hari (misal: 150 orang)
  - Minimum booking (misal: 1 hari sebelum)
  - Maximum booking (misal: 30 hari ke depan)
  - Blackout dates (tanggal yang ditutup)

#### [NEW] [app/admin/kuota/[date]/page.tsx](file:///t:/web1/suroloyo-booking/app/admin/kuota/[date]/page.tsx)

**Fitur Detail Tanggal:**

- Kuota total
- Terisi
- Tersisa
- List booking untuk tanggal ini
- Edit kuota
- Close/Open jalur

---

### Modul 5: Payment Verification

Verifikasi pembayaran dan bukti transfer.

#### [NEW] [app/admin/payments/page.tsx](file:///t:/web1/suroloyo-booking/app/admin/payments/page.tsx)

**Fitur:**

- **Pending Payments:**
  - Grid/List view bukti transfer yang belum diverifikasi
  - Preview image bukti transfer
  - Booking info (ID, nama, jumlah, tanggal)
- **Quick Actions:**
  - Approve payment
  - Reject payment (dengan alasan)
  - Request new proof
- **Payment History:**
  - Semua payment yang sudah diverifikasi
  - Filter by status/date
  - Export report

**UI Components:**

- Image lightbox untuk preview bukti transfer
- Side-by-side view: Bukti transfer + Booking detail
- Approve/Reject modal dengan form alasan

---

### Modul 6: Content Management

Kelola konten website (News, Gallery, Info).

#### [NEW] [app/admin/content/news/page.tsx](file:///t:/web1/suroloyo-booking/app/admin/content/news/page.tsx)

**Fitur:**

- CRUD artikel news
- Rich text editor (TinyMCE/Quill)
- Upload featured image
- Publish/Draft status
- SEO settings (meta title, description)

#### [NEW] [app/admin/content/gallery/page.tsx](file:///t:/web1/suroloyo-booking/app/admin/content/gallery/page.tsx)

**Fitur:**

- Upload multiple images
- Drag & drop reorder
- Edit caption
- Delete images
- Image optimization

---

### Modul 7: Reports & Analytics

Generate laporan dan export data.

#### [NEW] [app/admin/reports/page.tsx](file:///t:/web1/suroloyo-booking/app/admin/reports/page.tsx)

**Fitur:**

- **Report Types:**
  - Booking Report (by date range)
  - Revenue Report
  - User Growth Report
  - Payment Method Report
  - Cancellation Report
- **Export Options:**
  - Excel (.xlsx)
  - PDF
  - CSV
- **Filters:**
  - Date range
  - Status
  - Payment method

---

### Modul 8: Settings & Configuration

Pengaturan sistem dan konfigurasi.

#### [NEW] [app/admin/settings/page.tsx](file:///t:/web1/suroloyo-booking/app/admin/settings/page.tsx)

**Fitur:**

- **General Settings:**
  - Site name, logo
  - Contact info
  - Operating hours
- **Booking Settings:**
  - Harga tiket per orang
  - Min/max peserta per grup
  - Booking window (berapa hari sebelum/sesudah)
- **Payment Settings:**
  - Bank account info
  - Payment methods
  - Payment deadline (jam)
- **Email/Notification Settings:**
  - Email templates
  - WhatsApp templates
  - Auto-send settings
- **Admin Management:**
  - Add/remove admin users
  - Change admin password
  - Activity log

---

## Struktur File Baru

```
app/
├── admin/
│   ├── layout.tsx                    # Admin layout dengan sidebar
│   ├── page.tsx                      # Dashboard
│   ├── booking/
│   │   ├── page.tsx                  # List booking
│   │   └── [id]/
│   │       └── page.tsx              # Detail booking
│   ├── users/
│   │   ├── page.tsx                  # List users
│   │   └── [id]/
│   │       └── page.tsx              # Detail user
│   ├── kuota/
│   │   ├── page.tsx                  # Kalender kuota
│   │   └── [date]/
│   │       └── page.tsx              # Edit kuota tanggal
│   ├── payments/
│   │   └── page.tsx                  # Verifikasi pembayaran
│   ├── content/
│   │   ├── news/
│   │   │   ├── page.tsx              # List news
│   │   │   ├── new/page.tsx          # Create news
│   │   │   └── [id]/page.tsx         # Edit news
│   │   └── gallery/
│   │       └── page.tsx              # Gallery management
│   ├── reports/
│   │   └── page.tsx                  # Reports & export
│   └── settings/
│       └── page.tsx                  # System settings

components/
├── admin/
│   ├── AdminSidebar.tsx              # Sidebar navigation
│   ├── AdminHeader.tsx               # Top header dengan user menu
│   ├── StatsCard.tsx                 # Card untuk statistics
│   ├── DataTable.tsx                 # Reusable table component
│   ├── BookingStatusBadge.tsx        # Badge untuk status
│   ├── ImagePreview.tsx              # Preview gambar dengan lightbox
│   ├── DateRangePicker.tsx           # Date range selector
│   └── ExportButton.tsx              # Export data button

context/
└── AdminContext.tsx                  # Admin-specific state management

lib/
├── api/
│   ├── bookings.ts                   # API calls untuk booking
│   ├── users.ts                      # API calls untuk users
│   ├── payments.ts                   # API calls untuk payments
│   └── reports.ts                    # API calls untuk reports
└── utils/
    ├── exportToExcel.ts              # Export utility
    └── formatters.ts                 # Data formatters
```

---

## Component Design

### AdminLayout

```tsx
// Sidebar dengan menu:
- Dashboard
- Booking Management
  - All Bookings
  - Pending Verification
- User Management
- Kuota & Jadwal
- Payment Verification
- Content
  - News
  - Gallery
- Reports
- Settings
- Logout
```

### DataTable (Reusable)

```tsx
// Props:
- columns: Column[]
- data: any[]
- onSort: (column) => void
- onFilter: (filters) => void
- onPageChange: (page) => void
- actions: Action[]
- selectable: boolean
```

### StatsCard

```tsx
// Props:
- title: string
- value: number | string
- icon: ReactNode
- trend?: { value: number, direction: 'up' | 'down' }
- color: 'primary' | 'success' | 'warning' | 'danger'
```

---

## Authentication & Authorization

### Admin Auth Flow

1. Admin login di `/admin/login` (halaman terpisah dari user login)
2. Credentials: email + password khusus admin
3. JWT token disimpan di httpOnly cookie
4. Middleware check role di setiap route `/admin/*`
5. Redirect ke login jika tidak authorized

### Role System

```typescript
enum Role {
	USER = "user",
	ADMIN = "admin",
	SUPER_ADMIN = "super_admin",
}

interface User {
	// ... existing fields
	role: Role;
}
```

---

## Database Schema (Recommended)

### Tabel Baru yang Dibutuhkan:

```sql
-- Admin Users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(50),
  created_at TIMESTAMP,
  last_login TIMESTAMP
);

-- Bookings
CREATE TABLE bookings (
  id VARCHAR(50) PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  booking_date DATE,
  status VARCHAR(50),
  total_price INTEGER,
  payment_proof_url VARCHAR(500),
  payment_status VARCHAR(50),
  admin_notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Booking Members
CREATE TABLE booking_members (
  id UUID PRIMARY KEY,
  booking_id VARCHAR(50) REFERENCES bookings(id),
  name VARCHAR(255),
  nik VARCHAR(16),
  phone VARCHAR(20),
  gender VARCHAR(1),
  address TEXT,
  is_leader BOOLEAN,
  ktp_photo_url VARCHAR(500),
  emergency_contact JSONB
);

-- Kuota
CREATE TABLE daily_quota (
  date DATE PRIMARY KEY,
  total_quota INTEGER,
  filled INTEGER,
  is_open BOOLEAN,
  notes TEXT
);

-- Activity Log
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id),
  action VARCHAR(100),
  entity_type VARCHAR(50),
  entity_id VARCHAR(100),
  details JSONB,
  created_at TIMESTAMP
);

-- News Articles
CREATE TABLE news_articles (
  id UUID PRIMARY KEY,
  slug VARCHAR(255) UNIQUE,
  title VARCHAR(500),
  content TEXT,
  excerpt TEXT,
  featured_image VARCHAR(500),
  status VARCHAR(20),
  published_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## API Endpoints yang Dibutuhkan

### Authentication

- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/me` - Get current admin

### Dashboard

- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/recent-activities` - Recent activities

### Bookings

- `GET /api/admin/bookings` - List bookings (with filters)
- `GET /api/admin/bookings/:id` - Get booking detail
- `PATCH /api/admin/bookings/:id/approve` - Approve booking
- `PATCH /api/admin/bookings/:id/reject` - Reject booking
- `PATCH /api/admin/bookings/:id/status` - Update status
- `DELETE /api/admin/bookings/:id` - Cancel booking

### Users

- `GET /api/admin/users` - List users
- `GET /api/admin/users/:id` - Get user detail
- `PATCH /api/admin/users/:id` - Update user
- `PATCH /api/admin/users/:id/ban` - Ban user

### Kuota

- `GET /api/admin/kuota` - Get kuota calendar
- `GET /api/admin/kuota/:date` - Get kuota for specific date
- `PATCH /api/admin/kuota/:date` - Update kuota
- `POST /api/admin/kuota/bulk` - Bulk update kuota

### Payments

- `GET /api/admin/payments/pending` - Pending payments
- `PATCH /api/admin/payments/:id/verify` - Verify payment
- `PATCH /api/admin/payments/:id/reject` - Reject payment

### Content

- `GET /api/admin/news` - List news
- `POST /api/admin/news` - Create news
- `PATCH /api/admin/news/:id` - Update news
- `DELETE /api/admin/news/:id` - Delete news
- `POST /api/admin/gallery/upload` - Upload images

### Reports

- `GET /api/admin/reports/bookings` - Booking report
- `GET /api/admin/reports/revenue` - Revenue report
- `GET /api/admin/reports/export` - Export data

---

## Verification Plan

### Manual Testing

#### 1. Admin Login & Authentication

**Steps:**

1. Buka browser dan navigasi ke `http://localhost:3000/admin/login`
2. Login dengan credentials admin (email: admin@suroloyo.com, password: admin123)
3. Verifikasi redirect ke dashboard admin
4. Coba akses route `/admin/*` tanpa login → harus redirect ke login
5. Logout dan verifikasi redirect ke login page

**Expected Result:**

- ✅ Admin bisa login dengan credentials yang benar
- ✅ Redirect ke dashboard setelah login
- ✅ Protected routes tidak bisa diakses tanpa auth
- ✅ Logout berhasil dan clear session

---

#### 2. Dashboard & Statistics

**Steps:**

1. Login sebagai admin
2. Lihat dashboard utama
3. Verifikasi semua stats card menampilkan data:
   - Total Booking
   - Total Pendaki
   - Total Revenue
   - Pending Verifikasi
4. Cek charts/graphs muncul dengan data
5. Verifikasi recent activities menampilkan 10 booking terbaru

**Expected Result:**

- ✅ Semua statistics card menampilkan angka yang benar
- ✅ Charts render dengan baik
- ✅ Recent activities update real-time

---

#### 3. Booking Management

**Steps:**

1. Navigasi ke "Booking Management"
2. Verifikasi table menampilkan semua booking
3. Test search: cari booking by ID/nama
4. Test filter: filter by status "Diproses"
5. Test sort: sort by tanggal
6. Click detail booking → verifikasi semua data muncul
7. Test approve booking:
   - Click "Approve" button
   - Verifikasi status berubah menjadi "Berhasil"
   - Cek email/notifikasi terkirim
8. Test reject booking:
   - Click "Reject" button
   - Isi alasan penolakan
   - Verifikasi status berubah menjadi "Dibatalkan"

**Expected Result:**

- ✅ Table menampilkan data dengan benar
- ✅ Search, filter, sort berfungsi
- ✅ Detail booking lengkap
- ✅ Approve/reject mengubah status
- ✅ Notifikasi terkirim

---

#### 4. Payment Verification

**Steps:**

1. Navigasi ke "Payment Verification"
2. Lihat list pending payments
3. Click preview bukti transfer
4. Verifikasi image muncul di lightbox
5. Test approve payment:
   - Click "Approve"
   - Verifikasi status payment berubah
   - Cek booking status update
6. Test reject payment:
   - Click "Reject"
   - Isi alasan
   - Verifikasi user dapat notifikasi

**Expected Result:**

- ✅ Pending payments muncul
- ✅ Image preview berfungsi
- ✅ Approve/reject update status
- ✅ Notifikasi terkirim ke user

---

#### 5. Kuota Management

**Steps:**

1. Navigasi ke "Kuota & Jadwal"
2. Verifikasi kalender muncul dengan kuota per hari
3. Test edit kuota:
   - Click tanggal
   - Ubah kuota dari 150 → 100
   - Save
   - Verifikasi perubahan tersimpan
4. Test bulk edit:
   - Pilih range tanggal (1-7 Maret)
   - Set kuota 120
   - Verifikasi semua tanggal update
5. Test close jalur:
   - Pilih tanggal
   - Set "Jalur Ditutup"
   - Verifikasi user tidak bisa booking tanggal ini

**Expected Result:**

- ✅ Kalender menampilkan kuota
- ✅ Edit kuota tersimpan
- ✅ Bulk edit berfungsi
- ✅ Close jalur mencegah booking

---

#### 6. User Management

**Steps:**

1. Navigasi ke "User Management"
2. Verifikasi table menampilkan semua users
3. Test search user by email
4. Click detail user
5. Verifikasi booking history muncul
6. Test ban user:
   - Click "Ban User"
   - Verifikasi user tidak bisa login
7. Test unban user

**Expected Result:**

- ✅ User list lengkap
- ✅ Search berfungsi
- ✅ Detail user dan history muncul
- ✅ Ban/unban berfungsi

---

#### 7. Content Management (News)

**Steps:**

1. Navigasi ke "Content > News"
2. Click "Create New Article"
3. Isi form:
   - Title: "Test Artikel"
   - Content: Lorem ipsum...
   - Upload featured image
   - Set status: Published
4. Save
5. Verifikasi artikel muncul di homepage user
6. Test edit artikel
7. Test delete artikel

**Expected Result:**

- ✅ Create artikel berhasil
- ✅ Artikel muncul di frontend
- ✅ Edit dan delete berfungsi

---

#### 8. Reports & Export

**Steps:**

1. Navigasi ke "Reports"
2. Pilih "Booking Report"
3. Set date range: 1-31 Januari 2026
4. Click "Generate Report"
5. Verifikasi data muncul
6. Test export to Excel
7. Download dan buka file Excel
8. Verifikasi data sesuai

**Expected Result:**

- ✅ Report generate dengan benar
- ✅ Export to Excel berfungsi
- ✅ Data di Excel sesuai dengan di web

---

### Automated Testing (Future)

Setelah implementasi selesai, bisa ditambahkan:

- Unit tests untuk utility functions
- Integration tests untuk API endpoints
- E2E tests dengan Playwright/Cypress

---

## Timeline Estimasi

### Phase 1: Foundation (1-2 minggu)

- Setup routing `/admin/*`
- Admin authentication & authorization
- Admin layout & sidebar
- Dashboard basic

### Phase 2: Core Features (2-3 minggu)

- Booking management (list, detail, approve/reject)
- Payment verification
- User management basic

### Phase 3: Advanced Features (2-3 minggu)

- Kuota management dengan kalender
- Content management (News, Gallery)
- Reports & export

### Phase 4: Polish & Testing (1 minggu)

- UI/UX improvements
- Manual testing
- Bug fixes
- Documentation

**Total Estimasi: 6-9 minggu**

---

## Dependencies Tambahan

```json
{
	"dependencies": {
		"recharts": "^2.10.0", // Charts
		"react-table": "^8.0.0", // Data tables
		"react-datepicker": "^4.25.0", // Date picker
		"react-quill": "^2.0.0", // Rich text editor
		"xlsx": "^0.18.5", // Excel export
		"jspdf": "^2.5.1", // PDF export
		"react-dropzone": "^14.2.3", // File upload
		"date-fns": "^3.0.0", // Date utilities
		"swr": "^2.2.4" // Data fetching
	}
}
```

---

## Notes

- Admin panel ini **memerlukan backend API** untuk berfungsi penuh
- Saat ini sistem menggunakan Context API lokal, perlu migrasi ke database
- Pertimbangkan menggunakan **Next.js API Routes** atau backend terpisah (Express, NestJS)
- Untuk production, gunakan **PostgreSQL** atau **MongoDB** sebagai database
- Implementasi **real-time updates** dengan WebSocket atau Server-Sent Events
- Tambahkan **rate limiting** untuk API endpoints
- Implementasi **audit log** untuk semua admin actions
- Gunakan **image CDN** (Cloudinary, AWS S3) untuk upload gambar

---

## Rekomendasi Tech Stack Backend

### Option 1: Next.js API Routes + Prisma + PostgreSQL

- ✅ Terintegrasi dengan Next.js
- ✅ Type-safe dengan Prisma
- ✅ Mudah deploy (Vercel)

### Option 2: Separate Backend (NestJS + PostgreSQL)

- ✅ Scalable
- ✅ Microservices ready
- ✅ Better separation of concerns

### Option 3: Supabase (Backend as a Service)

- ✅ Instant backend
- ✅ Real-time subscriptions
- ✅ Built-in auth
- ✅ File storage included
