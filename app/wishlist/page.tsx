"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Heart, ArrowRight } from "lucide-react"
import { useStore } from "@/context/store-context"
import { ProductCard } from "@/components/product-card"

export default function WishlistPage() {
  const { wishlist, products, loading } = useStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const items = products.filter((p) => wishlist.includes(p.id))

  if (!mounted) {
    return <div className="mx-auto min-h-[50vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-hidden />
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
          <Heart className="size-7 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Your wishlist is empty</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Tap the heart on any product to save it here for later.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Browse products <ArrowRight className="size-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Wishlist</h1>
      <p className="mt-1 text-sm text-muted-foreground">{items.length} saved items</p>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
