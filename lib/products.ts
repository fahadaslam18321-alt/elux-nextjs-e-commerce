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
