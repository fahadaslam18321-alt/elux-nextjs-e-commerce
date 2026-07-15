"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Jab page load hoga, ye user se password mange ga
    const password = prompt("Enter Admin Password to access dashboard:");
    if (password === "Fahad1234") { 
      setIsAuthenticated(true);
    } else {
      alert("Access Denied! Incorrect Password.");
      window.location.href = "/";
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-600">Verifying Admin Access...</p>
      </div>
    );
  }

  // YAHAN AAPKA PEHLE SE MAUJOOD ADMIN PAGE KA BAKI CODE AYEGA (return statement wagera)
}
import Image from "next/image"
import { useMemo, useState } from "react"
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Trash2,
  Search,
  type LucideIcon,
} from "lucide-react"
import { products as seedProducts, type Product } from "@/lib/products"
import { formatPrice, cn } from "@/lib/utils"

const revenueByMonth = [
  { month: "Jan", value: 42000 },
  { month: "Feb", value: 38500 },
  { month: "Mar", value: 51200 },
  { month: "Apr", value: 47800 },
  { month: "May", value: 60400 },
  { month: "Jun", value: 72900 },
  { month: "Jul", value: 68100 },
  { month: "Aug", value: 81300 },
]

export default function AdminPage() {
  const [items, setItems] = useState<Product[]>(seedProducts)
  const [query, setQuery] = useState("")

  const totalRevenue = revenueByMonth.reduce((s, m) => s + m.value, 0)
  const maxRevenue = Math.max(...revenueByMonth.map((m) => m.value))

  const stats: { icon: LucideIcon; label: string; value: string; delta: string }[] = [
    { icon: DollarSign, label: "Revenue", value: formatPrice(totalRevenue), delta: "+12.4%" },
    { icon: ShoppingCart, label: "Orders", value: "1,284", delta: "+8.2%" },
    { icon: Users, label: "Customers", value: "3,942", delta: "+5.1%" },
    { icon: Package, label: "Products", value: String(items.length), delta: "Live" },
  ]

  const filtered = useMemo(
    () =>
      items.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()),
      ),
    [items, query],
  )

  function removeProduct(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Admin dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Store overview and product management.</p>
        </div>
        <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
          Demo data
        </span>
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
            {revenueByMonth.map((m) => (
              <div key={m.month} className="flex h-full flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-md bg-primary transition-all duration-500 hover:bg-accent"
                    style={{ height: `${Math.max((m.value / maxRevenue) * 100, 4)}%` }}
                    title={formatPrice(m.value)}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Top products</h2>
          <ul className="mt-4 space-y-4">
            {[...items]
              .sort((a, b) => b.reviews - a.reviews)
              .slice(0, 4)
              .map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <div className="size-11 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <Image
                      src={p.image || "/placeholder.svg"}
                      alt={p.name}
                      width={60}
                      height={60}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.reviews} sold</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(p.price)}</p>
                </li>
              ))}
          </ul>
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
                <th className="px-6 py-3 font-medium">Rating</th>
                <th className="px-6 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 shrink-0 overflow-hidden rounded-md bg-secondary">
                        <Image
                          src={p.image || "/placeholder.svg"}
                          alt={p.name}
                          width={48}
                          height={48}
                          className="size-full object-cover"
                        />
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-6 py-3">{formatPrice(p.price)}</td>
                  <td className="px-6 py-3">{p.rating}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => removeProduct(p.id)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground",
                        "transition hover:bg-destructive/10 hover:text-destructive",
                      )}
                    >
                      <Trash2 className="size-3.5" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No products match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
