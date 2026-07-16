"use client"

import { use, useEffect } from "react"
import { notFound } from "next/navigation"
import { useStore } from "@/context/store-context"
import { ProductDetail } from "@/components/product-detail"

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { products, loading, getProduct } = useStore()

  const product = getProduct(id)

  useEffect(() => {
    if (!loading && !product) notFound()
  }, [loading, product])

  if (loading || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-secondary" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-secondary" />
            <div className="h-6 w-1/2 animate-pulse rounded bg-secondary" />
            <div className="h-32 w-full animate-pulse rounded bg-secondary" />
          </div>
        </div>
      </div>
    )
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return <ProductDetail product={product} related={related} />
}
