-- ============================================================
-- AroundJos — Seed Data
-- Run after 001_initial_schema.sql
-- ============================================================

-- ─── Categories ──────────────────────────────────────────────────────────────
INSERT INTO public.categories (id, name, slug, description, icon, color, featured, order_num) VALUES
  ('hotels-lodges',        'Hotels & Lodges',        'hotels-lodges',        'Find the best hotels, guesthouses and lodges in Jos',  '🏨', '#FF7D0A', true,  1),
  ('restaurants-food',     'Restaurants & Food',     'restaurants-food',     'Explore local cuisine, fast food and fine dining',       '🍽️', '#EF4444', true,  2),
  ('lounges-nightlife',    'Lounges & Nightlife',    'lounges-nightlife',    'Relaxation spots, clubs and entertainment venues',       '🍸', '#8B5CF6', true,  3),
  ('shortlets-apartments', 'Shortlets & Apartments', 'shortlets-apartments', 'Short-term rentals and furnished apartments',            '🏠', '#10B981', true,  4),
  ('phones-gadgets',       'Phones & Gadgets',       'phones-gadgets',       'Phone stores, repair shops and gadget dealers',          '📱', '#3B82F6', true,  5),
  ('fashion-clothing',     'Fashion & Clothing',     'fashion-clothing',     'Boutiques, tailors and fashion stores',                  '👗', '#F59E0B', true,  6),
  ('beauty-wellness',      'Beauty & Wellness',      'beauty-wellness',      'Salons, spas, barbershops and gyms',                     '💇', '#EC4899', true,  7),
  ('health-medical',       'Health & Medical',       'health-medical',       'Hospitals, clinics, pharmacies and labs',                '🏥', '#14B8A6', false, 8),
  ('automotive',           'Automotive',             'automotive',           'Mechanics, spare parts and auto services',               '🚗', '#64748B', false, 9),
  ('events-tourism',       'Events & Tourism',       'events-tourism',       'Event centers, photographers and tourist attractions',   '📸', '#F97316', false, 10),
  ('local-services',       'Local Services',         'local-services',       'Plumbers, electricians, lawyers and more',               '🔧', '#6B7280', false, 11)
ON CONFLICT (slug) DO NOTHING;

-- ─── Listings ────────────────────────────────────────────────────────────────
INSERT INTO public.listings (
  slug, business_name, tagline, description, category_slug, subcategory_slug,
  address, area, lat, lng, phone, whatsapp,
  images, cover_image, amenities, services, price_range,
  status, verified, claimed, featured, sponsored,
  rating_average, review_count, view_count, save_count
) VALUES

-- Hotels
(
  'hill-station-hotel-jos',
  'Hill Station Hotel',
  'Jos''s Iconic Colonial-Era Luxury Hotel',
  'The legendary Hill Station Hotel, perched atop the Jos Plateau, offers breathtaking views of the city. Built during the colonial era, it has been renovated to blend heritage charm with modern comfort. Features include a swimming pool, tennis courts, a restaurant serving continental and Nigerian cuisine, and beautifully landscaped gardens.',
  'hotels-lodges', 'hotels',
  'Hill Station Hotel Road, GRA, Jos', 'GRA', 9.9085, 8.8921,
  '+2348031234567', '+2348031234567',
  ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  ARRAY['Swimming Pool','Tennis Court','Restaurant','Bar','Wi-Fi','Parking','Conference Room','Garden'],
  ARRAY['Room Service','Airport Pickup','Event Hosting','Laundry'],
  'premium',
  'active', true, true, true, true,
  4.5, 87, 1240, 156
),

(
  'rayfield-resort-jos',
  'Rayfield Resort',
  'Serene Lakeside Retreat on the Plateau',
  'Nestled on the beautiful shores of Rayfield Lake, this resort offers a unique blend of natural beauty and modern amenities. Perfect for weekend getaways and corporate retreats. Enjoy water sports on the lake, nature walks through pine forests, and fresh plateau air at 1,200 metres elevation.',
  'hotels-lodges', 'resorts',
  'Rayfield Road, Rayfield, Jos South', 'Rayfield', 9.8756, 8.9012,
  '+2348039876543', '+2348039876543',
  ARRAY['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'],
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
  ARRAY['Lake View','Restaurant','Wi-Fi','Parking','Picnic Area','Boat Rides'],
  ARRAY['Catering','Event Hosting','Nature Tours'],
  'mid',
  'active', true, false, true, false,
  4.3, 52, 890, 98
),

-- Restaurants
(
  'plateau-kitchen-jos',
  'Plateau Kitchen',
  'Authentic Plateau Cuisine — Taste the Highlands',
  'Experience the rich flavours of Plateau State cuisine at the heart of Jos. We serve traditional dishes like Miyan Kuka, Kilishi, Zobo, and the famous Jos Noodles. Our open-air restaurant captures the cool Jos breeze while you enjoy homemade meals prepared with fresh local ingredients sourced from Plateau farms.',
  'restaurants-food', 'local-cuisine',
  'No. 14 Ahmadu Bello Way, Terminus, Jos', 'Terminus', 9.9281, 8.8936,
  '+2348055443322', '+2348055443322',
  ARRAY['https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800','https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800'],
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
  ARRAY['Outdoor Seating','Wi-Fi','Takeaway','Family Friendly'],
  ARRAY['Dine-In','Takeaway','Catering','Event Meals'],
  'budget',
  'active', true, true, true, false,
  4.7, 143, 2100, 234
),

-- Lounges
(
  'the-hub-lounge-jos',
  'The Hub Lounge',
  'Jos''s Coolest Hangout Spot',
  'The Hub is more than a lounge — it''s an experience. Enjoy crafted cocktails, premium shisha, live music on weekends, and the best views in Farin Gada. Our rooftop terrace is the perfect spot to unwind after a long week. Happy hour 4–7pm daily.',
  'lounges-nightlife', 'lounges',
  'Plot 7, Ring Road, Farin Gada, Jos', 'Farin Gada', 9.9380, 8.8760,
  '+2348099887766', '+2348099887766',
  ARRAY['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800'],
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
  ARRAY['Rooftop Terrace','Shisha','Bar','Wi-Fi','Live Music','Parking'],
  ARRAY['Hookah Service','Cocktails','Event Hosting','VIP Tables'],
  'premium',
  'active', false, false, true, true,
  4.4, 78, 1560, 187
),

-- Shortlets
(
  'plateau-heights-shortlet-jos',
  'Plateau Heights Shortlet',
  'Modern Furnished Apartments for Short Stays',
  'Experience the comfort of home with the luxury of a hotel. Plateau Heights offers beautifully furnished 1, 2, and 3-bedroom apartments in the serene GRA area of Jos. All apartments come with 24/7 power supply, high-speed internet, fully equipped kitchen, and complimentary toiletries.',
  'shortlets-apartments', 'shortlets',
  'No. 22 Jos Road, GRA, Jos North', 'GRA', 9.9050, 8.8950,
  '+2348088776655', '+2348088776655',
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  ARRAY['24/7 Power','Wi-Fi','Fully Furnished','Kitchen','Parking','Security'],
  ARRAY['1-Bedroom','2-Bedroom','3-Bedroom','Airport Pickup'],
  'mid',
  'active', true, true, true, true,
  4.6, 44, 760, 103
),

-- Phone Stores
(
  'techzone-phones-jos',
  'TechZone Phones & Gadgets',
  'Latest Phones, Best Prices in Jos',
  'Jos''s most trusted phone and gadget store. We stock the latest iPhones, Samsung Galaxy, Tecno, Infinix and more. All phones come with warranty. We also offer professional phone repair services, screen replacement, and accessories.',
  'phones-gadgets', 'phone-stores',
  'Shop 12, Mall Road Plaza, Zaria Road, Jos', 'Zaria Road', 9.9450, 8.8800,
  '+2348033221100', '+2348033221100',
  ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'],
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
  ARRAY['AC','Wide Selection','Warranty on All Products'],
  ARRAY['Phone Sales','Phone Repair','Screen Replacement','Accessories'],
  'mid',
  'active', true, true, false, false,
  4.1, 34, 430, 29
),

-- Beauty
(
  'glow-beauty-studio-jos',
  'Glow Beauty Studio',
  'Transform. Glow. Slay.',
  'Jos''s top-rated beauty studio offering professional hair styling, makeup, braiding, locs, and skincare treatments. Our team of experienced stylists are trained in the latest techniques. Whether it''s for a special occasion or your everyday look, we''ve got you covered.',
  'beauty-wellness', 'hair-salons',
  'Suite 4, Crystal Mall, Tudun Wada, Jos', 'Tudun Wada', 9.9200, 8.9100,
  '+2348044332211', '+2348044332211',
  ARRAY['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'],
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
  ARRAY['AC','Wi-Fi','Waiting Area','Refreshments'],
  ARRAY['Hair Styling','Braiding','Makeup','Skincare','Nails'],
  'mid',
  'active', true, false, true, false,
  4.8, 112, 1890, 245
),

-- Fashion
(
  'afrique-boutique-jos',
  'Afrique Boutique',
  'Where African Fashion Meets Modern Style',
  'Afrique Boutique is Jos''s premier destination for Ankara fashion, Aso-Oke, and modern African-inspired clothing. We offer ready-to-wear pieces and bespoke tailoring services. Our in-house designers can create custom outfits for weddings, parties, and corporate events.',
  'fashion-clothing', 'boutiques',
  'No. 8 Ahmadu Bello Way, Terminus, Jos', 'Terminus', 9.9260, 8.8940,
  '+2348066554433', '+2348066554433',
  ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'],
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
  ARRAY['Fitting Room','AC','Custom Tailoring'],
  ARRAY['Ready-to-Wear','Custom Designs','Alterations','Bridal Fashion'],
  'mid',
  'active', false, false, false, false,
  4.6, 29, 320, 67
)

ON CONFLICT (slug) DO NOTHING;
