import { Timestamp } from 'firebase/firestore';

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
  createdAt: Timestamp;
  updatedAt: Timestamp;
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

// ─── Listing Types ────────────────────────────────────────────────────────────

export type ListingStatus = 'draft' | 'pending' | 'active' | 'rejected' | 'suspended';

export interface OpeningHours {
  monday:    DayHours;
  tuesday:   DayHours;
  wednesday: DayHours;
  thursday:  DayHours;
  friday:    DayHours;
  saturday:  DayHours;
  sunday:    DayHours;
}

export interface DayHours {
  open:   boolean;
  from:   string; // "09:00"
  to:     string; // "22:00"
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Listing {
  id: string;
  slug: string;
  businessName: string;
  tagline?: string;
  description: string;
  categorySlug: string;
  subcategorySlug?: string;
  address: string;
  area: JosArea | string;
  coordinates?: GeoPoint;
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  images: string[];
  coverImage: string;
  openingHours?: Partial<OpeningHours>;
  amenities: string[];
  services: string[];
  priceRange?: 'budget' | 'mid' | 'premium' | 'luxury';
  // Status flags
  status: ListingStatus;
  verified: boolean;
  claimed: boolean;
  featured: boolean;
  sponsored: boolean;
  // Stats
  ratingAverage: number;
  reviewCount: number;
  viewCount: number;
  saveCount: number;
  // Ownership
  createdBy: string;
  claimedBy?: string;
  ownerId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Review Types ─────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  listingId: string;
  authorId: string;
  authorName: string;
  rating: number;       // 1-5
  title?: string;
  body: string;
  images?: string[];
  helpful: number;
  reported: boolean;
  reportCount: number;
  status: 'active' | 'hidden' | 'deleted';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // owner reply
  ownerReply?: {
    body: string;
    repliedAt: Timestamp;
  };
}

// ─── Business Claim Types ─────────────────────────────────────────────────────

export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export interface BusinessClaim {
  id: string;
  listingId: string;
  listingName: string;
  userId: string;
  userEmail: string;
  userName: string;
  phone: string;
  position: string; // "Owner", "Manager", etc.
  proofDocuments: string[]; // Firebase Storage URLs
  message: string;
  status: ClaimStatus;
  reviewedBy?: string;
  reviewedAt?: Timestamp;
  rejectionReason?: string;
  createdAt: Timestamp;
}

// ─── Ad Types ─────────────────────────────────────────────────────────────────

export type AdPlacement = 'homepage_banner' | 'sidebar' | 'listing_page' | 'search_results' | 'category_page';
export type AdStatus = 'draft' | 'active' | 'paused' | 'expired';

export interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  listingId?: string;
  placement: AdPlacement[];
  status: AdStatus;
  budget?: number;
  impressions: number;
  clicks: number;
  startDate: Timestamp;
  endDate: Timestamp;
  createdBy: string;
  createdAt: Timestamp;
}

// ─── Favorite Types ───────────────────────────────────────────────────────────

export interface Favorite {
  id: string;
  userId: string;
  listingId: string;
  listingName: string;
  listingSlug: string;
  coverImage?: string;
  createdAt: Timestamp;
}

// ─── Report Types ─────────────────────────────────────────────────────────────

export type ReportTarget = 'listing' | 'review';
export type ReportReason = 'inappropriate' | 'spam' | 'incorrect_info' | 'closed' | 'duplicate' | 'other';

export interface Report {
  id: string;
  targetType: ReportTarget;
  targetId: string;
  reportedBy: string;
  reason: ReportReason;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Timestamp;
}

// ─── Notification Types ───────────────────────────────────────────────────────

export type NotificationType = 
  | 'claim_approved'
  | 'claim_rejected'
  | 'listing_approved'
  | 'listing_rejected'
  | 'new_review'
  | 'review_reply'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Timestamp;
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

export interface SearchResult {
  listings: Listing[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
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

// ─── Analytics Types ──────────────────────────────────────────────────────────

export interface ListingAnalytics {
  views: number;
  saves: number;
  whatsappClicks: number;
  phoneClicks: number;
  reviewCount: number;
  ratingAverage: number;
  viewsByDay: Record<string, number>;
}
