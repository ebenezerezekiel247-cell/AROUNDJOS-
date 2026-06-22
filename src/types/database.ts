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
        Insert: {
          id:           string;
          email:        string;
          display_name?: string;
          photo_url?:   string | null;
          role?:        'visitor' | 'business_owner' | 'moderator' | 'admin';
          phone?:       string | null;
          bio?:         string | null;
        };
        Update: {
          display_name?: string;
          photo_url?:   string | null;
          role?:        'visitor' | 'business_owner' | 'moderator' | 'admin';
          phone?:       string | null;
          bio?:         string | null;
        };
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
        Insert: {
          id:           string;
          name:         string;
          slug:         string;
          description?: string | null;
          icon?:        string | null;
          color?:       string | null;
          featured?:    boolean;
          order_num?:   number;
        };
        Update: {
          name?:        string;
          description?: string | null;
          icon?:        string | null;
          color?:       string | null;
          featured?:    boolean;
          order_num?:   number;
        };
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
        Insert: {
          slug:              string;
          business_name:     string;
          tagline?:          string | null;
          description:       string;
          category_slug?:    string | null;
          subcategory_slug?: string | null;
          address:           string;
          area:              string;
          lat?:              number | null;
          lng?:              number | null;
          phone:             string;
          whatsapp?:         string | null;
          email?:            string | null;
          website?:          string | null;
          images?:           string[];
          cover_image?:      string | null;
          opening_hours?:    Json | null;
          amenities?:        string[];
          services?:         string[];
          price_range?:      'budget' | 'mid' | 'premium' | 'luxury' | null;
          status?:           'draft' | 'pending' | 'active' | 'rejected' | 'suspended';
          verified?:         boolean;
          claimed?:          boolean;
          featured?:         boolean;
          sponsored?:        boolean;
          created_by?:       string | null;
          owner_id?:         string | null;
          claimed_by?:       string | null;
        };
        Update: {
          slug?:             string;
          business_name?:    string;
          tagline?:          string | null;
          description?:      string;
          category_slug?:    string | null;
          subcategory_slug?: string | null;
          address?:          string;
          area?:             string;
          lat?:              number | null;
          lng?:              number | null;
          phone?:            string;
          whatsapp?:         string | null;
          email?:            string | null;
          website?:          string | null;
          images?:           string[];
          cover_image?:      string | null;
          opening_hours?:    Json | null;
          amenities?:        string[];
          services?:         string[];
          price_range?:      'budget' | 'mid' | 'premium' | 'luxury' | null;
          status?:           'draft' | 'pending' | 'active' | 'rejected' | 'suspended';
          verified?:         boolean;
          claimed?:          boolean;
          featured?:         boolean;
          sponsored?:        boolean;
          rating_average?:   number;
          review_count?:     number;
          view_count?:       number;
          save_count?:       number;
          owner_id?:         string | null;
          claimed_by?:       string | null;
          updated_at?:       string;
        };
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
        Insert: {
          listing_id:   string;
          author_id?:   string | null;
          author_name?: string;
          rating:       number;
          title?:       string | null;
          body:         string;
          images?:      string[];
          status?:      'active' | 'hidden' | 'deleted';
          owner_reply?: Json | null;
        };
        Update: {
          rating?:      number;
          title?:       string | null;
          body?:        string;
          status?:      'active' | 'hidden' | 'deleted';
          helpful?:     number;
          reported?:    boolean;
          report_count?: number;
          owner_reply?: Json | null;
          updated_at?:  string;
        };
      };

      favorites: {
        Row: {
          id:         string;
          user_id:    string;
          listing_id: string;
          created_at: string;
        };
        Insert: {
          user_id:    string;
          listing_id: string;
        };
        Update: Record<string, never>;
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
        Insert: {
          listing_id:       string;
          listing_name:     string;
          user_id:          string;
          user_email:       string;
          user_name:        string;
          phone:            string;
          position:         string;
          message:          string;
          proof_documents?: string[];
          status?:          'pending' | 'approved' | 'rejected';
          reviewed_by?:     string | null;
          reviewed_at?:     string | null;
          rejection_reason?: string | null;
        };
        Update: {
          status?:           'pending' | 'approved' | 'rejected';
          reviewed_by?:      string | null;
          reviewed_at?:      string | null;
          rejection_reason?: string | null;
        };
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
        Insert: {
          title:        string;
          image_url:    string;
          link_url:     string;
          listing_id?:  string | null;
          placement?:   string[];
          status?:      'draft' | 'active' | 'paused' | 'expired';
          budget?:      number | null;
          start_date?:  string | null;
          end_date?:    string | null;
          created_by?:  string | null;
        };
        Update: {
          status?:      'draft' | 'active' | 'paused' | 'expired';
          impressions?: number;
          clicks?:      number;
          start_date?:  string | null;
          end_date?:    string | null;
        };
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
        Insert: {
          user_id:     string;
          type:        string;
          title:       string;
          body:        string;
          read?:       boolean;
          action_url?: string | null;
        };
        Update: {
          read?:       boolean;
          action_url?: string | null;
        };
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
        Insert: {
          target_type:  'listing' | 'review';
          target_id:    string;
          reported_by?: string | null;
          reason:       string;
          details?:     string | null;
          status?:      'pending' | 'resolved' | 'dismissed';
        };
        Update: {
          status?: 'pending' | 'resolved' | 'dismissed';
        };
      };
    };

    Views: Record<string, never>;
    Functions: {
      is_admin:         { Args: Record<never, never>; Returns: boolean };
      is_listing_owner: { Args: { listing_id: string }; Returns: boolean };
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
