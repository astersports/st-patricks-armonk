/**
 * SEO Component — Dynamic meta tags for each page.
 * Uses react-helmet-async to inject title, description, OG tags, and structured data.
 */
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "event";
  structuredData?: Record<string, unknown>;
  noIndex?: boolean;
}

const SITE_NAME = "St. Patrick Church, Armonk";
const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";
const DEFAULT_DESCRIPTION =
  "Welcome to St. Patrick Church in Armonk, NY. Join our vibrant Catholic community for Mass, sacraments, faith formation, and fellowship.";
const DEFAULT_IMAGE = "/og-image.png";

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  image = DEFAULT_IMAGE,
  type = "website",
  structuredData,
  noIndex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = `${BASE_URL}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

/**
 * Schema.org structured data for St. Patrick Church (CatholicChurch type).
 * Include this on the homepage for local SEO.
 */
export const CHURCH_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "CatholicChurch",
  name: "St. Patrick Church",
  alternateName: "St. Patrick's of Armonk",
  url: BASE_URL || "https://st-patricks-armonk.manus.space",
  telephone: "+1-914-273-9724",
  email: "office@stpatricksarmonk.org",
  address: {
    "@type": "PostalAddress",
    streetAddress: "137 Moseman Road",
    addressLocality: "Armonk",
    addressRegion: "NY",
    postalCode: "10504",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 41.1268,
    longitude: -73.7140,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "17:00",
      closes: "18:00",
      description: "Vigil Mass",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday"],
      opens: "08:00",
      closes: "12:30",
      description: "Sunday Masses (8:00 AM, 10:00 AM, 12:00 PM)",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "09:00",
      description: "Daily Mass",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "16:00",
      closes: "16:45",
      description: "Confessions",
    },
  ],
  sameAs: [
    "https://www.facebook.com/StPatricksArmonk",
  ],
  image: DEFAULT_IMAGE,
  priceRange: "Free",
  hasMap: "https://maps.google.com/?q=St+Patrick+Church+Armonk+NY",
};
