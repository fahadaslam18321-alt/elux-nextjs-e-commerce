"use client"

import { useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { products, categories, type Category } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { cn } from "@/lib/utils"

type SortKey = "featured" | "price-asc" | "price-desc" | "rating"

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "rating", label: "Top Rated" },
]

export function ShopView() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const queryParam = searchParams.get("q") ?? ""
  const categoryParam = (searchParams.get("category") as Category | null) ?? null

  const [sort, setSort] = useState<SortKey>("featured")

  const setCategory = (category: Category | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category) params.set("category", category)
    else params.delete("category")
    router.push(`/shop${params.toString() ? `?${params.toString()}` : ""}`)
  }

  const filtered = useMemo(() => {
    let list = [...products]
    if (categoryParam) list = list.filter((p) => p.category === categoryParam)
    if (queryParam) {
      const q = queryParam.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        list.sort((a, b) => b.price - a.price)
        break
      case "rating":
        list.sort((a, b) => b.rating - a.rating)
        break
      default:
        list.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    }
    return list
  }, [categoryParam, queryParam, sort])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 border-b border-border pb-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {categoryParam ?? "All Products"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {queryParam ? (
            <>
              Results for <span className="font-medium text-foreground">&ldquo;{queryParam}&rdquo;</span> —{" "}
            </>
          ) : null}
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-10">
        {/* Filters */}
        <aside className="lg:w-56 lg:shrink-0">
          <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            <button
              onClick={() => setCategory(null)}
              className={cn(
                "rounded-full px-3 py-1.5 text-left text-sm transition lg:rounded-md",
                !categoryParam
                  ? "bg-primary text-primary-foreground lg:bg-secondary lg:text-foreground lg:font-medium"
                  : "border border-border lg:border-0 lg:hover:bg-secondary",
              )}
            >
              All Products
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-left text-sm transition lg:rounded-md",
                  categoryParam === c
                    ? "bg-primary text-primary-foreground lg:bg-secondary lg:text-foreground lg:font-medium"
                    : "border border-border lg:border-0 lg:hover:bg-secondary",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-end">
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-md border border-input bg-card px-3 py-1.5 text-sm outline-none focus:border-ring"
              >
                {sortOptions.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
              <Search className="size-8 text-muted-foreground" />
              <p className="mt-4 font-medium">No products found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
