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
  featured?: boolean
  badge?: string
}

export type Category = "Audio" | "Wearables" | "Computing" | "Home" | "Photography"

export const categories: Category[] = ["Audio", "Wearables", "Computing", "Home", "Photography"]

export const products: Product[] = [
  {
    id: "aura-headphones",
    name: "Aura Wireless Headphones",
    tagline: "Immersive adaptive sound",
    description:
      "Studio-grade drivers with adaptive noise cancellation and 40-hour battery life. Machined aluminum ear cups with memory-foam cushions for all-day comfort.",
    category: "Audio",
    price: 349,
    rating: 4.8,
    reviews: 1284,
    image:
      "https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: true,
    badge: "Best Seller",
  },
  {
    id: "pulse-earbuds",
    name: "Pulse Pro Earbuds",
    tagline: "Sound without limits",
    description:
      "Compact true-wireless earbuds with spatial audio, transparency mode, and a wireless charging case. Sweat and water resistant for any workout.",
    category: "Audio",
    price: 199,
    rating: 4.6,
    reviews: 842,
    image:
      "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "chrono-watch",
    name: "Chrono Smartwatch",
    tagline: "Your day, on your wrist",
    description:
      "A stunning always-on AMOLED display, advanced health tracking, GPS, and multi-day battery. Swap bands to match any moment.",
    category: "Wearables",
    price: 429,
    rating: 4.7,
    reviews: 967,
    image:
      "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: true,
    badge: "New",
  },
  {
    id: "flex-band",
    name: "Flex Fitness Band",
    tagline: "Move with intention",
    description:
      "Lightweight fitness tracker with continuous heart-rate, sleep insights, and a 14-day battery. Slim, comfortable, and always motivating.",
    category: "Wearables",
    price: 129,
    rating: 4.4,
    reviews: 531,
    image:
      "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "nova-laptop",
    name: "Nova Ultrabook 14",
    tagline: "Power that travels light",
    description:
      "A featherweight aluminum ultrabook with a brilliant 14-inch display, all-day battery, and blazing performance for work and play.",
    category: "Computing",
    price: 1299,
    rating: 4.9,
    reviews: 402,
    image:
      "https://images.pexels.com/photos/18105/pexels-photo-18105.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: true,
    badge: "Editor's Choice",
  },
  {
    id: "glide-mouse",
    name: "Glide Wireless Mouse",
    tagline: "Precision in your palm",
    description:
      "Ergonomic wireless mouse with silent clicks, adjustable DPI, and a rechargeable battery that lasts for months on a single charge.",
    category: "Computing",
    price: 79,
    rating: 4.5,
    reviews: 288,
    image:
      "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "halo-speaker",
    name: "Halo Smart Speaker",
    tagline: "Fill every room",
    description:
      "Room-filling 360-degree sound with a built-in voice assistant and elegant fabric finish that complements any space.",
    category: "Home",
    price: 179,
    rating: 4.6,
    reviews: 654,
    image:
      "https://images.pexels.com/photos/127876/pexels-photo-127876.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "lumen-lamp",
    name: "Lumen Desk Lamp",
    tagline: "Light that adapts to you",
    description:
      "Smart LED desk lamp with tunable warmth, wireless charging base, and touch controls. Designed to reduce eye strain during long sessions.",
    category: "Home",
    price: 149,
    rating: 4.7,
    reviews: 219,
    image:
      "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800",
    badge: "New",
  },
  {
    id: "vista-camera",
    name: "Vista Mirrorless Camera",
    tagline: "Capture the extraordinary",
    description:
      "A compact mirrorless camera with a full-frame sensor, 4K video, and lightning-fast autofocus. The perfect companion for creators.",
    category: "Photography",
    price: 1599,
    rating: 4.9,
    reviews: 176,
    image:
      "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: true,
    badge: "Best Seller",
  },
  {
    id: "orbit-drone",
    name: "Orbit Camera Drone",
    tagline: "See the world from above",
    description:
      "Foldable 4K camera drone with obstacle avoidance, 34-minute flight time, and cinematic auto-flight modes for stunning aerial footage.",
    category: "Photography",
    price: 899,
    rating: 4.8,
    reviews: 143,
    image:
      "https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
]

export function getProduct(id: string) {
  return products.find((p) => p.id === id)
}
