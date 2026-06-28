-- Site content table for admin-editable text
CREATE TABLE IF NOT EXISTS public.site_content (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES public.users(id)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read site content
CREATE POLICY "site_content_select" ON public.site_content
  FOR SELECT USING (true);

-- Only admins can edit
CREATE POLICY "site_content_update" ON public.site_content
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Seed default about content
INSERT INTO public.site_content (key, value) VALUES
(
  'about',
  '{
    "headline": "About AroundJos",
    "tagline": "The #1 local business discovery platform for Jos, Plateau State, Nigeria.",
    "story": "Jos is one of Nigeria''s most beautiful cities — known for its cool climate, breathtaking plateau views, and warm, welcoming people. But finding a reliable restaurant, shortlet, or service provider in Jos meant asking around on WhatsApp groups or scrolling through scattered Facebook pages.\n\nAroundJos was created to change that. We believe Jos deserves a dedicated, well-designed platform where locals and visitors can discover the best the city has to offer — from iconic hotels like Hill Station to the best suya spots on Zaria Road.",
    "stats": [
      {"value": "500+", "label": "Businesses"},
      {"value": "25+",  "label": "Jos Areas"},
      {"value": "1,000+", "label": "Monthly Users"}
    ]
  }'::jsonb
),
(
  'contact',
  '{
    "whatsapp": "+2348031234567",
    "email": "hello@aroundjos.com",
    "address": "Jos, Plateau State, Nigeria",
    "hours": "Mon – Fri: 9am – 6pm"
  }'::jsonb
),
(
  'advertise',
  '{
    "headline": "Grow Your Business with AroundJos",
    "tagline": "Put your business in front of thousands of people in Jos.",
    "plans": [
      {"name": "Basic",    "price": "₦5,000",  "period": "/month", "features": ["Standard listing", "WhatsApp & call button", "Appear in search", "Up to 5 photos"]},
      {"name": "Featured", "price": "₦15,000", "period": "/month", "popular": true, "features": ["Everything in Basic", "Featured badge", "Homepage placement", "Up to 15 photos", "Priority in search"]},
      {"name": "Sponsored","price": "₦35,000", "period": "/month", "features": ["Everything in Featured", "Sponsored banner ad", "Top of category page", "Unlimited photos", "Analytics dashboard", "Verified badge"]}
    ]
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;
