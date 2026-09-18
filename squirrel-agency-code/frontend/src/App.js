import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import axios from "axios";
import "@/App.css";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO = "/logo.svg";
const img = (n) => `/images/${n}.jpg`;
const images = {
  hero: img("hero"),
  workspace: img("workspace"),
  studioA: img("studio-a"),
  studioB: img("studio-b"),
  office: img("about-office"),
  founder: img("founder"),
};
const services = [
  ["01", "Website Development", "Custom websites with editorial clarity, fast load times, clear information architecture and conversion paths built into every page — from brand sites to multi-page product experiences.", "website-development"],
  ["02", "Landing Page Development", "Single-purpose landing pages engineered for campaigns, launches and lead capture — sharp messaging, proof, and a friction-free next step.", "landing-page-development"],
  ["03", "SEO", "Technical SEO, on-page structure, content systems and authority building that compound discoverability long after the campaign ends.", "seo"],
  ["04", "Meta Ads", "Facebook and Instagram campaigns with scroll-stopping creative, tight audience strategy and weekly optimisation around real business goals.", "meta-ads"],
  ["05", "Google Ads", "Search, Performance Max and remarketing built around high-intent keywords — so you meet buyers when they are already looking.", "google-ads"],
  ["06", "Campaign Management", "One operating rhythm across creative, media, landing pages and reporting — so every channel reinforces the same story.", "campaign-management"],
  ["07", "Poster Design", "Campaign posters, social visuals and print-ready artwork with cultural edge — made to stop people and stick in memory.", "poster-design"],
  ["08", "UGC Video Creation", "Native short-form video that feels human, not corporate — scripts, hooks and edits built for Reels, Shorts and paid social.", "ugc-video-creation"],
  ["09", "Amazon Product Listing", "Keyword-rich titles, A+ content, image systems and listing health so your product ranks, looks trustworthy and converts.", "amazon-product-listing"],
  ["10", "Flipkart Product Listing", "Category-ready Flipkart listings with clean attributes, benefit-led copy and imagery that reduces bounce and lifts orders.", "flipkart-product-listing"],
  ["11", "Myntra Product Listing", "Fashion-first Myntra catalog work — fit, fabric, styling cues and studio imagery that help shoppers choose with confidence.", "myntra-product-listing"],
];
const serviceDetails = {
  "website-development": {
    opportunity: "Your website is often the first serious conversation a buyer has with your brand. We design and build sites that look considered, load fast, and guide people toward enquiry, purchase or booking — without the usual agency fluff.",
    points: [
      ["01 / STRATEGY & IA", "Sitemap, messaging hierarchy and page jobs defined before a single layout is drawn."],
      ["02 / DESIGN SYSTEM", "Typography, colour, components and motion that scale across every page."],
      ["03 / BUILD & PERFORMANCE", "Clean front-end engineering, responsive layouts, SEO basics and conversion-minded CTAs."],
      ["04 / LAUNCH SUPPORT", "QA, analytics setup, handover docs and a clear path for future updates."],
    ],
    forWho: "Startups, D2C brands, service businesses and founders who need a digital home that matches the ambition of the product.",
  },
  "landing-page-development": {
    opportunity: "Homepages try to do everything. Landing pages do one job: turn traffic into a next step. We build focused pages for ads, launches and lead magnets — copy, design and proof working as one.",
    points: [
      ["01 / OFFER CLARITY", "Headline, promise and proof aligned to the campaign that sends the traffic."],
      ["02 / CONVERSION LAYOUT", "Above-the-fold clarity, social proof, objection handling and a single primary CTA."],
      ["03 / SPEED & TRACKING", "Fast load, mobile-first layout, pixel and form tracking ready for ads."],
      ["04 / ITERATION", "A structure you can A/B test as creative and audiences evolve."],
    ],
    forWho: "Teams running Meta, Google or influencer traffic who need the page to close the loop.",
  },
  seo: {
    opportunity: "Paid media stops when the budget stops. SEO builds a durable path to demand. We fix the foundations, structure content for intent, and set up a system that compounds over months — not overnight hacks.",
    points: [
      ["01 / TECHNICAL AUDIT", "Crawlability, indexation, Core Web Vitals, site structure and critical fixes."],
      ["02 / ON-PAGE SYSTEMS", "Title patterns, internal linking, schema and content briefs tied to real queries."],
      ["03 / CONTENT ROADMAP", "Topic clusters and page priorities mapped to commercial intent."],
      ["04 / MEASUREMENT", "Search Console, ranking tracking and a monthly review cadence."],
    ],
    forWho: "Brands ready to invest in organic growth alongside (or instead of) paid acquisition.",
  },
  "meta-ads": {
    opportunity: "Meta rewards relevance. We pair strong creative with disciplined audience and budget management so your brand shows up in the feed with a reason to stop — and a clear next action.",
    points: [
      ["01 / CREATIVE STRATEGY", "Hooks, angles and formats built for Reels, Stories and feed."],
      ["02 / AUDIENCE ARCHITECTURE", "Prospecting, retargeting and lookalikes structured around your funnel."],
      ["03 / MEDIA MANAGEMENT", "Daily monitoring, creative rotation and budget shifts toward what works."],
      ["04 / REPORTING", "Clear weekly reads on spend, CPA, ROAS and learning — not vanity charts."],
    ],
    forWho: "D2C, local businesses and service brands that need Meta to become a predictable growth channel.",
  },
  "google-ads": {
    opportunity: "Google captures intent. We build search and Performance Max campaigns that meet buyers mid-research — with tight keyword strategy, useful ad copy and landing pages that match the query.",
    points: [
      ["01 / KEYWORD STRATEGY", "High-intent themes, negatives and match types that protect budget."],
      ["02 / AD CRAFT", "RSA copy, assets and extensions that speak to the query behind the click."],
      ["03 / FUNNEL ALIGNMENT", "Landing pages and offers matched to each campaign cluster."],
      ["04 / OPTIMISATION", "Bid strategy, search-term mining and weekly creative/offer tests."],
    ],
    forWho: "Businesses with clear offers and buyers who already search for what you sell.",
  },
  "campaign-management": {
    opportunity: "Channels fail when they operate in silos. We run campaigns as one system — message, creative, media and landing experience managed together so learning compounds across the stack.",
    points: [
      ["01 / CAMPAIGN BLUEPRINT", "Goals, offers, audiences and channel roles defined up front."],
      ["02 / CREATIVE OPS", "Asset calendars, variants and testing queues that keep momentum."],
      ["03 / CROSS-CHANNEL RHYTHM", "Meta, Google, organic and landing updates in one weekly loop."],
      ["04 / INSIGHT LOOPS", "What worked, what did not, and what we change next — written clearly."],
    ],
    forWho: "Founders who want one accountable team instead of juggling freelancers and platforms.",
  },
  "poster-design": {
    opportunity: "A strong visual stops the scroll and carries the campaign. We design posters and key visuals with typography, composition and cultural instinct — ready for social, outdoor, print or event.",
    points: [
      ["01 / CONCEPT DIRECTION", "Mood, message and visual metaphor locked before production."],
      ["02 / ART DIRECTION", "Layout systems that work across sizes without losing impact."],
      ["03 / PRODUCTION FILES", "Print-ready and digital exports with clear usage notes."],
      ["04 / CAMPAIGN VARIANTS", "Formats for feed, stories, banners and physical applications."],
    ],
    forWho: "Brands launching products, events, seasons or culture-led campaigns that need a memorable face.",
  },
  "ugc-video-creation": {
    opportunity: "People trust people more than polish. We create UGC-style short video — hooks, scripts and edits — that feel native on social and still sell the product with clarity.",
    points: [
      ["01 / BRIEF & HOOKS", "Angles, talking points and first-three-second hooks for each asset."],
      ["02 / PRODUCTION", "Creator-led or studio shoots with brand-safe but human delivery."],
      ["03 / EDIT & CAPTIONS", "Pacing, text overlays and cuts built for mobile sound-off viewing."],
      ["04 / AD-READY PACKS", "Multiple cuts for organic and paid, organised by funnel stage."],
    ],
    forWho: "E-commerce and consumer brands that need video creative that performs without looking like an ad.",
  },
  "amazon-product-listing": {
    opportunity: "On Amazon, the listing is the storefront. We optimise titles, bullets, images and A+ content so shoppers find you, trust you and choose you over the next option in the SERP.",
    points: [
      ["01 / KEYWORD RESEARCH", "Search terms mapped into title, bullets and backend fields."],
      ["02 / COPY SYSTEMS", "Benefit-led bullets and A+ modules that answer objections."],
      ["03 / IMAGE DIRECTION", "Main image, lifestyle, infographics and detail shots that convert."],
      ["04 / LISTING HEALTH", "Compliance checks and iteration based on search and conversion signals."],
    ],
    forWho: "Brands and sellers who want Amazon to be a growth channel, not just a catalogue dump.",
  },
  "flipkart-product-listing": {
    opportunity: "Flipkart rewards clear category fit and trustworthy presentation. We build listings with accurate attributes, persuasive copy and imagery that reduce returns and lift conversion.",
    points: [
      ["01 / CATEGORY MAPPING", "Correct taxonomy, attributes and filters so you show up in the right searches."],
      ["02 / LISTING COPY", "Titles and descriptions written for Flipkart shopper behaviour."],
      ["03 / VISUAL PACK", "Clean product photography direction and benefit frames."],
      ["04 / OPTIMISATION", "Ongoing tweaks based on visibility, CTR and order quality."],
    ],
    forWho: "Sellers expanding on Flipkart who need listings that compete on clarity, not just price.",
  },
  "myntra-product-listing": {
    opportunity: "Fashion discovery is visual and detail-sensitive. We craft Myntra listings that communicate fit, fabric, occasion and style — so shoppers can decide without second-guessing.",
    points: [
      ["01 / FASHION ATTRIBUTES", "Fit, fabric, pattern, occasion and style cues filled accurately."],
      ["02 / CATALOG STORY", "Copy that sells the look without overselling the product."],
      ["03 / STUDIO IMAGERY", "Model and flat-lay direction aligned with Myntra browsing habits."],
      ["04 / SEASON READY", "Variants and refreshes timed for drops, sales and trends."],
    ],
    forWho: "Apparel and lifestyle brands that need Myntra presence to feel as sharp as the collection.",
  },
};
const projects = [
  { name: "NOVA / D2C SKINCARE", type: "CONCEPT PROJECT", desc: "A quieter, faster storefront for a new generation of skincare — product storytelling, routine education and a checkout path designed for first-time buyers.", image: img("project-nova"), tag: "E-COMMERCE", year: "2026" },
  { name: "ATLAS / PRODUCT LAUNCH", type: "DEMO CASE STUDY", desc: "A full launch system — landing page, campaign creative and performance media — designed to give one sharp product idea a long runway.", image: img("project-atlas"), tag: "CAMPAIGN", year: "2026" },
  { name: "ORBIT / GROWTH ENGINE", type: "CONCEPT PROJECT", desc: "From first click to repeat purchase: website, ads and retention creative working as one ecosystem for sustainable momentum.", image: img("project-orbit"), tag: "PERFORMANCE", year: "2025" },
  { name: "FORM / STUDIO EDIT", type: "DEMO CASE STUDY", desc: "An editorial identity and content system that lets product photography and brand personality share the same frame across web and social.", image: img("project-form"), tag: "CREATIVE", year: "2025" },
];
const serviceVisuals = [img("svc-web"), img("svc-landing"), img("svc-seo"), img("svc-meta"), img("svc-google"), img("svc-campaign"), img("svc-poster"), img("svc-ugc"), img("svc-amazon"), img("svc-flipkart"), img("svc-myntra")];
const stats = [["11", "Disciplines under one roof"], ["03", "Marketplaces covered end-to-end"], ["24h", "Response on every enquiry"], ["100%", "Founder-led, senior attention"]];
const testimonials = [
  ["They treated our launch like their own — strategy, design and ads finally moving as one team. The website, creatives and campaigns stopped feeling like three different agencies.", "RS", "R. SHARMA", "D2C FOUNDER"],
  ["Fast, honest and unusually detail-obsessed. The website finally matches the product, and the landing pages actually convert the traffic we pay for.", "AM", "A. MEHTA", "SAAS CO-FOUNDER"],
  ["One team for the website, the creatives and the campaigns meant zero handoff chaos. Decisions got faster and the work felt sharper every week.", "KP", "K. PATEL", "RETAIL BRAND OWNER"],
];
const insights = [
  ["MARKETING", "Why your landing page — not your homepage — closes the sale", "4 MIN READ", "/insights/landing-page-vs-homepage"],
  ["E-COMMERCE", "The marketplace listing checklist we run before every launch", "6 MIN READ", "/insights/marketplace-listing-checklist"],
  ["CREATIVE", "Creative that converts: building ads people actually stop for", "5 MIN READ", "/insights/creative-that-converts"],
];
const filterMap = { Websites: ["WEBSITE"], Marketing: ["MARKETING", "CAMPAIGN", "PERFORMANCE"], Creative: ["CREATIVE"], "E-commerce": ["E-COMMERCE", "ECOMMERCE"] };
const matchFilter = (p, f) => { const tag = (p.tag || "").toUpperCase(); return (filterMap[f] || []).some((t) => tag.includes(t)); };
const normalizeProject = (project) => ({ ...project, name: project.title || project.name, image: project.cover_image || project.image, tag: project.category || project.tag, desc: project.summary || project.desc, type: project.status_label || project.type });
const useProjects = () => { const [items, setItems] = useState(projects); useEffect(() => { axios.get(`${API}/projects`).then(({ data }) => setItems([...data.map(normalizeProject), ...projects])).catch(() => {}); }, []); return items; };
const ease = [0.22, 1, 0.36, 1];

function Image({ src, alt, className = "", eager = false }) { return <img className={className} src={src} alt={alt} loading={eager ? "eager" : "lazy"} fetchpriority={eager ? "high" : undefined} onError={(e) => { e.currentTarget.src = images.workspace; }} />; }
function Reveal({ children, className = "", delay = 0, ...props }) { return <motion.div className={className} initial={{ opacity: 0, y: 44 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.9, delay, ease }} {...props}>{children}</motion.div>; }
function SectionHead({ eyebrow, title, text }) { return <div className="section-heading"><Reveal><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></Reveal>{text && <Reveal delay={0.12}><p>{text}</p></Reveal>}</div>; }
function Logo() { return <img className="logo-mark" src={LOGO} alt="The Squirrel Agency logo" />; }

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const location = useLocation();
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 24); onScroll(); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { setOpen(false); setDrop(false); }, [location.pathname]);
  const links = [["About", "/about"], ["Work", "/work"], ["Insights", "/insights"], ["Case Studies", "/case-studies"], ["Contact", "/contact"]];
  return <header className={`site-header ${scrolled ? "is-scrolled" : ""}`} data-testid="site-header">
    <Link to="/" className="brand-mark" data-testid="header-logo-link" aria-label="The Squirrel Agency — home"><Logo /></Link>
    <nav className="desktop-nav" aria-label="Main navigation">
      <NavLink to="/" end data-testid="nav-home">Home</NavLink>
      <div className="nav-item" onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
        <NavLink to="/services" data-testid="nav-services" aria-haspopup="true" aria-expanded={drop} onFocus={() => setDrop(true)} onBlur={() => setDrop(false)}>Services <i className="caret">▾</i></NavLink>
        <AnimatePresence>{drop && <motion.div className="nav-dropdown" data-testid="services-dropdown" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.22, ease }}>
          {services.map((s) => <Link key={s[3]} to={`/services/${s[3]}`} data-testid={`dropdown-${s[3]}`}><span>{s[0]}</span>{s[1]}</Link>)}
        </motion.div>}</AnimatePresence>
      </div>
      {links.map(([label, path]) => <NavLink key={path} to={path} data-testid={`nav-${label.toLowerCase().replaceAll(" ", "-")}`}>{label}</NavLink>)}
    </nav>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open} data-testid="mobile-menu-button"><span></span><span></span></button>
    {open && <nav className="mobile-nav" aria-label="Mobile navigation">{[["Home", "/"], ["Services", "/services"], ...links].map(([label, path]) => <Link onClick={() => setOpen(false)} key={path} to={path} data-testid={`mobile-nav-${label.toLowerCase().replaceAll(" ", "-")}`}>{label}</Link>)}</nav>}
  </header>;
}

function Footer() { return <footer className="footer"><div className="footer-top"><Logo /><div className="footer-claim" data-testid="footer-claim">Technology.<br />Creativity.<br /><em>Performance.</em></div></div><div className="footer-grid"><div><span className="eyebrow">NAVIGATE</span>{[["Home", "/"], ["Services", "/services"], ["About", "/about"], ["Work", "/work"], ["Insights", "/insights"], ["Case Studies", "/case-studies"], ["Contact", "/contact"]].map(([x, p]) => <Link key={p} to={p} data-testid={`footer-${x.toLowerCase().replaceAll(" ", "-")}`}>{x}</Link>)}</div><div><span className="eyebrow">DISCIPLINES</span>{services.slice(0, 6).map((s) => <Link key={s[3]} to={`/services/${s[3]}`} data-testid={`footer-service-${s[3]}`}>{s[1]}</Link>)}</div><div><span className="eyebrow">START A CONVERSATION</span><a href="tel:+919277477048" data-testid="footer-phone">+91 92774 77048</a><a href="mailto:info.thesquirrelagency@gmail.com" data-testid="footer-email">info.thesquirrelagency@gmail.com</a><a href="https://instagram.com/thesquirrel_agency" target="_blank" rel="noreferrer" data-testid="footer-instagram">@thesquirrel_agency</a><span className="footer-address" data-testid="footer-location">India · working worldwide</span></div></div><div className="footer-bottom"><span data-testid="footer-copyright">© 2026 The Squirrel Agency. All rights reserved.</span><div><Link to="/privacy" data-testid="footer-privacy">Privacy Policy</Link><Link to="/terms" data-testid="footer-terms">Terms</Link></div></div></footer>; }

function Hero() {
  const full = "WE BUILD DIGITAL EXPERIENCES THAT MOVE BRANDS.";
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const reduce = useRef(typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches).current;
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yVisual = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yChipA = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yChipB = useTransform(scrollYProgress, [0, 1], [0, 70]);
  useEffect(() => { let i = 0; const timer = setInterval(() => { i += 1; setText(full.slice(0, i)); if (i >= full.length) { clearInterval(timer); setDone(true); } }, 34 + Math.random() * 22); return () => clearInterval(timer); }, []);
  const onMove = (e) => { if (reduce) return; setTilt({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 }); };
  return <section className="hero" ref={heroRef} onMouseMove={onMove}>
    <div className="hero-copy">
      <div className="eyebrow hero-eyebrow" data-testid="hero-eyebrow">THE SQUIRREL AGENCY · EST. 2026</div>
      <h1 className={done ? "done" : ""} data-testid="hero-headline">{text}<span className="reveal-space">&nbsp;</span></h1>
      <motion.div className="hero-bottom" initial={{ opacity: 0, y: 26 }} animate={done ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease }}>
        <p data-testid="hero-subheading">Technology, creativity and performance marketing for ambitious brands — websites, campaigns, SEO and marketplace growth under one roof in Kanpur, working worldwide.</p>
        <div className="hero-actions"><Link className="button button-accent" to="/contact" data-testid="hero-start-project">Start a project <span>↗</span></Link><Link className="button button-quiet" to="/work" data-testid="hero-view-work">View our work <span>↗</span></Link></div>
      </motion.div>
    </div>
    <motion.div className="hero-visual" style={{ y: yVisual }} data-testid="hero-visual">
      <Image src={images.hero} alt="Red editorial studio light representing a digital idea in motion" eager />
      <div className="hero-tint" />
      <motion.div className="hero-chip chip-a" style={{ y: yChipA }}><div className="chip-inner" style={{ transform: `translate(${tilt.x * 16}px, ${tilt.y * 12}px)` }}><span>CONVERSION SIGNAL</span><div className="bars"><i style={{ height: "34%" }} /><i style={{ height: "58%" }} /><i style={{ height: "42%" }} /><i style={{ height: "76%" }} /><i style={{ height: "96%" }} /></div><strong>MOMENTUM ↑</strong></div></motion.div>
      <motion.div className="hero-chip chip-b" style={{ y: yChipB }}><div className="chip-inner" style={{ transform: `translate(${tilt.x * -12}px, ${tilt.y * -10}px)` }}><span>CAMPAIGN / LIVE</span><strong>ATTENTION → ACTION</strong></div></motion.div>
    </motion.div>
    <div className="hero-index">01 — 04</div>
  </section>;
}

function Marquee() { const items = [...services.map((s) => s[1]), "E-COMMERCE"]; const loop = [...items, ...items]; return <div className="marquee" data-testid="capabilities-marquee" aria-hidden="true"><div>{loop.map((x, i) => <span key={`${x}-${i}`}>{x} <b>✳</b></span>)}</div></div>; }

function Stats() { return <section className="light stats-band" data-testid="stats-strip"><Reveal className="stats">{stats.map(([n, l], i) => <div className="stat" key={l} data-testid={`stat-${i + 1}`}><b>{n}</b><span>{l}</span></div>)}</Reveal></section>; }

function WorkSection({ compact = false, filter = "All" }) {
  const items = useProjects();
  const shown = filter === "All" ? items : items.filter((p) => matchFilter(p, filter));
  return <section className={`section light work-section ${compact ? "compact" : ""}`}><SectionHead eyebrow="03 / SELECTED WORK" title={<>Selected<br /><em>work.</em></>} text="Digital experiences built to perform. Concepts, systems and campaigns with a point of view." /><div className="project-grid">{shown.map((p, i) => <Reveal key={p.id || p.name} delay={(i % 2) * 0.08}><Link to="/case-studies" className="project-card" data-testid={`project-card-${i}`}><div className="project-image"><Image src={p.image} alt={`${p.name} ${p.tag} project visual`} /><span className="project-arrow">↗</span></div><div className="project-meta"><div><span className="project-type">{p.type}</span><h3>{p.name}</h3><p>{p.desc}</p></div><div className="project-side"><span>{p.tag}</span><span>{p.year}</span></div></div></Link></Reveal>)}</div>{!shown.length && <p data-testid="no-projects" style={{ color: "var(--muted)" }}>No projects in this category yet.</p>}</section>;
}

function ServicesSection() {
  const [active, setActive] = useState(0);
  return (
    <section className="section light services-section">
      <SectionHead eyebrow="04 / WHAT WE DO" title={<>Eleven disciplines.<br /><em>One team.</em></>} text="Strategy, creative, technology and performance — connected from the first question to the last click. Click any service to open the full brief." />
      <div className="services-interaction">
        <div className="service-list">
          {services.map((s, i) => (
            <Link
              key={s[3]}
              to={`/services/${s[3]}`}
              className={`service-row ${active === i ? "active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              data-testid={`service-row-${s[3]}`}
            >
              <span>{s[0]}</span>
              <strong>{s[1]}</strong>
              <i>↗</i>
            </Link>
          ))}
        </div>
        <Link
          to={`/services/${services[active][3]}`}
          className="service-preview"
          data-testid="service-preview-link"
          aria-label={`Open ${services[active][1]}`}
        >
          <Image src={serviceVisuals[active]} alt={`${services[active][1]} visual`} />
          <div className="preview-label">
            <span>{services[active][0]} / {services[active][1]}</span>
            <p>{services[active][2]}</p>
            <span className="service-explore">Explore this service ↗</span>
          </div>
        </Link>
      </div>
    </section>
  );
}

function StudioBand() { return <section className="section light studio-band"><Reveal className="studio-copy"><span className="eyebrow">05 / CREATIVE STUDIO</span><h2>Designed to be seen.<br /><em>Built to perform.</em></h2><p>Campaign worlds, product stories, posters and social-native creative that earn attention without shouting. We treat every asset as part of a larger system — so the brand feels consistent from the first impression to the last click.</p><Link to="/work" className="text-link" data-testid="studio-work-link">Explore the studio <span>↗</span></Link></Reveal><Reveal className="studio-collage" delay={0.1}><Image src={images.studioA} alt="Creative studio design workspace with colour studies" /><Image src={images.studioB} alt="Graphic design and print production detail" /><span>MAKE<br />THE<br /><em>MEMORY</em></span></Reveal></section>; }

function Funnel() { return <section className="section funnel-section"><SectionHead eyebrow="06 / PERFORMANCE" title={<>From attention<br /><em>to action.</em></>} text="A joined-up growth system that respects the idea, the audience and the numbers — traffic is only useful when it turns into engagement, leads, conversions and retention." /><div className="funnel" data-testid="performance-funnel">{[["Traffic", "Reach the right people with search, social and content."], ["Engagement", "Earn attention with creative that feels relevant, not loud."], ["Leads", "Capture intent with landing pages and offers that respect the click."], ["Conversions", "Remove friction between interest and purchase or enquiry."], ["Retention", "Stay useful after the first sale with content and remarketing."], ["Growth", "Turn learning into a durable advantage across channels."]].map(([x, d], i) => <Reveal className={`funnel-step step-${i}`} key={x} delay={i * 0.07} data-testid={`funnel-step-${x.toLowerCase()}`}><span>0{i + 1}</span><strong>{x}</strong><p className="funnel-desc">{d}</p><i>↓</i></Reveal>)}</div></section>; }

function Marketplace() { return <section className="section light marketplace"><Reveal><span className="eyebrow">07 / MARKETPLACE GROWTH</span><h2>Built to sell<br /><em>everywhere.</em></h2><p>From title optimisation and A+ content to image direction and category attributes, we make the product easier to find, trust and choose on Amazon, Flipkart and Myntra — the same commercial instinct, tailored to each platform.</p></Reveal><Reveal className="market-grid" delay={0.1}>{[["AMAZON", "Title optimisation · A+ content · Image systems · Listing health", img("mkt-amazon")], ["FLIPKART", "Category mapping · Attribute accuracy · Benefit-led copy · Visual packs", img("mkt-flipkart")], ["MYNTRA", "Fashion attributes · Studio imagery · Catalog storytelling · Season refreshes", img("mkt-myntra")]].map(([x, y, src]) => <div className="market-card" key={x} data-testid={`marketplace-${x.toLowerCase()}`}><Image src={src} alt={`${x} marketplace product visual`} /><div><strong>{x}</strong><span>{y}</span></div></div>)}</Reveal></section>; }

function Process() { return <section className="section light process-section"><SectionHead eyebrow="08 / THE METHOD" title={<>How we<br /><em>work.</em></>} text="Good work is not a reveal. It is a rhythm — clear questions, brave decisions, measured iteration. Every engagement follows the same spine so progress stays visible." /><div className="timeline">{["Discover", "Strategize", "Design", "Develop", "Launch", "Optimize", "Scale"].map((x, i) => <Reveal className="timeline-step" key={x} delay={i * 0.05} data-testid={`process-step-${x.toLowerCase()}`}><span>0{i + 1}</span><strong>{x}</strong><p>{["Find the real problem underneath the brief — audience, offer, constraints and what success must look like.", "Make the point of view impossible to miss: positioning, message hierarchy and channel roles.", "Shape the system, story and experience across web, creative and campaign touchpoints.", "Build it cleanly, quickly and to last — performance, accessibility and handover included.", "Put the work in front of the right people with tracking, QA and a calm go-live plan.", "Read the signal, refine the response — creative, media and page tests every week.", "Turn momentum into a durable advantage: systems, content and playbooks that keep compounding."][i]}</p></Reveal>)}</div></section>; }

function Testimonials() { return <section className="section testimonials-section"><SectionHead eyebrow="09 / KIND WORDS" title={<>Trusted in<br /><em>the room.</em></>} text="Sample quotes shown while client references are being collected — the care, pace and obsession with detail are real." /><div className="testimonial-grid">{testimonials.map((t, i) => <Reveal className="testimonial" key={t[2]} delay={i * 0.08} data-testid={`testimonial-${i + 1}`}><span className="quote-mark">“</span><p>{t[0]}</p><div className="testimonial-who"><span className="monogram">{t[1]}</span><div><strong>{t[2]}</strong><span>{t[3]}</span></div></div></Reveal>)}</div></section>; }

function Insights() { return <section className="section light insights-section"><SectionHead eyebrow="10 / INSIGHTS" title={<>Notes from<br /><em>the field.</em></>} text="Short field notes on landing pages, marketplace listings and creative that converts — practical thinking from the work, not theory decks." /><div className="insight-grid">{insights.map((t, i) => <Reveal key={t[1]} delay={i * 0.08}>{t[3] ? <Link to={t[3]} className="insight-card insight-linked" data-testid={`insight-card-${i + 1}`}><span className="insight-tag">{t[0]}</span><h3>{t[1]}</h3><div className="insight-meta"><span>{t[2]}</span><span>READ NOW ↗</span></div></Link> : <div className="insight-card" data-testid={`insight-card-${i + 1}`}><span className="insight-tag">{t[0]}</span><h3>{t[1]}</h3><div className="insight-meta"><span>{t[2]}</span><span>COMING SOON</span></div></div>}</Reveal>)}</div></section>; }

function AboutTeaser() { return <section className="section light about-teaser"><Reveal><span className="eyebrow">11 / A POINT OF VIEW</span><h2>We don’t just<br />make things look good.<br /><em>We make them work.</em></h2></Reveal><Reveal delay={0.12}><p>The Squirrel Agency is a digital-first creative and performance studio for ambitious brands that want their next chapter to matter — founded in Kanpur, built remote-first, and obsessed with clarity over theatre.</p><Link to="/about" className="button button-outline" data-testid="meet-agency-link">Meet the agency <span>↗</span></Link></Reveal></section>; }

function CTA() { return <section className="final-cta"><Reveal><span className="eyebrow">12 / YOUR NEXT CHAPTER</span><h2>Let’s build<br /><em>something</em><br />remarkable.</h2><p>Tell us what you’re building, what is not working, or what you want to make possible. Every enquiry gets a response within 24 hours — call, mail or WhatsApp.</p><Link to="/contact" className="button button-accent" data-testid="final-start-project">Start a project <span>↗</span></Link></Reveal></section>; }

function PageIntro({ eyebrow, title, text }) { return <section className="page-intro"><Reveal><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{text && <p>{text}</p>}</Reveal></section>; }

function Home() { return <><Header /><main><Hero /><Marquee /><Stats /><WorkSection /><ServicesSection /><StudioBand /><Funnel /><Marketplace /><Process /><Testimonials /><Insights /><AboutTeaser /><CTA /></main><Footer /></>; }

function ServicesPage() { return <><Header /><main><PageIntro eyebrow="02 / CAPABILITIES" title={<>The right people<br /><em>for the whole picture.</em></>} text="We bring the disciplines together early — strategy, design, development, media and marketplace — so the output feels like one thought, not eleven handoffs. Pick a service below to see how we approach it." /><ServicesSection /><section className="service-manifesto"><Reveal><span className="eyebrow">TECHNOLOGY · CREATIVITY · PERFORMANCE</span><h2>One team.<br /><em>More momentum.</em></h2><p className="manifesto-text">Most brands lose time between agencies, freelancers and platforms. We keep website, creative and performance in the same room so decisions stay fast, the story stays consistent, and every rupee of attention has a job.</p><Link to="/contact" className="button button-accent" data-testid="services-cta">Start a project <span>↗</span></Link></Reveal></section></main><Footer /></>; }

function ServiceDetail() {
  const { slug } = useParams();
  const index = Math.max(0, services.findIndex((s) => s[3] === slug));
  const item = services[index] || services[0];
  const detail = serviceDetails[item[3]] || serviceDetails["website-development"];
  return (
    <>
      <Header />
      <main>
        <PageIntro eyebrow={`${item[0]} / SERVICE DETAIL`} title={<>{item[1]}<br /><em>with intent.</em></>} text={item[2]} />
        <section className="light detail-hero">
          <Reveal><Image src={serviceVisuals[index]} alt={`${item[1]} detail visual`} /></Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow">THE OPPORTUNITY</span>
            <h2>Make the next<br /><em>move clearer.</em></h2>
            <p>{detail.opportunity}</p>
            <Link to="/contact" className="button button-accent" data-testid="service-detail-cta">Talk to us <span>↗</span></Link>
          </Reveal>
        </section>
        <section className="light detail-columns">
          <Reveal>
            <span className="eyebrow">WHAT YOU GET</span>
            <h2>A sharper route<br /><em>to progress.</em></h2>
            <p className="detail-for-who"><b>WHO IT’S FOR</b>{detail.forWho}</p>
          </Reveal>
          <Reveal className="detail-points" delay={0.1}>
            {detail.points.map(([label, text]) => (
              <p key={label}><b>{label}</b>{text}</p>
            ))}
          </Reveal>
        </section>
        <section className="light detail-next">
          <Reveal>
            <span className="eyebrow">NEXT STEP</span>
            <h2>Ready to brief<br /><em>this service?</em></h2>
            <p>Share your product, timeline and what “good” looks like. We’ll reply within 24 hours with a clear point of view — not a generic pitch deck.</p>
            <div className="detail-next-actions">
              <Link to="/contact" className="button button-accent" data-testid="service-detail-contact">Start a project <span>↗</span></Link>
              <Link to="/services" className="button button-outline" data-testid="service-detail-all">All services <span>↗</span></Link>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}

function AboutPage() { return <><Header /><main><PageIntro eyebrow="03 / THE AGENCY" title={<>We make digital<br /><em>matter.</em></>} text="The Squirrel Agency is a digital-first creative, technology and performance marketing studio helping ambitious brands build a stronger presence and turn attention into growth — from websites and campaigns to marketplace listings." /><section className="light about-story"><Reveal className="about-photo"><Image src={images.office} alt="Modern creative agency interior" /></Reveal><Reveal delay={0.1}><span className="eyebrow">OUR PHILOSOPHY</span><h2>Ideas should<br /><em>do something.</em></h2><p>We believe the best digital work creates a feeling, removes friction and leaves a measurable trace. That means strategy without theatre, design with a point of view and technology that gets out of the way. We would rather ship one sharp system than ten disconnected assets.</p><p>Based in Kanpur and working remote-first worldwide, we stay close to the work: founder-led attention, clear communication, and a bias toward clarity over volume.</p><div className="beliefs"><span>01 / Curiosity over convention</span><span>02 / Clarity is a creative act</span><span>03 / Every detail earns its place</span><span>04 / Performance without killing the idea</span></div></Reveal></section><section className="founder"><Reveal><span className="eyebrow">THE FOUNDER</span><h2>Akash<br /><em>Gupta.</em></h2><span className="founder-title">Founder & Creative Strategist</span></Reveal><Reveal className="founder-copy" delay={0.1}><Image src={images.founder} alt="Akash Gupta, Founder & Creative Strategist of The Squirrel Agency" /><p>Akash Gupta is the founder of The Squirrel Agency, a digital-first creative and performance marketing agency built around one simple belief — brands should not just be seen, they should be remembered.</p><p>With a strong interest in technology, creativity and digital growth, Akash brings together strategy, design, development and performance marketing to help businesses build a stronger digital presence and turn attention into measurable growth.</p><p>The studio is intentionally small and senior: fewer layers, faster decisions, and work that stays accountable from the first workshop to the weekly optimisation loop.</p></Reveal></section><CTA /></main><Footer /></>; }

function WorkPage() { const [filter, setFilter] = useState("All"); return <><Header /><main><PageIntro eyebrow="04 / WORK" title={<>Selected work.<br /><em>Different by design.</em></>} text="A selection of concept systems and demo case studies. Every project is clearly labelled — because good work does not need borrowed proof." /><div className="light" style={{ borderTop: "1px solid var(--ink-line)" }}><div className="work-filter" style={{ paddingTop: "40px" }}>{["All", "Websites", "Marketing", "Creative", "E-commerce"].map((f) => <button key={f} className={filter === f ? "selected" : ""} onClick={() => setFilter(f)} data-testid={`filter-${f.toLowerCase().replaceAll(" ", "-")}`}>{f}</button>)}</div><WorkSection compact filter={filter} /></div><CTA /></main><Footer /></>; }

function CaseStudies() { const items = useProjects(); return <><Header /><main><PageIntro eyebrow="05 / CASE STUDIES" title={<>Proof of<br /><em>practice.</em></>} text="Demo projects built to show how we think. Any metrics shown are illustrative / demo data, never a claim about real client performance." /><section className="light case-list" style={{ paddingTop: "110px" }}>{items.map((p, i) => <Reveal key={p.id || p.name} delay={0.05}><Link to={`/case-studies/${p.id || i + 1}`} className="case-row" data-testid={`case-study-${i + 1}`}><span>{String(i + 1).padStart(2, "0")}</span><Image src={p.image} alt={`${p.name} case study`} /><div><span className="project-type">{p.type}</span><h2>{p.name}</h2><p>{p.desc}</p><strong>Read case study ↗</strong></div></Link></Reveal>)}</section><CTA /></main><Footer /></>; }

function CaseDetail() { const { id } = useParams(); const items = useProjects(); const p = items.find((item, index) => String(item.id || index + 1) === id) || items[0]; const blocks = [["02 / CHALLENGE", p.challenge || "Make a complex offer feel simple, desirable and ready for its next audience."], ["03 / STRATEGY", p.strategy || "Build one connected system across story, experience, creative and performance."], ["04 / DESIGN & BUILD", "A system of type, colour and motion designed to feel considered — then engineered to load fast and convert."], ["05 / MARKETING", "Launch creative and performance media working from the same playbook, measured week by week."], ["06 / RESULTS — ILLUSTRATIVE", p.outcome || "A flexible foundation designed to learn in public and get better with every signal."]]; return <><Header /><main><PageIntro eyebrow={`${p.type} / CASE STUDY`} title={<>{p.name.split(" / ")[0]}<br /><em>in practice.</em></>} text="Illustrative / Demo Data — a considered look at the decisions behind the work." /><section className="light case-detail-cover"><Reveal><Image src={p.image} alt={`${p.name} feature image`} /></Reveal></section><section className="light case-detail-copy"><Reveal><span className="eyebrow">01 / OVERVIEW</span><h2>A more useful<br /><em>kind of impact.</em></h2><p className="case-overview-text">{p.desc}</p></Reveal><Reveal delay={0.1} className="case-blocks">{blocks.map(([label, text]) => <p key={label}><b>{label}</b> {text}</p>)}<small>Illustrative / Demo Data. No real client results are being claimed.</small></Reveal></section><section className="light case-gallery"><Reveal><Image src={p.image} alt={`${p.name} gallery composition one`} /></Reveal><Reveal delay={0.08}><Image src={p.image} alt={`${p.name} gallery composition two`} className="gallery-alt" /></Reveal></section><CTA /></main><Footer /></>; }

function ContactPage() { const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", service: "Website Development", budget: "", message: "" }); const [status, setStatus] = useState("idle"); const update = e => setForm({ ...form, [e.target.name]: e.target.value }); const submit = async e => { e.preventDefault(); setStatus("submitting"); try { await axios.post(`${API}/enquiries`, form); const text = `Hi The Squirrel Agency, I am ${form.name} from ${form.company || "my company"}. I would like to discuss ${form.service}. ${form.message}`; window.open(`https://wa.me/919277477048?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer"); setStatus("success"); } catch { setStatus("error"); } }; return <><Header /><main><PageIntro eyebrow="06 / CONTACT" title={<>Let’s build<br /><em>something remarkable.</em></>} text="Tell us what you’re building, what is not working, or what you want to make possible. Share a short brief — product, timeline, budget range — and we’ll reply within 24 hours with a clear next step." /><section className="light contact-layout"><div className="contact-details"><span className="eyebrow">START A CONVERSATION</span><a href="tel:+919277477048" data-testid="contact-phone">+91 92774 77048</a><a href="mailto:info.thesquirrelagency@gmail.com" data-testid="contact-email">info.thesquirrelagency@gmail.com</a><a href="https://instagram.com/thesquirrel_agency" target="_blank" rel="noreferrer" data-testid="contact-instagram">@thesquirrel_agency</a><span>India · working worldwide</span><p className="contact-note">Prefer WhatsApp? Submit the form and we’ll open a chat with your brief already filled — or message us directly at the number above.</p></div><form className="contact-form" onSubmit={submit} data-testid="enquiry-form"><div className="form-row"><label>Name<input required name="name" value={form.name} onChange={update} placeholder="Your name" data-testid="enquiry-name" /></label><label>Email<input required type="email" name="email" value={form.email} onChange={update} placeholder="you@company.com" data-testid="enquiry-email" /></label></div><div className="form-row"><label>Phone<input required name="phone" value={form.phone} onChange={update} placeholder="+91" data-testid="enquiry-phone" /></label><label>Company<input name="company" value={form.company} onChange={update} placeholder="Company name" data-testid="enquiry-company" /></label></div><div className="form-row"><label>Service<select name="service" value={form.service} onChange={update} data-testid="enquiry-service">{services.map(s => <option key={s[3]}>{s[1]}</option>)}</select></label><label>Budget<select name="budget" value={form.budget} onChange={update} data-testid="enquiry-budget"><option value="">Select range</option><option>₹50k — ₹1L</option><option>₹1L — ₹3L</option><option>₹3L+</option></select></label></div><label>Message<textarea required minLength="10" name="message" value={form.message} onChange={update} placeholder="Tell us a little about the ambition, timeline and what success looks like..." data-testid="enquiry-message" /></label><button className="button button-accent submit-button" type="submit" disabled={status === "submitting"} data-testid="enquiry-submit">{status === "submitting" ? "Sending..." : "Send enquiry ↗"}</button>{status === "success" && <p className="form-success" data-testid="enquiry-success">Thanks — your enquiry is saved. WhatsApp is open so we can continue the conversation.</p>}{status === "error" && <p className="form-error" data-testid="enquiry-error">Something went wrong. Please call us directly at +91 92774 77048.</p>}</form></section><section className="light service-area" data-testid="service-area"><Reveal><span className="eyebrow">SERVICE AREA</span><h2>Based in Kanpur.<br /><em>Working worldwide.</em></h2><p>M Block, Kidwai Nagar, Kanpur Nagar, Uttar Pradesh — a remote-first studio built for ambitious brands everywhere. Website development, performance marketing, creative and marketplace listings: we work across India and with international clients in overlapping timezones. Every enquiry gets a response within 24 hours — call, mail or DM, whatever suits you.</p><div className="area-facts"><span>STUDIO — M BLOCK, KIDWAI NAGAR, KANPUR NAGAR, UP</span><span>RESPONSE — WITHIN 24 HOURS</span><span>TIMEZONE — IST (UTC +5:30)</span></div></Reveal><Reveal className="area-map" delay={0.1}><iframe title="The Squirrel Agency studio location — Kidwai Nagar, Kanpur" src="https://maps.google.com/maps?q=M%20Block%20Kidwai%20Nagar%20Kanpur%20Nagar%20Uttar%20Pradesh&z=14&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" data-testid="service-area-map" /></Reveal></section></main><Footer /></>; }

function Legal({ terms = false }) { return <><Header /><main><PageIntro eyebrow={`07 / ${terms ? "TERMS" : "PRIVACY"}`} title={terms ? <>Simple, clear<br /><em>terms.</em></> : <>A little<br /><em>privacy.</em></>} text={terms ? "How we work together when you enquire or start a project with The Squirrel Agency." : "How we handle information you share through this website — kept short, clear and respectful."} /><section className="light legal-copy"><h2>{terms ? "Working together" : "Respecting your information"}</h2><p>We only use information shared through this website to respond to enquiries and understand how we can help. We do not sell personal information or use it for unrelated marketing lists.</p><p>By submitting an enquiry, you agree that The Squirrel Agency may contact you about the request by email, phone or WhatsApp. Project work is scoped in writing before production begins. For questions about these policies, write to us through the contact page or email info.thesquirrelagency@gmail.com.</p>{!terms && <p>Analytics or messaging tools may process technical data (such as browser type or pages visited) to improve the site. You can ask us to delete enquiry data you have shared by contacting the studio.</p>}</section></main><Footer /></>; }

const getAdminKey = () => sessionStorage.getItem("studio-admin-key") || "";
const clearAdminKey = () => sessionStorage.removeItem("studio-admin-key");

function EditorGate({ children }) {
  const [key, setKey] = useState("");
  const [state, setState] = useState("checking");
  const [error, setError] = useState(false);
  useEffect(() => {
    const saved = getAdminKey();
    if (!saved) { setState("locked"); return; }
    axios.get(`${API}/admin/verify`, { headers: { "X-Admin-Key": saved } }).then(() => setState("open")).catch(() => { clearAdminKey(); setState("locked"); });
  }, []);
  const unlock = async (event) => {
    event.preventDefault();
    setError(false); setState("checking");
    try {
      await axios.get(`${API}/admin/verify`, { headers: { "X-Admin-Key": key } });
      sessionStorage.setItem("studio-admin-key", key);
      setState("open");
    } catch { setState("locked"); setError(true); }
  };
  if (state === "open") return children;
  return <><Header /><main><PageIntro eyebrow="08 / STUDIO TOOL" title={<>Private<br /><em>desk.</em></>} text="The publishing desk is reserved for the agency. Enter the admin password to continue." /><section className="light lock-section"><form className="lock-form" onSubmit={unlock} data-testid="editor-lock-form"><label>Admin password<input type="password" required value={key} onChange={(e) => setKey(e.target.value)} placeholder="••••••••" autoFocus data-testid="editor-password-input" /></label><button className="button button-accent" type="submit" disabled={state === "checking"} data-testid="editor-unlock-button">{state === "checking" ? "Checking..." : "Unlock editor ↗"}</button>{error && <p className="form-error" data-testid="editor-lock-error">Incorrect password. Please try again.</p>}</form></section></main><Footer /></>;
}

function LiveCasePreview({ form }) { return <aside className="editor-preview live-case-preview" data-testid="live-case-preview"><div className="preview-topline"><span className="eyebrow">LIVE PREVIEW / CASE STUDY</span><span>{form.year || "2026"}</span></div><div className="live-cover"><Image src={form.cover_image || images.workspace} alt="Live case study cover preview" /></div><span className="project-type">{form.status_label || "CONCEPT PROJECT"} · {form.category || "CATEGORY"}</span><h2 data-testid="live-preview-title">{form.title || "Your project title"}</h2><p className="live-summary" data-testid="live-preview-summary">{form.summary || "A short project summary will appear here as you write."}</p><div className="live-preview-meta"><span>{form.services || "Your services"}</span><span>{form.challenge ? "01 / CHALLENGE" : "STORY IN PROGRESS"}</span></div><div className="live-story"><p><b>THE CHALLENGE</b>{form.challenge || "The challenge behind the work will appear here."}</p><p><b>THE STRATEGY</b>{form.strategy || "Your strategic point of view will appear here."}</p><p><b>THE OUTCOME</b>{form.outcome || "The outcome and value of the work will appear here."}</p></div></aside>; }

function ProjectEditor() {
  const empty = { title: "", category: "Websites", year: "2026", summary: "", cover_image: "", services: "", challenge: "", strategy: "", outcome: "", status_label: "CONCEPT PROJECT" };
  const [form, setForm] = useState(empty); const [status, setStatus] = useState("idle");
  const [upload, setUpload] = useState({ state: "idle", name: "" });
  const [published, setPublished] = useState([]);
  const [subs, setSubs] = useState([]);
  const fileInput = useRef(null);
  const loadPublished = () => { axios.get(`${API}/projects`).then(({ data }) => setPublished(data)).catch(() => {}); };
  const loadSubs = () => { axios.get(`${API}/newsletter`, { headers: { "X-Admin-Key": getAdminKey() } }).then(({ data }) => setSubs(data)).catch(() => {}); };
  useEffect(() => { loadPublished(); loadSubs(); }, []);
  const exportSubs = () => {
    const csv = ["Email,Subscribed On", ...subs.map((s) => `${s.email},${(s.created_at || "").slice(0, 10)}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "squirrel-subscribers.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const removeProject = async (id) => {
    if (!window.confirm("Delete this case study? This cannot be undone.")) return;
    try { await axios.delete(`${API}/projects/${id}`, { headers: { "X-Admin-Key": getAdminKey() } }); setPublished((current) => current.filter((p) => p.id !== id)); }
    catch (err) { if (err?.response?.status === 401) { clearAdminKey(); window.location.reload(); } }
  };
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const pickCover = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    setUpload({ state: "uploading", name: file.name });
    try {
      const body = new FormData();
      body.append("file", file);
      const { data } = await axios.post(`${API}/uploads`, body, { headers: { "X-Admin-Key": getAdminKey() } });
      setForm((current) => ({ ...current, cover_image: `${process.env.REACT_APP_BACKEND_URL}${data.url}` }));
      setUpload({ state: "done", name: file.name });
    } catch (err) { if (err?.response?.status === 401) { clearAdminKey(); window.location.reload(); return; } setUpload({ state: "error", name: file.name }); }
  };
  const publish = async (event) => {
    event.preventDefault();
    if (!form.cover_image) { setUpload((current) => ({ ...current, state: "missing" })); return; }
    setStatus("saving");
    try { await axios.post(`${API}/projects`, form, { headers: { "X-Admin-Key": getAdminKey() } }); setStatus("saved"); setForm(empty); setUpload({ state: "idle", name: "" }); if (fileInput.current) fileInput.current.value = ""; loadPublished(); } catch (err) { if (err?.response?.status === 401) { clearAdminKey(); window.location.reload(); return; } setStatus("error"); }
  };
  const textFields = [["summary", "Short summary", "A concise description of the work..."], ["challenge", "Challenge", "What needed to change?"], ["strategy", "Strategy", "What was the point of view?"], ["outcome", "Outcome", "What did the work make possible?"]];
  return <><Header /><main><PageIntro eyebrow="08 / STUDIO TOOL" title={<>Publish the<br /><em>next chapter.</em></>} text="Write the story on the left. See the exact case-study composition take shape on the right." /><section className="light editor-layout"><form className="editor-form" onSubmit={publish} data-testid="project-editor-form"><div className="editor-header"><span className="eyebrow">NEW CASE STUDY</span><span className="editor-status">{status === "saved" ? "PUBLISHED" : status === "error" ? "TRY AGAIN" : "DRAFT"}</span></div><label>Project title<input required name="title" value={form.title} onChange={update} placeholder="Project Nova" data-testid="project-title" /></label><div className="form-row"><label>Category<select name="category" value={form.category} onChange={update} data-testid="project-category"><option>Websites</option><option>Landing Pages</option><option>Marketing</option><option>Creative</option><option>E-commerce</option></select></label><label>Year<input required pattern="[0-9]{4}" name="year" value={form.year} onChange={update} data-testid="project-year" /></label></div>{textFields.map(([name, label, placeholder]) => <label key={name}>{label}<textarea required minLength="10" name={name} value={form[name]} onChange={update} placeholder={placeholder} data-testid={`project-${name}`} /></label>)}<div className="cover-upload" data-testid="cover-upload"><span className="cover-upload-label">Cover image</span><div className="cover-upload-row"><button type="button" className="button button-quiet cover-upload-button" onClick={() => fileInput.current && fileInput.current.click()} disabled={upload.state === "uploading"} data-testid="cover-upload-button">{upload.state === "uploading" ? "Uploading..." : "Upload image ↑"}</button><input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={pickCover} hidden data-testid="cover-file-input" /><span className="cover-upload-hint">or paste an image URL below</span></div><input name="cover_image" value={form.cover_image} onChange={update} placeholder="https://images.unsplash.com/..." data-testid="project-cover-image" />{upload.state === "done" && <p className="form-success" data-testid="cover-upload-success">Uploaded — {upload.name}</p>}{upload.state === "error" && <p className="form-error" data-testid="cover-upload-error">Upload failed. Try another image or paste a URL.</p>}{upload.state === "missing" && !form.cover_image && <p className="form-error" data-testid="cover-missing-error">Add a cover image before publishing.</p>}</div><label>Services<input required name="services" value={form.services} onChange={update} placeholder="Website Development · SEO" data-testid="project-services" /></label><label>Label<select name="status_label" value={form.status_label} onChange={update} data-testid="project-status-label"><option>CONCEPT PROJECT</option><option>DEMO CASE STUDY</option><option>SELECTED WORK</option></select></label><button className="button button-accent" type="submit" disabled={status === "saving"} data-testid="project-publish-button">{status === "saving" ? "Publishing..." : "Publish case study ↗"}</button>{status === "saved" && <p className="form-success" data-testid="project-publish-success">Published successfully. Add another story whenever you are ready.</p>}{status === "error" && <p className="form-error" data-testid="project-publish-error">Could not publish this project. Please try again.</p>}</form><LiveCasePreview form={form} /></section><section className="light manage-list" data-testid="manage-projects"><div className="editor-header"><span className="eyebrow">PUBLISHED PROJECTS</span><span className="editor-status">{published.length} LIVE</span></div>{published.length ? published.map((p) => <div className="manage-row" key={p.id} data-testid={`manage-row-${p.id}`}><span>{p.year}</span><strong>{p.title}</strong><em>{p.category}</em><button type="button" className="manage-delete" onClick={() => removeProject(p.id)} data-testid={`delete-project-${p.id}`}>Delete</button></div>) : <p className="manage-empty" data-testid="manage-empty">Projects you publish will appear here. The four curated concept projects stay fixed.</p>}</section><section className="light manage-list" data-testid="manage-subscribers"><div className="editor-header"><span className="eyebrow">NEWSLETTER SUBSCRIBERS</span><span className="editor-status">{subs.length} TOTAL</span></div>{subs.length ? subs.map((s) => <div className="manage-row" key={s.id || s.email} data-testid={`subscriber-row`}><span>{(s.created_at || "").slice(0, 10)}</span><strong className="sub-email">{s.email}</strong><em>INSIGHTS LIST</em><span></span></div>) : <p className="manage-empty" data-testid="subscribers-empty">Subscribers will appear here once readers join from the Insights page.</p>}<button type="button" className="button button-quiet export-button" onClick={exportSubs} disabled={!subs.length} data-testid="export-subscribers">Export CSV ↓</button></section></main><Footer /></>;
}

function ArticleMeta({ title }) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const location = useLocation();
  const [vote, setVote] = useState("");
  const whatsapp = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} — The Squirrel Agency ${url}`)}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const sendVote = async (v) => { if (vote) return; setVote(v); try { await axios.post(`${API}/feedback`, { article: location.pathname, vote: v }); } catch { } };
  return <><div className="article-feedback" data-testid="article-feedback">{vote ? <span className="feedback-thanks" data-testid="feedback-thanks">Thanks for the feedback.</span> : <><span>WAS THIS USEFUL?</span><button type="button" onClick={() => sendVote("yes")} data-testid="feedback-yes">Yes ↗</button><button type="button" onClick={() => sendVote("no")} data-testid="feedback-no">No ↗</button></>}</div><div className="article-byline" data-testid="article-byline"><span className="monogram">AG</span><div><strong>Written by Akash Gupta</strong><span>Founder &amp; Creative Strategist</span></div></div><div className="article-share" data-testid="article-share"><span>SHARE THIS</span><a href={whatsapp} target="_blank" rel="noreferrer" data-testid="share-whatsapp">WhatsApp ↗</a><a href={linkedin} target="_blank" rel="noreferrer" data-testid="share-linkedin">LinkedIn ↗</a></div></>;
}

function RelatedArticles({ current }) {
  const covers = { "/insights/landing-page-vs-homepage": img("article-1"), "/insights/marketplace-listing-checklist": img("article-2"), "/insights/creative-that-converts": img("article-3") };
  const others = insights.filter((t) => t[3] && t[3] !== current);
  return <div className="related-wrap" data-testid="related-articles"><span className="eyebrow">KEEP READING</span><div className="related-grid">{others.map((t) => <Link key={t[3]} to={t[3]} className="related-card" data-testid={`related-${t[3].split("/").pop()}`}><Image src={covers[t[3]]} alt={`${t[1]} — article cover`} /><span className="insight-tag">{t[0]}</span><h3>{t[1]}</h3><span className="related-meta">{t[2]} ↗</span></Link>)}</div></div>;
}

function NewsletterBox() {
  const [email, setEmail] = useState(""); const [state, setState] = useState("idle");
  const subscribe = async (e) => { e.preventDefault(); setState("saving"); try { await axios.post(`${API}/newsletter`, { email }); setState("done"); setEmail(""); } catch { setState("error"); } };
  return <section className="light newsletter" data-testid="newsletter"><Reveal><span className="eyebrow">THE FIELD NOTES LIST</span><h2>New notes,<br /><em>first in your inbox.</em></h2><p>One short email when a new insight goes live. No noise, unsubscribe anytime.</p><form onSubmit={subscribe} className="newsletter-form" data-testid="newsletter-form"><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" aria-label="Email address" data-testid="newsletter-email" /><button className="button button-accent" type="submit" disabled={state === "saving"} data-testid="newsletter-submit">{state === "saving" ? "Subscribing..." : "Subscribe ↗"}</button></form>{state === "done" && <p className="form-success" data-testid="newsletter-success">You're on the list. See you in the inbox.</p>}{state === "error" && <p className="form-error" data-testid="newsletter-error">Could not subscribe right now — please try again.</p>}</Reveal></section>;
}

function InsightsPage() {
  const covers = [img("article-1"), img("article-2"), img("article-3")];
  const blurbs = ["Why the page built for one decision beats the page built for every visitor.", "The exact pre-launch routine we run before any product goes live on a marketplace.", "How we build ads that people actually stop for — and buy from."];
  return <><Header /><main><PageIntro eyebrow="10 / INSIGHTS" title={<>Notes from<br /><em>the field.</em></>} text="Short, practical reads on landing pages, marketplaces and creative — written from real work at the studio." /><section className="light case-list" style={{ paddingTop: "110px" }}>{insights.map((t, i) => <Reveal key={t[1]} delay={0.05}><Link to={t[3]} className="case-row" data-testid={`article-row-${i + 1}`}><span>{String(i + 1).padStart(2, "0")}</span><Image src={covers[i]} alt={`${t[1]} — article cover`} /><div><span className="project-type">{t[0]}</span><h2>{t[1]}</h2><p>{blurbs[i]}</p><strong>Read article ↗ · {t[2]}</strong></div></Link></Reveal>)}</section><NewsletterBox /><CTA /></main><Footer /></>;
}

function WhatsAppFloat() { const text = encodeURIComponent("Hi The Squirrel Agency, I would like to discuss a project."); return <a className="whatsapp-float" href={`https://wa.me/919277477048?text=${text}`} target="_blank" rel="noreferrer" aria-label="Chat with The Squirrel Agency on WhatsApp" data-testid="whatsapp-float"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/></svg></a>; }

function ArticlePage() {
  return <><Header /><main>
    <PageIntro eyebrow="INSIGHTS / MARKETING · 4 MIN READ" title={<>Your landing page<br /><em>closes the sale.</em></>} text="Why the page built for one decision beats the page built for every visitor." />
    <article className="light article-body" data-testid="article-body">
      <Reveal className="article-cover" data-testid="article-cover"><Image src={img("article-1")} alt="Marketing performance analytics — editorial cover for the landing page article" /></Reveal>
      <Reveal className="article-block"><span className="eyebrow">01 / THE CONFUSION</span><h3>A homepage is a lobby. A landing page is a closer.</h3><p>Your homepage has to greet everyone — investors, job seekers, existing customers, press. So it speaks generally, links everywhere, and asks for nothing in particular. A landing page has exactly one visitor in mind: the person who just clicked your ad. It continues the precise promise that earned the click and asks for one specific next step. When brands send paid traffic to a homepage, they pay for attention and then waste it in the lobby.</p></Reveal>
      <Reveal className="article-block"><span className="eyebrow">02 / ONE PAGE, ONE JOB</span><h3>Every extra choice costs you money.</h3><p>Each additional link, menu item or competing headline is a door out of the sale. A focused landing page removes the navigation, repeats one message in progressively stronger forms, and gives the visitor a single decision to make. <b>If a section does not move the visitor toward that decision, it does not belong on the page.</b> This is why disciplined landing pages routinely outperform beautiful homepages on the same budget.</p></Reveal>
      <Reveal className="article-block"><span className="eyebrow">03 / THE ATTENTION MATH</span><h3>You have about five seconds.</h3><p>Cold traffic decides fast. The first screen must answer three questions instantly: what is this, is it for me, and what do I do next. If any answer requires scrolling or guessing, a share of your visitors is already gone. We design the opening fold like a headline test — one idea, one image, one action — and let the rest of the page earn the scroll instead of assuming it.</p></Reveal>
      <Reveal className="article-block"><span className="eyebrow">04 / PROOF BEFORE PERSUASION</span><h3>Claims need evidence, in that order.</h3><p>Visitors believe reviews more than adjectives. Place proof — ratings, numbers, names, guarantees — immediately after each claim, not in a distant footer. The rhythm we build with is simple: claim, proof, action. Repeat it down the page and the decision starts to feel like the visitor's own idea.</p></Reveal>
      <Reveal className="article-block"><span className="eyebrow">05 / WHAT WE MEASURE</span><h3>Opinions stop at launch.</h3><p>After release, the page answers to numbers, not taste. These are the four signals we watch before changing anything:</p></Reveal>
      <ul className="article-points" data-testid="article-metrics"><li><b>01</b> SCROLL DEPTH — where attention actually ends</li><li><b>02</b> CTA CLICK RATE — is the ask clear enough</li><li><b>03</b> COST PER LEAD — the only metric that pays rent</li><li><b>04</b> TIME TO FIRST INTERACTION — how fast the page earns trust</li></ul>
      <ArticleMeta title="Why your landing page — not your homepage — closes the sale" />
      <div className="article-actions"><Link to="/contact" className="button button-accent" data-testid="article-cta">Plan my landing page <span>↗</span></Link><Link to="/" className="button button-quiet" data-testid="article-back">Back to home <span>↗</span></Link></div>
      <RelatedArticles current="/insights/landing-page-vs-homepage" />
    </article>
    <CTA />
  </main><Footer /></>;
}

function ArticleTwo() {
  return <><Header /><main>
    <PageIntro eyebrow="INSIGHTS / E-COMMERCE · 6 MIN READ" title={<>The listing checklist<br /><em>we run first.</em></>} text="The exact pre-launch routine we use before any product goes live on Amazon, Flipkart or Myntra." />
    <article className="light article-body" data-testid="article-body">
      <Reveal className="article-cover" data-testid="article-cover"><Image src={img("article-2")} alt="Retail storefront — editorial cover for the marketplace listing checklist article" /></Reveal>
      <Reveal className="article-block"><span className="eyebrow">01 / BEFORE YOU WRITE</span><h3>Research is the listing.</h3><p>Most weak listings are written before anyone has looked at the market. We start by reading the top ten competing listings and their one-star reviews. The titles tell us which keywords buyers actually type; the complaints tell us what the photos must prove. <b>A listing built on research writes itself. A listing built on assumptions gets buried.</b></p></Reveal>
      <Reveal className="article-block"><span className="eyebrow">02 / TITLE &amp; KEYWORDS</span><h3>The title is a search tool, not a slogan.</h3><p>Marketplace titles have a job: match how people search. Our working formula is brand, product type, the attribute buyers care about most, then size or quantity. Every word earns its place — no filler, no "best" and "amazing". The remaining keywords go into backend search terms, never stuffed into the title where they scare humans away.</p></Reveal>
      <Reveal className="article-block"><span className="eyebrow">03 / IMAGES THAT SELL</span><h3>Nobody reads a listing they didn't click.</h3><p>The main image wins the click from a results page full of near-identical products — clean background, product filling the frame, instantly readable at thumbnail size. The supporting images then answer questions in order: scale, texture, what's in the box, how it's used, and one honest lifestyle frame. If a buyer still has a question after the last image, the gallery has failed.</p></Reveal>
      <Reveal className="article-block"><span className="eyebrow">04 / BULLETS &amp; DESCRIPTION</span><h3>Benefits first, features second.</h3><p>Nobody buys "300-thread count" — they buy better sleep. Each bullet starts with the benefit, then names the feature that delivers it. Keep bullets scannable; the description carries the fuller story, the care instructions and the brand promise for those who want more.</p></Reveal>
      <Reveal className="article-block"><span className="eyebrow">05 / THE INVISIBLE HALF</span><h3>Backend fields decide where you appear.</h3><p>Category mapping, attributes, material, colour, size fields and search terms are invisible to buyers but not to the algorithm. A wrongly mapped category makes a product unfindable no matter how good the photos are. We audit every field, every time — this is the most skipped step in marketplace selling.</p></Reveal>
      <Reveal className="article-block"><span className="eyebrow">06 / LAUNCH WEEK</span><h3>The first seven days set the ceiling.</h3><p>Marketplaces watch early velocity. Launch with pricing planned, a small ad budget ready, and a review-collection process that follows platform rules. Fix nothing on gut feel — wait for the first data, then adjust title, price or images one variable at a time.</p></Reveal>
      <ul className="article-points" data-testid="article-metrics"><li><b>01</b> TOP 10 COMPETITORS READ — titles, prices, complaints mapped</li><li><b>02</b> TITLE BUILT — brand + product + key attribute + size</li><li><b>03</b> GALLERY PLANNED — main image plus five question-answering frames</li><li><b>04</b> BULLETS WRITTEN — benefit first, feature as proof</li><li><b>05</b> BACKEND FIELDS AUDITED — category, attributes, search terms</li><li><b>06</b> LAUNCH WEEK READY — price, ads budget, review process</li></ul>
      <ArticleMeta title="The marketplace listing checklist we run before every launch" />
      <div className="article-actions"><Link to="/contact" className="button button-accent" data-testid="article-cta">Get my listing audited <span>↗</span></Link><Link to="/" className="button button-quiet" data-testid="article-back">Back to home <span>↗</span></Link></div>
      <RelatedArticles current="/insights/marketplace-listing-checklist" />
    </article>
    <CTA />
  </main><Footer /></>;
}

function ArticleThree() {
  return <><Header /><main>
    <PageIntro eyebrow="INSIGHTS / CREATIVE · 5 MIN READ" title={<>Creative that<br /><em>converts.</em></>} text="How we build ads that people actually stop for — and buy from." />
    <article className="light article-body" data-testid="article-body">
      <Reveal className="article-cover" data-testid="article-cover"><Image src={img("article-3")} alt="Creative design workspace — editorial cover for the creative that converts article" /></Reveal>
      <Reveal className="article-block"><span className="eyebrow">01 / THE SCROLL PROBLEM</span><h3>Attention is earned in the first second.</h3><p>Your ad is competing with a friend's wedding photos and a cricket highlight, not with other ads. The feed rewards whatever stops the thumb. That means the first frame has to create an open loop — a question, a bold visual, a statement that demands a reaction. <b>If the first second doesn't earn the next three, nothing after it exists.</b></p></Reveal>
      <Reveal className="article-block"><span className="eyebrow">02 / HOOK BEFORE BRAND</span><h3>The logo can wait two seconds.</h3><p>The instinct to open with the brand kills more ads than bad design ever will. Lead with the problem, the result or the surprise — then introduce the brand as the answer. Viewers don't owe you attention; the hook earns it, and the brand collects it. This single reordering is often the difference between a skipped ad and a saved one.</p></Reveal>
      <Reveal className="article-block"><span className="eyebrow">03 / NATIVE, NOT POLISHED</span><h3>Ads that look like content win.</h3><p>On social platforms, the most expensive-looking ad often loses to a phone-shot video with a real voice. People scroll past advertising instinctively, but they stop for things that feel like the feed around them. This is why UGC-style creative outperforms studio polish so often — it borrows trust from the format instead of fighting it.</p></Reveal>
      <Reveal className="article-block"><span className="eyebrow">04 / ONE AD, ONE IDEA</span><h3>Single-minded beats comprehensive.</h3><p>An ad that says three things says nothing. Each creative gets one promise, one proof point, one action. Want to say something else? Make another ad — variation is how you find winners, not cramming. We test hooks against hooks and offers against offers, never five ideas fused into one tired frame.</p></Reveal>
      <Reveal className="article-block"><span className="eyebrow">05 / CREATIVE IS A NUMBERS GAME</span><h3>Volume feeds the algorithm, iteration feeds you.</h3><p>No brief survives first contact with the auction. We launch a spread of creative, let the numbers name the winner, then make variations of what worked — new hooks on the winning angle, new angles on the winning format. The studio that iterates weekly beats the studio that perfects monthly. These are the signals we read:</p></Reveal>
      <ul className="article-points" data-testid="article-metrics"><li><b>01</b> THUMBSTOP RATE — did the first second hold anyone</li><li><b>02</b> HOLD RATE — who stayed past the hook</li><li><b>03</b> CLICK-THROUGH — did interest become intent</li><li><b>04</b> COST PER RESULT — the number that decides scale</li></ul>
      <ArticleMeta title="Creative that converts: building ads people actually stop for" />
      <div className="article-actions"><Link to="/contact" className="button button-accent" data-testid="article-cta">Plan my campaign creative <span>↗</span></Link><Link to="/" className="button button-quiet" data-testid="article-back">Back to home <span>↗</span></Link></div>
      <RelatedArticles current="/insights/creative-that-converts" />
    </article>
    <CTA />
  </main><Footer /></>;
}

function SmoothScroll({ children }) {
  const location = useLocation();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf;
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }, [location.pathname]);
  return children;
}

function App() { useEffect(() => { document.title = "The Squirrel Agency | Digital Marketing, Web Development & Performance"; }, []); return <MotionConfig reducedMotion="user"><BrowserRouter><SmoothScroll><div className="App"><Routes><Route path="/" element={<Home />} /><Route path="/services" element={<ServicesPage />} /><Route path="/services/:slug" element={<ServiceDetail />} /><Route path="/about" element={<AboutPage />} /><Route path="/work" element={<WorkPage />} /><Route path="/case-studies" element={<CaseStudies />} /><Route path="/case-studies/:id" element={<CaseDetail />} /><Route path="/contact" element={<ContactPage />} /><Route path="/studio/editor" element={<EditorGate><ProjectEditor /></EditorGate>} /><Route path="/insights" element={<InsightsPage />} /><Route path="/insights/landing-page-vs-homepage" element={<ArticlePage />} /><Route path="/insights/marketplace-listing-checklist" element={<ArticleTwo />} /><Route path="/insights/creative-that-converts" element={<ArticleThree />} /><Route path="/privacy" element={<Legal />} /><Route path="/terms" element={<Legal terms />} /><Route path="*" element={<Home />} /></Routes><WhatsAppFloat /></div></SmoothScroll></BrowserRouter></MotionConfig>; }
export default App;
