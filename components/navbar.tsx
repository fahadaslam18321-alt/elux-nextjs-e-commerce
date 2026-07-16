"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, type FormEvent } from "react"
import { Heart, Search, ShoppingBag, Menu, X } from "lucide-react"
import { useStore } from "@/context/store-context"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { cartCount, wishlist, categories } = useStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") ?? "")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    router.push(`/shop${params.toString() ? `?${params.toString()}` : ""}`)
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link href="/" className="text-2xl font-bold tracking-tight">
          ELUX
        </Link>

        <nav className="ml-6 hidden items-center gap-6 lg:flex">
          <Link href="/shop" className="text-sm text-foreground/80 transition-colors hover:text-foreground">
            Shop
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/shop?category=${encodeURIComponent(c)}`}
              className="text-sm text-foreground/80 transition-colors hover:text-foreground"
            >
              {c}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="ml-auto hidden max-w-xs flex-1 items-center md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="w-full rounded-full border border-input bg-secondary/50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-ring focus:bg-card"
              aria-label="Search products"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <Link
            href="/wishlist"
            className="relative rounded-full p-2 transition-colors hover:bg-secondary"
            aria-label="Wishlist"
          >
            <Heart className="size-5" />
            {mounted && wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="relative rounded-full p-2 transition-colors hover:bg-secondary"
            aria-label="Cart"
          >
            <ShoppingBag className="size-5" />
            {mounted && cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className={cn("border-t border-border lg:hidden", mobileOpen ? "block" : "hidden")}>
        <div className="space-y-1 px-4 py-3">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="w-full rounded-full border border-input bg-secondary/50 py-2 pl-9 pr-4 text-sm outline-none"
                aria-label="Search products"
              />
            </div>
          </form>
          <Link
            href="/shop"
            onClick={() => setMobileOpen(false)}
            className="block rounded-md px-2 py-2 text-sm hover:bg-secondary"
          >
            All Products
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/shop?category=${encodeURIComponent(c)}`}
              onClick={() => setMobileOpen(false)}
              className="block rounded-md px-2 py-2 text-sm hover:bg-secondary"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
