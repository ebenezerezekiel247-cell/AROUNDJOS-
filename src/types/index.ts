// ─── User Types ──────────────────────────────────────────────────────────────

export type UserRole = 'visitor' | 'business_owner' | 'moderator' | 'admin';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  phone?: string;
  bio?: string;
  claimedListings: string[];
  favorites: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Category Types ───────────────────────────────────────────────────────────

export type CategorySlug =
  | 'hotels-lodges'
  | 'restaurants-food'
  | 'lounges-nightlife'
  | 'resorts-relaxation'
  | 'shortlets-apartments'
  | 'phones-gadgets'
  | 'fashion-clothing'
  | 'beauty-wellness'
  | 'health-medical'
  | 'automotive'
  | 'events-tourism'
  | 'local-services';

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug | string;
  description: string;
  icon: string;
  color: string;
  subcategories: Subcategory[];
  listingCount?: number;
  coverImage?: string;
  featured: boolean;
  order: number;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  icon?: string;
}

// ─── Jos Areas ────────────────────────────────────────────────────────────────

export type JosArea =
  | 'Bukuru'
  | 'Rayfield'
  | 'Tudun Wada'
  | 'Angwan Rogo'
  | 'GRA'
  | 'Terminus'
  | 'Zaria Road'
  | 'Farin Gada'
  | 'Bauchi Road'
  | 'Dogon Dutse'
  | 'Anglo Jos'
  | 'Laranto'
  | 'Kabong'
  | 'Tafawa Balewa'
  | 'Kwall'
  | 'Gyel'
  | 'Vwang'
  | 'Vom'
  | 'Shen'
  | 'Rantya'
  | 'Zawan'
  | 'Du'
  | 'Bassa'
  | 'Heipang'
  | 'Other';

export const JOS_AREAS: JosArea[] = [
  'Bukuru', 'Rayfield', 'Tudun Wada', 'Angwan Rogo', 'GRA', 'Terminus',
  'Zaria Road', 'Farin Gada', 'Bauchi Road', 'Dogon Dutse', 'Anglo Jos',
  'Laranto', 'Kabong', 'Tafawa Balewa', 'Kwall', 'Gyel', 'Vwang', 'Vom',
  'Shen', 'Rantya', 'Zawan', 'Du', 'Bassa', 'Heipang', 'Other',
];

// ─── Search Types ─────────────────────────────────────────────────────────────

export interface SearchFilters {
  query?: string;
  category?: string;
  area?: string;
  rating?: number;
  priceRange?: string[];
  verified?: boolean;
  featured?: boolean;
  openNow?: boolean;
}

// ─── UI / State Types ─────────────────────────────────────────────────────────

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface ModalState {
  isOpen: boolean;
  type?: string;
  data?: Record<string, unknown>;
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface ListingFormData {
  businessName: string;
  tagline?: string;
  description: string;
  categorySlug: string;
  subcategorySlug?: string;
  address: string;
  area: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  priceRange?: string;
  amenities: string[];
  services: string[];
}

export interface ReviewFormData {
  rating: number;
  title?: string;
  body: string;
}

export interface ClaimFormData {
  phone: string;
  position: string;
  message: string;
}
