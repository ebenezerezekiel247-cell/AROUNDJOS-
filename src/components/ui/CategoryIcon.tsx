import {
  Building2, UtensilsCrossed, Wine, Home, Smartphone,
  ShoppingBag, Sparkles, HeartPulse, Car, Camera, Wrench,
  GraduationCap, Building, LucideProps, Store,
} from 'lucide-react';

// ─── Icon Map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Building2,
  UtensilsCrossed,
  Wine,
  Home,
  Smartphone,
  ShoppingBag,
  Sparkles,
  HeartPulse,
  Car,
  Camera,
  Wrench,
  GraduationCap,
  Building,
  Store,
};

// ─── CategoryIcon Component ───────────────────────────────────────────────────

interface CategoryIconProps {
  /** Icon name string stored in categories data e.g. "Building2" */
  name: string;
  /** Category brand color e.g. "#FF7D0A" */
  color: string;
  /** Icon size in px (default 22) */
  size?: number;
  /** Extra class on the outer wrapper div */
  className?: string;
}

export function CategoryIcon({ name, color, size = 22, className }: CategoryIconProps) {
  const Icon = ICON_MAP[name] ?? Store;

  return (
    <div
      className={className}
      style={{
        width:           size + 18,
        height:          size + 18,
        borderRadius:    14,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        backgroundColor: `${color}20`,
        flexShrink:      0,
      }}
    >
      <Icon size={size} color={color} strokeWidth={1.8} />
    </div>
  );
}

// ─── Inline icon (no wrapper) ─────────────────────────────────────────────────
// Use when you need just the icon itself inside your own container.

interface RawCategoryIconProps {
  name: string;
  color: string;
  size?: number;
}

export function RawCategoryIcon({ name, color, size = 18 }: RawCategoryIconProps) {
  const Icon = ICON_MAP[name] ?? Store;
  return <Icon size={size} color={color} strokeWidth={1.8} />;
}
