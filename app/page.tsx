"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Laptop,
  Menu,
  PackageCheck,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tablet,
  Truck,
  Watch,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import DeviceSearch from "./components/DeviceSearch";

const categories = [
  {
    name: "Smartphones",
    icon: Smartphone,
    description: "Buy & sell phones",
  },
  {
    name: "Laptops",
    icon: Laptop,
    description: "Premium laptops",
  },
  {
    name: "Tablets",
    icon: Tablet,
    description: "Power on the go",
  },
  {
    name: "Smartwatches",
    icon: Watch,
    description: "Wearable tech",
  },
];

const products = [
  {
    brand: "Apple",
    name: "iPhone 15",
    storage: "128GB",
    price: "₹42,999",
    oldPrice: "₹49,999",
    condition: "Excellent",
  },
  {
    brand: "Samsung",
    name: "Galaxy S24",
    storage: "256GB",
    price: "₹48,999",
    oldPrice: "₹59,999",
    condition: "Like New",
  },
  {
    brand: "Apple",
    name: "MacBook Air M2",
    storage: "256GB SSD",
    price: "₹69,999",
    oldPrice: "₹84,999",
    condition: "Excellent",
  },
  {
    brand: "OnePlus",
    name: "OnePlus 12",
    storage: "256GB",
    price: "₹39,999",
    oldPrice: "₹49,999",
    condition: "Good",
  },
];

const services = [
  {
    icon: Smartphone,
    title: "Buy Devices",
    description:
      "Certified refurbished smartphones, laptops, tablets and more.",
  },
  {
    icon: PackageCheck,
    title: "Sell Your Device",
    description: "Get a competitive price and convenient doorstep pickup.",
  },
  {
    icon: Wrench,
    title: "Repair & Care",
    description: "Professional repair services from trained technicians.",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      image:
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=2000&q=85",
      badge: "Certified Devices",
      title: "Buy Smart. Buy Certified.",
      description:
        "Get quality-checked smartphones, laptops, tablets and more at prices you'll love.",
      primaryText: "Explore Devices",
      secondaryText: "Shop Now",
      primaryLink: "#products",
      secondaryLink: "#products",
    },
    {
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=2000&q=85",
      badge: "Best Value for Your Tech",
      title: "Turn Your Old Tech Into Cash.",
      description:
        "Sell your old devices easily and get a great value with our simple selling process.",
      primaryText: "Sell Your Device",
      secondaryText: "Get a Quote",
      primaryLink: "#sell",
      secondaryLink: "#sell",
    },
    {
      image:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=2000&q=85",
      badge: "Professional Repairs",
      title: "Broken Device? We've Got You.",
      description:
        "Reliable repairs by skilled professionals using quality parts and trusted service.",
      primaryText: "Book a Repair",
      secondaryText: "Learn More",
      primaryLink: "#repair",
      secondaryLink: "#repair",
    },
    {
      image:
        "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=2000&q=85",
      badge: "Everything Tech, One Place",
      title: "Your Tech. Your Choice.",
      description:
        "Buy, sell and repair your devices — all from one trusted technology platform.",
      primaryText: "Get Started",
      secondaryText: "Explore",
      primaryLink: "#products",
      secondaryLink: "#sell",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#111827]">
     <section className="bg-white">
  <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

    {/* HERO BANNER */}
    <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm">

      <motion.div
        key={currentSlide}
        initial={{ opacity: 0.5, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
        className="relative h-[280px] sm:h-[360px] lg:h-[430px]"
      >

        {/* IMAGE */}
        <img
          src={banners[currentSlide].image}
          alt={banners[currentSlide].title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

        {/* CONTENT */}
        <div className="relative z-10 flex h-full items-center px-7 sm:px-10 lg:px-16">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl text-white"
          >

            {/* BADGE */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-md sm:text-sm">
              <Sparkles size={14} />
              {banners[currentSlide].badge}
            </div>

            {/* TITLE */}
            <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              {banners[currentSlide].title}
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/85 sm:text-base">
              {banners[currentSlide].description}
            </p>

            {/* BUTTONS */}
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={banners[currentSlide].primaryLink}
                className="group flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                {banners[currentSlide].primaryText}

                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </a>

              <a
                href={banners[currentSlide].secondaryLink}
                className="rounded-lg bg-white px-5 py-3 text-sm font-bold text-gray-900 transition hover:bg-gray-100"
              >
                {banners[currentSlide].secondaryText}
              </a>
            </div>
          </motion.div>
        </div>

        {/* PREVIOUS */}
        <button
          onClick={prevSlide}
          aria-label="Previous banner"
          className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-800 shadow-md transition hover:bg-gray-100 sm:left-5"
        >
          <ChevronLeft size={21} />
        </button>

        {/* NEXT */}
        <button
          onClick={nextSlide}
          aria-label="Next banner"
          className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-800 shadow-md transition hover:bg-gray-100 sm:right-5"
        >
          <ChevronRight size={21} />
        </button>

        {/* DOTS */}
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to banner ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-7 bg-white"
                  : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>

      </motion.div>
    </div>

  </div>
</section>

      {/* TRUST BAR */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-gray-100 lg:grid-cols-4">
          <div className="flex items-center gap-3 px-5 py-6">
            <ShieldCheck className="text-indigo-600" />
            <div>
              <p className="text-sm font-bold">100% Verified</p>
              <p className="text-xs text-gray-500">Quality checked devices</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-6">
            <Truck className="text-indigo-600" />
            <div>
              <p className="text-sm font-bold">Doorstep Pickup</p>
              <p className="text-xs text-gray-500">Convenient & secure</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-6">
            <CircleCheck className="text-indigo-600" />
            <div>
              <p className="text-sm font-bold">Warranty Included</p>
              <p className="text-xs text-gray-500">Shop with confidence</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-6">
            <PackageCheck className="text-indigo-600" />
            <div>
              <p className="text-sm font-bold">Easy Returns</p>
              <p className="text-xs text-gray-500">Simple return process</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Explore
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Shop by category
            </h2>
          </div>

          <button className="hidden items-center gap-1 text-sm font-bold md:flex">
            View all
            <ChevronRight size={17} />
          </button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer rounded-3xl border border-gray-200 bg-white p-6 transition hover:border-indigo-200 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon size={27} />
                </div>

                <h3 className="mt-6 font-bold">{category.name}</h3>

                <p className="mt-1 text-sm text-gray-500">
                  {category.description}
                </p>

                <div className="mt-5 flex items-center gap-1 text-xs font-bold text-indigo-600">
                  Explore
                  <ArrowRight size={14} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                Featured
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Trending devices
              </h2>

              <p className="mt-3 text-gray-500">
                Quality checked. Better prices. Ready to go.
              </p>
            </div>

            <button className="hidden items-center gap-1 text-sm font-bold md:flex">
              View all
              <ChevronRight size={17} />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {products.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative flex h-56 items-center justify-center bg-[#f5f5f7]">
                  <div className="flex h-36 w-24 items-center justify-center rounded-[1.7rem] bg-gradient-to-br from-gray-800 to-gray-950 shadow-xl transition duration-500 group-hover:scale-105">
                    <Smartphone
                      size={58}
                      strokeWidth={1}
                      className="text-white/70"
                    />
                  </div>

                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-bold shadow-sm">
                    {product.condition}
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {product.brand}
                  </p>

                  <h3 className="mt-1 font-bold">{product.name}</h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {product.storage}
                  </p>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-lg font-black">{product.price}</p>
                      <p className="text-xs text-gray-400 line-through">
                        {product.oldPrice}
                      </p>
                    </div>

                    <button className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition hover:bg-indigo-600">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SELL CTA */}
      <section id="sell" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] bg-[#111827]">
          <div className="grid items-center lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-16">
              <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white/80">
                SELL YOUR TECH
              </div>

              <h2 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Turn your old device into instant value.
              </h2>

              <p className="mt-5 max-w-lg leading-7 text-gray-400">
                Get an estimated price, book a convenient pickup slot and get
                paid after your device passes our quality inspection.
              </p>

              <button className="mt-8 flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-black transition hover:bg-gray-100">
                Get Device Price
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="relative hidden min-h-[400px] items-center justify-center lg:flex">
              <div className="absolute h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl" />

              <div className="relative rotate-6 rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur">
                <div className="text-xs font-bold uppercase tracking-widest text-white/40">
                  Estimated value
                </div>

                <div className="mt-3 text-6xl font-black text-white">
                  ₹35,000
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm text-green-400">
                  <CircleCheck size={17} />
                  Free doorstep pickup
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="repair" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              One platform
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Everything your tech needs.
            </h2>

            <p className="mt-4 text-gray-500">
              From buying and selling to repairs and after-sales support,
              PhoneBhai keeps everything in one place.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="rounded-3xl border border-gray-200 bg-[#f8f9fb] p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Icon size={23} className="text-indigo-600" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold">{service.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {service.description}
                  </p>

                  <button className="mt-6 flex items-center gap-1 text-sm font-bold text-indigo-600">
                    Learn more
                    <ArrowRight size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY PhoneBhai */}
      <section id="why-us" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="rounded-[2.5rem] bg-indigo-600 p-8 sm:p-12 lg:p-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">
                Why PhoneBhai
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Tech buying should feel simple.
              </h2>

              <p className="mt-5 leading-7 text-indigo-100">
                We make every step transparent — from device condition and
                pricing to delivery, warranty and support.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Verified devices",
                "Transparent pricing",
                "Secure payments",
                "Doorstep services",
                "Warranty protection",
                "Dedicated support",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4"
                >
                  <CircleCheck className="text-white" size={19} />

                  <span className="text-sm font-semibold text-white">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      {/* <footer className="bg-[#111827] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
                  <Sparkles size={17} />
                </div>

                <span className="text-xl font-black">
                  Sure<span className="text-indigo-400">Buy</span>
                </span>
              </div>

              <p className="mt-5 max-w-xs text-sm leading-6 text-gray-400">
                A smarter way to buy, sell and care for your technology.
              </p>
            </div>

            <div>
              <h3 className="font-bold">Shop</h3>

              <div className="mt-4 space-y-3 text-sm text-gray-400">
                <p>Smartphones</p>
                <p>Laptops</p>
                <p>Tablets</p>
                <p>Accessories</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold">Services</h3>

              <div className="mt-4 space-y-3 text-sm text-gray-400">
                <p>Sell Your Device</p>
                <p>Repair</p>
                <p>Doorstep Pickup</p>
                <p>Warranty</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold">Support</h3>

              <div className="mt-4 space-y-3 text-sm text-gray-400">
                <p>Contact Us</p>
                <p>FAQs</p>
                <p>Track Order</p>
                <p>Privacy Policy</p>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 text-xs text-gray-500">
            © {new Date().getFullYear()} PhoneBhai. All rights reserved.
          </div>
        </div>
      </footer> */}
    </main>
  );
}
