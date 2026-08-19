// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   ArrowRight,
//   BadgeCheck,
//   Check,
//   CreditCard,
//   Heart,
//   MapPin,
//   ShieldCheck,
//   Smartphone,
//   Star,
//   Truck,
//   Wallet,
// } from "lucide-react";

// import { useWishlist } from "../../context/WishlistContext";
// import { useCheckout } from "@/app/context/CheckoutContext";
// import { useCart } from "../../context/CartContext";
// /* =========================================================
//    TYPES
// ========================================================= */

// type ProductVariant = {
//   storage: string;
//   color: string;
//   images: string[];
// };

// type Product = {
//   id: number;
//   brand: string;
//   name: string;
//   category: string;
//   storage: string;
//   condition: string;
//   price: number;
//   originalPrice: number;
//   rating: number;
//   reviews: number;
//   warranty: string;
//   color: string;
//   image: string;
//   description: string;
//   variants: ProductVariant[];
// };

// /* =========================================================
//    PRODUCT DATA
// ========================================================= */

// const products: Product[] = [
//   {
//     id: 1,
//     brand: "Apple",
//     name: "iPhone 15",
//     category: "Smartphones",
//     storage: "128GB",
//     condition: "Excellent",
//     price: 42999,
//     originalPrice: 49999,
//     rating: 4.8,
//     reviews: 124,
//     warranty: "6 Months",
//     color: "Black",
//     image: "/images/iphone-15.png",

//     description:
//       "A powerful and premium iPhone with excellent performance, a beautiful display, reliable cameras and long battery life. Professionally inspected before listing.",

//     variants: [
//       {
//         storage: "128GB",
//         color: "Black",
//         images: [
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//         ],
//       },
//       {
//         storage: "256GB",
//         color: "Black",
//         images: [
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//         ],
//       },
//       {
//         storage: "128GB",
//         color: "Blue",
//         images: [
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//         ],
//       },
//       {
//         storage: "256GB",
//         color: "Blue",
//         images: [
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//         ],
//       },
//     ],
//   },

//   {
//     id: 2,
//     brand: "Samsung",
//     name: "Galaxy S24",
//     category: "Smartphones",
//     storage: "256GB",
//     condition: "Like New",
//     price: 48999,
//     originalPrice: 59999,
//     rating: 4.9,
//     reviews: 89,
//     warranty: "6 Months",
//     color: "Black",
//     image: "/images/iphone-15.png",

//     description:
//       "A premium Samsung smartphone with flagship performance, excellent display quality and a refined camera experience.",

//     variants: [
//       {
//         storage: "128GB",
//         color: "Black",
//         images: [
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//         ],
//       },
//       {
//         storage: "256GB",
//         color: "Black",
//         images: [
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//         ],
//       },
//     ],
//   },

//   {
//     id: 3,
//     brand: "Apple",
//     name: "iPhone 14 Pro",
//     category: "Smartphones",
//     storage: "256GB",
//     condition: "Excellent",
//     price: 57999,
//     originalPrice: 69999,
//     rating: 4.8,
//     reviews: 176,
//     warranty: "6 Months",
//     color: "Purple",
//     image: "/images/iphone-15.png",

//     description:
//       "A premium iPhone Pro model offering powerful performance, excellent cameras and a high-quality display.",

//     variants: [
//       {
//         storage: "128GB",
//         color: "Purple",
//         images: [
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//         ],
//       },
//       {
//         storage: "256GB",
//         color: "Purple",
//         images: [
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//         ],
//       },
//     ],
//   },

//   {
//     id: 4,
//     brand: "OnePlus",
//     name: "OnePlus 12",
//     category: "Smartphones",
//     storage: "256GB",
//     condition: "Good",
//     price: 39999,
//     originalPrice: 49999,
//     rating: 4.7,
//     reviews: 72,
//     warranty: "6 Months",
//     color: "Green",
//     image: "/images/iphone-15.png",

//     description:
//       "A performance-focused smartphone with a large display, fast processor and smooth everyday experience.",

//     variants: [
//       {
//         storage: "128GB",
//         color: "Green",
//         images: [
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//         ],
//       },
//       {
//         storage: "256GB",
//         color: "Green",
//         images: [
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//         ],
//       },
//     ],
//   },

//   {
//     id: 5,
//     brand: "Apple",
//     name: "MacBook Air M2",
//     category: "Laptops",
//     storage: "256GB SSD",
//     condition: "Excellent",
//     price: 69999,
//     originalPrice: 84999,
//     rating: 4.9,
//     reviews: 93,
//     warranty: "12 Months",
//     color: "Silver",
//     image: "/images/iphone-15.png",

//     description:
//       "A lightweight Apple laptop powered by the M2 chip with excellent performance and battery life.",

//     variants: [
//       {
//         storage: "256GB SSD",
//         color: "Silver",
//         images: [
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//         ],
//       },
//       {
//         storage: "512GB SSD",
//         color: "Silver",
//         images: [
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//         ],
//       },
//     ],
//   },

//   {
//     id: 6,
//     brand: "Dell",
//     name: "Inspiron 14",
//     category: "Laptops",
//     storage: "512GB SSD",
//     condition: "Good",
//     price: 42999,
//     originalPrice: 52999,
//     rating: 4.6,
//     reviews: 51,
//     warranty: "6 Months",
//     color: "Silver",
//     image: "/images/iphone-15.png",

//     description:
//       "A practical laptop for everyday work, study and entertainment with a spacious SSD.",

//     variants: [
//       {
//         storage: "256GB SSD",
//         color: "Silver",
//         images: [
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//         ],
//       },
//       {
//         storage: "512GB SSD",
//         color: "Silver",
//         images: [
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//         ],
//       },
//     ],
//   },

//   {
//     id: 7,
//     brand: "Apple",
//     name: "iPad Air",
//     category: "Tablets",
//     storage: "64GB",
//     condition: "Excellent",
//     price: 35999,
//     originalPrice: 42999,
//     rating: 4.8,
//     reviews: 64,
//     warranty: "6 Months",
//     color: "Blue",
//     image: "/images/iphone-15.png",

//     description:
//       "A versatile tablet with a premium design, smooth performance and an excellent display.",

//     variants: [
//       {
//         storage: "64GB",
//         color: "Blue",
//         images: [
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//         ],
//       },
//       {
//         storage: "256GB",
//         color: "Blue",
//         images: [
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//         ],
//       },
//     ],
//   },

//   {
//     id: 8,
//     brand: "Apple",
//     name: "Apple Watch Series 9",
//     category: "Smartwatches",
//     storage: "GPS",
//     condition: "Like New",
//     price: 29999,
//     originalPrice: 39999,
//     rating: 4.8,
//     reviews: 42,
//     warranty: "6 Months",
//     color: "Black",
//     image: "/images/iphone-15.png",

//     description:
//       "A premium smartwatch with health, fitness and everyday smart features.",

//     variants: [
//       {
//         storage: "GPS",
//         color: "Black",
//         images: [
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//           "/images/iphone-15.png",
//         ],
//       },
//     ],
//   },
// ];

// /* =========================================================
//    PAGE PROPS
// ========================================================= */

// type PageProps = {
//   params: Promise<{
//     id: string;
//   }>;
// };

// /* =========================================================
//    PRODUCT DETAILS PAGE
// ========================================================= */

// export default function ProductDetailsPage({ params }: PageProps) {
//   const [productId, setProductId] = useState<number | null>(null);
//   const router = useRouter();

//   const { setProduct } = useCheckout();
//   const { addToCart, isInCart } = useCart();
//   const [selectedStorage, setSelectedStorage] = useState("");

//   const [selectedColor, setSelectedColor] = useState("");

//   const [selectedImage, setSelectedImage] = useState(0);

//   const [paymentMethod, setPaymentMethod] = useState("upi");

//   const { wishlist, toggleWishlist } = useWishlist();
//   const [quantity, setQuantity] = useState(1);
//   /* =======================================================
//      READ ROUTE ID
//   ======================================================= */

//   useEffect(() => {
//     let mounted = true;

//     params.then((value) => {
//       const parsedId = Number(value.id);

//       if (mounted && !Number.isNaN(parsedId)) {
//         setProductId(parsedId);
//       }
//     });

//     return () => {
//       mounted = false;
//     };
//   }, [params]);

//   /* =======================================================
//      LOADING
//   ======================================================= */

//   if (productId === null) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

//           <p className="mt-4 text-sm font-semibold text-gray-500">
//             Loading product...
//           </p>
//         </div>
//       </main>
//     );
//   }

//   /* =======================================================
//      FIND PRODUCT
//   ======================================================= */

//   const product = products.find((item) => item.id === productId);

//   if (!product) {
//     return (
//       <main className="min-h-screen bg-gray-50 px-5 py-20">
//         <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-10 text-center">
//           <h1 className="text-2xl font-black">Product not found</h1>

//           <p className="mt-2 text-sm text-gray-500">
//             The product you're looking for is no longer available.
//           </p>

//           <Link
//             href="/buy"
//             className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white"
//           >
//             <ArrowLeft size={16} />
//             Back to phones
//           </Link>
//         </div>
//       </main>
//     );
//   }

//   /* =======================================================
//      DEFAULT SELECTIONS
//   ======================================================= */

//   const activeStorage = selectedStorage || product.storage;

//   const activeColor = selectedColor || product.color;

//   /* =======================================================
//      FIND ACTIVE VARIANT
//   ======================================================= */

//   const activeVariant =
//     product.variants.find(
//       (variant) =>
//         variant.storage === activeStorage && variant.color === activeColor,
//     ) ||
//     product.variants.find((variant) => variant.storage === activeStorage) ||
//     product.variants[0];

//   const gallery =
//     activeVariant?.images?.length === 4
//       ? activeVariant.images
//       : [product.image, product.image, product.image, product.image];

//   /* =======================================================
//      AVAILABLE OPTIONS
//   ======================================================= */

//   const storageOptions = Array.from(
//     new Set(product.variants.map((variant) => variant.storage)),
//   );

//   const colorOptions = Array.from(
//     new Set(product.variants.map((variant) => variant.color)),
//   );

//   /* =======================================================
//      WISHLIST
//   ======================================================= */

//   const liked = wishlist.some((item) => item.id === String(product.id));

//   const wishlistProduct = {
//     id: String(product.id),
//     name: product.name,
//     brand: product.brand,
//     price: product.price,
//     image: gallery[0],
//     storage: activeStorage,
//   };

//   /* =======================================================
//      PRICE
//   ======================================================= */

//   const discount = Math.round(
//     ((product.originalPrice - product.price) / product.originalPrice) * 100,
//   );

//   const emiPrice = Math.ceil(product.price / 12);

//   /* =======================================================
//      IMAGE CHANGE
//   ======================================================= */

//   const handleStorageChange = (storage: string) => {
//     setSelectedStorage(storage);
//     setSelectedImage(0);
//   };

//   const handleColorChange = (color: string) => {
//     setSelectedColor(color);
//     setSelectedImage(0);
//   };

//   /* =======================================================
//      UI
//   ======================================================= */

//   return (
//     <main className="min-h-screen bg-[#f7f8fa] text-gray-900">
//       {/* PRODUCT */}

//       <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
//         <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
//           {/* =================================================
//               LEFT IMAGE SECTION
//           ================================================= */}

//           <div>
//             {/* MAIN IMAGE */}

//             <div className="relative flex min-h-[520px] items-center justify-center rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
//               <span className="absolute left-5 top-5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white">
//                 {discount}% OFF
//               </span>

//               {/* WISHLIST */}

//               <button
//                 type="button"
//                 onClick={() => toggleWishlist(wishlistProduct)}
//                 aria-label="Add to wishlist"
//                 className={`absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition ${
//                   liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
//                 }`}
//               >
//                 <Heart size={20} fill={liked ? "currentColor" : "none"} />
//               </button>

//               {/* MAIN IMAGE */}

//               <img
//                 src={gallery[selectedImage]}
//                 alt={`${product.name} ${activeColor}`}
//                 className="max-h-[430px] max-w-[80%] object-contain transition duration-500 hover:scale-105"
//               />
//             </div>

//             {/* =================================================
//                 IMAGE THUMBNAILS
//             ================================================= */}

//             <div className="mt-4 grid grid-cols-4 gap-3">
//               {gallery.map((image, index) => (
//                 <button
//                   key={`${image}-${index}`}
//                   type="button"
//                   onClick={() => setSelectedImage(index)}
//                   className={`relative flex h-24 items-center justify-center overflow-hidden rounded-2xl border bg-white p-3 transition ${
//                     selectedImage === index
//                       ? "border-2 border-indigo-600 ring-2 ring-indigo-100"
//                       : "border-gray-200 hover:border-gray-400"
//                   }`}
//                 >
//                   <img
//                     src={image}
//                     alt={`${product.name} view ${index + 1}`}
//                     className="h-full w-full object-contain"
//                   />

//                   {selectedImage === index && (
//                     <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
//                       <Check size={12} />
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </div>

//             {/* TRUST */}

//             <div className="mt-5 grid grid-cols-3 gap-3">
//               <InfoBox
//                 icon={<ShieldCheck size={19} />}
//                 title="Quality checked"
//               />

//               <InfoBox
//                 icon={<BadgeCheck size={19} />}
//                 title={product.warranty}
//               />

//               <InfoBox icon={<Truck size={19} />} title="Fast delivery" />
//             </div>
//           </div>

//           {/* =================================================
//               RIGHT PRODUCT DETAILS
//           ================================================= */}

//           <div>
//             <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
//               {product.brand}
//             </p>

//             <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
//               {product.name}
//             </h1>

//             {/* RATING */}

//             <div className="mt-3 flex flex-wrap items-center gap-3">
//               <div className="flex items-center gap-1 rounded-lg bg-green-600 px-2.5 py-1.5 text-xs font-bold text-white">
//                 {product.rating}
//                 <Star size={12} fill="currentColor" />
//               </div>

//               <span className="text-sm text-gray-500">
//                 {product.reviews} reviews
//               </span>

//               <span className="text-gray-300">•</span>

//               <span className="text-sm font-semibold text-gray-500">
//                 {product.condition} condition
//               </span>
//             </div>

//             {/* DESCRIPTION */}

//             <p className="mt-6 text-sm leading-7 text-gray-500">
//               {product.description}
//             </p>

//             {/* PRICE */}

//             <div className="mt-7 rounded-2xl border border-gray-200 bg-white p-5">
//               <div className="flex flex-wrap items-end gap-3">
//                 <span className="text-3xl font-black">
//                   ₹{product.price.toLocaleString("en-IN")}
//                 </span>

//                 <span className="mb-1 text-sm text-gray-400 line-through">
//                   ₹{product.originalPrice.toLocaleString("en-IN")}
//                 </span>

//                 <span className="mb-1 text-sm font-bold text-green-600">
//                   Save ₹
//                   {(product.originalPrice - product.price).toLocaleString(
//                     "en-IN",
//                   )}
//                 </span>
//               </div>

//               <div className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3">
//                 <CreditCard size={18} className="text-indigo-600" />

//                 <p className="text-xs font-semibold text-indigo-700">
//                   EMI available from ₹{emiPrice.toLocaleString("en-IN")}
//                   /month for 12 months
//                 </p>
//               </div>
//             </div>

//             {/* =================================================
//                 STORAGE
//             ================================================= */}

//             <div className="mt-6">
//               <p className="text-sm font-bold">Storage</p>

//               <div className="mt-3 flex flex-wrap gap-2">
//                 {storageOptions.map((storage) => (
//                   <button
//                     key={storage}
//                     type="button"
//                     onClick={() => handleStorageChange(storage)}
//                     className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
//                       activeStorage === storage
//                         ? "border-indigo-600 bg-indigo-50 text-indigo-600"
//                         : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
//                     }`}
//                   >
//                     {storage}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* =================================================
//                 COLOR
//             ================================================= */}

//             <div className="mt-6">
//               <p className="text-sm font-bold">
//                 Color:{" "}
//                 <span className="font-normal text-gray-500">{activeColor}</span>
//               </p>

//               <div className="mt-3 flex flex-wrap gap-2">
//                 {colorOptions.map((color) => (
//                   <button
//                     key={color}
//                     type="button"
//                     onClick={() => handleColorChange(color)}
//                     className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
//                       activeColor === color
//                         ? "border-indigo-600 bg-indigo-50"
//                         : "border-gray-200 bg-white hover:border-gray-400"
//                     }`}
//                   >
//                     <span
//                       className={`h-5 w-5 rounded-full border border-gray-300 ${
//                         color.toLowerCase().includes("black")
//                           ? "bg-gray-900"
//                           : color.toLowerCase().includes("blue")
//                             ? "bg-blue-500"
//                             : color.toLowerCase().includes("purple")
//                               ? "bg-purple-500"
//                               : color.toLowerCase().includes("green")
//                                 ? "bg-green-500"
//                                 : "bg-gray-300"
//                       }`}
//                     />

//                     {color}

//                     {activeColor === color && (
//                       <Check size={15} className="text-indigo-600" />
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* DELIVERY */}

//             <div className="mt-7 rounded-2xl border border-gray-200 bg-white p-5">
//               <div className="flex items-center gap-3">
//                 <MapPin size={19} className="text-indigo-600" />

//                 <div>
//                   <p className="text-sm font-bold">Check delivery</p>

//                   <p className="mt-1 text-xs text-gray-500">
//                     Enter your PIN code at checkout
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* PAYMENT */}

//             <div className="mt-7">
//               <h2 className="text-lg font-black">Choose payment method</h2>

//               <div className="mt-4 grid gap-3">
//                 <PaymentOption
//                   active={paymentMethod === "upi"}
//                   onClick={() => setPaymentMethod("upi")}
//                   icon={<Wallet size={19} />}
//                   title="UPI"
//                   description="Google Pay, PhonePe, Paytm and more"
//                 />

//                 <PaymentOption
//                   active={paymentMethod === "card"}
//                   onClick={() => setPaymentMethod("card")}
//                   icon={<CreditCard size={19} />}
//                   title="Credit / Debit Card"
//                   description="Secure card payment"
//                 />

//                 <PaymentOption
//                   active={paymentMethod === "emi"}
//                   onClick={() => setPaymentMethod("emi")}
//                   icon={<CreditCard size={19} />}
//                   title="EMI"
//                   description="Pay monthly with eligible cards"
//                 />

//                 <PaymentOption
//                   active={paymentMethod === "cod"}
//                   onClick={() => setPaymentMethod("cod")}
//                   icon={<Truck size={19} />}
//                   title="Cash on Delivery"
//                   description="Pay when your phone arrives"
//                 />
//               </div>
//             </div>






//             {/* BUY */}

//             <button
//               type="button"
//               onClick={() => {
//                 setProduct(
//                   {
//                     id: String(product.id),
//                     name: product.name,
//                     brand: product.brand,
//                     category: product.category,
//                     storage: product.storage,
//                     color: product.color,
//                     condition: product.condition,
//                     price: product.price,
//                     originalPrice: product.originalPrice,
//                     warranty: product.warranty,
//                     image: product.image,
//                   },
//                   selectedStorage || product.storage,
//                   selectedColor || product.color,
//                 );

//                 router.push("/checkout");
//               }}
//               className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
//             >
//               Buy now
//               <ArrowRight size={18} />
//             </button>

//             <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-gray-500">
//               <ShieldCheck size={15} className="text-green-600" />
//               Secure payment • Warranty backed • Quality checked
//             </div>
//           </div>
//         </div>

//         {/* ===================================================
//             PRODUCT INFORMATION
//         =================================================== */}

//         <section className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
//           <h2 className="text-2xl font-black">Product details</h2>

//           <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             <Detail title="Brand" value={product.brand} />

//             <Detail title="Model" value={product.name} />

//             <Detail title="Storage" value={activeStorage} />

//             <Detail title="Colour" value={activeColor} />

//             <Detail title="Condition" value={product.condition} />

//             <Detail title="Warranty" value={product.warranty} />

//             <Detail title="Rating" value={`${product.rating}/5`} />

//             <Detail title="Category" value={product.category} />
//           </div>
//         </section>

//         {/* ===================================================
//             HOW IT WORKS
//         =================================================== */}

//         <section className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
//           <h2 className="text-2xl font-black">Buy with confidence</h2>

//           <div className="mt-7 grid gap-6 md:grid-cols-3">
//             <Step
//               number="01"
//               icon={<Smartphone size={20} />}
//               title="Choose your phone"
//               text="Select your preferred storage, colour and payment option."
//             />

//             <Step
//               number="02"
//               icon={<ShieldCheck size={20} />}
//               title="Secure checkout"
//               text="Complete your payment through our secure checkout process."
//             />

//             <Step
//               number="03"
//               icon={<Truck size={20} />}
//               title="Get it delivered"
//               text="Your quality-checked phone is packed and delivered safely."
//             />
//           </div>
//         </section>
//       </section>
//     </main>
//   );
// }

// /* =========================================================
//    INFO BOX
// ========================================================= */

// function InfoBox({ icon, title }: { icon: React.ReactNode; title: string }) {
//   return (
//     <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-4 text-center">
//       <div className="text-indigo-600">{icon}</div>

//       <p className="mt-2 text-[11px] font-bold text-gray-600">{title}</p>
//     </div>
//   );
// }

// /* =========================================================
//    PAYMENT OPTION
// ========================================================= */

// function PaymentOption({
//   active,
//   onClick,
//   icon,
//   title,
//   description,
// }: {
//   active: boolean;
//   onClick: () => void;
//   icon: React.ReactNode;
//   title: string;
//   description: string;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
//         active
//           ? "border-indigo-600 bg-indigo-50"
//           : "border-gray-200 bg-white hover:border-gray-300"
//       }`}
//     >
//       <div
//         className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
//           active ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"
//         }`}
//       >
//         {icon}
//       </div>

//       <div className="flex-1">
//         <p className="text-sm font-bold">{title}</p>

//         <p className="mt-1 text-xs text-gray-500">{description}</p>
//       </div>

//       <div
//         className={`flex h-5 w-5 items-center justify-center rounded-full border ${
//           active ? "border-indigo-600 bg-indigo-600" : "border-gray-300"
//         }`}
//       >
//         {active && <Check size={12} className="text-white" />}
//       </div>
//     </button>
//   );
// }

// /* =========================================================
//    DETAIL
// ========================================================= */

// function Detail({ title, value }: { title: string; value: string }) {
//   return (
//     <div className="rounded-2xl bg-gray-50 p-4">
//       <p className="text-xs font-semibold text-gray-400">{title}</p>

//       <p className="mt-1 text-sm font-bold text-gray-900">{value}</p>
//     </div>
//   );
// }

// /* =========================================================
//    STEP
// ========================================================= */

// function Step({
//   number,
//   icon,
//   title,
//   text,
// }: {
//   number: string;
//   icon: React.ReactNode;
//   title: string;
//   text: string;
// }) {
//   return (
//     <div className="relative rounded-2xl bg-gray-50 p-6">
//       <div className="flex items-center justify-between">
//         <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
//           {icon}
//         </div>

//         <span className="text-xs font-black text-gray-300">{number}</span>
//       </div>

//       <h3 className="mt-5 font-black">{title}</h3>

//       <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
//     </div>
//   );
// }







"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CreditCard,
  Heart,
  MapPin,
  ShieldCheck,
  Smartphone,
  Star,
  Truck,
  Wallet,
  ShoppingCart,
} from "lucide-react";

import { useWishlist } from "../../context/WishlistContext";
import { useCheckout } from "@/app/context/CheckoutContext";
import { useCart } from "../../context/CartContext";

/* =========================================================
   TYPES
========================================================= */

type ProductVariant = {
  storage: string;
  color: string;
  images: string[];
};

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
  description: string;
  variants: ProductVariant[];
};

/* =========================================================
   PRODUCT DATA
========================================================= */

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
    description:
      "A powerful and premium iPhone with excellent performance, a beautiful display, reliable cameras and long battery life. Professionally inspected before listing.",
    variants: [
      {
        storage: "128GB",
        color: "Black",
        images: [
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
        ],
      },
      {
        storage: "256GB",
        color: "Black",
        images: [
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
        ],
      },
      {
        storage: "128GB",
        color: "Blue",
        images: [
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
        ],
      },
      {
        storage: "256GB",
        color: "Blue",
        images: [
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
        ],
      },
    ],
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
    description:
      "A premium Samsung smartphone with flagship performance, excellent display quality and a refined camera experience.",
    variants: [
      {
        storage: "128GB",
        color: "Black",
        images: [
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
        ],
      },
      {
        storage: "256GB",
        color: "Black",
        images: [
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
        ],
      },
    ],
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
    description:
      "A premium iPhone Pro model offering powerful performance, excellent cameras and a high-quality display.",
    variants: [
      {
        storage: "128GB",
        color: "Purple",
        images: [
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
        ],
      },
      {
        storage: "256GB",
        color: "Purple",
        images: [
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
        ],
      },
    ],
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
    description:
      "A performance-focused smartphone with a large display, fast processor and smooth everyday experience.",
    variants: [
      {
        storage: "128GB",
        color: "Green",
        images: [
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
        ],
      },
      {
        storage: "256GB",
        color: "Green",
        images: [
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
        ],
      },
    ],
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
    description:
      "A lightweight Apple laptop powered by the M2 chip with excellent performance and battery life.",
    variants: [
      {
        storage: "256GB SSD",
        color: "Silver",
        images: [
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
        ],
      },
      {
        storage: "512GB SSD",
        color: "Silver",
        images: [
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
        ],
      },
    ],
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
    description:
      "A practical laptop for everyday work, study and entertainment with a spacious SSD.",
    variants: [
      {
        storage: "256GB SSD",
        color: "Silver",
        images: [
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
        ],
      },
      {
        storage: "512GB SSD",
        color: "Silver",
        images: [
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
        ],
      },
    ],
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
    description:
      "A versatile tablet with a premium design, smooth performance and an excellent display.",
    variants: [
      {
        storage: "64GB",
        color: "Blue",
        images: [
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
        ],
      },
      {
        storage: "256GB",
        color: "Blue",
        images: [
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
        ],
      },
    ],
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
    description:
      "A premium smartwatch with health, fitness and everyday smart features.",
    variants: [
      {
        storage: "GPS",
        color: "Black",
        images: [
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
          "/images/iphone-15.png",
        ],
      },
    ],
  },
];

/* =========================================================
   PAGE PROPS
========================================================= */

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

/* =========================================================
   PRODUCT DETAILS PAGE
========================================================= */

export default function ProductDetailsPage({ params }: PageProps) {
  const [productId, setProductId] = useState<number | null>(null);

  const router = useRouter();

  const { setProduct } = useCheckout();

  const { addToCart, isInCart } = useCart();

  const [selectedStorage, setSelectedStorage] = useState("");

  const [selectedColor, setSelectedColor] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState("upi");

  const { wishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);

  /* =======================================================
     READ ROUTE ID
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    params.then((value) => {
      const parsedId = Number(value.id);

      if (mounted && !Number.isNaN(parsedId)) {
        setProductId(parsedId);
      }
    });

    return () => {
      mounted = false;
    };
  }, [params]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (productId === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-semibold text-gray-500">
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     FIND PRODUCT
  ======================================================= */

  const product = products.find((item) => item.id === productId);

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50 px-5 py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-black">Product not found</h1>

          <p className="mt-2 text-sm text-gray-500">
            The product you're looking for is no longer available.
          </p>

          <Link
            href="/buy"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white"
          >
            <ArrowLeft size={16} />
            Back to phones
          </Link>
        </div>
      </main>
    );
  }

  /* =======================================================
     DEFAULT SELECTIONS
  ======================================================= */

  const activeStorage = selectedStorage || product.storage;

  const activeColor = selectedColor || product.color;

  /* =======================================================
     FIND ACTIVE VARIANT
  ======================================================= */

  const activeVariant =
    product.variants.find(
      (variant) =>
        variant.storage === activeStorage &&
        variant.color === activeColor,
    ) ||
    product.variants.find(
      (variant) => variant.storage === activeStorage,
    ) ||
    product.variants[0];

  const gallery =
    activeVariant?.images?.length === 4
      ? activeVariant.images
      : [
          product.image,
          product.image,
          product.image,
          product.image,
        ];

  /* =======================================================
     AVAILABLE OPTIONS
  ======================================================= */

  const storageOptions = Array.from(
    new Set(
      product.variants.map(
        (variant) => variant.storage,
      ),
    ),
  );

  const colorOptions = Array.from(
    new Set(
      product.variants.map(
        (variant) => variant.color,
      ),
    ),
  );

  /* =======================================================
     WISHLIST
  ======================================================= */

  const liked = wishlist.some(
    (item) => item.id === String(product.id),
  );

  const wishlistProduct = {
    id: String(product.id),
    name: product.name,
    brand: product.brand,
    price: product.price,
    image: gallery[0],
    storage: activeStorage,
  };

  /* =======================================================
     CART
  ======================================================= */

  const currentVariantInCart = isInCart(
    String(product.id),
    activeStorage,
    activeColor,
  );

  const cartProduct = {
    id: String(product.id),
    name: product.name,
    brand: product.brand,
    category: product.category,
    storage: activeStorage,
    color: activeColor,
    condition: product.condition,
    price: product.price,
    originalPrice: product.originalPrice,
    warranty: product.warranty,
    image: gallery[0],
  };

  /* =======================================================
     PRICE
  ======================================================= */

  const discount = Math.round(
    ((product.originalPrice - product.price) /
      product.originalPrice) *
      100,
  );

  const emiPrice = Math.ceil(
    product.price / 12,
  );

  /* =======================================================
     IMAGE CHANGE
  ======================================================= */

  const handleStorageChange = (
    storage: string,
  ) => {
    setSelectedStorage(storage);
    setSelectedImage(0);
  };

  const handleColorChange = (
    color: string,
  ) => {
    setSelectedColor(color);
    setSelectedImage(0);
  };

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const handleAddToCart = () => {
    addToCart(cartProduct, quantity);
  };

  /* =======================================================
     BUY NOW
  ======================================================= */

  const handleBuyNow = () => {
    setProduct(
      {
        id: String(product.id),
        name: product.name,
        brand: product.brand,
        category: product.category,
        storage: activeStorage,
        color: activeColor,
        condition: product.condition,
        price: product.price,
        originalPrice: product.originalPrice,
        warranty: product.warranty,
        image: gallery[0],
      },
      activeStorage,
      activeColor,
    );

    router.push("/checkout");
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">

          {/* =================================================
              LEFT IMAGE SECTION
          ================================================= */}

          <div>
            {/* MAIN IMAGE */}

            <div className="relative flex min-h-[520px] items-center justify-center rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
              <span className="absolute left-5 top-5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white">
                {discount}% OFF
              </span>

              {/* WISHLIST */}

              <button
                type="button"
                onClick={() =>
                  toggleWishlist(
                    wishlistProduct,
                  )
                }
                aria-label="Add to wishlist"
                className={`absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition ${
                  liked
                    ? "text-red-500"
                    : "text-gray-500 hover:text-red-500"
                }`}
              >
                <Heart
                  size={20}
                  fill={
                    liked
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>

              {/* MAIN IMAGE */}

              <img
                src={gallery[selectedImage]}
                alt={`${product.name} ${activeColor}`}
                className="max-h-[430px] max-w-[80%] object-contain transition duration-500 hover:scale-105"
              />
            </div>

            {/* IMAGE THUMBNAILS */}

            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map(
                (image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setSelectedImage(
                        index,
                      )
                    }
                    className={`relative flex h-24 items-center justify-center overflow-hidden rounded-2xl border bg-white p-3 transition ${
                      selectedImage === index
                        ? "border-2 border-indigo-600 ring-2 ring-indigo-100"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${
                        index + 1
                      }`}
                      className="h-full w-full object-contain"
                    />

                    {selectedImage ===
                      index && (
                      <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                ),
              )}
            </div>

            {/* TRUST */}

            <div className="mt-5 grid grid-cols-3 gap-3">
              <InfoBox
                icon={
                  <ShieldCheck
                    size={19}
                  />
                }
                title="Quality checked"
              />

              <InfoBox
                icon={
                  <BadgeCheck
                    size={19}
                  />
                }
                title={product.warranty}
              />

              <InfoBox
                icon={<Truck size={19} />}
                title="Fast delivery"
              />
            </div>
          </div>

          {/* =================================================
              RIGHT PRODUCT DETAILS
          ================================================= */}

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              {product.brand}
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            {/* RATING */}

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-lg bg-green-600 px-2.5 py-1.5 text-xs font-bold text-white">
                {product.rating}
                <Star
                  size={12}
                  fill="currentColor"
                />
              </div>

              <span className="text-sm text-gray-500">
                {product.reviews} reviews
              </span>

              <span className="text-gray-300">
                •
              </span>

              <span className="text-sm font-semibold text-gray-500">
                {product.condition}{" "}
                condition
              </span>
            </div>

            {/* DESCRIPTION */}

            <p className="mt-6 text-sm leading-7 text-gray-500">
              {product.description}
            </p>

            {/* PRICE */}

            <div className="mt-7 rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-3xl font-black">
                  ₹
                  {product.price.toLocaleString(
                    "en-IN",
                  )}
                </span>

                <span className="mb-1 text-sm text-gray-400 line-through">
                  ₹
                  {product.originalPrice.toLocaleString(
                    "en-IN",
                  )}
                </span>

                <span className="mb-1 text-sm font-bold text-green-600">
                  Save ₹
                  {(
                    product.originalPrice -
                    product.price
                  ).toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3">
                <CreditCard
                  size={18}
                  className="text-indigo-600"
                />

                <p className="text-xs font-semibold text-indigo-700">
                  EMI available from ₹
                  {emiPrice.toLocaleString(
                    "en-IN",
                  )}
                  /month for 12 months
                </p>
              </div>
            </div>

            {/* STORAGE */}

            <div className="mt-6">
              <p className="text-sm font-bold">
                Storage
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {storageOptions.map(
                  (storage) => (
                    <button
                      key={storage}
                      type="button"
                      onClick={() =>
                        handleStorageChange(
                          storage,
                        )
                      }
                      className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                        activeStorage ===
                        storage
                          ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {storage}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* COLOR */}

            <div className="mt-6">
              <p className="text-sm font-bold">
                Color:{" "}
                <span className="font-normal text-gray-500">
                  {activeColor}
                </span>
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {colorOptions.map(
                  (color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        handleColorChange(
                          color,
                        )
                      }
                      className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                        activeColor ===
                        color
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-200 bg-white hover:border-gray-400"
                      }`}
                    >
                      <span
                        className={`h-5 w-5 rounded-full border border-gray-300 ${
                          color
                            .toLowerCase()
                            .includes(
                              "black",
                            )
                            ? "bg-gray-900"
                            : color
                                  .toLowerCase()
                                  .includes(
                                    "blue",
                                  )
                              ? "bg-blue-500"
                              : color
                                    .toLowerCase()
                                    .includes(
                                      "purple",
                                    )
                                ? "bg-purple-500"
                                : color
                                      .toLowerCase()
                                      .includes(
                                        "green",
                                      )
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                        }`}
                      />

                      {color}

                      {activeColor ===
                        color && (
                        <Check
                          size={15}
                          className="text-indigo-600"
                        />
                      )}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* QUANTITY */}

            <div className="mt-6">
              <p className="text-sm font-bold">
                Quantity
              </p>

              <div className="mt-3 inline-flex h-11 items-center overflow-hidden rounded-xl border border-gray-200 bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      (current) =>
                        Math.max(
                          1,
                          current - 1,
                        ),
                    )
                  }
                  aria-label="Decrease quantity"
                  className="flex h-full w-11 items-center justify-center text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                >
                  <span className="text-lg">
                    −
                  </span>
                </button>

                <span className="flex h-full min-w-12 items-center justify-center border-x border-gray-200 px-3 text-sm font-bold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      (current) =>
                        current + 1,
                    )
                  }
                  aria-label="Increase quantity"
                  className="flex h-full w-11 items-center justify-center text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                >
                  <span className="text-lg">
                    +
                  </span>
                </button>
              </div>
            </div>

            {/* DELIVERY */}

            <div className="mt-7 rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <MapPin
                  size={19}
                  className="text-indigo-600"
                />

                <div>
                  <p className="text-sm font-bold">
                    Check delivery
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Enter your PIN code at
                    checkout
                  </p>
                </div>
              </div>
            </div>

            {/* PAYMENT */}

            <div className="mt-7">
              <h2 className="text-lg font-black">
                Choose payment method
              </h2>

              <div className="mt-4 grid gap-3">
                <PaymentOption
                  active={
                    paymentMethod ===
                    "upi"
                  }
                  onClick={() =>
                    setPaymentMethod(
                      "upi",
                    )
                  }
                  icon={
                    <Wallet size={19} />
                  }
                  title="UPI"
                  description="Google Pay, PhonePe, Paytm and more"
                />

                <PaymentOption
                  active={
                    paymentMethod ===
                    "card"
                  }
                  onClick={() =>
                    setPaymentMethod(
                      "card",
                    )
                  }
                  icon={
                    <CreditCard
                      size={19}
                    />
                  }
                  title="Credit / Debit Card"
                  description="Secure card payment"
                />

                <PaymentOption
                  active={
                    paymentMethod ===
                    "emi"
                  }
                  onClick={() =>
                    setPaymentMethod(
                      "emi",
                    )
                  }
                  icon={
                    <CreditCard
                      size={19}
                    />
                  }
                  title="EMI"
                  description="Pay monthly with eligible cards"
                />

                <PaymentOption
                  active={
                    paymentMethod ===
                    "cod"
                  }
                  onClick={() =>
                    setPaymentMethod(
                      "cod",
                    )
                  }
                  icon={
                    <Truck size={19} />
                  }
                  title="Cash on Delivery"
                  description="Pay when your phone arrives"
                />
              </div>
            </div>

            {/* =================================================
                CART + BUY BUTTONS
            ================================================= */}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">

              {/* ADD TO CART */}

              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                className={`flex h-14 w-full items-center justify-center gap-2 rounded-2xl border text-sm font-black transition ${
                  currentVariantInCart
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-indigo-200 bg-white text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50"
                }`}
              >
                {currentVariantInCart ? (
                  <>
                    <Check
                      size={18}
                    />
                    Added to cart
                  </>
                ) : (
                  <>
                    <ShoppingCart
                      size={18}
                    />
                    Add to cart
                  </>
                )}
              </button>

              {/* BUY NOW */}

              <button
                type="button"
                onClick={
                  handleBuyNow
                }
                className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Buy now

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>

            {/* VIEW CART */}

            {currentVariantInCart && (
              <Link
                href="/cart"
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-100 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
              >
                <ShoppingCart
                  size={16}
                />
                View cart
              </Link>
            )}

            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-gray-500">
              <ShieldCheck
                size={15}
                className="text-green-600"
              />
              Secure payment • Warranty
              backed • Quality checked
            </div>
          </div>
        </div>

        {/* ===================================================
            PRODUCT INFORMATION
        =================================================== */}

        <section className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-black">
            Product details
          </h2>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Detail
              title="Brand"
              value={product.brand}
            />

            <Detail
              title="Model"
              value={product.name}
            />

            <Detail
              title="Storage"
              value={activeStorage}
            />

            <Detail
              title="Colour"
              value={activeColor}
            />

            <Detail
              title="Condition"
              value={product.condition}
            />

            <Detail
              title="Warranty"
              value={product.warranty}
            />

            <Detail
              title="Rating"
              value={`${product.rating}/5`}
            />

            <Detail
              title="Category"
              value={product.category}
            />
          </div>
        </section>

        {/* ===================================================
            HOW IT WORKS
        =================================================== */}

        <section className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-black">
            Buy with confidence
          </h2>

          <div className="mt-7 grid gap-6 md:grid-cols-3">
            <Step
              number="01"
              icon={
                <Smartphone size={20} />
              }
              title="Choose your phone"
              text="Select your preferred storage, colour and payment option."
            />

            <Step
              number="02"
              icon={
                <ShieldCheck size={20} />
              }
              title="Secure checkout"
              text="Complete your payment through our secure checkout process."
            />

            <Step
              number="03"
              icon={<Truck size={20} />}
              title="Get it delivered"
              text="Your quality-checked phone is packed and delivered safely."
            />
          </div>
        </section>
      </section>
    </main>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-4 text-center">
      <div className="text-indigo-600">
        {icon}
      </div>

      <p className="mt-2 text-[11px] font-bold text-gray-600">
        {title}
      </p>
    </div>
  );
}

/* =========================================================
   PAYMENT OPTION
========================================================= */

function PaymentOption({
  active,
  onClick,
  icon,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
        active
          ? "border-indigo-600 bg-indigo-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          active
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-sm font-bold">
          {title}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>
      </div>

      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          active
            ? "border-indigo-600 bg-indigo-600"
            : "border-gray-300"
        }`}
      >
        {active && (
          <Check
            size={12}
            className="text-white"
          />
        )}
      </div>
    </button>
  );
}

/* =========================================================
   DETAIL
========================================================= */

function Detail({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-xs font-semibold text-gray-400">
        {title}
      </p>

      <p className="mt-1 text-sm font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   STEP
========================================================= */

function Step({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="relative rounded-2xl bg-gray-50 p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
          {icon}
        </div>

        <span className="text-xs font-black text-gray-300">
          {number}
        </span>
      </div>

      <h3 className="mt-5 font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {text}
      </p>
    </div>
  );
}