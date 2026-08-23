/**
 * Server-owned guide catalog used by checkout and fulfillment.
 *
 * Product IDs and expected prices are deliberately kept on the server. The
 * browser sends only a known slug, so it cannot choose an arbitrary Stripe
 * product or price.
 */
export const GUIDE_CATALOG = {
  "eb1a-master": {
    productId: "prod_UuuNVJM174nKvQ",
    name: "EB-1A Master Guide",
    expectedAmount: 9900,
  },
  "eb1a-business": {
    productId: "prod_UuubGa79bq84fn",
    name: "EB-1A for Business Leaders",
    expectedAmount: 7900,
  },
  "eb1a-arts": {
    productId: "prod_UuucU0qjBiiFYp",
    name: "EB-1A for Artists & Creators",
    expectedAmount: 7900,
  },
  "eb1a-athletics": {
    productId: "prod_UuudKN57E7YBxm",
    name: "EB-1A for Athletes & Coaches",
    expectedAmount: 7900,
  },
  "eb1a-education": {
    productId: "prod_Uuuecov9ZMnSbo",
    name: "EB-1A for Educators",
    expectedAmount: 7900,
  },
  "eb1a-science": {
    productId: "prod_Uuuf4bMQ91y7V0",
    name: "EB-1A for Scientists",
    expectedAmount: 7900,
  },
  "eb1a-complete": {
    productId: "prod_UuufVso7YgP9cq",
    name: "The Complete EB-1A Collection",
    expectedAmount: 24900,
  },
} as const;

export type GuideSlug = keyof typeof GUIDE_CATALOG;

export const GUIDE_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(GUIDE_CATALOG).map(([slug, guide]) => [slug, guide.name]),
);

const PRODUCT_ID_TO_SLUG = Object.fromEntries(
  Object.entries(GUIDE_CATALOG).map(([slug, guide]) => [guide.productId, slug]),
) as Record<string, GuideSlug>;

const BUNDLE_GUIDE_SLUGS: GuideSlug[] = [
  "eb1a-master",
  "eb1a-business",
  "eb1a-arts",
  "eb1a-athletics",
  "eb1a-education",
  "eb1a-science",
];

export function getGuideCatalogEntry(slug: string) {
  return GUIDE_CATALOG[slug as GuideSlug];
}

export function getGuideSlugsForProduct(productId: string): GuideSlug[] {
  const slug = PRODUCT_ID_TO_SLUG[productId];
  if (!slug) return [];
  return slug === "eb1a-complete" ? BUNDLE_GUIDE_SLUGS : [slug];
}