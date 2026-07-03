CREATE TABLE services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT NOT NULL DEFAULT 'website',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO services (slug, title, description) VALUES
  ('motor-insurance', 'Motor insurance', 'Renewals, new vehicle cover, third-party policies, and claim guidance for two-wheelers, cars, and commercial vehicles.'),
  ('health-insurance', 'Health insurance', 'Personal, family floater, senior citizen, and top-up plans explained in simple language before you buy.'),
  ('life-insurance', 'Life insurance', 'Term protection, savings-linked plans, and future-ready coverage for family security and long-term goals.'),
  ('business-insurance', 'Business insurance', 'Coverage for shops, offices, small businesses, stock, liability, transit, and fire-related risks.'),
  ('travel-insurance', 'Travel insurance', 'Domestic and international travel protection for medical needs, baggage delays, and trip interruptions.');