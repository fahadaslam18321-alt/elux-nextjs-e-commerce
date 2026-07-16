"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Truck, ShieldCheck, RotateCcw } from "lucide-react"
import { useStore } from "@/context/store-context"
import { ProductCard } from "@/components/product-card"

export default function HomePage() {
  const { products, categories, loading } = useStore()
  const featured = products.filter((p) => p.featured)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-20 lg:px-8">
          <div>
            <span className="inline-block rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              Modern Shopping Redefined
            </span>
            <h1 className="mt-5 text-balance font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              The future of everyday technology
            </h1>
            <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
              Discover a curated collection of premium audio, wearables, computing, and
              photography gear — thoughtfully designed for the way you live.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Shop the collection <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/shop?category=Audio"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition hover:bg-secondary"
              >
                Explore audio
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Featured ELUX headphones"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { icon: Truck, title: "Free shipping", desc: "On all orders over $50" },
            { icon: RotateCcw, title: "30-day returns", desc: "Shop with confidence" },
            { icon: ShieldCheck, title: "2-year warranty", desc: "On every product" },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                <f.icon className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium">{f.title}</p>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Shop by category</h2>
            <p className="mt-1 text-sm text-muted-foreground">Find exactly what you&apos;re looking for.</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/shop?category=${encodeURIComponent(c)}`}
              className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition hover:border-foreground/30 hover:bg-secondary"
            >
              <span className="font-medium">{c}</span>
              <ArrowRight className="size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Featured products</h2>
            <p className="mt-1 text-sm text-muted-foreground">Handpicked favorites from our collection.</p>
          </div>
          <Link
            href="/shop"
            className="hidden items-center gap-1 text-sm font-medium text-accent hover:underline sm:flex"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        {loading ? (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-secondary" />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
