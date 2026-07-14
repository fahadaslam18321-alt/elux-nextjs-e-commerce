import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { products, getProduct } from "@/lib/products"
import { ProductDetail } from "@/components/product-detail"

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = getProduct(id)
  if (!product) return { title: "Product not found — ELUX" }
  return {
    title: `${product.name} — ELUX`,
    description: product.description,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = getProduct(id)
  if (!product) notFound()

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return <ProductDetail product={product} related={related} />
}
