-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extend existing or create new)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  nik VARCHAR(16),
  gender VARCHAR(1) CHECK (gender IN ('L', 'P')),
  address TEXT,
  dob DATE,
  ktp_photo_url TEXT,
  emergency_contact JSONB,
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
  id VARCHAR(50) PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'approved', 'rejected', 'cancelled')),
  total_participants INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  payment_method VARCHAR(50),
  payment_proof_url TEXT,
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'failed')),
  payment_verified_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BOOKING MEMBERS TABLE
-- ============================================
CREATE TABLE booking_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id VARCHAR(50) REFERENCES bookings(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  nik VARCHAR(16) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  gender VARCHAR(1) CHECK (gender IN ('L', 'P')),
  address TEXT NOT NULL,
  is_leader BOOLEAN DEFAULT FALSE,
  ktp_photo_url TEXT,
  dob DATE,
  emergency_contact JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DAILY QUOTA TABLE
-- ============================================
CREATE TABLE daily_quota (
  date DATE PRIMARY KEY,
  total_quota INTEGER NOT NULL DEFAULT 150,
  filled INTEGER DEFAULT 0,
  is_open BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ACTIVITY LOGS TABLE
-- ============================================
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(100),
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NEWS ARTICLES TABLE
-- ============================================
CREATE TABLE news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES users(id),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
CREATE INDEX idx_booking_members_booking_id ON booking_members(booking_id);
CREATE INDEX idx_activity_logs_admin_id ON activity_logs(admin_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_news_articles_status ON news_articles(status);
CREATE INDEX idx_news_articles_slug ON news_articles(slug);

-- ============================================
-- TRIGGERS for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_quota_updated_at BEFORE UPDATE ON daily_quota
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTIONS for RLS
-- ============================================

-- Function to check if current user is admin (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM users
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quota ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Users: Users can read their own data, admins can read all
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON users
  FOR SELECT USING (is_admin());

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Bookings: Users can view own bookings, admins can view all
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admins can do everything on bookings
CREATE POLICY "Admins can manage all bookings" ON bookings
  FOR ALL USING (is_admin());

-- Booking Members: Follow booking permissions
CREATE POLICY "View booking members" ON booking_members
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM bookings WHERE id = booking_id AND (
      user_id = auth.uid() OR is_admin()
    )
  ));

-- Daily Quota: Public read, admin write
CREATE POLICY "Anyone can view quota" ON daily_quota
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage quota" ON daily_quota
  FOR ALL USING (is_admin());

-- Activity Logs: Admin only
CREATE POLICY "Admins can view activity logs" ON activity_logs
  FOR SELECT USING (is_admin());

-- News: Public read for published, admin manage all
CREATE POLICY "Anyone can view published news" ON news_articles
  FOR SELECT USING (status = 'published' OR is_admin());

CREATE POLICY "Admins can manage news" ON news_articles
  FOR ALL USING (is_admin());

-- ============================================
-- GALLERY TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  caption TEXT,
  category VARCHAR(50) DEFAULT 'general',
  order_index INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_gallery_created_at ON gallery(created_at);

CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery" ON gallery
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage gallery" ON gallery
  FOR ALL USING (is_admin());
-- ============================================
-- AUTH TRIGGER for New Users
-- ============================================

-- Function to handle new user creation in public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger logic for auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- Function to increment quota filled count atomically
CREATE OR REPLACE FUNCTION public.increment_quota_filled(target_date DATE, count INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.daily_quota
  SET filled = COALESCE(filled, 0) + count
  WHERE date = target_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
