export type Product = {
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
  highlights: string[];
  emiFrom: number;
};

export const products: Product[] = [
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
    image: "/images/phones/iphone-15.png",
    description:
      "The iPhone 15 delivers powerful performance, an advanced camera system and a premium design. This quality-checked device is tested for performance, battery, display and overall condition.",
    highlights: [
      "6.1-inch Super Retina display",
      "A16 Bionic chip",
      "48MP advanced camera system",
      "USB-C connectivity",
      "Face ID",
      "Quality checked by PhoneBuy",
    ],
    emiFrom: 1799,
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
    image: "/images/phones/galaxy-s24.png",
    description:
      "Samsung Galaxy S24 combines a premium display, powerful processor and an advanced camera system. The device has been professionally inspected before being listed.",
    highlights: [
      "6.2-inch Dynamic AMOLED display",
      "256GB storage",
      "Advanced camera system",
      "Premium metal design",
      "Fast charging",
      "Quality checked by PhoneBuy",
    ],
    emiFrom: 2049,
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
    image: "/images/phones/iphone-14-pro.png",
    description:
      "The iPhone 14 Pro features a stunning display, powerful performance and a professional-grade camera system. Every device is carefully inspected before delivery.",
    highlights: [
      "6.1-inch Super Retina XDR display",
      "256GB storage",
      "Pro camera system",
      "Dynamic Island",
      "Face ID",
      "Quality checked by PhoneBuy",
    ],
    emiFrom: 2399,
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
    image: "/images/phones/oneplus-12.png",
    description:
      "OnePlus 12 offers flagship performance, a smooth display and a powerful camera setup. This phone has been checked for functionality and quality.",
    highlights: [
      "High refresh rate AMOLED display",
      "256GB storage",
      "Flagship processor",
      "Fast charging",
      "Premium camera system",
      "Quality checked by PhoneBuy",
    ],
    emiFrom: 1699,
  },
];