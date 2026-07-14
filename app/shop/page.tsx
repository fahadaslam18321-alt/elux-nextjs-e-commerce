import { Suspense } from "react"
import { ShopView } from "@/components/shop-view"

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-20 text-sm text-muted-foreground">Loading products…</div>}>
      <ShopView />
    </Suspense>
  )
}
