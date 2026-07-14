"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Heart, Minus, Plus, Star, Check, ArrowLeft, Truck, ShieldCheck, RotateCcw } from "lucide-react"
import type { Product } from "@/lib/products"
import { useStore } from "@/context/store-context"
import { formatPrice, cn } from "@/lib/utils"
import { ProductCard } from "@/components/product-card"

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const wished = isInWishlist(product.id)

  function handleAdd() {
    addToCart(product.id, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to shop
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-secondary">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={800}
            height={800}
            priority
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-foreground">
              {product.category}
            </Link>
            {product.badge && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                {product.badge}
              </span>
            )}
          </div>

          <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">{product.tagline}</p>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-4",
                    i < Math.round(product.rating) ? "fill-accent text-accent" : "text-border",
                  )}
                />
              ))}
            </div>
            <span className="font-medium">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
          </div>

          <p className="mt-6 text-3xl font-semibold">{formatPrice(product.price)}</p>

          <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 transition hover:text-accent"
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center text-sm font-medium" aria-live="polite">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-3 transition hover:text-accent"
                aria-label="Increase quantity"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              {added ? (
                <>
                  <Check className="size-4" /> Added to cart
                </>
              ) : (
                <>Add to cart — {formatPrice(product.price * quantity)}</>
              )}
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wished}
              className="rounded-full border border-border p-3 transition hover:bg-secondary"
            >
              <Heart className={cn("size-5", wished && "fill-accent text-accent")} />
            </button>
          </div>

          <div className="mt-8 grid gap-3 border-t border-border pt-6 text-sm sm:grid-cols-3">
            {[
              { icon: Truck, label: "Free shipping over $50" },
              { icon: RotateCcw, label: "30-day returns" },
              { icon: ShieldCheck, label: "2-year warranty" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-muted-foreground">
                <f.icon className="size-4" />
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-semibold tracking-tight">You might also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
