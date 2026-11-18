
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Search,
  X,
  Sparkles,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

type Article = {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  featured?: boolean;
  content: string[];
};

const categories = [
  "All",
  "Buying Guides",
  "Smartphone Tips",
  "Comparisons",
  "Tech & Trends",
  "Refurbished",
];

const articles: Article[] = [
  {
    id: 1,
    category: "Buying Guides",
    title: "Buying a smartphone in 2026? Here's what actually matters.",
    excerpt:
      "Forget the marketing noise. These are the features worth paying attention to before choosing your next smartphone.",
    date: "November 14, 2026",
    readTime: "6 min read",
    author: "PhoneBhai Editorial",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1500&q=85",
    featured: true,
    content: [
      "A new smartphone launch can make every previous model feel outdated. But the truth is that choosing a phone should be about what you actually need, not what a marketing campaign tells you to want.",
      "Start with the essentials: display quality, battery life, camera consistency, processor performance and software support. These are the things you will notice every day, long after the excitement of unboxing has faded.",
      "Think about your usage. If you take lots of photographs, prioritise camera quality and storage. If you play games, look at sustained performance and thermal management. If you mainly browse, message and stream, a balanced device may offer much better value.",
      "Finally, compare the total value rather than just the launch price. A carefully selected previous-generation or refurbished phone can sometimes offer a better experience for your budget.",
    ],
  },
  {
    id: 2,
    category: "Refurbished",
    title: "Refurbished vs. second-hand phones: know the difference.",
    excerpt:
      "They may sound similar, but the buying experience and checks behind them can be very different.",
    date: "November 12, 2026",
    readTime: "5 min read",
    author: "PhoneBhai Editorial",
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1100&q=85",
    content: [
      "The terms refurbished and second-hand are often used interchangeably, but they do not necessarily describe the same process.",
      "A second-hand phone is generally a device previously owned by someone else. Its condition can vary considerably, depending on how it was used and maintained.",
      "A refurbished phone should go through an inspection and preparation process before being offered for sale. The quality of that process matters, so always ask what checks have actually been performed.",
      "Before buying, check the display, cameras, speakers, charging port, battery condition, network connectivity and device identifiers. Also read the seller's replacement and warranty policies carefully.",
    ],
  },
  {
    id: 3,
    category: "Smartphone Tips",
    title: "5 simple habits that can help your phone battery last longer.",
    excerpt:
      "Small everyday changes can make a meaningful difference to battery health and daily usage.",
    date: "November 10, 2026",
    readTime: "4 min read",
    author: "PhoneBhai Editorial",
    image:
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1100&q=85",
    content: [
      "Your phone battery naturally ages with use. While no setting can stop that process, a few sensible habits can help you avoid unnecessary battery stress.",
      "Avoid exposing your phone to excessive heat. High temperatures are particularly hard on lithium-ion batteries, especially while charging.",
      "Use battery optimisation features when available, keep your software updated and avoid leaving demanding applications running unnecessarily.",
      "You do not need to obsess over every percentage point. Focus on keeping your phone cool and using reliable chargers and cables.",
    ],
  },
  {
    id: 4,
    category: "Comparisons",
    title: "Flagship or mid-range? Where should your money go?",
    excerpt:
      "Premium phones are impressive, but a mid-range device might be all you need.",
    date: "November 8, 2026",
    readTime: "7 min read",
    author: "PhoneBhai Editorial",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1100&q=85",
    content: [
      "Flagship smartphones usually bring the best available hardware, premium materials and advanced camera systems. But that does not automatically make them the right choice for everyone.",
      "Mid-range phones have become remarkably capable. For everyday tasks, social media, video streaming and photography, many offer more than enough performance.",
      "Consider which features you will actually use. If you rarely shoot professional-style video or play demanding games, paying extra for the highest-end processor may not make sense.",
      "The smartest purchase is the one that gives you the experience you want without paying for features you will never use.",
    ],
  },
  {
    id: 5,
    category: "Tech & Trends",
    title: "Why smartphone cameras are about more than megapixels.",
    excerpt:
      "Sensor size, processing and stabilisation often matter more than a big number on the box.",
    date: "November 6, 2026",
    readTime: "5 min read",
    author: "PhoneBhai Editorial",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1100&q=85",
    content: [
      "A camera specification sheet can be confusing. One phone advertises 200 megapixels while another has a much smaller number. Which one takes better photographs?",
      "Megapixels describe image resolution, but they do not tell the whole story. Sensor size, lens quality, image processing, autofocus and optical stabilisation all contribute to the final result.",
      "Look at real-world sample photographs, especially in low light and with moving subjects. Consistency matters more than a single impressive specification.",
      "A good camera is a complete system. Evaluate the results rather than buying based on one number.",
    ],
  },
  {
    id: 6,
    category: "Buying Guides",
    title: "A practical checklist before you buy your next phone.",
    excerpt:
      "Keep this checklist handy and make a more confident decision before you place your order.",
    date: "November 4, 2026",
    readTime: "4 min read",
    author: "PhoneBhai Editorial",
    image:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1100&q=85",
    content: [
      "A little preparation can prevent a lot of regret. Before buying, decide your budget and identify the features you genuinely need.",
      "Compare storage, battery capacity, display quality, camera performance and software support. Do not forget to check whether the phone supports the network bands and connectivity features you need.",
      "For pre-owned or refurbished devices, inspect the physical condition and test the important hardware functions. Confirm what accessories are included and understand the seller's policies.",
      "Take your time, compare a few options and choose the phone that fits your actual usage.",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

function ArticleImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`bg-cover bg-center transition-transform duration-700 ${className}`}
      style={{ backgroundImage: `url("${src}")` }}
    />
  );
}

export default function BlogClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] =
    useState<Article | null>(null);

  const reduceMotion = useReducedMotion();
  const featuredArticle = articles[0];

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === "All" ||
        article.category === activeCategory;

      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const displayedArticles =
    activeCategory === "All" && !searchQuery.trim()
      ? filteredArticles.filter((article) => !article.featured)
      : filteredArticles;

  useEffect(() => {
    if (!selectedArticle) return;

    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedArticle(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedArticle]);

  const animationProps = reduceMotion
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.12 },
        variants: fadeUp,
      };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f7f5] text-[#111111]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#090909] px-5 pb-14 pt-16 text-white sm:px-8 sm:pb-20 sm:pt-24 lg:px-12 lg:pb-24 lg:pt-28">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[300px] w-[300px] rounded-full border border-white/[0.07] sm:h-[500px] sm:w-[500px]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-[220px] w-[220px] rounded-full border border-white/[0.08] sm:h-[340px] sm:w-[340px]" />

        <div className="relative mx-auto max-w-[1440px]">
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : "visible"}
            variants={fadeUp}
            className="mb-7 flex items-center gap-3 sm:mb-8"
          >
            <span className="h-px w-8 bg-white sm:w-10" />
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/60 sm:text-xs sm:tracking-[0.35em]">
              The PhoneBhai Journal
            </span>
          </motion.div>

          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <motion.div
              initial={reduceMotion ? false : "hidden"}
              animate={reduceMotion ? undefined : "visible"}
              variants={fadeUp}
            >
              <h1 className="max-w-4xl text-[clamp(3.1rem,12vw,8.5rem)] font-black leading-[0.9] tracking-[-0.075em] sm:text-[clamp(4rem,9vw,8.5rem)]">
                Tech.
                <br />
                <span className="text-white/35">Without</span>
                <br />
                The Noise.
              </h1>

              <div className="mt-8 flex flex-col gap-6 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-md text-sm leading-7 text-white/55 sm:text-base">
                  Smart reads, honest insights and everything worth knowing
                  about the technology in your pocket.
                </p>

                <a
                  href="#latest"
                  className="group inline-flex w-fit items-center gap-3 border-b border-white/40 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] transition hover:border-white sm:text-xs"
                >
                  Explore stories
                  <ArrowDown
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-y-1"
                  />
                </a>
              </div>
            </motion.div>

            {/* Featured image: visible on mobile and tablet too */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 35 }}
              animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto w-full max-w-[420px] lg:ml-auto"
            >
              <div className="relative">
                <div className="absolute -left-3 -top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black sm:-left-6 sm:-top-6 sm:h-16 sm:w-16 lg:h-20 lg:w-20">
                  <Sparkles size={22} strokeWidth={1.5} />
                </div>

                <div className="aspect-[16/10] overflow-hidden sm:aspect-[4/3] lg:aspect-[4/5]">
                  <ArticleImage
                    src={featuredArticle.image}
                    alt="Featured smartphone editorial"
                    className="h-full w-full grayscale transition-all duration-700 hover:scale-105 hover:grayscale-0"
                  />
                </div>

                <div className="absolute -bottom-4 left-3 bg-white px-4 py-3 text-black shadow-xl sm:-bottom-5 sm:-left-6 sm:px-6 sm:py-4">
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-black/45 sm:text-[9px] sm:tracking-[0.25em]">
                    Curiosity looks good on you.
                  </p>
                  <p className="mt-1 text-base font-black tracking-tight sm:text-lg">
                    Stay in the know.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-16 flex flex-col gap-2 border-t border-white/15 pt-5 text-[8px] font-bold uppercase tracking-[0.2em] text-white/35 sm:mt-20 sm:flex-row sm:items-center sm:justify-between sm:text-[10px] sm:tracking-[0.25em]">
            <span>Ideas for a smarter digital life</span>
            <span>Read. Discover. Decide.</span>
          </div>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-7 flex items-center justify-between sm:mb-8">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-black" />
              <p className="text-[9px] font-black uppercase tracking-[0.22em] sm:text-[10px] sm:tracking-[0.25em]">
                Editor&apos;s Pick
              </p>
            </div>
            <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-black/35 sm:text-[10px] sm:tracking-[0.2em]">
              01 / Featured story
            </span>
          </div>

          <motion.article
            {...animationProps}
            className="grid overflow-hidden bg-white lg:grid-cols-2"
          >
            <div className="group relative min-h-[230px] overflow-hidden sm:min-h-[360px] lg:min-h-[470px]">
              <ArticleImage
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="absolute inset-0 h-full w-full grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute left-4 top-4 bg-white px-3 py-2 text-[8px] font-black uppercase tracking-[0.2em] text-black sm:left-5 sm:top-5 sm:px-4 sm:text-[9px]">
                Featured
              </div>
            </div>

            <div className="flex flex-col justify-center px-5 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-14 xl:px-16">
              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-black/40 sm:text-[10px] sm:tracking-[0.25em]">
                {featuredArticle.category}
              </span>

              <h2 className="mt-4 text-3xl font-black leading-[1.05] tracking-[-0.055em] sm:mt-6 sm:text-4xl lg:text-5xl">
                {featuredArticle.title}
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-black/55 sm:mt-6">
                {featuredArticle.excerpt}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-[9px] font-semibold uppercase tracking-[0.1em] text-black/40 sm:mt-8 sm:gap-5 sm:text-[10px] sm:tracking-[0.12em]">
                <span className="flex items-center gap-2">
                  <CalendarDays size={13} />
                  {featuredArticle.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock3 size={13} />
                  {featuredArticle.readTime}
                </span>
              </div>

              <button
                onClick={() => setSelectedArticle(featuredArticle)}
                className="group mt-8 flex w-fit items-center gap-4 border-b border-black pb-3 text-[9px] font-black uppercase tracking-[0.2em] sm:mt-10 sm:text-[10px]"
              >
                Read the story
                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </button>
            </div>
          </motion.article>
        </div>
      </section>

      {/* LATEST STORIES */}
      <section
        id="latest"
        className="scroll-mt-16 border-t border-black/10 bg-[#f7f7f5] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div className="mx-auto max-w-[1440px]">
          <motion.div
            {...animationProps}
            className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end"
          >
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/40 sm:text-[10px] sm:tracking-[0.3em]">
                Fresh perspectives
              </span>
              <h2 className="mt-3 text-5xl font-black tracking-[-0.07em] sm:mt-4 sm:text-7xl">
                The latest<span className="text-black/25">.</span>
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-black/50 sm:mt-4">
                Explore guides, comparisons and ideas to help you make smarter
                tech decisions.
              </p>
            </div>

            <div className="relative w-full lg:max-w-[330px]">
              <Search
                size={17}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-black/40"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search stories..."
                aria-label="Search blog stories"
                className="w-full border-b border-black/25 bg-transparent py-4 pl-8 pr-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-black"
              />
            </div>
          </motion.div>

          {/* CATEGORY FILTERS */}
          <div className="mt-9 flex gap-2 overflow-x-auto border-b border-black/10 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={`shrink-0 rounded-full border px-4 py-3 text-[8px] font-black uppercase tracking-[0.12em] transition-all duration-300 sm:px-5 sm:text-[10px] sm:tracking-[0.14em] ${
                  activeCategory === category
                    ? "border-black bg-black text-white"
                    : "border-black/15 bg-transparent text-black/55 hover:border-black hover:text-black"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* ARTICLE GRID */}
          <motion.div
            layout={!reduceMotion}
            className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:mt-10 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-12 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {displayedArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : { opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.4,
                    delay: reduceMotion ? 0 : index * 0.04,
                  }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedArticle(article)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedArticle(article);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Read ${article.title}`}
                >
                  <div className="relative aspect-[5/4] overflow-hidden bg-[#e5e5e2]">
                    <ArticleImage
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />

                    <span className="absolute left-3 top-3 bg-white px-3 py-2 text-[8px] font-black uppercase tracking-[0.14em] text-black sm:left-4 sm:top-4 sm:text-[9px] sm:tracking-[0.16em]">
                      {article.category}
                    </span>

                    <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-black group-hover:text-white sm:bottom-4 sm:right-4 sm:h-10 sm:w-10">
                      <ArrowUpRight size={17} />
                    </div>
                  </div>

                  <div className="pt-4 sm:pt-5">
                    <div className="flex flex-wrap items-center gap-2 text-[8px] font-bold uppercase tracking-[0.12em] text-black/40 sm:gap-3 sm:text-[9px] sm:tracking-[0.14em]">
                      <span>{article.date}</span>
                      <span className="h-1 w-1 rounded-full bg-black/30" />
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="mt-3 text-xl font-black leading-[1.12] tracking-[-0.045em] transition-colors group-hover:text-black/55 sm:mt-4 sm:text-2xl">
                      {article.title}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/50">
                      {article.excerpt}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-black/10 pt-4 sm:mt-6">
                      <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-black/40 sm:text-[9px] sm:tracking-[0.15em]">
                        {article.author}
                      </span>
                      <span className="flex shrink-0 items-center gap-2 text-[8px] font-black uppercase tracking-[0.12em] sm:text-[9px] sm:tracking-[0.15em]">
                        Read more
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {displayedArticles.length === 0 && (
            <div className="py-20 text-center sm:py-24">
              <Search size={30} className="mx-auto text-black/25" />
              <h3 className="mt-5 text-2xl font-black tracking-tight">
                No stories found.
              </h3>
              <p className="mt-2 text-sm text-black/45">
                Try another search or choose a different category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="mt-6 border-b border-black pb-1 text-xs font-bold uppercase tracking-widest"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* BLACK CTA */}
      <section className="bg-black px-5 py-16 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <motion.div
          {...animationProps}
          className="mx-auto flex max-w-[1440px] flex-col justify-between gap-9 lg:flex-row lg:items-end"
        >
          <div>
            <span className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.25em] text-white/45 sm:text-[10px] sm:tracking-[0.3em]">
              <Sparkles size={14} />
              Your next upgrade starts here
            </span>

            <h2 className="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.07em] sm:mt-6 sm:text-7xl lg:text-8xl">
              Find your
              <br />
              next favourite.
            </h2>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/50 sm:mt-7">
              Done reading? Explore smartphones and discover a device that
              fits your world.
            </p>
          </div>

          <a
            href="/buy"
            className="group flex w-fit items-center gap-5 border border-white/30 px-5 py-4 text-[9px] font-black uppercase tracking-[0.18em] transition-all duration-300 hover:bg-white hover:text-black sm:gap-6 sm:px-7 sm:py-5 sm:text-[10px] sm:tracking-[0.2em]"
          >
            Explore phones
            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>
        </motion.div>
      </section>

      {/* ARTICLE READER MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="article-modal-title"
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: 35, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduceMotion
                  ? undefined
                  : { opacity: 0, y: 25, scale: 0.98 }
              }
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[94dvh] w-full max-w-3xl overflow-y-auto overscroll-contain bg-[#f7f7f5] text-black shadow-2xl sm:max-h-[92dvh]"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                aria-label="Close article"
                className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-black hover:text-white sm:right-4 sm:top-4"
              >
                <X size={18} />
              </button>

              <div className="relative h-52 overflow-hidden sm:h-72 md:h-80">
                <ArticleImage
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <span className="absolute bottom-5 left-5 bg-white px-3 py-2 text-[8px] font-black uppercase tracking-[0.18em] text-black sm:bottom-6 sm:left-6 sm:px-4 sm:text-[9px] sm:tracking-[0.2em]">
                  {selectedArticle.category}
                </span>
              </div>

              <div className="px-5 py-7 sm:px-9 sm:py-10 md:px-12 md:py-12">
                <div className="flex flex-wrap items-center gap-3 text-[8px] font-bold uppercase tracking-[0.13em] text-black/40 sm:gap-4 sm:text-[9px] sm:tracking-[0.15em]">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={13} />
                    {selectedArticle.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock3 size={13} />
                    {selectedArticle.readTime}
                  </span>
                </div>

                <h2
                  id="article-modal-title"
                  className="mt-5 text-3xl font-black leading-[1.05] tracking-[-0.055em] sm:mt-6 sm:text-4xl md:text-5xl"
                >
                  {selectedArticle.title}
                </h2>

                <p className="mt-5 border-l-2 border-black pl-4 text-sm font-medium leading-7 text-black/60 sm:mt-6 sm:pl-5 sm:text-base">
                  {selectedArticle.excerpt}
                </p>

                <div className="mt-7 space-y-5 sm:mt-9 sm:space-y-6">
                  {selectedArticle.content.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm leading-7 text-black/70 sm:text-base sm:leading-8"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-9 flex flex-col gap-4 border-t border-black/10 pt-5 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
                  <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-black/40 sm:text-[9px]">
                    {selectedArticle.author}
                  </span>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="flex w-fit items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] sm:text-[10px]"
                  >
                    Close story
                    <X size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
