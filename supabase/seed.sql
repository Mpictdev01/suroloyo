-- Insert default admin user
-- Password: admin123 (hashed with bcrypt)
-- You should change this password after first login!

INSERT INTO users (
  id,
  email,
  name,
  role,
  created_at
) VALUES (
  uuid_generate_v4(),
  'admin@suroloyo.com',
  'Admin Suroloyo',
  'admin',
  NOW()
);

-- Insert some sample daily quota
INSERT INTO daily_quota (date, total_quota, filled, is_open)
SELECT 
  CURRENT_DATE + (n || ' days')::INTERVAL,
  150,
  FLOOR(RANDOM() * 50)::INTEGER,
  TRUE
FROM generate_series(0, 30) n;
