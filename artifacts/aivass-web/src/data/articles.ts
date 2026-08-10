// Real AiVass articles — sourced from /api/posts on the live site (2026-08-10)
// Two articles currently published. Article body content must be fetched from the live API or CMS.
// TODO: Fetch full article body content from API or owner-supplied source before launch.
// Current URLs: aivass.com/blog/${slug} → new URL: aivass.com/articles/${slug}
// Redirect required: /blog/from-surviving-to-thriving → /articles/from-surviving-to-thriving
// Redirect required: /blog/eb1a-critical-role-criterion → /articles/eb1a-critical-role-criterion

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
  // body: string — full HTML body not yet migrated; owner must supply or connect to API
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
  },
];
