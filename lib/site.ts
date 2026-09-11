export const SITE_NAME = "GenSpeak";
export const SITE_TAGLINE = "Translate anything into any generation's slang";
export const SITE_DESCRIPTION =
  "Type a sentence in plain English and get it back in Gen Alpha, Gen Z, Millennial, Gen X or Boomer slang. Free, instant, and no sign-up.";

/**
 * Absolute origin of the deployed site, used for canonical URLs, sitemaps and
 * social card images. Set NEXT_PUBLIC_SITE_URL once a custom domain exists;
 * Vercel supplies its own production URL in the meantime.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}
