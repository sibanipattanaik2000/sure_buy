
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
import { AnimatePresence, motion } from "framer-motion";

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
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const featuredArticle = articles[0];

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === "All" || article.category === activeCategory;

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

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedArticle(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedArticle]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f5] text-[#111111]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#090909] px-5 pb-16 pt-20 text-white sm:px-8 sm:pb-24 sm:pt-28 lg:px-12">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-white/[0.07]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-[340px] w-[340px] rounded-full border border-white/[0.08]" />

        <div className="relative mx-auto max-w-[1440px]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mb-8 flex items-center gap-3"
          >
            <span className="h-[1px] w-10 bg-white" />
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/60 sm:text-xs">
              The PhoneBhai Journal
            </span>
          </motion.div>

          <div className="grid items-end gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <h1 className="max-w-4xl text-[clamp(3.5rem,9vw,8.5rem)] font-black leading-[0.88] tracking-[-0.075em]">
                Tech.
                <br />
                <span className="text-white/35">Without</span>
                <br />
                The Noise.
              </h1>

              <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-md text-sm leading-7 text-white/55 sm:text-base">
                  Smart reads, honest insights and everything worth knowing
                  about the technology in your pocket.
                </p>

                <a
                  href="#latest"
                  className="group inline-flex w-fit items-center gap-3 border-b border-white/40 pb-2 text-xs font-bold uppercase tracking-[0.2em] transition hover:border-white"
                >
                  Explore stories
                  <ArrowDown
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-y-1"
                  />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative ml-auto max-w-[420px]">
                <div className="absolute -left-7 -top-7 z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white text-black">
                  <Sparkles size={25} strokeWidth={1.5} />
                </div>

                <div className="aspect-[4/5] overflow-hidden rounded-sm">
                  <ArticleImage
                    src={featuredArticle.image}
                    alt="Featured smartphone editorial"
                    className="h-full w-full grayscale transition-all duration-700 hover:scale-105 hover:grayscale-0"
                  />
                </div>

                <div className="absolute -bottom-5 -left-10 bg-white px-6 py-4 text-black shadow-xl">
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-black/45">
                    Curiosity looks good on you.
                  </p>
                  <p className="mt-1 text-lg font-black tracking-tight">
                    Stay in the know.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-20 flex items-center justify-between border-t border-white/15 pt-5 text-[9px] font-bold uppercase tracking-[0.25em] text-white/35 sm:text-[10px]">
            <span>Ideas for a smarter digital life</span>
            <span>Read. Discover. Decide.</span>
          </div>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-black" />
              <p className="text-[10px] font-black uppercase tracking-[0.25em]">
                Editor&apos;s Pick
              </p>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
              01 / Featured story
            </span>
          </div>

          <motion.article
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            className="grid overflow-hidden bg-white lg:grid-cols-2"
          >
            <div className="group relative min-h-[320px] overflow-hidden sm:min-h-[470px]">
              <ArticleImage
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="absolute inset-0 h-full w-full grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute left-5 top-5 bg-white px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-black">
                Featured
              </div>
            </div>

            <div className="flex flex-col justify-center px-7 py-10 sm:px-12 sm:py-14 lg:px-16">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-black/40">
                {featuredArticle.category}
              </span>

              <h2 className="mt-6 text-3xl font-black leading-[1.05] tracking-[-0.055em] sm:text-5xl">
                {featuredArticle.title}
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-black/55">
                {featuredArticle.excerpt}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/40">
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
                className="group mt-10 flex w-fit items-center gap-4 border-b border-black pb-3 text-[10px] font-black uppercase tracking-[0.2em]"
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
        className="border-t border-black/10 bg-[#f7f7f5] px-5 py-16 sm:px-8 sm:py-24 lg:px-12"
      >
        <div className="mx-auto max-w-[1440px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
                Fresh perspectives
              </span>
              <h2 className="mt-4 text-5xl font-black tracking-[-0.07em] sm:text-7xl">
                The latest<span className="text-black/25">.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-black/50">
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
          <div className="mt-12 flex gap-2 overflow-x-auto border-b border-black/10 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full border px-5 py-3 text-[9px] font-black uppercase tracking-[0.14em] transition-all duration-300 sm:text-[10px] ${
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
            layout
            className="mt-10 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {displayedArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  layout
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="relative aspect-[5/4] overflow-hidden bg-[#e5e5e2]">
                    <ArticleImage
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />

                    <span className="absolute left-4 top-4 bg-white px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-black">
                      {article.category}
                    </span>

                    <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-black group-hover:text-white">
                      <ArrowUpRight size={17} />
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.14em] text-black/40">
                      <span>{article.date}</span>
                      <span className="h-1 w-1 rounded-full bg-black/30" />
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="mt-4 text-2xl font-black leading-[1.12] tracking-[-0.045em] transition-colors group-hover:text-black/55">
                      {article.title}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/50">
                      {article.excerpt}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4">
                      <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/40">
                        {article.author}
                      </span>
                      <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em]">
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
            <div className="py-24 text-center">
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
      <section className="bg-black px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto flex max-w-[1440px] flex-col justify-between gap-10 lg:flex-row lg:items-end"
        >
          <div>
            <span className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/45">
              <Sparkles size={14} />
              Your next upgrade starts here
            </span>

            <h2 className="mt-6 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.07em] sm:text-7xl lg:text-8xl">
              Find your
              <br />
              next favourite.
            </h2>

            <p className="mt-7 max-w-md text-sm leading-7 text-white/50">
              Done reading? Explore smartphones and discover a device that
              fits your world.
            </p>
          </div>

          <a
            href="/buy"
            className="group flex w-fit items-center gap-6 border border-white/30 px-7 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white hover:text-black"
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="article-modal-title"
              initial={{ opacity: 0, y: 35, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto bg-[#f7f7f5] text-black shadow-2xl"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                aria-label="Close article"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-black hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="relative h-64 overflow-hidden sm:h-80">
                <ArticleImage
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <span className="absolute bottom-6 left-6 bg-white px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-black">
                  {selectedArticle.category}
                </span>
              </div>

              <div className="px-6 py-8 sm:px-12 sm:py-12">
                <div className="flex flex-wrap items-center gap-4 text-[9px] font-bold uppercase tracking-[0.15em] text-black/40">
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
                  className="mt-6 text-3xl font-black leading-[1.05] tracking-[-0.055em] sm:text-5xl"
                >
                  {selectedArticle.title}
                </h2>

                <p className="mt-6 border-l-2 border-black pl-5 text-base font-medium leading-7 text-black/60">
                  {selectedArticle.excerpt}
                </p>

                <div className="mt-9 space-y-6">
                  {selectedArticle.content.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm leading-8 text-black/70 sm:text-base"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-12 flex items-center justify-between border-t border-black/10 pt-6">
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/40">
                    {selectedArticle.author}
                  </span>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em]"
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
