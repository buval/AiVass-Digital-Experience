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
    keyTakeaways: [
      "Transformation is not a change in behavior — it is a change in identity, the internal picture you hold of who you are. Behavior is what you can see; identity is what's carrying it.",
      "Your self-image acts like a thermostat: no matter how high you set your goals, behavior drifts back to the level your identity is set to. Lasting change requires resetting the thermostat, not increasing the force applied to old habits.",
      "Willpower is a momentary lift; identity is a lifetime carry. Plans fail not from lack of discipline, but because the person inside never actually changed.",
      "The anchoring question \u201CWhat would the person I\u2019m becoming do right now?\u201D bypasses motivation and routes every choice through identity \u2014 repeated often enough, it becomes a reflex.",
      "Real transformation is gradual and quiet: feed the new identity with small consistent evidence day after day, and the landscape changes without your noticing.",
    ],
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
    keyTakeaways: [
      "EB-1A Criterion 8 requires evidence of a leading or critical role for organizations with a distinguished reputation — it centers on functional impact, not external recognition. You only need to prove one of the two role types.",
      "A leading role is defined by authority and direction (title, reporting structure, decision-making power); a critical role is defined by essentiality to outcomes regardless of title.",
      "The organization\u2019s distinguished reputation is a separate, mandatory evidentiary burden — you must prove both your role and the organization\u2019s standing independently.",
      "Strong Criterion 8 petitions present evidence across four categories: organizational documentation, quantified impact documentation, external validation (expert letters, press), and organizational reputation evidence.",
      "Expert recommendation letters must cite specific contributions, named projects, quantified impact, and explain why your expertise was uniquely critical \u2014 generic praise is immediately discounted by adjudicators.",
      "Under the Kazarian two-step, Criterion 8 evidence must connect to your broader narrative of sustained national or international acclaim, not just prove a single role in isolation.",
    ],
    faq: [
      {
        q: "What is the difference between a leading role and a critical role for EB-1A Criterion 8?",
        a: "A leading role is defined by authority and direction \u2014 your title, reporting structure, decision-making power, and team size. A critical role is defined by essentiality: your specific contributions were necessary for the organization\u2019s outcomes, regardless of your title. You only need to prove one, so choose the framing that best fits your strongest evidence.",
      },
      {
        q: "Does the size of the organization matter for Criterion 8?",
        a: "Size alone does not determine distinguished reputation. A small startup with prestigious investors, groundbreaking technology, and notable press coverage can qualify just as well as a Fortune 500 company. What matters is that the organization is recognized within its field \u2014 through rankings, media coverage, awards, or notable clients and partners.",
      },
      {
        q: "Can I use a lesser-known or startup organization for Criterion 8?",
        a: "Yes, but you must document its distinguished reputation specifically. Focus on factors such as venture funding from top-tier investors, press coverage in recognized publications, industry association recognition, notable clients or government contracts, or groundbreaking technology. Generic descriptions of the company\u2019s mission are not sufficient.",
      },
      {
        q: "How many expert recommendation letters do I need for Criterion 8?",
        a: "USCIS does not specify a number, but strong petitions typically include at least two expert letters that specifically address your Criterion 8 claim. Each letter should identify the writer\u2019s qualifications, describe your specific contributions and their impact, and explain why those contributions were critical \u2014 not merely helpful \u2014 to the organization\u2019s mission.",
      },
      {
        q: "What is the most common Request for Evidence (RFE) on Criterion 8?",
        a: "The most common RFE asks petitioners to explain how their role differed from others with similar titles. Prepare this distinction proactively: document specific contributions, outcomes, and expertise that were unique to you \u2014 not shared by peers in comparable positions \u2014 so you are not caught off guard by the request.",
      },
      {
        q: "Can I claim Criterion 8 for multiple organizations?",
        a: "Yes. You can present Criterion 8 claims for multiple organizations, which can strengthen your petition by showing a pattern of leading or critical roles rather than a single instance. Each claim requires independent evidence of your role and the organization\u2019s distinguished reputation.",
      },
    ],
  },
];
