"use client"

import Image from "next/image"
import { useEffect, useMemo, useState, type FormEvent } from "react"
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Trash2,
  Search,
  Plus,
  X,
  type LucideIcon,
} from "lucide-react"
import { useStore } from "@/context/store-context"
import { supabase } from "@/lib/supabase"
import { categories, FALLBACK_IMAGE, type Category } from "@/lib/products"
import { formatPrice, cn } from "@/lib/utils"

type OrderRow = {
  id: string
  email: string
  total: number
  status: string
  created_at: string
}

type OrderItemRow = {
  product_id: string | null
  product_name: string
  quantity: number
  price: number
}

export default function AdminPage() {
  const { products, loading, addProduct, deleteProduct } = useStore()
  const [query, setQuery] = useState("")
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [orderItems, setOrderItems] = useState<OrderItemRow[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  // Fetch orders + order_items from Supabase and subscribe to realtime
  useEffect(() => {
    let mounted = true

    async function fetchOrders() {
      const [ordersRes, itemsRes] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("order_items").select("product_id, product_name, quantity, price"),
      ])
      if (!mounted) return
      if (ordersRes.data) setOrders(ordersRes.data as OrderRow[])
      if (itemsRes.data) setOrderItems(itemsRes.data as OrderItemRow[])
    }

    fetchOrders()

    const channel = supabase
      .channel("orders-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, fetchOrders)
      .on("postgres_changes", { event: "*", schema: "public", table: "order_items" }, fetchOrders)
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  // Dynamic KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = orders.length
  const uniqueCustomers = useMemo(
    () => new Set(orders.map((o) => o.email)).size,
    [orders],
  )
  const productCount = products.length

  const stats: { icon: LucideIcon; label: string; value: string; delta: string }[] = [
    { icon: DollarSign, label: "Revenue", value: formatPrice(totalRevenue), delta: `${totalOrders} orders` },
    { icon: ShoppingCart, label: "Orders", value: String(totalOrders), delta: "All time" },
    { icon: Users, label: "Customers", value: String(uniqueCustomers), delta: "Unique emails" },
    { icon: Package, label: "Products", value: String(productCount), delta: loading ? "Loading…" : "Live" },
  ]

  // Monthly revenue chart (aggregate from real orders by month)
  const monthlyRevenue = useMemo(() => {
    const map = new Map<string, number>()
    const now = new Date()
    const months: { label: string; value: number }[] = []
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      const label = d.toLocaleString("en-US", { month: "short" })
      months.push({ label, value: 0 })
      map.set(key, months.length - 1)
    }
    for (const o of orders) {
      const d = new Date(o.created_at)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      const idx = map.get(key)
      if (idx !== undefined) months[idx].value += o.total
    }
    return months
  }, [orders])

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value), 1)

  // Top products by quantity sold (from real order_items)
  const topProducts = useMemo(() => {
    const qtyMap = new Map<string, number>()
    for (const item of orderItems) {
      const key = item.product_id ?? item.product_name
      qtyMap.set(key, (qtyMap.get(key) ?? 0) + item.quantity)
    }
    const ranked = Array.from(qtyMap.entries())
      .map(([id, qty]) => {
        const product = products.find((p) => p.id === id)
        return {
          id,
          name: product?.name ?? orderItems.find((i) => (i.product_id ?? i.product_name) === id)?.product_name ?? "Unknown",
          image: product?.image ?? FALLBACK_IMAGE,
          price: product?.price ?? 0,
          sold: qty,
        }
      })
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5)
    return ranked
  }, [orderItems, products])

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()),
      ),
    [products, query],
  )

  async function handleDelete(id: string) {
    await deleteProduct(id)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Admin dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Store overview and product management.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="size-4" /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-full bg-secondary">
                <s.icon className="size-5" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-accent">
                <TrendingUp className="size-3.5" /> {s.delta}
              </span>
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Revenue</h2>
            <span className="text-sm text-muted-foreground">Last 8 months</span>
          </div>
          <div className="mt-8 flex h-56 items-end gap-2 sm:gap-4">
            {monthlyRevenue.map((m) => (
              <div key={m.label} className="flex h-full flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-md bg-primary transition-all duration-500 hover:bg-accent"
                    style={{ height: `${Math.max((m.value / maxRevenue) * 100, m.value > 0 ? 4 : 0)}%` }}
                    title={formatPrice(m.value)}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Top products</h2>
          {topProducts.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No sales data yet.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {topProducts.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sold} sold</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(p.price)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Product management */}
      <div className="mt-6 rounded-2xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-6">
          <h2 className="text-lg font-semibold">Product management</h2>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="rounded-full border border-input bg-background py-2 pl-9 pr-4 text-sm outline-none focus:border-ring"
              aria-label="Search products in admin"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Stock</th>
                <th className="px-6 py-3 font-medium">Rating</th>
                <th className="px-6 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Loading products…
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-secondary">
                          <Image src={p.image || FALLBACK_IMAGE} alt={p.name} fill className="object-cover" />
                        </div>
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">{p.category}</td>
                    <td className="px-6 py-3">{formatPrice(p.price)}</td>
                    <td className="px-6 py-3">{p.stock}</td>
                    <td className="px-6 py-3">{p.rating}</td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground",
                          "transition hover:bg-destructive/10 hover:text-destructive",
                        )}
                      >
                        <Trash2 className="size-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No products match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} onAdd={addProduct} />}
    </div>
  )
}

function AddProductModal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (input: {
    name: string
    price: number
    category: Category
    description: string
    tagline: string
    image: string
    stock: number
    featured: boolean
    badge: string
  }) => Promise<{ error: string | null }>
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const name = String(formData.get("name") ?? "")
    const price = Number(formData.get("price") ?? 0)
    const category = String(formData.get("category") ?? "Audio") as Category
    const description = String(formData.get("description") ?? "")
    const tagline = String(formData.get("tagline") ?? "")
    const image = String(formData.get("image") ?? "")
    const stock = Number(formData.get("stock") ?? 0)
    const featured = formData.get("featured") === "on"
    const badge = String(formData.get("badge") ?? "")

    if (!name || price <= 0) {
      setError("Name and a valid price are required.")
      setSubmitting(false)
      return
    }

    const { error: addError } = await onAdd({
      name,
      price,
      category,
      description,
      tagline,
      image: image || FALLBACK_IMAGE,
      stock,
      featured,
      badge,
    })

    if (addError) {
      setError(addError)
      setSubmitting(false)
      return
    }

    setSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add new product</h2>
          <button onClick={onClose} className="rounded-full p-1.5 transition hover:bg-secondary" aria-label="Close">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <FormField label="Product name" name="name" placeholder="Aura Wireless Headphones" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Price (USD)" name="price" type="number" placeholder="349" required />
            <label className="block">
              <span className="text-sm font-medium">Category</span>
              <select
                name="category"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
                defaultValue="Audio"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <FormField label="Tagline" name="tagline" placeholder="Immersive adaptive sound" />
          <FormField label="Image URL" name="image" placeholder="https://images.pexels.com/..." />
          <label className="block">
            <span className="text-sm font-medium">Description</span>
            <textarea
              name="description"
              rows={3}
              placeholder="Studio-grade drivers with adaptive noise cancellation…"
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Stock quantity" name="stock" type="number" placeholder="50" />
            <FormField label="Badge (optional)" name="badge" placeholder="Best Seller" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" className="size-4 rounded border-border" />
            <span className="font-medium">Featured product</span>
          </label>

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Saving…" : "Save product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        required={required}
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-ring"
      />
    </label>
  )
}
