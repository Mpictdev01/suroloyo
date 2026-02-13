# 📋 Ulasan Lengkap Website Suroloyo Booking

## 🎯 Overview Proyek

**Suroloyo Booking** adalah sistem booking pendakian online modern yang dibangun menggunakan **Next.js 15**, **React 19**, **TypeScript**, dan **Framer Motion**. Website ini menyediakan platform terintegrasi untuk reservasi pendakian Gunung Suroloyo via jalur Nyatnyono.

---

## 🛠️ Stack Teknologi

### Core Framework

- **Next.js 15.1.0** - React framework dengan App Router
- **React 19.0.0** - Library UI terbaru
- **TypeScript 5.7.2** - Type safety
- **Tailwind CSS 3.4.19** - Utility-first CSS framework

### Libraries & Tools

- **Framer Motion 11.15.0** - Animasi dan transisi smooth
- **Lenis 1.1.18** - Smooth scrolling experience
- **Material Symbols** - Icon set dari Google

---

## 📱 Fitur-Fitur Utama

### 1. **Halaman Beranda (Landing Page)**

**Path:** `/`

#### Komponen Utama:

- **Hero Section**
  - Background image dinamis dengan gradient overlay
  - Animasi fade-in menggunakan Framer Motion
  - Badge status "Jalur Pendakian Resmi Dibuka"
  - Judul besar dengan gradient text effect
  - CTA button "Booking Sekarang" dan "Lihat Panduan"
  - Auto-redirect ke login jika belum login

- **Panduan Booking (4 Langkah)**
  1. Registrasi Akun - Buat akun dengan data valid
  2. Pilih Jadwal - Cek kuota dan pilih tanggal
  3. Pembayaran - QRIS, E-Wallet, Transfer Bank
  4. E-Ticket Terbit - QR Code untuk registrasi di basecamp

- **Galeri Keindahan**
  - Grid layout responsif (2 kolom mobile, 4 kolom desktop)
  - 6 foto dengan layout masonry
  - Lightbox untuk preview gambar full screen
  - Hover effect dengan overlay caption
  - Animasi scale on hover

- **Suroloyo News**
  - 3 artikel terbaru
  - Card design dengan gambar featured
  - Tanggal publikasi dengan icon
  - Excerpt preview
  - Link ke detail artikel

- **Lokasi Basecamp**
  - Informasi alamat lengkap
  - Jam operasional (24 jam, registrasi 07:00-22:00)
  - Google Maps embed dengan grayscale effect
  - Hover untuk colored map
  - Link ke Google Maps

#### Teknologi:

- Smooth scroll dengan Lenis
- Intersection Observer untuk scroll animations
- Responsive grid system
- Material Icons untuk iconography

---

### 2. **Sistem Autentikasi**

#### **Login Page** (`/masuk`)

**Fitur:**

- Split layout design (50/50 desktop)
- **Left Side:** Image slider otomatis (5 detik interval)
  - 3 gambar pemandangan Suroloyo
  - Fade transition animation
  - Indicator dots untuk navigasi
  - Overlay gradient untuk readability
  - Back button ke homepage
- **Right Side:** Form login
  - Email & password input
  - "Lupa password?" link
  - Loading state dengan spinner
  - Google OAuth button (UI ready)
  - Link ke halaman registrasi
  - Return URL support untuk redirect setelah login

**UX Details:**

- Mobile: Full screen form tanpa slider
- Auto-login simulation (1.5 detik)
- Smooth page transitions
- Backdrop blur effect

#### **Register Page** (`/daftar-akun`)

**Fitur:**

- Form registrasi sederhana
  - Nama lengkap
  - Email
  - Password
- Auto-login setelah registrasi
- Redirect ke homepage
- Loading state animation

---

### 3. **Sistem Booking (4 Tahap)**

#### **Tahap 1: SOP & Peraturan** (`/booking/aturan`)

**Path:** `/booking/aturan`

**Fitur:**

- Progress bar booking (Step 1/4)
- 5 Peraturan wajib:
  1. ❌ Bawa Sampah Turun
  2. 🚫 Dilarang Sajam & Miras
  3. 🔥 Dilarang Api Unggun
  4. 🥾 Patuhi Jalur Resmi
  5. 🤝 Hormati Norma Setempat

- Checkbox persetujuan dengan animasi
- Tombol "Lanjutkan" disabled sampai setuju
- Auth gate (redirect ke login jika belum login)

**Validasi:**

- User harus login
- Checkbox harus dicentang

---

#### **Tahap 2: Pilih Jadwal** (`/booking/jadwal`)

**Path:** `/booking/jadwal`

**Fitur:**

- **Kalender Interaktif**
  - Grid 7x6 (Minggu-Sabtu)
  - Navigasi bulan (prev/next)
  - Color coding status:
    - 🟢 Hijau: Kuota aman (>20 slot)
    - 🟡 Kuning: Terbatas (<20 slot)
    - 🔴 Merah: Penuh (0 slot)
  - Progress bar kuota per hari
  - Tanggal yang sudah lewat di-disable
  - Selected date dengan highlight biru

- **Sidebar Detail**
  - Tanggal terpilih (format Indonesia)
  - Status kuota
  - Sisa slot
  - Info warning tentang perubahan tanggal
  - Button "Lanjut ke Anggota"

**Teknologi:**

- Dynamic calendar generation
- Deterministic random slot allocation (demo)
- useMemo untuk optimasi performa
- Responsive layout (sidebar bottom di mobile)

---

#### **Tahap 3: Data Pendaki** (`/booking/grup`)

**Path:** `/booking/grup`

**Fitur:**

- **Ketua Grup (Leader)**
  - Auto-filled dari profil user
  - Display: Nama, NIK, HP, Alamat
  - Warning jika data belum lengkap
  - Link ke halaman profil untuk melengkapi
  - Animasi pulse pada tombol "Lengkapi Profil"

- **Form Tambah Anggota**
  - Nama lengkap (sesuai KTP)
  - Jenis kelamin (Radio button)
  - NIK (16 digit, numeric only)
  - Nomor HP (numeric only)
  - Alamat domisili
  - Button "Tambahkan Anggota"
  - Disabled jika sudah 10 orang

- **Daftar Anggota**
  - Card list dengan avatar initial
  - Info NIK dan HP
  - Button hapus per anggota
  - Empty state jika belum ada anggota

- **Sidebar Ringkasan**
  - Progress bar jumlah peserta (1-10)
  - Checklist validasi:
    - ✅ Data Ketua Lengkap
    - ✅ Min. 1 Pendaki
  - Button "Lanjut Pembayaran"

**Validasi:**

- Min 1 orang (leader saja)
- Max 10 orang total
- Semua field anggota wajib diisi
- NIK dan HP hanya angka

---

#### **Tahap 4: Pembayaran** (`/booking/bayar`)

**Path:** `/booking/bayar`

**Fitur:**

- **Header Tagihan**
  - Total harga (Rp 25.000 x jumlah peserta)
  - Countdown timer (1:59:59)
  - Font mono untuk timer

- **Informasi Bank**
  - Logo Bank BRI
  - Nama rekening: PT. Wisata Alam Suroloyo
  - Virtual Account number dengan format spasi
  - Button "Salin" dengan feedback copied
  - Animasi glow effect

- **Upload Bukti Transfer**
  - Drag & drop area
  - Preview file yang diupload
  - Support: JPG, PNG, PDF (max 2MB)
  - Icon dan status upload

- **Sidebar Rincian**
  - Booking ID (auto-generated)
  - Tanggal pendakian
  - Breakdown harga:
    - Tiket Leader: Rp 25.000
    - Anggota x N: Rp (N × 25.000)
    - Total
  - Info keamanan pembayaran
  - Button "Konfirmasi Pembayaran"

**Flow:**

- Upload bukti → Konfirmasi → Simulasi verifikasi (1.5 detik)
- Data masuk ke riwayat dengan status "Diproses"
- Reset booking state
- Redirect ke halaman riwayat

**Validasi:**

- Bukti transfer wajib diupload
- Booking ID harus ada

---

### 4. **Profil & Data Pendaki**

#### **Halaman Profil** (`/profil`)

**Path:** `/profil`

**Fitur:**

- **Warning Alert**
  - Peringatan tentang verifikasi KTP
  - Konsekuensi jika foto tidak valid

- **Section: Data Pribadi**
  - Nama sesuai KTP \*
  - NIK (16 digit, validasi numeric) \*
  - Tanggal Lahir (date picker) \*
  - Jenis Kelamin (Radio: Pria/Wanita) \*
  - Nomor WhatsApp/HP \*
  - Alamat Lengkap (textarea) \*

- **Section: Kontak Darurat**
  - Nama Kontak \*
  - Nomor HP \*
  - Hubungan (dropdown) \*
    - Orang Tua
    - Suami/Istri
    - Saudara Kandung
    - Teman

- **Section: Upload KTP**
  - File input dengan preview
  - Panduan foto KTP:
    - ✅ Jelas dan tajam
    - ✅ Tidak blur/gelap/glare
    - ✅ Tidak terpotong
    - ✅ NIK dan nama terbaca
  - Warning: Admin berhak menolak jika tidak valid
  - Button hapus foto

- **Action Buttons**
  - Batal (router.back)
  - Simpan Biodata (dengan loading state)

**Validasi Granular:**

- Cek setiap field satu per satu
- Alert dengan daftar field yang belum lengkap
- Return URL support untuk redirect setelah simpan

**Data Flow:**

- Data disimpan ke BookingContext sebagai `leader`
- Digunakan untuk booking sebagai ketua grup

---

### 5. **Riwayat Booking**

#### **Halaman Riwayat** (`/riwayat`)

**Path:** `/riwayat`

**Fitur:**

- **Empty State**
  - Icon history besar
  - Pesan "Belum ada riwayat"
  - CTA "Mulai Booking Sekarang"

- **Grid Booking Cards**
  - Layout: 1 kolom (mobile), 2 kolom (tablet), 3 kolom (desktop)
  - Setiap card menampilkan:
    - Strip warna biru di atas
    - Tanggal pendakian
    - Status badge (Berhasil/Diproses/Dibatalkan)
    - Jumlah peserta
    - Total harga
    - Booking ID
    - Footer "Lihat Detail" dengan arrow
  - Hover effect: border primary, shadow glow

**Status Colors:**

- 🟢 Berhasil: Green
- 🟡 Diproses: Yellow
- ⚪ Lainnya: Gray

**Interaksi:**

- Click card → Detail booking (`/riwayat/[id]`)

---

#### **Detail Riwayat** (`/riwayat/[id]`)

**Path:** `/riwayat/[id]`

**Fitur:**

- Informasi lengkap booking
- Daftar anggota
- Status pembayaran
- E-ticket (jika sudah approved)
- QR Code untuk scan di basecamp

---

### 6. **Dashboard** (Placeholder)

**Path:** `/dashboard`

**Fitur:**

- Member card digital dengan QR code
- Performance overview:
  - Total Summits: 12
  - Highest Elevation: 1,492m
  - Active Bookings: 1
- Recent activity table
- Stats cards dengan animasi

**Note:** Ini adalah halaman demo/placeholder untuk showcase

---

### 7. **Halaman Informasi**

#### **Cek Kuota** (`/kuota`)

**Path:** `/kuota`

**Fitur:**

- Kalender kuota real-time
- Filter bulan
- Status ketersediaan per hari
- Quick booking dari kalender

#### **Kontak** (`/kontak`)

**Path:** `/kontak`

**Fitur:**

- Informasi Basecamp Nyatnyono
  - Alamat lengkap
  - Nomor telepon: +62 812-3456-7890
  - Email: info@suroloyobooking.com
- Jam Operasional
  - Senin-Jumat: 08:00-16:00 WIB
  - Sabtu-Minggu: 24 Jam

#### **Kebijakan & Syarat**

**Path:** `/kebijakan`, `/syarat`

**Fitur:**

- Terms of Service
- Privacy Policy
- Refund Policy

---

## 🎨 Design System

### Color Palette

```css
Primary: #007BFF (Blue)
Background Dark: #0B1121
Surface Dark: #1A1F2E
Border Dark: #2A2F3E
Text White: #FFFFFF
Text Gray: #9CA3AF
```

### Typography

- **Font:** System default (sans-serif)
- **Headings:** Bold, 2xl-4xl
- **Body:** Regular, sm-base
- **Mono:** Untuk ID, nomor rekening

### Components

- **Buttons:**
  - Primary: Blue gradient dengan shadow
  - Secondary: White/10 dengan backdrop blur
  - Disabled: Gray dengan opacity 50%
- **Cards:**
  - Background: Surface dark
  - Border: Border dark
  - Rounded: 2xl (16px)
  - Hover: Border primary/50

- **Inputs:**
  - Background: Background dark
  - Border: Border dark
  - Focus: Ring primary
  - Rounded: xl (12px)

### Animations

- **Fade In Up:** Opacity 0→1, Y 30→0
- **Stagger Container:** Delay 0.1s per child
- **Hover Scale:** 1.02-1.05
- **Smooth Scroll:** Lenis integration

---

## 🔐 State Management

### BookingContext

**Global State:**

```typescript
- user: User | null
- leader: Member | null
- bookingDate: string | null
- members: Member[]
- bookingId: string | null
- history: BookingHistoryItem[]
```

**Actions:**

```typescript
-login(userData) -
	logout() -
	setLeader(leader) -
	setBookingDate(date) -
	addMember(member) -
	removeMember(index) -
	generateBookingId() -
	resetBooking() -
	addToHistory(item);
```

**Data Flow:**

1. Login → Set user & auto-set leader
2. Booking → Update date, members
3. Payment → Generate ID, add to history
4. Reset → Clear all booking data

---

## 🛡️ Security & Validation

### Auth Gates

- Semua halaman booking memerlukan login
- Redirect ke `/masuk?returnUrl=...`
- Auto-redirect setelah login

### Input Validation

- **NIK:** 16 digit, numeric only
- **Phone:** Numeric only
- **Email:** Email format
- **File Upload:**
  - Max 2MB
  - Format: JPG, PNG, PDF
  - Preview sebelum upload

### Data Validation

- Profil lengkap sebelum booking
- Min/max peserta (1-10)
- Tanggal tidak boleh masa lalu
- Kuota tersedia

---

## 📱 Responsive Design

### Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Mobile Optimizations

- Hamburger menu
- Bottom navigation
- Stacked layouts
- Touch-friendly buttons (min 44px)
- Swipe gestures untuk kalender

### Desktop Features

- Sidebar layouts
- Hover effects
- Dropdown menus
- Multi-column grids

---

## ⚡ Performance

### Optimizations

- **Next.js App Router:** Server components
- **Image Optimization:** Next/Image (jika digunakan)
- **Code Splitting:** Automatic by Next.js
- **Lazy Loading:** Framer Motion viewport triggers
- **Memoization:** useMemo untuk kalender

### Loading States

- Skeleton screens
- Spinner animations
- Progress indicators
- Disabled states

---

## 🚀 Deployment Ready

### Build Configuration

```json
{
	"scripts": {
		"dev": "next dev",
		"build": "next build",
		"start": "next start",
		"lint": "next lint"
	}
}
```

### Environment Variables (Recommended)

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_GOOGLE_MAPS_KEY=
DATABASE_URL=
PAYMENT_GATEWAY_KEY=
```

---

## 📊 Fitur Tambahan yang Bisa Dikembangkan

### Backend Integration

- [ ] Real API untuk autentikasi
- [ ] Database untuk booking (PostgreSQL/MongoDB)
- [ ] Payment gateway integration (Midtrans/Xendit)
- [ ] Email notification
- [ ] WhatsApp notification
- [ ] Admin dashboard

### Features

- [ ] Multi-language (ID/EN)
- [ ] Dark/Light mode toggle
- [ ] PWA support
- [ ] Offline mode
- [ ] Push notifications
- [ ] Social media sharing
- [ ] Review & rating system
- [ ] Weather forecast integration
- [ ] Trail difficulty calculator
- [ ] Packing list generator

### Analytics

- [ ] Google Analytics
- [ ] User behavior tracking
- [ ] Conversion funnel
- [ ] A/B testing

---

## 🎯 Kesimpulan

**Suroloyo Booking** adalah aplikasi booking pendakian yang **modern, user-friendly, dan feature-rich**. Dengan desain yang clean, animasi yang smooth, dan flow booking yang jelas, aplikasi ini memberikan pengalaman yang excellent untuk pendaki.

### Kelebihan:

✅ UI/UX modern dan menarik
✅ Responsive di semua device
✅ Animasi smooth dengan Framer Motion
✅ Flow booking yang jelas (4 tahap)
✅ Validasi data yang ketat
✅ State management yang terorganisir
✅ TypeScript untuk type safety
✅ Component-based architecture

### Yang Perlu Dikembangkan:

⚠️ Backend API integration
⚠️ Real payment gateway
⚠️ Database persistence
⚠️ Email/WhatsApp notification
⚠️ Admin panel
⚠️ Real-time kuota update

---

**Total Halaman:** 15+ pages
**Total Komponen:** 5 reusable components
**Lines of Code:** ~3,500+ lines
**Tech Stack:** Next.js 15 + React 19 + TypeScript + Tailwind CSS

---

_Dibuat dengan ❤️ untuk Gunung Suroloyo_
