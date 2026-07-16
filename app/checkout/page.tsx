"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, type FormEvent } from "react"
import { CheckCircle2, Lock, ArrowRight } from "lucide-react"
import { useStore } from "@/context/store-context"
import { formatPrice } from "@/lib/utils"

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount, placeOrder } = useStore()
  const [placed, setPlaced] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const shipping = cartTotal > 50 ? 0 : 8
  const tax = Math.round(cartTotal * 0.08)
  const total = cartTotal + shipping + tax

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const email = String(formData.get("email") ?? "")

    const { error: orderError, orderId: newOrderId } = await placeOrder(email)
    if (orderError) {
      setError(orderError)
      setSubmitting(false)
      return
    }
    setOrderId(newOrderId ?? "ELX-UNKNOWN")
    setPlaced(true)
    setSubmitting(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (placed) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <CheckCircle2 className="size-16 text-accent" />
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">Order confirmed</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for your purchase. Your order{" "}
          <span className="font-medium text-foreground">{orderId.slice(0, 8)}</span> is being processed and a
          confirmation has been sent to your email.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Continue shopping <ArrowRight className="size-4" />
        </Link>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Nothing to check out</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your cart is empty.</p>
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
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <fieldset>
            <legend className="text-lg font-semibold">Contact</legend>
            <div className="mt-4 grid gap-4">
              <Field label="Email address" name="email" type="email" placeholder="you@example.com" />
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-lg font-semibold">Shipping address</legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="First name" name="firstName" placeholder="Jane" />
              <Field label="Last name" name="lastName" placeholder="Doe" />
              <div className="sm:col-span-2">
                <Field label="Address" name="address" placeholder="123 Market Street" />
              </div>
              <Field label="City" name="city" placeholder="San Francisco" />
              <Field label="Postal code" name="zip" placeholder="94103" />
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-lg font-semibold">Payment</legend>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3.5" /> This is a demo. Do not enter real card details.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Card number" name="card" placeholder="4242 4242 4242 4242" />
              </div>
              <Field label="Expiry" name="expiry" placeholder="MM / YY" />
              <Field label="CVC" name="cvc" placeholder="123" />
            </div>
          </fieldset>

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <ul className="mt-4 space-y-4">
              {cart.map(({ product, quantity }) => (
                <li key={product.id} className="flex items-center gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                      {quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(product.price * quantity)}</p>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal ({cartCount})</dt>
                <dd>{formatPrice(cartTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tax</dt>
                <dd>{formatPrice(tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Placing order…" : `Place order — ${formatPrice(total)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        required
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-ring"
      />
    </label>
  )
}
