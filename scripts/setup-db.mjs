import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL     = 'https://wgwkpojlfhiuivdvrvcm.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indnd2twb2psZmhpdWl2ZHZydmNtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTgxMjUwMiwiZXhwIjoyMDk3Mzg4NTAyfQ.wkchcN4SZ9JzVecMC0HQmFYsBaeMh_074bN_Ob4Jsbg';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const CATEGORIES = [
  { id:'hotels-lodges',        name:'Hotels & Lodges',        slug:'hotels-lodges',        description:'Hotels, guesthouses and lodges in Jos', icon:'🏨', color:'#FF7D0A', featured:true,  order_num:1 },
  { id:'restaurants-food',     name:'Restaurants & Food',     slug:'restaurants-food',     description:'Local cuisine, fast food and fine dining', icon:'🍽️', color:'#EF4444', featured:true,  order_num:2 },
  { id:'lounges-nightlife',    name:'Lounges & Nightlife',    slug:'lounges-nightlife',    description:'Relaxation spots, clubs and entertainment', icon:'🍸', color:'#8B5CF6', featured:true,  order_num:3 },
  { id:'shortlets-apartments', name:'Shortlets & Apartments', slug:'shortlets-apartments', description:'Short-term rentals and furnished apartments', icon:'🏠', color:'#10B981', featured:true,  order_num:4 },
  { id:'phones-gadgets',       name:'Phones & Gadgets',       slug:'phones-gadgets',       description:'Phone stores, repair shops and gadget dealers', icon:'📱', color:'#3B82F6', featured:true,  order_num:5 },
  { id:'fashion-clothing',     name:'Fashion & Clothing',     slug:'fashion-clothing',     description:'Boutiques, tailors and fashion stores', icon:'👗', color:'#F59E0B', featured:true,  order_num:6 },
  { id:'beauty-wellness',      name:'Beauty & Wellness',      slug:'beauty-wellness',      description:'Salons, spas, barbershops and gyms', icon:'💇', color:'#EC4899', featured:true,  order_num:7 },
  { id:'health-medical',       name:'Health & Medical',       slug:'health-medical',       description:'Hospitals, clinics, pharmacies and labs', icon:'🏥', color:'#14B8A6', featured:false, order_num:8 },
  { id:'automotive',           name:'Automotive',             slug:'automotive',           description:'Mechanics, spare parts and auto services', icon:'🚗', color:'#64748B', featured:false, order_num:9 },
  { id:'events-tourism',       name:'Events & Tourism',       slug:'events-tourism',       description:'Event centers, photographers and tourist spots', icon:'📸', color:'#F97316', featured:false, order_num:10 },
  { id:'local-services',       name:'Local Services',         slug:'local-services',       description:'Plumbers, electricians, lawyers and more', icon:'🔧', color:'#6B7280', featured:false, order_num:11 },
];

const LISTINGS = [
  { slug:'hill-station-hotel-jos', business_name:'Hill Station Hotel', tagline:"Jos's Iconic Colonial-Era Luxury Hotel", description:'The legendary Hill Station Hotel, perched atop the Jos Plateau, offers breathtaking views of the city. Built during the colonial era, it blends heritage charm with modern comfort. Features include a swimming pool, tennis courts, a restaurant serving continental and Nigerian cuisine.', category_slug:'hotels-lodges', address:'Hill Station Hotel Road, GRA, Jos', area:'GRA', lat:9.9085, lng:8.8921, phone:'+2348031234567', whatsapp:'+2348031234567', images:['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'], cover_image:'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', amenities:['Swimming Pool','Tennis Court','Restaurant','Bar','Wi-Fi','Parking'], services:['Room Service','Airport Pickup','Event Hosting'], price_range:'premium', status:'active', verified:true, claimed:true, featured:true, sponsored:true, rating_average:4.5, review_count:87, view_count:1240, save_count:156 },
  { slug:'rayfield-resort-jos', business_name:'Rayfield Resort', tagline:'Serene Lakeside Retreat on the Plateau', description:'Nestled on the shores of Rayfield Lake, this resort offers a unique blend of natural beauty and modern amenities. Perfect for weekend getaways and corporate retreats.', category_slug:'hotels-lodges', address:'Rayfield Road, Rayfield, Jos South', area:'Rayfield', lat:9.8756, lng:8.9012, phone:'+2348039876543', whatsapp:'+2348039876543', images:['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'], cover_image:'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', amenities:['Lake View','Restaurant','Wi-Fi','Parking','Boat Rides'], services:['Catering','Event Hosting','Nature Tours'], price_range:'mid', status:'active', verified:true, claimed:false, featured:true, sponsored:false, rating_average:4.3, review_count:52, view_count:890, save_count:98 },
  { slug:'plateau-kitchen-jos', business_name:'Plateau Kitchen', tagline:'Authentic Plateau Cuisine — Taste the Highlands', description:'Experience the rich flavours of Plateau State cuisine at the heart of Jos. We serve traditional dishes like Miyan Kuka, Kilishi, Zobo, and the famous Jos Noodles.', category_slug:'restaurants-food', address:'No. 14 Ahmadu Bello Way, Terminus, Jos', area:'Terminus', lat:9.9281, lng:8.8936, phone:'+2348055443322', whatsapp:'+2348055443322', images:['https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800'], cover_image:'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800', amenities:['Outdoor Seating','Wi-Fi','Takeaway'], services:['Dine-In','Takeaway','Catering'], price_range:'budget', status:'active', verified:true, claimed:true, featured:true, sponsored:false, rating_average:4.7, review_count:143, view_count:2100, save_count:234 },
  { slug:'the-hub-lounge-jos', business_name:'The Hub Lounge', tagline:"Jos's Coolest Hangout Spot", description:"The Hub is more than a lounge — it's an experience. Enjoy crafted cocktails, premium shisha, live music on weekends, and the best views in Farin Gada.", category_slug:'lounges-nightlife', address:'Plot 7, Ring Road, Farin Gada, Jos', area:'Farin Gada', lat:9.9380, lng:8.8760, phone:'+2348099887766', whatsapp:'+2348099887766', images:['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800'], cover_image:'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800', amenities:['Rooftop Terrace','Shisha','Bar','Wi-Fi','Live Music'], services:['Cocktails','Event Hosting','VIP Tables'], price_range:'premium', status:'active', verified:false, claimed:false, featured:true, sponsored:true, rating_average:4.4, review_count:78, view_count:1560, save_count:187 },
  { slug:'plateau-heights-shortlet-jos', business_name:'Plateau Heights Shortlet', tagline:'Modern Furnished Apartments for Short Stays', description:'Beautifully furnished 1, 2, and 3-bedroom apartments in GRA with 24/7 power and high-speed internet.', category_slug:'shortlets-apartments', address:'No. 22 Jos Road, GRA, Jos North', area:'GRA', lat:9.9050, lng:8.8950, phone:'+2348088776655', whatsapp:'+2348088776655', images:['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], cover_image:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', amenities:['24/7 Power','Wi-Fi','Fully Furnished','Kitchen','Parking'], services:['1-Bedroom','2-Bedroom','3-Bedroom'], price_range:'mid', status:'active', verified:true, claimed:true, featured:true, sponsored:true, rating_average:4.6, review_count:44, view_count:760, save_count:103 },
  { slug:'glow-beauty-studio-jos', business_name:'Glow Beauty Studio', tagline:'Transform. Glow. Slay.', description:"Jos's top-rated beauty studio offering professional hair styling, makeup, braiding, locs, and skincare treatments.", category_slug:'beauty-wellness', address:'Suite 4, Crystal Mall, Tudun Wada, Jos', area:'Tudun Wada', lat:9.9200, lng:8.9100, phone:'+2348044332211', whatsapp:'+2348044332211', images:['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'], cover_image:'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800', amenities:['AC','Wi-Fi','Waiting Area'], services:['Hair Styling','Braiding','Makeup','Nails'], price_range:'mid', status:'active', verified:true, claimed:false, featured:true, sponsored:false, rating_average:4.8, review_count:112, view_count:1890, save_count:245 },
  { slug:'techzone-phones-jos', business_name:'TechZone Phones & Gadgets', tagline:'Latest Phones, Best Prices in Jos', description:"Jos's most trusted phone and gadget store with iPhones, Samsung, Tecno, Infinix and warranty on all phones.", category_slug:'phones-gadgets', address:'Shop 12, Mall Road Plaza, Zaria Road, Jos', area:'Zaria Road', lat:9.9450, lng:8.8800, phone:'+2348033221100', whatsapp:'+2348033221100', images:['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'], cover_image:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', amenities:['AC','Wide Selection','Warranty'], services:['Phone Sales','Phone Repair','Screen Replacement'], price_range:'mid', status:'active', verified:true, claimed:true, featured:false, sponsored:false, rating_average:4.1, review_count:34, view_count:430, save_count:29 },
  { slug:'afrique-boutique-jos', business_name:'Afrique Boutique', tagline:'Where African Fashion Meets Modern Style', description:"Jos's premier destination for Ankara fashion, Aso-Oke, and modern African-inspired clothing.", category_slug:'fashion-clothing', address:'No. 8 Ahmadu Bello Way, Terminus, Jos', area:'Terminus', lat:9.9260, lng:8.8940, phone:'+2348066554433', whatsapp:'+2348066554433', images:['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'], cover_image:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', amenities:['Fitting Room','AC','Custom Tailoring'], services:['Ready-to-Wear','Custom Designs','Bridal Fashion'], price_range:'mid', status:'active', verified:false, claimed:false, featured:false, sponsored:false, rating_average:4.6, review_count:29, view_count:320, save_count:67 },
];

async function main() {
  console.log('\n🚀 AroundJos — Database Seed\n');
  console.log('📡 Project: wgwkpojlfhiuivdvrvcm.supabase.co\n');

  process.stdout.write('📋 Seeding categories… ');
  const { error: ce } = await supabase.from('categories').upsert(CATEGORIES, { onConflict:'slug' });
  if (ce) {
    console.log('❌\n');
    if (ce.code === '42P01') {
      console.log('Tables not found. Run 001_initial_schema.sql in Supabase SQL Editor first.\n');
      console.log('👉 https://supabase.com/dashboard/project/wgwkpojlfhiuivdvrvcm/editor\n');
    } else { console.error(ce.message); }
    process.exit(1);
  }
  console.log(`✅ (${CATEGORIES.length})`);

  process.stdout.write('🏢 Seeding listings… ');
  const { error: le } = await supabase.from('listings').upsert(LISTINGS, { onConflict:'slug' });
  if (le) { console.log('❌\n'); console.error(le.message); process.exit(1); }
  console.log(`✅ (${LISTINGS.length})`);

  console.log('\n✨ Done! Your database is ready.\n');
  console.log('Next → npm run dev → Sign up → Then run:');
  console.log("  UPDATE public.users SET role='admin' WHERE email='YOUR_EMAIL';\n");
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
