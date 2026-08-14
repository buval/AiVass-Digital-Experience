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
  /**
   * Plain-text FAQ pairs used to emit FAQPage JSON-LD (client-side and in the
   * build-time prerender). Keep in sync with the FaqAccordion content in the
   * article body — text-only summaries, no markup.
   */
  faq?: { q: string; a: string }[];
  /**
   * Plain-text key takeaways. Rendered in the article body's Key Takeaways
   * block and injected as static HTML by the build-time prerender so non-JS
   * crawlers (LinkedIn, Perplexity, ChatGPT browsing) can read the direct answer.
   */
  keyTakeaways?: string[];
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
    keyTakeaways: [
      "A field of endeavor is the specific area of expertise in which an EB-1A applicant has demonstrated extraordinary ability — the domain of sustained national or international acclaim. It is not a job title, a SOC code, or an industry.",
      "USCIS evaluates your field of endeavor for consistency, extraordinary ability, future benefit, and qualification across all ten EB-1A criteria.",
      "Job titles, employers, and industries can change; the core expertise and type of contribution must stay consistent.",
      "The strongest definitions follow the formula: core domain + specialization + application context — e.g. \u201Cmachine learning engineering, with specialization in NLP as applied to healthcare.\u201D",
      "SOC codes are administrative classifications, not limits on your field — your field can span multiple SOC codes as your career advances (USCIS Policy Manual, Vol. 6, Part F, Ch. 2).",
    ],
    faq: [
      {
        q: "Can my field of endeavor be interdisciplinary?",
        a: "Yes, but frame it carefully. Choose a primary field that has an established community of practitioners, recognition mechanisms (awards, conferences, publications), and clear criteria for extraordinary ability. Say \u201Cbioinformatics\u201D or \u201Ccomputational biology\u201D — not \u201CI work in both biology and computer science.\u201D",
      },
      {
        q: "I changed industries completely. Can I still make an EB-1A petition work?",
        a: "Sometimes. Ask yourself: did your core expertise transfer? Can you frame both roles under one broader field? Do you have recognition in the new field? A Software Engineer who became a Product Manager can work under \u201Cuser-centric product development for consumer applications\u201D; a Chemical Engineer who became a Real Estate Investor has no obvious connecting field.",
      },
      {
        q: "Should my field of endeavor use academic language or everyday language?",
        a: "Use professional language that is accessible but precise. \u201CEthical AI development, specifically addressing bias in machine learning systems\u201D is precise without being either too academic or too casual.",
      },
      {
        q: "USCIS said my field of endeavor was too broad. What now?",
        a: "Narrow the definition with specific expertise areas, provide context about what the field includes and excludes, show clear boundaries by referencing specific communities, journals, and conferences, and reframe your evidence to emphasize depth in the narrower field. Example: \u201CMy field is growth marketing for B2B SaaS companies\u201D instead of \u201CMy field is marketing.\u201D",
      },
      {
        q: "I have achievements in two separate fields. Which should I choose for EB-1A?",
        a: "Choose the field where you have more recent recognition, stronger evidence across multiple USCIS criteria, clearer future plans in the U.S., and better recommendation letters. One strong field beats two weak fields.",
      },
      {
        q: "Can I work in a different field after my green card is approved?",
        a: "Technically yes — the green card does not restrict your job. However, your I-140 petition is tied to your stated field and future plans, and changing fields immediately after approval could raise questions. It is safest to continue in your field for at least 1\u20132 years post-approval.",
      },
      {
        q: "What if my field of endeavor is very new or emerging?",
        a: "Emerging fields can work if you can demonstrate a community of practitioners, recognition mechanisms, and precedent. Fields like prompt engineering for large language models and CRISPR applications have worked. The key is showing it is a field — with practitioners and standards — not just a trend or a tool.",
      },
    ],
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
