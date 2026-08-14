// Real AiVass articles — sourced from /api/posts on the live site (2026-08-10)
// Full body content migrated 2026-08-10; source: https://aivass.com/api/posts/{slug}
// Canonical URL: https://aivass.com/insights/articles/{slug}
// Old /blog/{slug} URLs redirect to /insights/articles/{slug}

export interface Article {
  id: string;
  slug: string;
  title: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  categoryLabel: string;
  tags: string[];
  excerpt: string;
  metaDescription: string;
  keywords: string[];
  readingTime: number;
  featured: boolean;
  coverImage: string | null;
  heroImage: string | null;         // hero image filename from public/images/
  heroAlt: string;                  // descriptive alt text for the hero image
  relatedGuides: string[];          // guide slugs shown at end of article
  relatedArticles: string[];        // article slugs shown as related
  hasToc: boolean;                  // show table of contents (long articles)
}

export const ARTICLES: Article[] = [
  {
    id: "from-surviving-to-thriving",
    slug: "from-surviving-to-thriving",
    title: "From Surviving to Thriving",
    author: "Maria Boukhval",
    publishedAt: "2026-08-05",
    updatedAt: "2026-08-05",
    category: "transformation",
    categoryLabel: "Field Notes",
    tags: ["deep-dive"],
    excerpt:
      "What transformation actually is — and why a different life never begins with more force. It begins with a new picture of who you are. A field note from AiVass.",
    metaDescription:
      "What transformation actually is — and why a different life never begins with more force. It begins with a new picture of who you are. A field note from AiVass.",
    keywords: ["transformation", "identity", "self-image", "personal growth", "mindset", "AiVass Field Notes"],
    readingTime: 9,
    featured: true,
    coverImage: null,
    heroImage: "article-hero-surviving-to-thriving.jpg",
    heroAlt: "Light entering through a tall doorway into a serene garden — a visual metaphor for transformation and becoming",
    relatedGuides: ["eb1a-master"],
    relatedArticles: ["eb1a-critical-role-criterion"],
    hasToc: false,
  },
  {
    id: "mastering-your-field-of-endeavor",
    slug: "mastering-your-field-of-endeavor",
    title: "Mastering Your Field of Endeavor: The Story That USCIS Needs to Hear",
    author: "AiVass Editorial",
    publishedAt: "2026-08-14",
    updatedAt: "2026-08-14",
    category: "eb1a-strategy",
    categoryLabel: "Articles",
    tags: ["field-of-endeavor", "petition-strategy", "deep-dive", "self-petitioner"],
    excerpt:
      "Your field of endeavor is not your job title, your SOC code, or your industry — it's the narrative thread connecting your past, present, and future. Here's how to identify, articulate, and defend it.",
    metaDescription:
      "Complete EB-1A guide to defining your field of endeavor — interactive frameworks, real-world examples across tech, science, arts and sports, common mistakes, FAQ, and a self-assessment checklist.",
    keywords: ["EB-1A", "field of endeavor", "extraordinary ability", "USCIS", "green card", "I-140", "SOC codes", "petition strategy"],
    readingTime: 21,
    featured: true,
    coverImage: null,
    heroImage: "article-hero-field-of-endeavor.jpg",
    heroAlt: "A single golden thread winding through a colonnade of stone arches toward the light — the narrative thread connecting past, present, and future",
    relatedGuides: ["eb1a-master"],
    relatedArticles: ["eb1a-critical-role-criterion"],
    hasToc: true,
  },
  {
    id: "eb1a-critical-role-criterion",
    slug: "eb1a-critical-role-criterion",
    title: "EB-1A Criterion 8: Leading or Critical Role — The Complete Evidence Guide",
    author: "AiVass Editorial",
    publishedAt: "2026-02-27",
    updatedAt: "2026-02-27",
    category: "eb1a-criteria",
    categoryLabel: "Articles",
    tags: ["criterion-8-critical-role", "evidence-collection", "deep-dive", "self-petitioner"],
    excerpt:
      "How to document, position, and defend one of the most powerful — and most misunderstood — criteria in an extraordinary ability petition.",
    metaDescription:
      "Complete guide to EB-1A Criterion 8 — Leading or Critical Role. Evidence requirements, real-world examples, expert letter strategy, and common mistakes to avoid.",
    keywords: ["EB-1A", "critical role", "leading role", "criterion 8", "extraordinary ability", "USCIS", "green card"],
    readingTime: 18,
    featured: true,
    coverImage: null,
    heroImage: "article-hero-eb1a-criterion-8.jpg",
    heroAlt: "Research documents and fountain pen on a refined desk — representing the precision required for EB-1A petition evidence",
    relatedGuides: ["eb1a-master", "eb1a-science"],
    relatedArticles: ["from-surviving-to-thriving"],
    hasToc: true,
  },
];
