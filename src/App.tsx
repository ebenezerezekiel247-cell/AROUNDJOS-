import { useState, useEffect } from "react";
import {
  Search, MapPin, Star, Heart, Phone, MessageCircle,
  Flame, Crown, ArrowRight, Sparkles, Menu, X,
  Sun, Moon, LogIn, Building2, UtensilsCrossed, Wine,
  Home, Smartphone, ShoppingBag, HeartPulse, Car, Camera,
  Wrench, CheckCircle2, Eye, EyeOff, Mail, Lock, User,
  ArrowLeft, Upload, Plus, Globe, ChevronRight,
  Megaphone, TrendingUp, Users, BarChart3, Check,
  LogOut, LayoutDashboard
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Page = "home" | "auth" | "add-listing" | "advertise" | "search";
type AuthMode = "signin" | "signup" | "reset";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "hotels-lodges",        name: "Hotels & Lodges",     icon: Building2,       color: "#FF7D0A" },
  { id: "restaurants-food",     name: "Restaurants & Food",  icon: UtensilsCrossed, color: "#EF4444" },
  { id: "lounges-nightlife",    name: "Lounges & Nightlife", icon: Wine,            color: "#8B5CF6" },
  { id: "shortlets-apartments", name: "Shortlets",           icon: Home,            color: "#10B981" },
  { id: "phones-gadgets",       name: "Phones & Gadgets",    icon: Smartphone,      color: "#3B82F6" },
  { id: "fashion-clothing",     name: "Fashion & Clothing",  icon: ShoppingBag,     color: "#F59E0B" },
  { id: "beauty-wellness",      name: "Beauty & Wellness",   icon: Sparkles,        color: "#EC4899" },
  { id: "health-medical",       name: "Health & Medical",    icon: HeartPulse,      color: "#14B8A6" },
  { id: "automotive",           name: "Automotive",          icon: Car,             color: "#64748B" },
  { id: "events-tourism",       name: "Events & Tourism",    icon: Camera,          color: "#F97316" },
  { id: "local-services",       name: "Local Services",      icon: Wrench,          color: "#6B7280" },
];

const JOS_AREAS = [
  "GRA", "Terminus", "Rayfield", "Bukuru", "Farin Gada",
  "Anglo Jos", "Laranto", "Tudun Wada", "Nassarawa", "Hwolshe",
  "Dogon Dutse", "Kabong", "Jenta", "Angwan Rukuba", "Bauchi Road",
];

const AREAS = [
  { name: "GRA",          count: 47, image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80" },
  { name: "Terminus",     count: 83, image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80" },
  { name: "Rayfield",     count: 29, image: "https://images.unsplash.com/photo-1475688621402-4257c812d6db?w=400&q=80" },
  { name: "Bukuru",       count: 38, image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=400&q=80" },
  { name: "Farin Gada",   count: 54, image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80" },
  { name: "Anglo Jos",    count: 22, image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&q=80" },
  { name: "Laranto",      count: 31, image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&q=80" },
  { name: "Tudun Wada",   count: 19, image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&q=80" },
];

const FEATURED_LISTINGS = [
  { id: "1", businessName: "Hill Station Hotel", area: "GRA", slug: "hill-station-hotel", coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", ratingAverage: 4.5, reviewCount: 87, verified: true, featured: true, sponsored: true, priceRange: "premium", whatsapp: "+2348031234567", phone: "+2348031234567" },
  { id: "2", businessName: "Rayfield Resort", area: "Rayfield", slug: "rayfield-resort", coverImage: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80", ratingAverage: 4.3, reviewCount: 52, verified: true, featured: true, sponsored: false, priceRange: "mid", whatsapp: "+2348039876543", phone: "+2348039876543" },
  { id: "3", businessName: "Skyline Lounge", area: "Terminus", slug: "skyline-lounge", coverImage: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80", ratingAverage: 4.6, reviewCount: 134, verified: true, featured: true, sponsored: false, priceRange: "mid", whatsapp: "+2348051234567", phone: null },
  { id: "4", businessName: "The Plateau Kitchen", area: "GRA", slug: "plateau-kitchen", coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", ratingAverage: 4.7, reviewCount: 203, verified: true, featured: false, sponsored: false, priceRange: "budget", whatsapp: "+2348061234567", phone: "+2348061234567" },
  { id: "5", businessName: "Arewa Suites", area: "Anglo Jos", slug: "arewa-suites", coverImage: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80", ratingAverage: 3.9, reviewCount: 28, verified: false, featured: false, sponsored: false, priceRange: "budget", whatsapp: null, phone: "+2348071234567" },
  { id: "6", businessName: "Josiah's Barbershop", area: "Farin Gada", slug: "josiahs-barbershop", coverImage: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80", ratingAverage: 4.8, reviewCount: 312, verified: true, featured: false, sponsored: false, priceRange: "budget", whatsapp: "+2348081234567", phone: "+2348081234567" },
  { id: "7", businessName: "TechHub Jos", area: "Terminus", slug: "techhub-jos", coverImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80", ratingAverage: 4.2, reviewCount: 67, verified: true, featured: false, sponsored: false, priceRange: "mid", whatsapp: "+2348091234567", phone: null },
  { id: "8", businessName: "Plateau Spa & Wellness", area: "GRA", slug: "plateau-spa", coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80", ratingAverage: 4.4, reviewCount: 89, verified: true, featured: false, sponsored: false, priceRange: "mid", whatsapp: "+2348001234567", phone: "+2348001234567" },
];

const TRENDING_LISTINGS = [
  { id: "t1", businessName: "Noodles & More", area: "Terminus", slug: "noodles-more", coverImage: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80", ratingAverage: 4.5, reviewCount: 178, verified: true, featured: false, sponsored: false, priceRange: "budget", whatsapp: "+2348021234567", phone: "+2348021234567" },
  { id: "t2", businessName: "Bukuru Suya Spot", area: "Bukuru", slug: "bukuru-suya", coverImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80", ratingAverage: 4.9, reviewCount: 421, verified: true, featured: false, sponsored: false, priceRange: "budget", whatsapp: "+2348031234568", phone: null },
  { id: "t3", businessName: "Plateau Mall Fashion", area: "Terminus", slug: "plateau-fashion", coverImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80", ratingAverage: 4.0, reviewCount: 55, verified: false, featured: false, sponsored: false, priceRange: "mid", whatsapp: null, phone: "+2348041234567" },
];

const RECENT_LISTINGS = [
  { id: "r1", businessName: "Jos Rooftop Grill", area: "GRA", slug: "jos-rooftop-grill", coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", ratingAverage: 4.6, reviewCount: 12, verified: false, featured: false, sponsored: false, priceRange: "mid", whatsapp: "+2348011111111", phone: "+2348011111111" },
  { id: "r2", businessName: "Laranto Guest House", area: "Laranto", slug: "laranto-guesthouse", coverImage: "https://images.unsplash.com/photo-1551882547-ff40c4a49f8e?w=600&q=80", ratingAverage: 3.8, reviewCount: 6, verified: false, featured: false, sponsored: false, priceRange: "budget", whatsapp: "+2348022222222", phone: null },
  { id: "r3", businessName: "Kabong Pharmacy", area: "Kabong", slug: "kabong-pharmacy", coverImage: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&q=80", ratingAverage: 4.1, reviewCount: 9, verified: true, featured: false, sponsored: false, priceRange: "budget", whatsapp: null, phone: "+2348033333333" },
  { id: "r4", businessName: "Style Hub Boutique", area: "Farin Gada", slug: "style-hub", coverImage: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80", ratingAverage: 4.3, reviewCount: 18, verified: true, featured: false, sponsored: false, priceRange: "mid", whatsapp: "+2348044444444", phone: "+2348044444444" },
];

const AD_PACKAGES = [
  { id: "basic", name: "Basic Listing", price: "Free", period: "", color: "#6B7280", features: ["Business profile page", "WhatsApp & phone contact", "Category listing", "Customer reviews", "Basic analytics"], popular: false },
  { id: "featured", name: "Featured", price: "₦15,000", period: "/month", color: "#ff7d0a", features: ["Everything in Basic", "Featured badge on listing", "Priority in search results", "Homepage placement", "Advanced analytics", "Push to top weekly"], popular: true },
  { id: "sponsored", name: "Sponsored", price: "₦35,000", period: "/month", color: "#8B5CF6", features: ["Everything in Featured", "Sponsored badge", "Homepage banner slot", "Category page top spot", "Social media mention", "Dedicated account manager", "Monthly performance report"], popular: false },
];

// ─── Utils ────────────────────────────────────────────────────────────────────

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function getPriceSymbol(range: string) {
  if (range === "budget")  return "₦";
  if (range === "mid")     return "₦₦";
  if (range === "premium") return "₦₦₦";
  if (range === "luxury")  return "₦₦₦₦";
  return "";
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error" | "info"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, []);
  const bg = type === "success" ? "#23a155" : type === "error" ? "#ef4444" : "#3b82f6";
  return (
    <div className="fixed top-20 right-4 z-[200] animate-slide-up" style={{ maxWidth: 340 }}>
      <div className="flex items-center gap-3 text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-xl" style={{ background: bg }}>
        <span>{msg}</span>
        <button onClick={onClose} className="opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn(sz, i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300 fill-gray-300")} />
      ))}
    </div>
  );
}

// ─── Verified Badge ───────────────────────────────────────────────────────────

function VerifiedBadge() {
  return <span title="Verified"><CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#ff7d0a" }} /></span>;
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="font-black text-xl" style={{ fontFamily: "'Syne', sans-serif", color: "#3d3d3d" }}>{title}</h2>
        {subtitle && <p className="text-sm mt-0.5" style={{ color: "#9a9a9a" }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Listing Card ─────────────────────────────────────────────────────────────

interface ListingItem {
  id: string; businessName: string; area: string; slug: string;
  coverImage: string; ratingAverage: number; reviewCount: number;
  verified: boolean; featured: boolean; sponsored: boolean;
  priceRange: string; whatsapp: string | null; phone: string | null;
}

function ListingCard({ listing, navigate }: { listing: ListingItem; navigate: (p: Page) => void }) {
  const [fav, setFav] = useState(false);
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 cursor-pointer" style={{ borderColor: "#f0f0f0" }}>
      <div className="relative overflow-hidden aspect-[4/3]" onClick={() => navigate("auth")}>
        <img src={listing.coverImage} alt={listing.businessName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {listing.sponsored && <span className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: "#ff7d0a" }}><Crown className="w-2.5 h-2.5" /> Sponsored</span>}
          {listing.featured && !listing.sponsored && <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Flame className="w-2.5 h-2.5" /> Featured</span>}
        </div>
        <button onClick={(e) => { e.stopPropagation(); setFav(!fav); }} className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
          <Heart className={cn("w-4 h-4 transition-colors", fav ? "fill-red-500 text-red-500" : "text-gray-500")} />
        </button>
        {listing.priceRange && <div className="absolute bottom-3 left-3"><span className="bg-black/50 text-white text-xs font-medium px-2 py-0.5 rounded-lg backdrop-blur-sm">{getPriceSymbol(listing.priceRange)}</span></div>}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-sm leading-tight line-clamp-1" style={{ fontFamily: "'Syne', sans-serif", color: "#3d3d3d" }}>{listing.businessName}</h3>
          {listing.verified && <VerifiedBadge />}
        </div>
        <div className="flex items-center gap-1 text-xs mb-2.5" style={{ color: "#9a9a9a" }}>
          <MapPin className="w-3 h-3 flex-shrink-0" /><span className="line-clamp-1">{listing.area} · Jos</span>
        </div>
        {listing.reviewCount > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <StarRating rating={listing.ratingAverage} />
            <span className="text-xs font-semibold" style={{ color: "#6a6a6a" }}>{listing.ratingAverage.toFixed(1)}</span>
            <span className="text-xs" style={{ color: "#b4b4b4" }}>({listing.reviewCount})</span>
          </div>
        )}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: "#f0f0f0" }}>
          {listing.whatsapp && <a href={`https://wa.me/${listing.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold py-2 rounded-xl hover:bg-emerald-100 transition-colors"><MessageCircle className="w-3.5 h-3.5" /> WhatsApp</a>}
          {listing.phone && <a href={`tel:${listing.phone}`} onClick={(e) => e.stopPropagation()} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl transition-colors" style={{ background: "#fff4ec", color: "#ff7d0a" }}><Phone className="w-3.5 h-3.5" /> Call</a>}
        </div>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ page, navigate, dark, toggleDark, user, onSignOut }: {
  page: Page; navigate: (p: Page) => void; dark: boolean; toggleDark: () => void;
  user: { name: string; email: string } | null; onSignOut: () => void;
}) {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [searchOpen, setSearch]   = useState(false);
  const [userMenu, setUserMenu]   = useState(false);
  const [query, setQuery]         = useState("");
  const [scrolled, setScrolled]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMenuOpen(false); setSearch(false); setUserMenu(false); }, [page]);

  const go = (p: Page) => { navigate(p); window.scrollTo(0, 0); };
  const isHome = page === "home";

  const navTextBase = isHome && !scrolled ? "text-white hover:text-white/80" : "text-gray-700 hover:text-gray-900";

  return (
    <>
      <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled || !isHome ? "bg-white border-b shadow-sm" : "bg-transparent")} style={{ borderColor: scrolled || !isHome ? "#f0f0f0" : "transparent" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => go("home")} className="flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: "#ff7d0a" }}>AJ</div>
              <span className={cn("text-lg font-black tracking-tight", isHome && !scrolled ? "text-white" : "text-gray-900")}>
                Around<span style={{ color: "#ff7d0a" }}>Jos</span>
              </span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { label: "Home",         p: "home" as Page },
                { label: "Explore",      p: "search" as Page },
                { label: "Add Business", p: "add-listing" as Page },
                { label: "Advertise",    p: "advertise" as Page },
              ].map(({ label, p }) => (
                <button key={label} onClick={() => go(p)}
                  className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors", page === p ? "bg-orange-50 text-[#ff7d0a]" : cn(navTextBase, "hover:bg-white/10"))}
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-2">
              <button onClick={() => setSearch(!searchOpen)} className={cn("p-2 rounded-xl transition-colors", isHome && !scrolled ? "text-white hover:bg-white/10" : "text-gray-600 hover:bg-gray-100")}>
                <Search className="w-5 h-5" />
              </button>
              <button onClick={toggleDark} className={cn("p-2 rounded-xl transition-colors", isHome && !scrolled ? "text-white hover:bg-white/10" : "text-gray-600 hover:bg-gray-100")}>
                {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user ? (
                <div className="relative">
                  <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-xl text-white text-sm font-bold flex items-center justify-center" style={{ background: "#ff7d0a" }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className={cn("text-sm font-semibold hidden md:block", isHome && !scrolled ? "text-white" : "text-gray-800")}>{user.name.split(" ")[0]}</span>
                  </button>
                  {userMenu && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border shadow-xl py-2 z-50" style={{ borderColor: "#f0f0f0" }}>
                      <div className="px-4 py-2 border-b" style={{ borderColor: "#f0f0f0" }}>
                        <p className="font-semibold text-sm text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <button onClick={() => { go("add-listing"); setUserMenu(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> My Listings
                      </button>
                      <button onClick={() => { onSignOut(); setUserMenu(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => go("auth")} className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(255,125,10,0.35)]" style={{ background: "#ff7d0a" }}>
                  <LogIn className="w-4 h-4" /> Sign In
                </button>
              )}

              <button onClick={() => setMenuOpen(!menuOpen)} className={cn("md:hidden p-2 rounded-xl transition-colors", isHome && !scrolled ? "text-white hover:bg-white/10" : "text-gray-600 hover:bg-gray-100")}>
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3" style={{ borderColor: "#f0f0f0" }}>
            <form onSubmit={(e) => { e.preventDefault(); go("search"); }} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#b4b4b4" }} />
                <input autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search businesses, restaurants, hotels..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2" style={{ borderColor: "#e4e4e4", outlineColor: "#ff7d0a" }} />
              </div>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t bg-white px-4 py-4 space-y-1" style={{ borderColor: "#f0f0f0" }}>
            {[
              { label: "Home",         p: "home" as Page },
              { label: "Explore",      p: "search" as Page },
              { label: "Add Business", p: "add-listing" as Page },
              { label: "Advertise",    p: "advertise" as Page },
            ].map(({ label, p }) => (
              <button key={label} onClick={() => go(p)} className={cn("block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors", page === p ? "text-[#ff7d0a] bg-orange-50" : "text-gray-700 hover:bg-gray-100")}>
                {label}
              </button>
            ))}
            {!user && <button onClick={() => go("auth")} className="w-full mt-2 text-white text-sm font-bold px-4 py-3 rounded-xl" style={{ background: "#ff7d0a" }}>Sign In / Sign Up</button>}
          </div>
        )}
      </header>

      {(userMenu || menuOpen || searchOpen) && <div className="fixed inset-0 z-40" onClick={() => { setUserMenu(false); setMenuOpen(false); setSearch(false); }} />}
    </>
  );
}

// ─── Auth Page ────────────────────────────────────────────────────────────────

function AuthPage({ navigate, onLogin, showToast }: {
  navigate: (p: Page) => void;
  onLogin: (user: { name: string; email: string }) => void;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
}) {
  const [mode, setMode]       = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const [showPass, setShow]   = useState(false);
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (mode === "reset") {
      showToast("Password reset email sent! Check your inbox.", "success");
      setMode("signin");
      return;
    }
    if (mode === "signup") {
      if (!name.trim())       { showToast("Please enter your name.", "error"); return; }
      if (password.length < 6){ showToast("Password must be at least 6 characters.", "error"); return; }
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const displayName = mode === "signup" ? name : email.split("@")[0];
      onLogin({ name: displayName, email });
      showToast(mode === "signup" ? `Welcome to AroundJos, ${displayName}! 🎉` : "Welcome back!", "success");
      navigate("home");
      window.scrollTo(0, 0);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-20 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(255,125,10,0.08)" }} />
      <div className="absolute bottom-20 right-1/4 w-56 h-56 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(218,111,47,0.08)" }} />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={() => navigate("home")} className="inline-flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black" style={{ background: "#ff7d0a" }}>AJ</div>
            <span className="text-2xl font-black text-gray-900">Around<span style={{ color: "#ff7d0a" }}>Jos</span></span>
          </button>
        </div>

        <div className="bg-white rounded-3xl border shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-7" style={{ borderColor: "#f0f0f0" }}>
          <div className="mb-6">
            {mode === "reset" && (
              <button onClick={() => setMode("signin")} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            <h1 className="font-black text-2xl text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
              {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create account" : "Reset password"}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {mode === "signin" ? "Sign in to AroundJos" : mode === "signup" ? "Join AroundJos — it's free" : "We'll send a reset link to your email"}
            </p>
          </div>

          {/* Google SSO */}
          {mode !== "reset" && (
            <>
              <button disabled={loading} className="w-full flex items-center justify-center gap-3 bg-white border-2 text-gray-700 font-semibold py-3 rounded-2xl transition-all text-sm hover:border-orange-300 disabled:opacity-50" style={{ borderColor: "#e4e4e4" }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">or with email</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required className="w-full pl-10 pr-4 py-3 border rounded-2xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white" style={{ borderColor: "#e4e4e4" }} />
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required className="w-full pl-10 pr-4 py-3 border rounded-2xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white" style={{ borderColor: "#e4e4e4" }} />
              </div>
            </div>
            {mode !== "reset" && (
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPass(e.target.value)} placeholder={mode === "signup" ? "Min 6 characters" : "Your password"} required className="w-full pl-10 pr-12 py-3 border rounded-2xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white" style={{ borderColor: "#e4e4e4" }} />
                  <button type="button" onClick={() => setShow(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === "signin" && (
                  <div className="text-right mt-1.5">
                    <button type="button" onClick={() => setMode("reset")} className="text-xs font-medium hover:underline" style={{ color: "#ff7d0a" }}>Forgot password?</button>
                  </div>
                )}
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full text-white font-bold py-3 rounded-2xl transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,125,10,0.35)]" style={{ background: "#ff7d0a" }}>
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Email"}
            </button>
          </form>

          {mode !== "reset" && (
            <p className="text-center text-sm text-gray-400 mt-6">
              {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-bold hover:underline" style={{ color: "#ff7d0a" }}>
                {mode === "signin" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing, you agree to our <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

// ─── Add Listing Page ─────────────────────────────────────────────────────────

const ADD_STEPS = ["Business Info", "Location & Contact", "Details & Media", "Review & Submit"];

function AddListingPage({ navigate, user, showToast }: {
  navigate: (p: Page) => void;
  user: { name: string; email: string } | null;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
}) {
  const [step, setStep]         = useState(0);
  const [submitting, setSubmit] = useState(false);
  const [done, setDone]         = useState(false);
  const [amenity, setAmenity]   = useState("");
  const [service, setService]   = useState("");
  const [form, setForm]         = useState({
    business_name: "", tagline: "", description: "", category_slug: "",
    subcategory_slug: "", address: "", area: "", phone: "", whatsapp: "",
    email: "", website: "", price_range: "mid",
    amenities: [] as string[], services: [] as string[],
  });
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 0) return form.business_name.trim() && form.description.trim() && form.category_slug;
    if (step === 1) return form.address.trim() && form.area && form.phone.trim();
    return true;
  };

  const handleSubmit = () => {
    if (!user) { showToast("Please sign in first to add a listing.", "error"); navigate("auth"); return; }
    setSubmit(true);
    setTimeout(() => { setSubmit(false); setDone(true); }, 1500);
  };

  const addTag = (key: "amenities" | "services", val: string, clear: () => void) => {
    const arr = form[key] as string[];
    if (val.trim() && !arr.includes(val.trim())) set(key, [...arr, val.trim()]);
    clear();
  };
  const removeTag = (key: "amenities" | "services", val: string) => set(key, (form[key] as string[]).filter((x) => x !== val));

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-24">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="font-black text-2xl text-gray-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Sign In Required</h2>
          <p className="text-gray-500 mb-6">You need to be signed in to add a business listing to AroundJos.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => { navigate("auth"); window.scrollTo(0, 0); }} className="text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(255,125,10,0.35)]" style={{ background: "#ff7d0a" }}>
              Sign In / Sign Up — Free
            </button>
            <button onClick={() => navigate("home")} className="text-gray-600 font-semibold px-6 py-3 rounded-2xl border hover:bg-gray-100 transition-all" style={{ borderColor: "#e4e4e4" }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-24">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_4px_20px_rgba(35,161,85,0.3)]" style={{ background: "#23a155" }}>
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          <h2 className="font-black text-2xl text-gray-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Listing Submitted!</h2>
          <p className="text-gray-500 mb-2">
            <strong style={{ color: "#3d3d3d" }}>{form.business_name}</strong> has been submitted for review.
          </p>
          <p className="text-sm text-gray-400 mb-8">Our team will review and approve it within 24–48 hours. You'll receive a confirmation email at <strong>{user.email}</strong>.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => { setDone(false); setStep(0); setForm({ business_name: "", tagline: "", description: "", category_slug: "", subcategory_slug: "", address: "", area: "", phone: "", whatsapp: "", email: "", website: "", price_range: "mid", amenities: [], services: [] }); }} className="text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition-all" style={{ background: "#ff7d0a" }}>
              Add Another Listing
            </button>
            <button onClick={() => navigate("home")} className="text-gray-600 font-semibold px-6 py-3 rounded-2xl border hover:bg-gray-100 transition-all" style={{ borderColor: "#e4e4e4" }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedCat = CATEGORIES.find((c) => c.id === form.category_slug);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <button onClick={() => navigate("home")} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <h1 className="font-black text-3xl text-gray-900 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Add Your Business</h1>
          <p className="text-gray-400 text-sm">List your business on AroundJos for free and reach thousands of customers.</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
          {ADD_STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{ background: i < step ? "#23a155" : i === step ? "#ff7d0a" : "#e4e4e4", color: i <= step ? "white" : "#9a9a9a" }}>
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className="text-xs font-semibold" style={{ color: i === step ? "#ff7d0a" : i < step ? "#23a155" : "#9a9a9a" }}>{s}</span>
              </div>
              {i < ADD_STEPS.length - 1 && <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-300" />}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl border p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)]" style={{ borderColor: "#f0f0f0" }}>

          {/* Step 0: Business Info */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-black text-lg text-gray-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Business Information</h2>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Business Name *</label>
                <input value={form.business_name} onChange={(e) => set("business_name", e.target.value)} placeholder="e.g. Hill Station Hotel" className="w-full px-4 py-3 border rounded-2xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white" style={{ borderColor: "#e4e4e4" }} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Tagline <span className="font-normal text-gray-400">(optional)</span></label>
                <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="e.g. Jos's finest dining experience" className="w-full px-4 py-3 border rounded-2xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white" style={{ borderColor: "#e4e4e4" }} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Category *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const active = form.category_slug === cat.id;
                    return (
                      <button key={cat.id} type="button" onClick={() => set("category_slug", cat.id)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-2xl border text-sm font-semibold transition-all text-left"
                        style={{ borderColor: active ? cat.color : "#e4e4e4", background: active ? `${cat.color}12` : "white", color: active ? cat.color : "#6a6a6a" }}>
                        <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
                        <span className="line-clamp-1 text-xs">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description *</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe your business, what you offer, and what makes you special..." rows={4} className="w-full px-4 py-3 border rounded-2xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white resize-none" style={{ borderColor: "#e4e4e4" }} />
                <p className="text-xs text-gray-400 mt-1">{form.description.length}/500 characters</p>
              </div>
            </div>
          )}

          {/* Step 1: Location & Contact */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-black text-lg text-gray-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Location & Contact</h2>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Area in Jos *</label>
                <select value={form.area} onChange={(e) => set("area", e.target.value)} className="w-full px-4 py-3 border rounded-2xl text-sm bg-gray-50 focus:outline-none appearance-none" style={{ borderColor: "#e4e4e4" }}>
                  <option value="">Select an area...</option>
                  {JOS_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Street Address *</label>
                <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="e.g. 12 Hill Station Road, GRA, Jos" className="w-full px-4 py-3 border rounded-2xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white" style={{ borderColor: "#e4e4e4" }} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+234 800 000 0000" className="w-full pl-10 pr-4 py-3 border rounded-2xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white" style={{ borderColor: "#e4e4e4" }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">WhatsApp Number <span className="font-normal text-gray-400">(optional)</span></label>
                <div className="relative">
                  <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+234 800 000 0000" className="w-full pl-10 pr-4 py-3 border rounded-2xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white" style={{ borderColor: "#e4e4e4" }} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Email <span className="font-normal text-gray-400">(optional)</span></label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="business@email.com" className="w-full pl-10 pr-4 py-3 border rounded-2xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white" style={{ borderColor: "#e4e4e4" }} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Website <span className="font-normal text-gray-400">(optional)</span></label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://yoursite.com" className="w-full pl-10 pr-4 py-3 border rounded-2xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white" style={{ borderColor: "#e4e4e4" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details & Media */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-black text-lg text-gray-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Details & Photos</h2>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Price Range</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[{ v: "budget", l: "₦ Budget" }, { v: "mid", l: "₦₦ Mid" }, { v: "premium", l: "₦₦₦ Premium" }, { v: "luxury", l: "₦₦₦₦ Luxury" }].map(({ v, l }) => (
                    <button key={v} type="button" onClick={() => set("price_range", v)}
                      className="py-2.5 rounded-2xl border text-sm font-semibold transition-all"
                      style={{ borderColor: form.price_range === v ? "#ff7d0a" : "#e4e4e4", background: form.price_range === v ? "#fff4ec" : "white", color: form.price_range === v ? "#ff7d0a" : "#6a6a6a" }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Amenities <span className="font-normal text-gray-400">(e.g. Wi-Fi, Parking, AC)</span></label>
                <div className="flex gap-2 mb-2">
                  <input value={amenity} onChange={(e) => setAmenity(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("amenities", amenity, () => setAmenity("")); } }} placeholder="Type and press Enter" className="flex-1 px-4 py-2.5 border rounded-2xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white" style={{ borderColor: "#e4e4e4" }} />
                  <button type="button" onClick={() => addTag("amenities", amenity, () => setAmenity(""))} className="px-4 py-2.5 rounded-2xl text-sm font-bold text-white" style={{ background: "#ff7d0a" }}><Plus className="w-4 h-4" /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(form.amenities as string[]).map((a) => (
                    <span key={a} className="flex items-center gap-1.5 bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                      {a}<button type="button" onClick={() => removeTag("amenities", a)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Services <span className="font-normal text-gray-400">(e.g. Delivery, Catering)</span></label>
                <div className="flex gap-2 mb-2">
                  <input value={service} onChange={(e) => setService(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("services", service, () => setService("")); } }} placeholder="Type and press Enter" className="flex-1 px-4 py-2.5 border rounded-2xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white" style={{ borderColor: "#e4e4e4" }} />
                  <button type="button" onClick={() => addTag("services", service, () => setService(""))} className="px-4 py-2.5 rounded-2xl text-sm font-bold text-white" style={{ background: "#ff7d0a" }}><Plus className="w-4 h-4" /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(form.services as string[]).map((s) => (
                    <span key={s} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                      {s}<button type="button" onClick={() => removeTag("services", s)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Photos <span className="font-normal text-gray-400">(up to 8)</span></label>
                <div className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:border-orange-300 transition-colors" style={{ borderColor: "#e4e4e4" }}>
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-semibold text-gray-500">Drag & drop photos here</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max 8 photos</p>
                  <button type="button" className="mt-3 text-xs font-bold px-4 py-2 rounded-xl text-white" style={{ background: "#ff7d0a" }}>Browse Files</button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-black text-lg text-gray-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Review & Submit</h2>
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                {[
                  { label: "Business Name", value: form.business_name },
                  { label: "Category", value: selectedCat?.name || "—" },
                  { label: "Area", value: form.area || "—" },
                  { label: "Address", value: form.address || "—" },
                  { label: "Phone", value: form.phone || "—" },
                  { label: "WhatsApp", value: form.whatsapp || "—" },
                  { label: "Price Range", value: getPriceSymbol(form.price_range) || "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-400 font-medium">{label}</span>
                    <span className="font-semibold text-gray-800 text-right max-w-[55%] line-clamp-1">{value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-sm text-orange-800">
                <strong>Note:</strong> Your listing will be reviewed by our team within 24–48 hours before going live. We may contact you at <strong>{user.email}</strong> for verification.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: "#f0f0f0" }}>
            <button onClick={() => step === 0 ? navigate("home") : setStep(step - 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all" style={{ borderColor: "#e4e4e4" }}>
              <ArrowLeft className="w-4 h-4" /> {step === 0 ? "Cancel" : "Back"}
            </button>
            {step < ADD_STEPS.length - 1 ? (
              <button onClick={() => { if (canNext()) setStep(step + 1); else showToast("Please fill in all required fields.", "error"); }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 shadow-[0_4px_20px_rgba(255,125,10,0.35)]" style={{ background: "#ff7d0a" }}>
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60" style={{ background: "#23a155" }}>
                {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {submitting ? "Submitting..." : "Submit Listing"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Advertise Page ───────────────────────────────────────────────────────────

function AdvertisePage({ navigate, user, showToast }: {
  navigate: (p: Page) => void;
  user: { name: string; email: string } | null;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
}) {
  const [selected, setSelected]   = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const handleEnquire = (pkgId: string) => {
    if (!user) { showToast("Please sign in to place an ad.", "error"); navigate("auth"); return; }
    setSelected(pkgId);
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
  };

  if (submitted) {
    const pkg = AD_PACKAGES.find((p) => p.id === selected);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-24">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "#ff7d0a" }}>
            <Megaphone className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-black text-2xl text-gray-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Enquiry Received! 🎉</h2>
          <p className="text-gray-500 mb-2">You enquired about the <strong style={{ color: "#ff7d0a" }}>{pkg?.name}</strong> package.</p>
          <p className="text-sm text-gray-400 mb-8">Our team will contact <strong>{user?.email}</strong> within 24 hours to get your ad live.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => { setSubmitted(false); setSelected(null); }} className="text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition-all" style={{ background: "#ff7d0a" }}>
              View Other Packages
            </button>
            <button onClick={() => navigate("home")} className="text-gray-600 font-semibold px-6 py-3 rounded-2xl border hover:bg-gray-100 transition-all" style={{ borderColor: "#e4e4e4" }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full mb-4" style={{ background: "#fff4ec", color: "#ff7d0a" }}>
            <Megaphone className="w-3.5 h-3.5" /> Advertising on AroundJos
          </div>
          <h1 className="font-black text-3xl sm:text-4xl text-gray-900 mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
            Reach More Customers in Jos
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto text-base">
            AroundJos connects local businesses with thousands of residents and visitors looking for services just like yours.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { icon: Users,     value: "12,000+", label: "Monthly Visitors" },
            { icon: BarChart3, value: "500+",    label: "Active Listings" },
            { icon: TrendingUp,value: "8x",      label: "Avg. Reach Boost" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white rounded-3xl border p-6 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)]" style={{ borderColor: "#f0f0f0" }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "#fff4ec" }}>
                <Icon className="w-5 h-5" style={{ color: "#ff7d0a" }} />
              </div>
              <p className="font-black text-2xl text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <h2 className="font-black text-2xl text-gray-900 mb-6 text-center" style={{ fontFamily: "'Syne', sans-serif" }}>Choose Your Plan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {AD_PACKAGES.map((pkg) => (
            <div key={pkg.id} className={cn("bg-white rounded-3xl border p-7 relative transition-all", pkg.popular ? "shadow-[0_8px_32px_rgba(255,125,10,0.2)] scale-[1.02]" : "shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]")}
              style={{ borderColor: pkg.popular ? "#ff7d0a" : "#f0f0f0", borderWidth: pkg.popular ? 2 : 1 }}>
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold text-white px-4 py-1 rounded-full" style={{ background: "#ff7d0a" }}>
                  Most Popular
                </div>
              )}
              <h3 className="font-black text-lg text-gray-900 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{pkg.name}</h3>
              <div className="flex items-end gap-1 mb-5">
                <span className="font-black text-3xl" style={{ color: pkg.color }}>{pkg.price}</span>
                {pkg.period && <span className="text-gray-400 text-sm mb-1">{pkg.period}</span>}
              </div>
              <ul className="space-y-2.5 mb-6">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: pkg.color }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => pkg.id === "basic" ? navigate("add-listing") : handleEnquire(pkg.id)}
                disabled={loading && selected === pkg.id}
                className="w-full font-bold py-3 rounded-2xl text-sm transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: pkg.popular ? "#ff7d0a" : "#f0f0f0", color: pkg.popular ? "white" : "#3d3d3d" }}>
                {loading && selected === pkg.id && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {pkg.id === "basic" ? "Get Started Free" : "Enquire Now"}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-3xl border p-7 shadow-[0_2px_12px_rgba(0,0,0,0.06)]" style={{ borderColor: "#f0f0f0" }}>
          <h3 className="font-black text-lg text-gray-900 mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              { q: "How quickly will my ad go live?", a: "Featured and Sponsored ads typically go live within 24 hours of payment confirmation." },
              { q: "Can I cancel anytime?", a: "Yes, all paid plans are monthly with no long-term commitment. Cancel before renewal to avoid charges." },
              { q: "What payment methods are accepted?", a: "We accept bank transfers, card payments, and Flutterwave. Our team will send payment details after your enquiry." },
              { q: "Is there a free option?", a: "Yes! The Basic Listing is completely free. You get a full business profile, contact buttons, and customer reviews." },
            ].map(({ q, a }) => (
              <div key={q} className="border-b pb-4 last:border-0 last:pb-0" style={{ borderColor: "#f0f0f0" }}>
                <p className="font-bold text-sm text-gray-800 mb-1">{q}</p>
                <p className="text-sm text-gray-400">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Search Page ──────────────────────────────────────────────────────────────

function SearchPage({ navigate }: { navigate: (p: Page) => void }) {
  const [query, setQuery] = useState("");
  const ALL = [...FEATURED_LISTINGS, ...TRENDING_LISTINGS, ...RECENT_LISTINGS];
  const filtered = query.trim()
    ? ALL.filter((l) => l.businessName.toLowerCase().includes(query.toLowerCase()) || l.area.toLowerCase().includes(query.toLowerCase()))
    : ALL;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-black text-2xl text-gray-900 mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Explore Businesses</h1>
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or area..." className="w-full pl-10 pr-4 py-3 border bg-white rounded-2xl text-sm focus:outline-none focus:ring-2" style={{ borderColor: "#e4e4e4" }} />
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-bold text-gray-700">No results for "{query}"</p>
            <p className="text-gray-400 text-sm mt-1">Try a different name or area</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((l) => <ListingCard key={l.id} listing={l} navigate={navigate} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage({ navigate }: { navigate: (p: Page) => void }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden pt-16" style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d1a00 50%, #3d1500 100%)" }}>
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(255,125,10,0.15)" }} />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(218,111,47,0.15)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center w-full">
          <div className="inline-flex items-center gap-2 border text-sm font-medium mb-6 px-4 py-1.5 rounded-full animate-fade-in" style={{ background: "rgba(255,125,10,0.1)", borderColor: "rgba(255,125,10,0.2)", color: "#ff9b32" }}>
            📍 Jos, Plateau State, Nigeria
          </div>
          <h1 className="font-black text-4xl sm:text-5xl md:text-6xl text-white leading-tight tracking-tight mb-4 animate-slide-up" style={{ fontFamily: "'Syne', sans-serif" }}>
            Discover Everything<br /><span style={{ color: "#ff7d0a" }}>Around Jos</span>
          </h1>
          <p className="text-base sm:text-lg max-w-xl mx-auto mb-10 animate-slide-up" style={{ color: "#b4b4b4" }}>
            Find hotels, restaurants, shops, lounges, and services in Jos, Plateau State — all in one place.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-white rounded-2xl p-2 flex items-center gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <div className="flex-1 flex items-center gap-3 px-3">
                <Search className="w-5 h-5 flex-shrink-0" style={{ color: "#ff7d0a" }} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { navigate("search"); window.scrollTo(0, 0); } }} placeholder="Search hotels, restaurants, shops..." className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none py-2" />
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 border-l" style={{ borderColor: "#f0f0f0" }}>
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Jos, Nigeria</span>
              </div>
              <button onClick={() => { navigate("search"); window.scrollTo(0, 0); }} className="text-white text-sm font-bold px-5 py-3 rounded-xl" style={{ background: "#ff7d0a" }}>Search</button>
            </div>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-8 animate-fade-in">
            {CATEGORIES.slice(0, 6).map((cat) => {
              const Icon = cat.icon;
              return (
                <button key={cat.id} onClick={() => { navigate("search"); window.scrollTo(0, 0); }}
                  className="flex items-center gap-1.5 text-white text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors backdrop-blur-sm hover:bg-white/20"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Icon style={{ width: 14, height: 14 }} /> {cat.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: "linear-gradient(to top, #f8f8f8, transparent)" }} />
      </section>

      {/* Stats */}
      <div style={{ background: "white", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 divide-x py-5" style={{ borderColor: "#f0f0f0" }}>
            {[{ value: "500+", label: "Businesses" }, { value: "25+", label: "Areas in Jos" }, { value: "1K+", label: "Reviews" }].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center justify-center gap-0.5 px-4">
                <span className="font-black text-2xl" style={{ fontFamily: "'Syne', sans-serif", color: "#ff7d0a" }}>{value}</span>
                <span className="text-xs" style={{ color: "#9a9a9a" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <section className="py-10 sm:py-14">
          <SectionHeader title="Browse by Category" subtitle="What are you looking for?"
            action={<button onClick={() => { navigate("search"); window.scrollTo(0, 0); }} className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all" style={{ color: "#ff7d0a" }}>All <ArrowRight className="w-4 h-4" /></button>} />
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button key={cat.id} onClick={() => { navigate("search"); window.scrollTo(0, 0); }}
                  className="group flex flex-col items-center gap-2.5 p-3 sm:p-4 rounded-3xl border bg-white hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-0.5"
                  style={{ borderColor: "#f0f0f0" }}>
                  <div className="p-2.5 rounded-2xl" style={{ background: `${cat.color}18` }}>
                    <Icon style={{ width: 22, height: 22, color: cat.color }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Advertise banner */}
        <div className="mb-8 rounded-3xl overflow-hidden relative cursor-pointer" onClick={() => { navigate("advertise"); window.scrollTo(0, 0); }} style={{ background: "linear-gradient(135deg, #ff7d0a 0%, #f05e06 50%, #da6f2f 100%)" }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)" }} />
          <div className="relative flex items-center justify-between p-6 sm:p-8">
            <div>
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Sponsored</span>
              <h3 className="text-white font-black text-xl sm:text-2xl mt-1" style={{ fontFamily: "'Syne', sans-serif" }}>Advertise Your Business Here</h3>
              <p className="text-white/80 text-sm mt-1">Reach thousands of locals and visitors in Jos</p>
            </div>
            <button className="bg-white font-bold text-sm px-5 py-2.5 rounded-2xl hover:bg-orange-50 transition-colors flex-shrink-0 ml-4" style={{ color: "#ff7d0a" }}>
              Learn More
            </button>
          </div>
        </div>

        {/* Featured Places */}
        <section className="py-10 sm:py-14">
          <SectionHeader title="Featured Places" subtitle="Handpicked top spots in Jos"
            action={<button onClick={() => { navigate("search"); window.scrollTo(0, 0); }} className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all" style={{ color: "#ff7d0a" }}>See all <ArrowRight className="w-4 h-4" /></button>} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {FEATURED_LISTINGS.map((l) => <ListingCard key={l.id} listing={l} navigate={navigate} />)}
          </div>
        </section>
      </div>

      {/* Areas */}
      <section className="py-10 sm:py-14" style={{ background: "#f0f0f0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader title="Explore by Area" subtitle="Discover businesses in your neighbourhood" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AREAS.map((area) => (
              <div key={area.name} onClick={() => { navigate("search"); window.scrollTo(0, 0); }} className="relative rounded-3xl overflow-hidden aspect-[4/3] cursor-pointer group">
                <img src={area.image} alt={area.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>{area.name}</h3>
                  <p className="text-white/70 text-xs">{area.count} businesses</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <section className="py-10 sm:py-14">
          <SectionHeader title="Trending Now" subtitle="Most visited places this week"
            action={<button onClick={() => { navigate("search"); window.scrollTo(0, 0); }} className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all" style={{ color: "#ff7d0a" }}>See all <ArrowRight className="w-4 h-4" /></button>} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {TRENDING_LISTINGS.map((l) => <ListingCard key={l.id} listing={l} navigate={navigate} />)}
          </div>
        </section>

        {/* Business CTA */}
        <section className="pb-10 sm:pb-14">
          <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center" style={{ background: "linear-gradient(135deg, #ff7d0a 0%, #f05e06 50%, #da6f2f 100%)" }}>
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(255,255,255,0.1)" }} />
            <div className="relative z-10">
              <div className="text-4xl mb-4">🏢</div>
              <h2 className="font-black text-2xl sm:text-3xl text-white mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>Own a Business in Jos?</h2>
              <p className="text-white/80 text-base max-w-md mx-auto mb-6">List your business on AroundJos and reach thousands of locals and visitors looking for services like yours.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button onClick={() => { navigate("add-listing"); window.scrollTo(0, 0); }} className="inline-flex items-center gap-2 bg-white font-bold px-6 py-3 rounded-2xl hover:bg-orange-50 transition-colors shadow-lg" style={{ color: "#f05e06" }}>
                  <Sparkles className="w-4 h-4" /> Add Your Business — Free
                </button>
                <button onClick={() => { navigate("auth"); window.scrollTo(0, 0); }} className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-2xl border border-white/20 transition-colors hover:bg-white/10">
                  Sign In First
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Recently Added */}
        <section className="py-10 sm:py-14">
          <SectionHeader title="Recently Added" subtitle="New businesses just listed on AroundJos"
            action={<button onClick={() => { navigate("search"); window.scrollTo(0, 0); }} className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all" style={{ color: "#ff7d0a" }}>See all <ArrowRight className="w-4 h-4" /></button>} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {RECENT_LISTINGS.map((l) => <ListingCard key={l.id} listing={l} navigate={navigate} />)}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer style={{ background: "#3d3d3d", borderTop: "1px solid #5a5a5a" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: "#ff7d0a" }}>AJ</div>
                <span className="font-black text-white text-lg">AroundJos</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#9a9a9a" }}>Discover everything around Jos, Plateau State, Nigeria.</p>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-3">Discover</h4>
              <ul className="space-y-2">
                {["Hotels", "Restaurants", "Lounges", "Phones & Gadgets", "Fashion"].map((item) => (
                  <li key={item}><button onClick={() => { navigate("search"); window.scrollTo(0, 0); }} className="text-sm transition-colors hover:text-white" style={{ color: "#9a9a9a" }}>{item}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-3">Company</h4>
              <ul className="space-y-2">
                {[
                  { l: "About Us",     p: "home" as Page },
                  { l: "Add Business", p: "add-listing" as Page },
                  { l: "Advertise",    p: "advertise" as Page },
                  { l: "Contact",      p: "home" as Page },
                ].map(({ l, p }) => (
                  <li key={l}><button onClick={() => { navigate(p); window.scrollTo(0, 0); }} className="text-sm transition-colors hover:text-white" style={{ color: "#9a9a9a" }}>{l}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-3">Areas in Jos</h4>
              <ul className="space-y-2">
                {["GRA", "Terminus", "Rayfield", "Bukuru", "Farin Gada"].map((area) => (
                  <li key={area}><button onClick={() => { navigate("search"); window.scrollTo(0, 0); }} className="text-sm transition-colors hover:text-white" style={{ color: "#9a9a9a" }}>{area}</button></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "#5a5a5a" }}>
            <p className="text-sm" style={{ color: "#6a6a6a" }}>© 2025 AroundJos. Made with ❤️ for Jos.</p>
            <div className="flex items-center gap-4">
              <button className="text-sm transition-colors hover:text-white" style={{ color: "#6a6a6a" }}>Privacy</button>
              <button className="text-sm transition-colors hover:text-white" style={{ color: "#6a6a6a" }}>Terms</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage]   = useState<Page>("home");
  const [dark, setDark]   = useState(false);
  const [user, setUser]   = useState<{ name: string; email: string } | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  const navigate = (p: Page) => setPage(p);
  const showToast = (msg: string, type: "success" | "error" | "info") => setToast({ msg, type });

  return (
    <div style={{ background: "#f8f8f8", minHeight: "100vh" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <Header
        page={page} navigate={navigate}
        dark={dark} toggleDark={() => setDark(!dark)}
        user={user} onSignOut={() => { setUser(null); setPage("home"); showToast("Signed out successfully.", "info"); }}
      />

      {page === "home"        && <HomePage navigate={navigate} />}
      {page === "auth"        && <AuthPage navigate={navigate} onLogin={setUser} showToast={showToast} />}
      {page === "add-listing" && <AddListingPage navigate={navigate} user={user} showToast={showToast} />}
      {page === "advertise"   && <AdvertisePage navigate={navigate} user={user} showToast={showToast} />}
      {page === "search"      && <SearchPage navigate={navigate} />}
    </div>
  );
}
