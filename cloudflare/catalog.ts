import { GUIDE_CATALOG } from "../artifacts/api-server/src/lib/guide-catalog";

// IDs can differ in Stripe test mode or after moving Stripe accounts. Names,
// amounts, currencies and bundle contents remain server-owned.
export function catalog(overrides?: string) {
  const ids: Record<string, { productId: string; priceId: string }> = overrides
    ? JSON.parse(overrides)
    : {};
  if (!ids || typeof ids !== "object" || Array.isArray(ids))
    throw new Error("Invalid Stripe catalog configuration");
  for (const [slug, value] of Object.entries(ids)) {
    if (
      !Object.hasOwn(GUIDE_CATALOG, slug) ||
      !value ||
      typeof value.productId !== "string" ||
      typeof value.priceId !== "string" ||
      !/^prod_[A-Za-z0-9]+$/.test(value.productId) ||
      !/^price_[A-Za-z0-9]+$/.test(value.priceId)
    ) {
      throw new Error("Invalid Stripe catalog IDs");
    }
  }
  return Object.fromEntries(
    Object.entries(GUIDE_CATALOG).map(([slug, guide]) => [
      slug,
      {
        ...guide,
        ...(Object.hasOwn(ids, slug) ? ids[slug] : {}),
      },
    ]),
  );
}

export function purchaseSlugs(
  entries: ReturnType<typeof catalog>,
  price: {
    productId: string;
    priceId: string;
    unitAmount: number | null | undefined;
    currency: string | undefined;
  },
) {
  const match = Object.entries(entries).find(
    ([, guide]) =>
      guide.productId === price.productId &&
      guide.priceId === price.priceId &&
      guide.expectedAmount === price.unitAmount &&
      price.currency === "usd",
  );
  if (!match) return [];
  return match[0] === "eb1a-complete"
    ? Object.keys(entries).filter((slug) => slug !== "eb1a-complete")
    : [match[0]];
}
