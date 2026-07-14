"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Star, Plus } from "lucide-react"
import type { Product } from "@/lib/products"
import { useStore } from "@/context/store-context"
import { formatPrice, cn } from "@/lib/utils"

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore()
  const wished = isInWishlist(product.id)

  return (
    <div className="group flex flex-col">
      <div className="relative overflow-hidden rounded-xl bg-secondary">
        <Link href={`/product/${product.id}`} aria-label={product.name}>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={600}
            height={600}
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
            {product.badge}
          </span>
        )}

        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className="absolute right-3 top-3 rounded-full bg-card/90 p-2 text-foreground shadow-sm backdrop-blur transition hover:scale-105"
        >
          <Heart className={cn("size-4", wished && "fill-accent text-accent")} />
        </button>

        <button
          onClick={() => addToCart(product.id)}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-medium text-primary-foreground opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Plus className="size-4" /> Add
        </button>
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-accent text-accent" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviews})</span>
          <span className="ml-auto">{product.category}</span>
        </div>
        <Link href={`/product/${product.id}`} className="mt-1">
          <h3 className="text-pretty font-medium leading-snug transition-colors group-hover:text-accent">
            {product.name}
          </h3>
        </Link>
        <p className="mt-auto pt-2 text-lg font-semibold">{formatPrice(product.price)}</p>
      </div>
    </div>
  )
}
