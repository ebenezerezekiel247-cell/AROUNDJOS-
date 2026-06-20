// Auto-generated Supabase types — run `npm run supabase:types` to regenerate
// Or paste into: https://supabase.com/dashboard/project/_/api

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id:           string;
          email:        string;
          display_name: string;
          photo_url:    string | null;
          role:         'visitor' | 'business_owner' | 'moderator' | 'admin';
          phone:        string | null;
          bio:          string | null;
          created_at:   string;
          updated_at:   string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };

      categories: {
        Row: {
          id:          string;
          name:        string;
          slug:        string;
          description: string | null;
          icon:        string | null;
          color:       string | null;
          featured:    boolean;
          order_num:   number;
          created_at:  string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };

      listings: {
        Row: {
          id:               string;
          slug:             string;
          business_name:    string;
          tagline:          string | null;
          description:      string;
          category_slug:    string | null;
          subcategory_slug: string | null;
          address:          string;
          area:             string;
          lat:              number | null;
          lng:              number | null;
          phone:            string;
          whatsapp:         string | null;
          email:            string | null;
          website:          string | null;
          images:           string[];
          cover_image:      string | null;
          opening_hours:    Json | null;
          amenities:        string[];
          services:         string[];
          price_range:      'budget' | 'mid' | 'premium' | 'luxury' | null;
          status:           'draft' | 'pending' | 'active' | 'rejected' | 'suspended';
          verified:         boolean;
          claimed:          boolean;
          featured:         boolean;
          sponsored:        boolean;
          rating_average:   number;
          review_count:     number;
          view_count:       number;
          save_count:       number;
          created_by:       string | null;
          owner_id:         string | null;
          claimed_by:       string | null;
          created_at:       string;
          updated_at:       string;
        };
        Insert: Omit<Database['public']['Tables']['listings']['Row'], 'id' | 'created_at' | 'updated_at' | 'rating_average' | 'review_count' | 'view_count' | 'save_count'>;
        Update: Partial<Database['public']['Tables']['listings']['Insert']>;
      };

      reviews: {
        Row: {
          id:           string;
          listing_id:   string;
          author_id:    string | null;
          author_name:  string;
          rating:       number;
          title:        string | null;
          body:         string;
          images:       string[];
          helpful:      number;
          reported:     boolean;
          report_count: number;
          status:       'active' | 'hidden' | 'deleted';
          owner_reply:  Json | null;
          created_at:   string;
          updated_at:   string;
        };
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at' | 'updated_at' | 'helpful' | 'reported' | 'report_count'>;
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };

      favorites: {
        Row: {
          id:         string;
          user_id:    string;
          listing_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['favorites']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['favorites']['Insert']>;
      };

      business_claims: {
        Row: {
          id:               string;
          listing_id:       string;
          listing_name:     string;
          user_id:          string;
          user_email:       string;
          user_name:        string;
          phone:            string;
          position:         string;
          message:          string;
          proof_documents:  string[];
          status:           'pending' | 'approved' | 'rejected';
          reviewed_by:      string | null;
          reviewed_at:      string | null;
          rejection_reason: string | null;
          created_at:       string;
        };
        Insert: Omit<Database['public']['Tables']['business_claims']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['business_claims']['Insert']>;
      };

      ads: {
        Row: {
          id:          string;
          title:       string;
          image_url:   string;
          link_url:    string;
          listing_id:  string | null;
          placement:   string[];
          status:      'draft' | 'active' | 'paused' | 'expired';
          budget:      number | null;
          impressions: number;
          clicks:      number;
          start_date:  string | null;
          end_date:    string | null;
          created_by:  string | null;
          created_at:  string;
        };
        Insert: Omit<Database['public']['Tables']['ads']['Row'], 'id' | 'created_at' | 'impressions' | 'clicks'>;
        Update: Partial<Database['public']['Tables']['ads']['Insert']>;
      };

      notifications: {
        Row: {
          id:         string;
          user_id:    string;
          type:       string;
          title:      string;
          body:       string;
          read:       boolean;
          action_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at' | 'read'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };

      reports: {
        Row: {
          id:          string;
          target_type: 'listing' | 'review';
          target_id:   string;
          reported_by: string | null;
          reason:      string;
          details:     string | null;
          status:      'pending' | 'resolved' | 'dismissed';
          created_at:  string;
        };
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at' | 'status'>;
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
      };
    };

    Views: Record<string, never>;
    Functions: {
      is_admin:          { Args: Record<never, never>; Returns: boolean };
      is_listing_owner:  { Args: { listing_id: string }; Returns: boolean };
    };
    Enums: Record<string, never>;
  };
}

// Convenience row types
export type DbUser         = Database['public']['Tables']['users']['Row'];
export type DbListing      = Database['public']['Tables']['listings']['Row'];
export type DbReview       = Database['public']['Tables']['reviews']['Row'];
export type DbFavorite     = Database['public']['Tables']['favorites']['Row'];
export type DbClaim        = Database['public']['Tables']['business_claims']['Row'];
export type DbCategory     = Database['public']['Tables']['categories']['Row'];
export type DbAd           = Database['public']['Tables']['ads']['Row'];
export type DbNotification = Database['public']['Tables']['notifications']['Row'];
