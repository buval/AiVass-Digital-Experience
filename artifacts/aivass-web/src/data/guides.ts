// Real AiVass guide products — sourced from /api/guides on the live site (2026-08-10)
// DO NOT edit names, slugs, descriptions or prices without confirming against live Stripe products.
// Purchase CTAs currently link to https://aivass.com/guides/${slug} until checkout is migrated to this build.
// TODO: When checkout is migrated, replace purchaseUrl with internal Stripe payment link.

export interface Guide {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  priceCents: number;
  pageCount: number;
  isBundle: boolean;
  category: string;
  sampleSlug?: string; // /samples/${sampleSlug}-sample.pdf
}

export const GUIDES: Guide[] = [
  {
    id: "53fa96ea-f9cd-4e6b-8d84-b53af5a92ce8",
    slug: "eb1a-master",
    name: "EB-1A Master Guide",
    subtitle: "The Strategic Evidence Framework",
    shortDescription: "The complete strategic playbook for your EB-1A petition — 52 pages",
    description:
      "The complete strategic playbook for building an EB-1A petition: how adjudicators evaluate the 10 criteria, how to structure your evidence portfolio, and how to frame a winning narrative — across every field of endeavor.",
    priceCents: 9900,
    pageCount: 52,
    isBundle: false,
    category: "Extraordinary Ability",
    sampleSlug: "eb1a-master",
  },
  {
    id: "9097abd9-96dc-4533-af0b-9cd006ce120a",
    slug: "eb1a-business",
    name: "EB-1A for Business Leaders",
    subtitle: "The Founder's Evidence Blueprint",
    shortDescription: "EB-1A evidence blueprint for founders & executives — 44 pages",
    description:
      "A field-specific EB-1A guide for founders, executives, and operators: translating funding rounds, revenue impact, press, board roles, and industry influence into the evidence categories USCIS recognises.",
    priceCents: 7900,
    pageCount: 44,
    isBundle: false,
    category: "Extraordinary Ability",
    sampleSlug: "eb1a-business",
  },
  {
    id: "1349a4d7-123b-4159-801e-36a2ca63e819",
    slug: "eb1a-arts",
    name: "EB-1A for Artists & Creators",
    subtitle: "Proof of Brilliance",
    shortDescription: "EB-1A evidence guide for artists & creators — 43 pages",
    description:
      "A field-specific EB-1A guide for artists, designers, performers, and creators: exhibitions, commercial success, press, distinguished reputation, and how creative careers map onto the 10 criteria.",
    priceCents: 7900,
    pageCount: 43,
    isBundle: false,
    category: "Extraordinary Ability",
    sampleSlug: "eb1a-arts",
  },
  {
    id: "6fb3a66a-944e-4109-aa0c-5bd93407683e",
    slug: "eb1a-athletics",
    name: "EB-1A for Athletes & Coaches",
    subtitle: "Podium to Permanence",
    shortDescription: "EB-1A evidence guide for athletes & coaches — 45 pages",
    description:
      "A field-specific EB-1A guide for athletes and coaches: rankings, championships, national team selection, media coverage, and turning athletic achievement into a green-card-ready evidence portfolio.",
    priceCents: 7900,
    pageCount: 45,
    isBundle: false,
    category: "Extraordinary Ability",
    sampleSlug: "eb1a-athletics",
  },
  {
    id: "f1c7a439-8a02-40f1-9466-a0981acf0bf3",
    slug: "eb1a-education",
    name: "EB-1A for Educators",
    subtitle: "The Academic Authority",
    shortDescription: "EB-1A evidence guide for educators — 47 pages",
    description:
      "A field-specific EB-1A guide for educators and academic leaders: teaching innovation, curriculum influence, awards, judging, publications, and building authority evidence beyond citation counts.",
    priceCents: 7900,
    pageCount: 47,
    isBundle: false,
    category: "Extraordinary Ability",
    sampleSlug: "eb1a-education",
  },
  {
    id: "fb3ebf0f-0c2f-4d8b-b9fb-05abae0836e4",
    slug: "eb1a-science",
    name: "EB-1A for Scientists",
    subtitle: "The Researcher's Blueprint",
    shortDescription: "EB-1A evidence guide for scientists & researchers — 44 pages",
    description:
      "A field-specific EB-1A guide for scientists and researchers: publications, citations, peer review, original contributions, and framing research impact so adjudicators see extraordinary ability.",
    priceCents: 7900,
    pageCount: 44,
    isBundle: false,
    category: "Extraordinary Ability",
    sampleSlug: "eb1a-science",
  },
];

export const BUNDLE: Guide = {
  id: "02e1ddea-7179-4ef8-87fc-d66345048d8a",
  slug: "eb1a-complete",
  name: "The Complete EB-1A Collection",
  subtitle: "All 6 guides — every field, one framework",
  shortDescription: "All 6 EB-1A guides at a bundle discount — 275 pages total",
  description:
    "The full library: the Master Guide plus all five field-specific guides (Business, Arts, Athletics, Education, Science). Every download is personalised to you and delivered instantly after purchase.",
  priceCents: 24900,
  pageCount: 275,
  isBundle: true,
  category: "Extraordinary Ability",
};

// Checkout: links to existing live site during migration period
// TODO: Replace with internal Stripe payment links once checkout is migrated to this build
export function guideCheckoutUrl(slug: string): string {
  // MISSING VERIFIED CHECKOUT URL — currently routing to existing live site
  // Owner must supply direct Stripe payment links or confirm migration plan
  return `https://aivass.com/guides/${slug}`;
}

export function guideSampleUrl(slug: string): string {
  return `https://aivass.com/samples/${slug}-sample.pdf`;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}
