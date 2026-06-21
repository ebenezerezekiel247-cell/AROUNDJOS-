import type { Category } from '@/types';

// ─── Static Categories (can be moved to Firestore later) ──────────────────────

export const CATEGORIES: Category[] = [
  {
    id:          'hotels-lodges',
    name:        'Hotels & Lodges',
    slug:        'hotels-lodges',
    description: 'Find the best hotels, guesthouses, and lodges in Jos',
    icon:        '🏨',
    color:       '#FF7D0A',
    featured:    true,
    order:       1,
    subcategories: [
      { id: 's1', name: 'Hotels',      slug: 'hotels',      categorySlug: 'hotels-lodges' },
      { id: 's2', name: 'Guesthouses', slug: 'guesthouses', categorySlug: 'hotels-lodges' },
      { id: 's3', name: 'Lodges',      slug: 'lodges',      categorySlug: 'hotels-lodges' },
      { id: 's4', name: 'Motels',      slug: 'motels',      categorySlug: 'hotels-lodges' },
    ],
  },
  {
    id:          'restaurants-food',
    name:        'Restaurants & Food',
    slug:        'restaurants-food',
    description: 'Explore local cuisine, fast food, and fine dining',
    icon:        '🍽️',
    color:       '#EF4444',
    featured:    true,
    order:       2,
    subcategories: [
      { id: 's5',  name: 'Local Cuisine',  slug: 'local-cuisine',  categorySlug: 'restaurants-food' },
      { id: 's6',  name: 'Fast Food',      slug: 'fast-food',      categorySlug: 'restaurants-food' },
      { id: 's7',  name: 'Bakeries',       slug: 'bakeries',       categorySlug: 'restaurants-food' },
      { id: 's8',  name: 'Suya Spots',     slug: 'suya-spots',     categorySlug: 'restaurants-food' },
      { id: 's9',  name: 'Chinese Food',   slug: 'chinese-food',   categorySlug: 'restaurants-food' },
    ],
  },
  {
    id:          'lounges-nightlife',
    name:        'Lounges & Nightlife',
    slug:        'lounges-nightlife',
    description: 'Relaxation spots, clubs, and entertainment venues',
    icon:        '🍸',
    color:       '#8B5CF6',
    featured:    true,
    order:       3,
    subcategories: [
      { id: 's10', name: 'Lounges',    slug: 'lounges',    categorySlug: 'lounges-nightlife' },
      { id: 's11', name: 'Night Clubs',slug: 'nightclubs', categorySlug: 'lounges-nightlife' },
      { id: 's12', name: 'Bars',       slug: 'bars',       categorySlug: 'lounges-nightlife' },
      { id: 's13', name: 'Resorts',    slug: 'resorts',    categorySlug: 'lounges-nightlife' },
    ],
  },
  {
    id:          'shortlets-apartments',
    name:        'Shortlets & Apartments',
    slug:        'shortlets-apartments',
    description: 'Short-term rentals and furnished apartments',
    icon:        '🏠',
    color:       '#10B981',
    featured:    true,
    order:       4,
    subcategories: [
      { id: 's14', name: 'Shortlets',       slug: 'shortlets',        categorySlug: 'shortlets-apartments' },
      { id: 's15', name: 'Service Apts',    slug: 'serviced-apts',    categorySlug: 'shortlets-apartments' },
      { id: 's16', name: 'Furnished Rooms', slug: 'furnished-rooms',  categorySlug: 'shortlets-apartments' },
    ],
  },
  {
    id:          'phones-gadgets',
    name:        'Phones & Gadgets',
    slug:        'phones-gadgets',
    description: 'Phone stores, repair shops, and gadget dealers',
    icon:        '📱',
    color:       '#3B82F6',
    featured:    true,
    order:       5,
    subcategories: [
      { id: 's17', name: 'Phone Stores',  slug: 'phone-stores',  categorySlug: 'phones-gadgets' },
      { id: 's18', name: 'Repair Shops',  slug: 'repair-shops',  categorySlug: 'phones-gadgets' },
      { id: 's19', name: 'Accessories',   slug: 'accessories',   categorySlug: 'phones-gadgets' },
      { id: 's20', name: 'Gadget Shops',  slug: 'gadget-shops',  categorySlug: 'phones-gadgets' },
    ],
  },
  {
    id:          'fashion-clothing',
    name:        'Fashion & Clothing',
    slug:        'fashion-clothing',
    description: 'Boutiques, tailors, and fashion stores',
    icon:        '👗',
    color:       '#F59E0B',
    featured:    true,
    order:       6,
    subcategories: [
      { id: 's21', name: 'Boutiques',     slug: 'boutiques',     categorySlug: 'fashion-clothing' },
      { id: 's22', name: 'Tailors',       slug: 'tailors',       categorySlug: 'fashion-clothing' },
      { id: 's23', name: 'Thrift Stores', slug: 'thrift-stores', categorySlug: 'fashion-clothing' },
      { id: 's24', name: 'Shoe Stores',   slug: 'shoe-stores',   categorySlug: 'fashion-clothing' },
    ],
  },
  {
    id:          'beauty-wellness',
    name:        'Beauty & Wellness',
    slug:        'beauty-wellness',
    description: 'Salons, spas, barbershops, and gyms',
    icon:        '💇',
    color:       '#EC4899',
    featured:    true,
    order:       7,
    subcategories: [
      { id: 's25', name: 'Hair Salons',  slug: 'hair-salons',  categorySlug: 'beauty-wellness' },
      { id: 's26', name: 'Barbershops',  slug: 'barbershops',  categorySlug: 'beauty-wellness' },
      { id: 's27', name: 'Spas',         slug: 'spas',         categorySlug: 'beauty-wellness' },
      { id: 's28', name: 'Gyms',         slug: 'gyms',         categorySlug: 'beauty-wellness' },
      { id: 's29', name: 'Nail Studios', slug: 'nail-studios', categorySlug: 'beauty-wellness' },
    ],
  },
  {
    id:          'health-medical',
    name:        'Health & Medical',
    slug:        'health-medical',
    description: 'Hospitals, clinics, pharmacies, and labs',
    icon:        '🏥',
    color:       '#14B8A6',
    featured:    false,
    order:       8,
    subcategories: [
      { id: 's30', name: 'Hospitals',    slug: 'hospitals',    categorySlug: 'health-medical' },
      { id: 's31', name: 'Clinics',      slug: 'clinics',      categorySlug: 'health-medical' },
      { id: 's32', name: 'Pharmacies',   slug: 'pharmacies',   categorySlug: 'health-medical' },
      { id: 's33', name: 'Labs',         slug: 'labs',         categorySlug: 'health-medical' },
    ],
  },
  {
    id:          'automotive',
    name:        'Automotive',
    slug:        'automotive',
    description: 'Mechanics, spare parts, and auto services',
    icon:        '🚗',
    color:       '#64748B',
    featured:    false,
    order:       9,
    subcategories: [
      { id: 's34', name: 'Mechanics',   slug: 'mechanics',   categorySlug: 'automotive' },
      { id: 's35', name: 'Spare Parts', slug: 'spare-parts', categorySlug: 'automotive' },
      { id: 's36', name: 'Car Wash',    slug: 'car-wash',    categorySlug: 'automotive' },
      { id: 's37', name: 'Tyre Shops',  slug: 'tyre-shops',  categorySlug: 'automotive' },
    ],
  },
  {
    id:          'events-tourism',
    name:        'Events & Tourism',
    slug:        'events-tourism',
    description: 'Event centers, photographers, and tourist attractions',
    icon:        '📸',
    color:       '#F97316',
    featured:    false,
    order:       10,
    subcategories: [
      { id: 's38', name: 'Event Centers',     slug: 'event-centers',     categorySlug: 'events-tourism' },
      { id: 's39', name: 'Photographers',     slug: 'photographers',     categorySlug: 'events-tourism' },
      { id: 's40', name: 'Tourist Spots',     slug: 'tourist-spots',     categorySlug: 'events-tourism' },
      { id: 's41', name: 'Catering Services', slug: 'catering-services', categorySlug: 'events-tourism' },
    ],
  },
  {
    id:          'local-services',
    name:        'Local Services',
    slug:        'local-services',
    description: 'Plumbers, electricians, lawyers, and more',
    icon:        '🔧',
    color:       '#6B7280',
    featured:    false,
    order:       11,
    subcategories: [
      { id: 's42', name: 'Electricians', slug: 'electricians', categorySlug: 'local-services' },
      { id: 's43', name: 'Plumbers',     slug: 'plumbers',     categorySlug: 'local-services' },
      { id: 's44', name: 'Lawyers',      slug: 'lawyers',      categorySlug: 'local-services' },
      { id: 's45', name: 'Printing',     slug: 'printing',     categorySlug: 'local-services' },
    ],
  },
];

export const FEATURED_CATEGORIES = CATEGORIES.filter((c) => c.featured);

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getSubcategoryBySlug(categorySlug: string, subcategorySlug: string) {
  const cat = getCategoryBySlug(categorySlug);
  return cat?.subcategories.find((s) => s.slug === subcategorySlug);
}
