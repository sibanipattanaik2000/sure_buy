"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Filter,
  Heart,
  PackageCheck,
  Search,
  ShieldCheck,
  Smartphone,
  Star,
  Tablet,
  Truck,
  Watch,
  X,
  Zap,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import Link from "next/link";
type Product = {
  id: number;
  brand: string;
  name: string;
  category: string;
  storage: string;
  condition: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  warranty: string;
  color: string;
  image: string;
};

const products: Product[] = [
  {
    id: 1,
    brand: "Apple",
    name: "iPhone 15",
    category: "Smartphones",
    storage: "128GB",
    condition: "Excellent",
    price: 42999,
    originalPrice: 49999,
    rating: 4.8,
    reviews: 124,
    warranty: "6 Months",
    color: "Black",
    image: "/images/iphone-15.png",
  },
  {
    id: 2,
    brand: "Samsung",
    name: "Galaxy S24",
    category: "Smartphones",
    storage: "256GB",
    condition: "Like New",
    price: 48999,
    originalPrice: 59999,
    rating: 4.9,
    reviews: 89,
    warranty: "6 Months",
    color: "Black",
    image: "/images/iphone-15.png",
  },
  {
    id: 3,
    brand: "Apple",
    name: "iPhone 14 Pro",
    category: "Smartphones",
    storage: "256GB",
    condition: "Excellent",
    price: 57999,
    originalPrice: 69999,
    rating: 4.8,
    reviews: 176,
    warranty: "6 Months",
    color: "Purple",
    image: "/images/iphone-15.png",
  },
  {
    id: 4,
    brand: "OnePlus",
    name: "OnePlus 12",
    category: "Smartphones",
    storage: "256GB",
    condition: "Good",
    price: 39999,
    originalPrice: 49999,
    rating: 4.7,
    reviews: 72,
    warranty: "6 Months",
    color: "Green",
    image: "/images/iphone-15.png",
  },
  {
    id: 5,
    brand: "Apple",
    name: "MacBook Air M2",
    category: "Laptops",
    storage: "256GB SSD",
    condition: "Excellent",
    price: 69999,
    originalPrice: 84999,
    rating: 4.9,
    reviews: 93,
    warranty: "12 Months",
    color: "Silver",
    image: "/images/iphone-15.png",
  },
  {
    id: 6,
    brand: "Dell",
    name: "Inspiron 14",
    category: "Laptops",
    storage: "512GB SSD",
    condition: "Good",
    price: 42999,
    originalPrice: 52999,
    rating: 4.6,
    reviews: 51,
    warranty: "6 Months",
    color: "Silver",
    image: "/images/iphone-15.png",
  },
  {
    id: 7,
    brand: "Apple",
    name: "iPad Air",
    category: "Tablets",
    storage: "64GB",
    condition: "Excellent",
    price: 35999,
    originalPrice: 42999,
    rating: 4.8,
    reviews: 64,
    warranty: "6 Months",
    color: "Blue",
    image: "/images/iphone-15.png",
  },
  {
    id: 8,
    brand: "Apple",
    name: "Apple Watch Series 9",
    category: "Smartwatches",
    storage: "GPS",
    condition: "Like New",
    price: 29999,
    originalPrice: 39999,
    rating: 4.8,
    reviews: 42,
    warranty: "6 Months",
    color: "Black",
    image: "/images/iphone-15.png",
  },
];

const categories = [
  { name: "All", icon: null },
  { name: "Smartphones", icon: Smartphone },
  //   { name: "Laptops", icon: Laptop },
  { name: "Tablets", icon: Tablet },
  { name: "Smartwatches", icon: Watch },
];

const brands = ["Apple", "Samsung", "OnePlus", "Google", "Xiaomi", "Dell"];

export default function BuyPage() {
  const [category, setCategory] = useState("All");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [mobileFilters, setMobileFilters] = useState(false);
  //const [wishlist, setWishlist] = useState<number[]>([]);
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "All") {
      result = result.filter((product) => product.category === category);
    }

    if (selectedBrands.length > 0) {
      result = result.filter((product) =>
        selectedBrands.includes(product.brand),
      );
    }

    result = result.filter((product) => product.price <= maxPrice);

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      );
    }

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [category, selectedBrands, maxPrice, sort, search]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((current) =>
      current.includes(brand)
        ? current.filter((item) => item !== brand)
        : [...current, brand],
    );
  };

  const { wishlist, toggleWishlist } = useWishlist();

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#111827]">
      {/* HEADER */}

      {/* <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
              <Zap size={17} />
            </div>

            <span className="text-xl font-black">
              Sure<span className="text-indigo-600">Buy</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="/"
              className="text-sm font-medium text-gray-500 hover:text-black"
            >
              Home
            </a>

            <a
              href="/buy"
              className="text-sm font-bold text-indigo-600"
            >
              Buy
            </a>

            <a
              href="/sell"
              className="text-sm font-medium text-gray-500 hover:text-black"
            >
              Sell
            </a>

            <a
              href="/repair"
              className="text-sm font-medium text-gray-500 hover:text-black"
            >
              Repair
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button className="hidden h-10 w-10 items-center justify-center rounded-full border border-gray-200 sm:flex">
              <Heart size={18} />
            </button>

            <button className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white">
              Sign in
            </button>
          </div>
        </div>
      </header> */}

      {/* HERO */}

      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              PhoneBhai Marketplace
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Find tech you'll love.
            </h1>

            <p className="mt-4 max-w-2xl text-gray-500">
              Certified devices, transparent pricing and warranty-backed
              purchases.
            </p>
          </div>

          {/* SEARCH */}

          <div className="mt-8 flex max-w-3xl items-center rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
            <Search className="ml-3 text-gray-400" size={20} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search iPhone, Samsung, MacBook..."
              className="h-12 flex-1 bg-transparent px-4 text-sm outline-none"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="mr-2 text-gray-400 hover:text-black"
              >
                <X size={17} />
              </button>
            )}

            <button className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORY BAR */}

      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl overflow-x-auto px-5 lg:px-8">
          <div className="flex min-w-max gap-3 py-4">
            {categories.map((item) => {
              const Icon = item.icon;
              const active = category === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => setCategory(item.name)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-black text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* MAIN */}

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* MOBILE FILTER */}

        <button
          onClick={() => setMobileFilters(!mobileFilters)}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold lg:hidden"
        >
          <Filter size={17} />
          Filters
        </button>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* FILTER SIDEBAR */}

          <aside className={`${mobileFilters ? "block" : "hidden"} lg:block`}>
            <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold">Filters</h2>

                {(selectedBrands.length > 0 || maxPrice < 100000) && (
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setMaxPrice(100000);
                    }}
                    className="text-xs font-bold text-indigo-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* BRAND */}

              <div className="mt-7">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Brand
                </h3>

                <div className="mt-4 space-y-3">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex cursor-pointer items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="h-4 w-4 rounded border-gray-300 accent-indigo-600"
                        />

                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* PRICE */}

              <div className="mt-8 border-t border-gray-100 pt-7">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Maximum price
                </h3>

                <div className="mt-4 flex items-center justify-between text-sm font-bold">
                  <span>₹10K</span>
                  <span>₹{maxPrice.toLocaleString("en-IN")}</span>
                </div>

                <input
                  type="range"
                  min="10000"
                  max="100000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="mt-4 w-full accent-indigo-600"
                />
              </div>

              {/* TRUST */}

              <div className="mt-8 rounded-2xl bg-gray-50 p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="shrink-0 text-indigo-600" size={19} />

                  <div>
                    <p className="text-xs font-bold">Every device is checked</p>

                    <p className="mt-1 text-[11px] leading-5 text-gray-500">
                      Multi-point quality inspection before listing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* PRODUCTS */}

          <div>
            {/* TOOLBAR */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold">
                  {filteredProducts.length} devices
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Showing available products
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden text-xs text-gray-400 sm:block">
                  Sort by
                </span>

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-10 appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-9 text-xs font-bold outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-3 text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* PRODUCT GRID */}

            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-16 text-center">
                <Search size={35} className="mx-auto text-gray-300" />

                <h3 className="mt-5 text-xl font-bold">No devices found</h3>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    liked={wishlist.some(
                      (item) => item.id === String(product.id),
                    )}
                    // onWishlist={() =>
                    //   toggleWishlist({
                    //     ...product,
                    //     id: String(product.id),
                    //   })
                    // }

                    onWishlist={() =>
                      toggleWishlist({
                        id: String(product.id),
                        name: product.name,
                        brand: product.brand,
                        price: product.price,
                        image: product.image,
                        storage: product.storage,
                      })
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}

      <section className="border-t border-gray-100 bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            <TrustCard
              icon={<ShieldCheck size={21} />}
              title="Quality checked"
              text="Every device goes through a detailed inspection."
            />

            <TrustCard
              icon={<PackageCheck size={21} />}
              title="Warranty included"
              text="Buy with confidence with warranty-backed devices."
            />

            <TrustCard
              icon={<Truck size={21} />}
              title="Fast delivery"
              text="Get your device delivered safely to your doorstep."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}

      {/* <footer className="bg-[#111827] py-12 text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="text-xl font-black">
                Sure<span className="text-indigo-400">Buy</span>
              </div>

              <p className="mt-2 text-sm text-gray-400">
                Smarter tech. Better value.
              </p>
            </div>

            <div className="text-xs text-gray-500">
              © {new Date().getFullYear()} PhoneBhai. All rights reserved.
            </div>
          </div>
        </div>
      </footer> */}
    </main>
  );
}

/* PRODUCT CARD */

function ProductCard({
  product,
  liked,
  onWishlist,
}: {
  product: Product;
  liked: boolean;
  onWishlist: () => void;
}) {
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  return (
    <article className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* IMAGE AREA */}

      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#f4f5f7] sm:h-64">
        {/* Discount */}

        <span className="absolute left-3 top-3 z-10 rounded-full bg-green-500 px-2.5 py-1 text-[10px] font-bold text-white">
          {discount}% OFF
        </span>

        {/* Wishlist */}

        <button
          onClick={onWishlist}
          className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition ${
            liked ? "text-red-500" : "text-gray-500"
          }`}
        >
          <Heart size={17} fill={liked ? "currentColor" : "none"} />
        </button>

        {/* TEMPORARY PRODUCT VISUAL */}

        {/* <div className="relative flex h-36 w-24 items-center justify-center rounded-[1.7rem] border-[5px] border-gray-700 bg-gradient-to-br from-gray-700 to-gray-950 shadow-xl transition duration-500 group-hover:scale-105 sm:h-40 sm:w-28">
          <Smartphone
            size={55}
            strokeWidth={1}
            className="text-white/70"
          />

          <div className="absolute right-[-3px] top-8 h-10 w-1 rounded-full bg-gray-600" />
        </div> */}
        <div className="relative flex h-36 w-28 items-center justify-center transition duration-500 group-hover:scale-105 sm:h-40 sm:w-32">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        </div>
        {/* Condition */}

        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold shadow-sm backdrop-blur">
          {product.condition}
        </span>
      </div>

      {/* CONTENT */}

      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {product.brand}
          </p>

          <div className="flex items-center gap-1 text-[10px] font-bold">
            <Star size={12} fill="currentColor" className="text-yellow-500" />
            {product.rating}
          </div>
        </div>

        <h2 className="mt-1 text-sm font-bold sm:text-base">{product.name}</h2>

        <p className="mt-1 text-xs text-gray-500">
          {product.storage} • {product.color}
        </p>

        {/* PRICE */}

        <div className="mt-5">
          <div className="flex items-end gap-2">
            <span className="text-lg font-black sm:text-xl">
              ₹{product.price.toLocaleString("en-IN")}
            </span>

            <span className="text-xs text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <p className="mt-1 text-[10px] text-green-600">
            You save ₹
            {(product.originalPrice - product.price).toLocaleString("en-IN")}
          </p>
        </div>

        {/* WARRANTY */}

        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4">
          <BadgeCheck size={15} className="text-indigo-600" />

          <span className="text-[10px] font-semibold text-gray-500">
            {product.warranty} warranty
          </span>
        </div>

        {/* BUTTON */}

        <Link
          href={`/buy/${product.id}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-xs font-bold text-white transition hover:bg-indigo-600"
        >
          View details
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}

/* TRUST CARD */

function TrustCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-[#f8f9fb] p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
        {icon}
      </div>

      <h3 className="mt-5 font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
    </div>
  );
}
