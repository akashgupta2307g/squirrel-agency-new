/**
 * ============================================================
 *  CLIENTS / BRANDS — EASY EDIT FILE
 * ============================================================
 * Future me naya customer add karna ho to SIRF isi file me kaam karo.
 * App.js / CSS touch karne ki zarurat nahi.
 *
 * NEW CLIENT ADD KARNE KE STEPS:
 * 1) Logo PNG ko yahan daalo:
 *    frontend/public/images/client-yourbrand.png
 * 2) Neeche `clients` array me naya object copy-paste karo (example dekho)
 * 3) `projects` array me bhi ek short card add karo (Work / Case Studies ke liye)
 * 4) Optional: `testimonials` me ek quote add karo
 * 5) GitHub pe commit → deploy
 *
 * Logo na ho to: logo: null, monogram: "AB" (2 letters)
 * ============================================================
 */

/** Brands section (Home, Work, About) — yahan full story + sales results */
export const clients = [
  {
    name: "SM Novamart",
    slug: "sm-novamart",
    logo: "/images/client-smnovamart.png",
    sector: "Marketplace · E-commerce",
    summary:
      "We partnered with SM Novamart to fix the full sell path — from how products show up in search to how they convert on the listing page.",
    work: [
      "Amazon & Flipkart listing rebuild",
      "Title, bullet & A+ content systems",
      "Image direction for trust & click-through",
      "Performance ads to scale winning SKUs",
    ],
    results: [
      ["3.2×", "Lift in marketplace orders after listing + ads overhaul"],
      ["2.5×", "Improvement in listing conversion rate on priority SKUs"],
      ["Top ranks", "Key products pushed into stronger search visibility"],
    ],
    story:
      "SM Novamart had product potential, but weak discovery and thin listing content were leaving sales on the table. We rebuilt the catalogue language, visuals and backend fields around how buyers actually search — then backed winners with Meta and Google campaigns. The result was not vanity traffic: orders and revenue moved up together, with a repeatable system the brand can keep scaling.",
  },
  {
    name: "Zerviq",
    slug: "zerviq",
    logo: "/images/client-zerviq.png",
    sector: "Premium brand · Performance",
    summary:
      "Zerviq needed premium creative that still sells. We connected brand story, landing experience and paid media into one sales engine.",
    work: [
      "Brand creative & campaign art direction",
      "Conversion-focused landing pages",
      "Meta Ads + Google Ads management",
      "Weekly optimisation for ROAS & volume",
    ],
    results: [
      ["4×", "Growth in paid-driven sales during peak campaign windows"],
      ["Lower CPA", "Acquisition cost tightened while order volume rose"],
      ["Premium feel", "Creative that matched the product — and still converted"],
    ],
    story:
      "For Zerviq, looking expensive was not enough — the funnel had to close. We built scroll-stopping creatives, clarified the offer on-page, and ran performance campaigns with strict creative rotation. Sales climbed because every rupee of attention had a job: stop the scroll, prove value, and move the buyer to checkout.",
  },
  {
    name: "Home Shine",
    slug: "home-shine",
    logo: "/images/client-homeshine.png",
    sector: "Home & kitchen · Catalogue growth",
    summary:
      "Home Shine’s catalogue was rebuilt for clarity and conversion — then amplified with campaigns that turned browsers into buyers.",
    work: [
      "Category-ready product listings",
      "Benefit-first copy & imagery packs",
      "Marketplace health & attribute mapping",
      "Always-on ads for bestsellers",
    ],
    results: [
      ["2.8×", "Increase in monthly sales after catalogue + campaign relaunch"],
      ["Higher CTR", "Main images and titles earning more clicks from search"],
      ["Stable growth", "Bestsellers scaled without breaking unit economics"],
    ],
    story:
      "Home kitchen shoppers decide fast. We made every listing answer the obvious questions — size, use, shine, trust — then used ads to push the SKUs that already converted. Sales volume rose because discovery and conversion improved at the same time, not one at the expense of the other.",
  },
  {
    name: "Instafation",
    slug: "instafation",
    logo: null,
    monogram: "IF",
    sector: "Digital growth · Full funnel",
    summary:
      "Instafation got a joined-up growth system — positioning, creatives and acquisition working as one team instead of three separate vendors.",
    work: [
      "Brand messaging & content direction",
      "Creative packs for organic + paid",
      "Lead & sales campaign management",
      "Funnel tracking and weekly iteration",
    ],
    results: [
      ["Strong uplift", "Leads and sales grew after the full-funnel rebuild"],
      ["One rhythm", "Creative, media and landing updates in a single weekly loop"],
      ["Clearer ROI", "Spend tied to outcomes, not vanity metrics"],
    ],
    story:
      "Instafation’s challenge was fragmentation. We tightened the story, shipped creative that felt native on social, and ran acquisition with landing pages that respected the click. The brand saw meaningful sales growth because every channel reinforced the same offer — and we optimised from real conversion data every week.",
  },

  /* ---------- COPY THIS BLOCK TO ADD A NEW CLIENT ----------
  {
    name: "New Brand Name",
    slug: "new-brand-name",
    logo: "/images/client-newbrand.png",
    // logo: null,
    // monogram: "NB",
    sector: "E-commerce · Ads",
    summary: "One short line about what you did together.",
    work: [
      "Service 1",
      "Service 2",
      "Service 3",
      "Service 4",
    ],
    results: [
      ["2×", "Sales growth after launch"],
      ["Higher CTR", "Better click-through on ads / listings"],
      ["More orders", "Consistent weekly order volume"],
    ],
    story: "2–4 sentences about the challenge, what you changed, and the sales outcome.",
  },
  ---------- END EXAMPLE ---------- */
];

/** Work cards + Case Studies list — short version of each brand */
export const projects = [
  {
    name: "SM NOVAMART",
    type: "CLIENT WORK",
    desc: "Marketplace growth system that turned weak listings into high-converting storefronts — driving a sharp lift in orders and repeat sales.",
    image: "/images/client-smnovamart.png",
    tag: "E-COMMERCE",
    year: "2025",
    challenge: "Products were hard to find and harder to trust on marketplace search results.",
    strategy: "Rebuild titles, images, A+ content and ads around buyer intent.",
    outcome: "Stronger ranking, higher conversion and a clear jump in monthly sales volume.",
  },
  {
    name: "ZERVIQ",
    type: "CLIENT WORK",
    desc: "Premium brand storytelling plus performance media that moved Zerviq from quiet catalogue presence to consistent, high-ticket sales.",
    image: "/images/client-zerviq.png",
    tag: "CAMPAIGN",
    year: "2025",
    challenge: "A premium product needed premium creative and a sales funnel that matched the price.",
    strategy: "Identity-led creatives, landing clarity and Meta/Google campaigns in one rhythm.",
    outcome: "Better brand recall, stronger ROAS and a measurable rise in paid and organic orders.",
  },
  {
    name: "HOME SHINE",
    type: "CLIENT WORK",
    desc: "Home & kitchen catalogue rebuild — listing health, creative and campaigns that pushed Home Shine into serious sales momentum.",
    image: "/images/client-homeshine.png",
    tag: "E-COMMERCE",
    year: "2025",
    challenge: "Category noise was burying good products before shoppers could compare them.",
    strategy: "Benefit-led listings, sparkle-clear imagery and always-on performance loops.",
    outcome: "Visibility and conversion improved together — unlocking sustained sales growth.",
  },
  {
    name: "INSTAFATION",
    type: "CLIENT WORK",
    desc: "End-to-end digital push for Instafation — presence, creatives and acquisition built to convert attention into real revenue.",
    image: "/images/project-orbit.jpg",
    tag: "PERFORMANCE",
    year: "2025",
    challenge: "The brand needed one joined-up system instead of scattered posts and ads.",
    strategy: "Positioning, creative packs and paid media managed as a single growth engine.",
    outcome: "Faster learning cycles and a clear uplift in leads and sales.",
  },
];

/** Homepage / About quote cards — [quote, monogram, name, role] */
export const testimonials = [
  [
    "They treated our launch like their own — listings, creatives and ads finally moving as one team. Sales started compounding instead of stalling every month.",
    "SN",
    "SM NOVAMART",
    "MARKETPLACE BRAND",
  ],
  [
    "Premium creative that still sold. Zerviq’s campaigns finally looked like the product and the numbers followed — stronger orders, cleaner ROAS.",
    "ZV",
    "ZERVIQ",
    "PREMIUM BRAND",
  ],
  [
    "Home Shine’s catalogue and ads finally spoke the same language. Visibility went up, conversion went up, and monthly sales jumped with it.",
    "HS",
    "HOME SHINE",
    "HOME & KITCHEN",
  ],
];

/** Big numbers strip on homepage — update first number when clients count changes */
export const stats = [
  ["04", "Growth brands in active partnership"],
  ["11", "Disciplines under one roof"],
  ["3×+", "Typical sales lift on rebuilt catalogues"],
  ["24h", "Response on every enquiry"],
];
