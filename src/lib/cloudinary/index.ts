import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddospiyjo',
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure:     true,
});

export { cloudinary };

export const CLD_CLOUD_NAME = 'ddospiyjo';

export const CLD_FOLDERS = {
  listings: (id: string) => `aroundjos/listings/${id}`,
  reviews:  (id: string) => `aroundjos/reviews/${id}`,
  claims:   (id: string) => `aroundjos/claims/${id}`,
  avatars:  (id: string) => `aroundjos/avatars/${id}`,
  ads:      'aroundjos/ads',
} as const;

export const CLD_TRANSFORMS = {
  cover:   'c_fill,w_800,h_600,q_auto,f_webp',
  thumb:   'c_fill,w_400,h_300,q_auto,f_webp',
  square:  'c_fill,w_300,h_300,q_auto,f_webp',
  avatar:  'c_fill,w_200,h_200,q_auto,f_webp,g_face',
  gallery: 'c_limit,w_1200,q_auto,f_webp',
} as const;

export async function uploadToCloudinary(
  source: string | Buffer,
  folder: string,
  publicId?: string
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(
    typeof source === 'string' ? source : `data:image/webp;base64,${source.toString('base64')}`,
    {
      folder,
      public_id:       publicId,
      overwrite:       true,
      transformation:  [{ quality: 'auto', fetch_format: 'webp' }],
      resource_type:   'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    }
  );
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function buildCloudinaryUrl(
  publicIdOrUrl: string,
  transform: keyof typeof CLD_TRANSFORMS = 'cover'
): string {
  if (publicIdOrUrl.startsWith('https://')) return publicIdOrUrl;
  return cloudinary.url(publicIdOrUrl, {
    transformation: CLD_TRANSFORMS[transform],
    secure: true,
  });
}
