/**
 * Server-owned guide catalog used by checkout and fulfillment.
 *
 * Product IDs and expected prices are deliberately kept on the server. The
 * browser sends only a known slug, so it cannot choose an arbitrary Stripe
 * product or price.
 */
export const GUIDE_CATALOG = {
  "eb1a-master": {
    productId: "prod_V7eSv1UvPadbOE",
    priceId: "price_1U7P9kFfohyT635rm1vkOfBH",
    name: "EB-1A Master Guide",
    expectedAmount: 9900,
  },
  "eb1a-business": {
    productId: "prod_V7eSPhkTy2wkIE",
    priceId: "price_1U7P9lFfohyT635rKTSZ7Q4z",
    name: "EB-1A for Business Leaders",
    expectedAmount: 7900,
  },
  "eb1a-arts": {
    productId: "prod_V7eS1kaVtSidDB",
    priceId: "price_1U7P9lFfohyT635r3yWeWDo3",
    name: "EB-1A for Artists & Creators",
    expectedAmount: 7900,
  },
  "eb1a-athletics": {
    productId: "prod_V7eSmn8erEhott",
    priceId: "price_1U7P9mFfohyT635rYuBEZHlD",
    name: "EB-1A for Athletes & Coaches",
    expectedAmount: 7900,
  },
  "eb1a-education": {
    productId: "prod_V7eSxdzfn0P4Ja",
    priceId: "price_1U7P9nFfohyT635rHbfMoJIe",
    name: "EB-1A for Educators",
    expectedAmount: 7900,
  },
  "eb1a-science": {
    productId: "prod_V7eSThDup3yu4z",
    priceId: "price_1U7P9oFfohyT635rBySOKFz2",
    name: "EB-1A for Scientists",
    expectedAmount: 7900,
  },
  "eb1a-complete": {
    productId: "prod_V7eSXCYBseEdTQ",
    priceId: "price_1U7P9oFfohyT635rgVgDI6N8",
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
  return Object.hasOwn(GUIDE_CATALOG, slug) ? GUIDE_CATALOG[slug as GuideSlug] : undefined;
}

export function getGuideSlugsForProduct(productId: string): GuideSlug[] {
  const slug = PRODUCT_ID_TO_SLUG[productId];
  if (!slug) return [];
  return slug === "eb1a-complete" ? BUNDLE_GUIDE_SLUGS : [slug];
}

interface PurchasedPrice {
  productId: string;
  priceId: string;
  unitAmount: number | null | undefined;
  currency: string | undefined;
}

export function getGuideSlugsForPurchase({
  productId,
  priceId,
  unitAmount,
  currency,
}: PurchasedPrice): GuideSlug[] {
  const slug = PRODUCT_ID_TO_SLUG[productId];
  if (!slug) return [];

  const guide = GUIDE_CATALOG[slug];
  if (
    guide.priceId !== priceId ||
    guide.expectedAmount !== unitAmount ||
    currency !== "usd"
  ) {
    return [];
  }

  return slug === "eb1a-complete" ? BUNDLE_GUIDE_SLUGS : [slug];
}
