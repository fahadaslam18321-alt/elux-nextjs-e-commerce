export type Product = {
  id: string
  name: string
  tagline: string
  description: string
  category: Category
  price: number
  rating: number
  reviews: number
  image: string
  stock: number
  featured?: boolean
  badge?: string | null
}

export type Category = "Audio" | "Wearables" | "Computing" | "Home" | "Photography"

export const categories: Category[] = ["Audio", "Wearables", "Computing", "Home", "Photography"]

export const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800"

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "fb-1",
    name: "Aura Wireless Headphones",
    tagline: "Studio-grade sound, all-day comfort",
    description: "Over-ear headphones with active noise cancellation, 40-hour battery, and plush memory-foam cushions.",
    category: "Audio",
    price: 299,
    rating: 4.8,
    reviews: 1240,
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800",
    stock: 32,
    featured: true,
    badge: "Best Seller",
  },
  {
    id: "fb-2",
    name: "Pulse True Wireless Earbuds",
    tagline: "Immersive audio in a tiny shell",
    description: "Compact earbuds with adaptive EQ, IPX5 water resistance, and a 24-hour charging case.",
    category: "Audio",
    price: 149,
    rating: 4.6,
    reviews: 890,
    image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800",
    stock: 75,
    featured: false,
    badge: null,
  },
  {
    id: "fb-3",
    name: "Vital Smartwatch Series 6",
    tagline: "Health insights on your wrist",
    description: "AMOLED display, ECG sensor, SpO2 tracking, and 7-day battery life in a titanium case.",
    category: "Wearables",
    price: 399,
    rating: 4.7,
    reviews: 2103,
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800",
    stock: 48,
    featured: true,
    badge: "New",
  },
  {
    id: "fb-4",
    name: "FitBand Activity Tracker",
    tagline: "Move more, every day",
    description: "Slim fitness band with continuous heart-rate, sleep tracking, and guided breathing exercises.",
    category: "Wearables",
    price: 89,
    rating: 4.4,
    reviews: 567,
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800",
    stock: 120,
    featured: false,
    badge: null,
  },
  {
    id: "fb-5",
    name: "Nova UltraBook 14",
    tagline: "Featherlight power",
    description: "14-inch laptop with a 3K OLED display, 32GB RAM, 1TB SSD, and an all-day 18-hour battery.",
    category: "Computing",
    price: 1799,
    rating: 4.9,
    reviews: 412,
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
    stock: 15,
    featured: true,
    badge: "Premium",
  },
  {
    id: "fb-6",
    name: "Mecha Mechanical Keyboard",
    tagline: "Tactile precision, backlit glow",
    description: "Hot-swappable switches, aluminum frame, per-key RGB lighting, and USB-C connectivity.",
    category: "Computing",
    price: 129,
    rating: 4.5,
    reviews: 738,
    image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800",
    stock: 60,
    featured: false,
    badge: null,
  },
  {
    id: "fb-7",
    name: "Orbit 4K Webcam",
    tagline: "Look sharp on every call",
    description: "4K UHD sensor, auto-framing, HDR, and dual noise-cancelling microphones for crystal-clear meetings.",
    category: "Computing",
    price: 199,
    rating: 4.3,
    reviews: 321,
    image: "https://images.pexels.com/photos/2588757/pexels-photo-2588757.jpeg?auto=compress&cs=tinysrgb&w=800",
    stock: 40,
    featured: false,
    badge: null,
  },
  {
    id: "fb-8",
    name: "Lumina Mirrorless Camera",
    tagline: "Capture the moment in 4K",
    description: "26MP sensor, 5-axis stabilization, 4K60 video, and a weather-sealed compact body.",
    category: "Photography",
    price: 1299,
    rating: 4.8,
    reviews: 654,
    image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800",
    stock: 22,
    featured: true,
    badge: "Editor's Pick",
  },
  {
    id: "fb-9",
    name: "Prisma Action Cam X2",
    tagline: "Rugged 4K anywhere",
    description: "Waterproof to 10m, electronic stabilization, live streaming, and a 150-minute battery.",
    category: "Photography",
    price: 349,
    rating: 4.5,
    reviews: 489,
    image: "https://images.pexels.com/photos/2879055/pexels-photo-2879055.jpeg?auto=compress&cs=tinysrgb&w=800",
    stock: 35,
    featured: false,
    badge: null,
  },
  {
    id: "fb-10",
    name: "Sonix Studio Microphone",
    tagline: "Broadcast-quality capture",
    description: "Large-diaphragm USB condenser mic with cardioid pattern, zero-latency monitoring, and shock mount.",
    category: "Audio",
    price: 179,
    rating: 4.6,
    reviews: 921,
    image: "https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&w=800",
    stock: 50,
    featured: false,
    badge: null,
  },
]
