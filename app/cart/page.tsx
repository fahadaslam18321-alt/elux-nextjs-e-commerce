"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { useStore } from "@/context/store-context"
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
  const { cart, setQuantity, removeFromCart, cartTotal, cartCount } = useStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const shipping = cartTotal > 50 || cartTotal === 0 ? 0 : 8
  const tax = Math.round(cartTotal * 0.08)
  const total = cartTotal + shipping + tax

  if (!mounted) {
    return <div className="mx-auto min-h-[50vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-hidden />
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="size-7 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Your cart is empty</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Looks like you haven&apos;t added anything yet. Explore our collection to find something you love.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Start shopping <ArrowRight className="size-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Shopping cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">{cartCount} items</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="divide-y divide-border border-y border-border">
            {cart.map(({ product, quantity }) => (
              <li key={product.id} className="flex gap-4 py-5">
                <Link
                  href={`/product/${product.id}`}
                  className="size-24 shrink-0 overflow-hidden rounded-lg bg-secondary"
                >
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={120}
                    height={120}
                    className="size-full object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link href={`/product/${product.id}`} className="font-medium hover:text-accent">
                        {product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(product.price * quantity)}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-border">
                      <button
                        onClick={() => setQuantity(product.id, quantity - 1)}
                        className="p-2 transition hover:text-accent"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(product.id, quantity + 1)}
                        className="p-2 transition hover:text-accent"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-destructive"
                    >
                      <Trash2 className="size-4" /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(cartTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Estimated tax</dt>
                <dd>{formatPrice(tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>
            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Checkout <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/shop"
              className="mt-3 flex w-full items-center justify-center text-sm text-muted-foreground transition hover:text-foreground"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
