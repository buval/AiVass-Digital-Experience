// Real AiVass guide products — sourced from /api/guides on the live site (2026-08-10)
// DO NOT edit names, slugs, descriptions or prices without confirming against live Stripe products.
// Purchase CTAs currently link to https://aivass.com/guides/${slug} until checkout is migrated to this build.
// TODO: When checkout is migrated, replace purchaseUrl with internal Stripe payment link.
// Hero images generated 2026-08-10 — stored in public/images/

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
  sampleSlug?: string;            // /samples/${sampleSlug}-sample.pdf
  heroImage: string;              // filename from public/images/
  heroAlt: string;                // descriptive alt text
  heroTagline?: string;           // one-sentence purchase-driving line shown in the hero
  heroPosition?: string;          // CSS object-position for the hero crop (default "center 18%")
  audience: string;               // who this guide is for
  learningPoints: string[];       // what the reader will learn
  relatedGuides: string[];        // slugs of related guides (shown at bottom of detail page)
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
    heroImage: "guide-hero-eb1a-master.jpg",
    heroAlt: "Architectural blueprint spread across a refined desk — representing the strategic architecture of an EB-1A petition",
    audience: "Self-petitioners across all fields preparing an EB-1A extraordinary ability petition.",
    learningPoints: [
      "How USCIS adjudicators evaluate each of the 10 criteria",
      "How to build and structure your evidence portfolio",
      "How to frame a winning narrative across any field of endeavor",
      "The strategic architecture behind a complete, coherent petition",
    ],
    relatedGuides: ["eb1a-business", "eb1a-arts", "eb1a-athletics"],
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
    heroImage: "guide-hero-eb1a-business.jpg",
    heroAlt: "Executive leader in a refined strategic workspace — representing the authority and vision required for EB-1A Business Leader petitions",
    audience: "Founders, executives, and operators seeking an EB-1A extraordinary ability green card.",
    learningPoints: [
      "How to translate funding rounds and revenue impact into criterion evidence",
      "Mapping press coverage, board roles and speaking engagements to specific criteria",
      "Building the founder narrative USCIS recognises as extraordinary",
      "The evidence categories most commonly used by business leaders",
    ],
    relatedGuides: ["eb1a-master", "eb1a-science"],
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
    heroImage: "guide-hero-eb1a-artists.jpg",
    heroAlt: "Artist working in a contemporary studio with natural light — representing creative work as extraordinary ability evidence",
    audience: "Artists, designers, performers, and creative practitioners of all disciplines.",
    learningPoints: [
      "How exhibitions, sales records and press coverage map to the 10 criteria",
      "Building a distinguished reputation case from gallery and commercial history",
      "How creative careers translate into evidence USCIS understands",
      "Documentation strategies for subjective creative achievement",
    ],
    relatedGuides: ["eb1a-master", "eb1a-education"],
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
    heroImage: "guide-hero-eb1a-athletes.jpg",
    heroAlt: "Elite athlete in a moment of focused preparation on court — representing performance excellence and extraordinary ability",
    heroTagline: "Turn your rankings, titles and headlines into a U.S. green card — while you're still at the top of your game.",
    audience: "Professional and elite athletes and coaches across all sports and disciplines.",
    learningPoints: [
      "How rankings, championships and national team selection translate to EB-1A criteria",
      "Building a media and recognition evidence portfolio from athletic achievement",
      "Coaching credentials, high-performance program leadership, and critical role evidence",
      "The most common mistakes athletes make on EB-1A petitions",
    ],
    relatedGuides: ["eb1a-master", "eb1a-education"],
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
    heroImage: "guide-hero-eb1a-educators.jpg",
    heroPosition: "center 42%",
    heroAlt: "Professor in a university library surrounded by reference volumes — representing scholarly authority and educational impact",
    audience: "Educators, professors, curriculum leaders, and academic administrators.",
    learningPoints: [
      "How to document teaching innovation and curriculum influence as evidence",
      "Using awards, judging and publications beyond raw citation counts",
      "Building the authority narrative expected by adjudicators",
      "Evidence strategies for academics who publish less than research-focused peers",
    ],
    relatedGuides: ["eb1a-master", "eb1a-science"],
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
    heroImage: "guide-hero-eb1a-scientists.jpg",
    heroAlt: "Scientist studying research data at a precise laboratory bench — representing discovery and intellectual authority",
    audience: "Scientists, researchers, and research engineers across all scientific fields.",
    learningPoints: [
      "How to frame research impact beyond raw citation numbers",
      "Peer review service, editorial roles, and original contribution evidence",
      "Documentation strategies for patent holders and applied researchers",
      "How lab leadership, funding and interdisciplinary impact build the case",
    ],
    relatedGuides: ["eb1a-master", "eb1a-education"],
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
  heroImage: "guide-hero-eb1a-master.jpg",
  heroAlt: "Complete EB-1A collection — six guides, one strategic architecture",
  audience: "Anyone who wants comprehensive coverage of every EB-1A field and criterion.",
  learningPoints: [
    "The Master Guide: all 10 criteria and the full evidentiary framework",
    "Five field-specific guides for Business, Arts, Athletics, Education, and Science",
    "275 pages of strategic guidance, delivered instantly as PDF downloads",
  ],
  relatedGuides: [],
};

// Checkout: direct Stripe payment links — all 7 guides wired.
// Sourced from live aivass.com checkout sessions (2026-08-10).
// eb1a-arts verified 2026-08-10: checkout page loads with correct product name, price ($79), and merchant.
const STRIPE_CHECKOUT_URLS: Record<string, string> = {
  "eb1a-master":
    "https://checkout.stripe.com/c/pay/cs_live_a1J6igGyP4dI2oWFB2TmI3TAnjExUVDXZj2BTWvWyjjNX4dVjhLTumnDEz#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicGRmZGhqaWBTZHdsZGtxJz8nZmprcXdqaScpJ2R1bE5gfCc%2FJ3VuWmlsc2BaMDRXPWlfazUydG1gcUtTZ39BTV88VHddX0A2XFRmRnYwV09gfF9RU2dxdHxuUVBWUVM9aT1McU1Bc0tzTEc1aWxcR3B1M2tiXzRhdDBGNnBpPW02Zm5cVnY1NXFDb2F%2FNW9UJyknY3dqaFZgd3Ngdyc%2FcXdwYCknZ2RmbmJ3anBrYUZqaWp3Jz8nJjQ3NzY2YycpJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl",
  "eb1a-business":
    "https://checkout.stripe.com/c/pay/cs_live_a1tIkxe4xv8LtuOqq7g1kkg2GJbRiytRoYlqNkQ3wu5MnYKNcKmJopigUg#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicGRmZGhqaWBTZHdsZGtxJz8nZmprcXdqaScpJ2R1bE5gfCc%2FJ3VuWmlsc2BaMDRXPWlfazUydG1gcUtTZ39BTV88VHddX0A2XFRmRnYwV09gfF9RU2dxdHxuUVBWUVM9aT1McU1Bc0tzTEc1aWxcR3B1M2tiXzRhdDBGNnBpPW02Zm5cVnY1NXFDb2F%2FNW9UJyknY3dqaFZgd3Ngdyc%2FcXdwYCknZ2RmbmJ3anBrYUZqaWp3Jz8nJjQ3NzY2YycpJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl",
  "eb1a-arts":
    "https://checkout.stripe.com/g/pay/cs_live_a15wx9u5OVR4ufYtKnNzMHFJVLOe3lzHMVmtIwaKAy1ZpyBw4jHgVkbPEf#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicGRmZGhqaWBTZHdsZGtxJz8ncXdgZHFoYGtxWjcnKSdicGRmZGhqaWBMa2xxVXdgY2BxZm1TZHdsZGtxJz8nZmprcXdqaScpJ2JwZGZkaGppYElqZGFsa2JWZndgYGtTZHdsZGtxJz8nZmprcXdqaScpJ2R1bE5gfCc%2FJ3VuWmlsc2BaMDRXPWlfazUydG1gcUtTZ39BTV88VHddX0A2XFRmRnYwV09gfF9RU2dxdHxuUVBWUVM9aT1McU1Bc0tzTEc1aWxcR3B1M2tiXzRhdDBGNnBpPW02Zm5cVnY1NXFDb2F%2FNW9UJyknY3dqaFZgd3Ngdyc%2FcXdwYCknZ2RmbmJ3anBrYUZqaWp3Jz8nJjQ3NzY2YycpJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl",
  "eb1a-athletics":
    "https://checkout.stripe.com/c/pay/cs_live_a1aP4iZSr7AGwNTwGeyVY8b29UHzyjs4SrIEvxKNQFUYm77f3ltiDGcCWV#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicGRmZGhqaWBTZHdsZGtxJz8nZmprcXdqaScpJ2R1bE5gfCc%2FJ3VuWmlsc2BaMDRXPWlfazUydG1gcUtTZ39BTV88VHddX0A2XFRmRnYwV09gfF9RU2dxdHxuUVBWUVM9aT1McU1Bc0tzTEc1aWxcR3B1M2tiXzRhdDBGNnBpPW02Zm5cVnY1NXFDb2F%2FNW9UJyknY3dqaFZgd3Ngdyc%2FcXdwYCknZ2RmbmJ3anBrYUZqaWp3Jz8nJjQ3NzY2YycpJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl",
  "eb1a-education":
    "https://checkout.stripe.com/c/pay/cs_live_a1dkma52P3IbDzEJcpWwnQTy2PuOAqBz8bsdCB79i7bb0e0AVniaVh7riU#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicGRmZGhqaWBTZHdsZGtxJz8nZmprcXdqaScpJ2R1bE5gfCc%2FJ3VuWmlsc2BaMDRXPWlfazUydG1gcUtTZ39BTV88VHddX0A2XFRmRnYwV09gfF9RU2dxdHxuUVBWUVM9aT1McU1Bc0tzTEc1aWxcR3B1M2tiXzRhdDBGNnBpPW02Zm5cVnY1NXFDb2F%2FNW9UJyknY3dqaFZgd3Ngdyc%2FcXdwYCknZ2RmbmJ3anBrYUZqaWp3Jz8nJjQ3NzY2YycpJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl",
  "eb1a-science":
    "https://checkout.stripe.com/c/pay/cs_live_a1SskRkmUULEBP2pRoMhu3w0djmHZEj6e2xyna9FiQ3CdkOO4ZaZof4eZU#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicGRmZGhqaWBTZHdsZGtxJz8nZmprcXdqaScpJ2R1bE5gfCc%2FJ3VuWmlsc2BaMDRXPWlfazUydG1gcUtTZ39BTV88VHddX0A2XFRmRnYwV09gfF9RU2dxdHxuUVBWUVM9aT1McU1Bc0tzTEc1aWxcR3B1M2tiXzRhdDBGNnBpPW02Zm5cVnY1NXFDb2F%2FNW9UJyknY3dqaFZgd3Ngdyc%2FcXdwYCknZ2RmbmJ3anBrYUZqaWp3Jz8nJjQ3NzY2YycpJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl",
  "eb1a-complete":
    "https://checkout.stripe.com/c/pay/cs_live_a1fwMLKlihsOJr79mhmwgznVKV4nvu0UHGmdYIVK3XU05sIpcKUxNqcHSg#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicGRmZGhqaWBTZHdsZGtxJz8nZmprcXdqaScpJ2R1bE5gfCc%2FJ3VuWmlsc2BaMDRXPWlfazUydG1gcUtTZ39BTV88VHddX0A2XFRmRnYwV09gfF9RU2dxdHxuUVBWUVM9aT1McU1Bc0tzTEc1aWxcR3B1M2tiXzRhdDBGNnBpPW02Zm5cVnY1NXFDb2F%2FNW9UJyknY3dqaFZgd3Ngdyc%2FcXdwYCknZ2RmbmJ3anBrYUZqaWp3Jz8nJjQ3NzY2YycpJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl",
};

export function guideCheckoutUrl(slug: string): string {
  return STRIPE_CHECKOUT_URLS[slug] ?? `https://aivass.com/guides/${slug}`;
}

export function guideSampleUrl(slug: string): string {
  return `/samples/${slug}-sample.pdf`;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}
