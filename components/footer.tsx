import Link from "next/link"
import { categories } from "@/lib/products"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="text-2xl font-bold tracking-tight">ELUX</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Modern shopping redefined. Thoughtfully designed technology for the way you live.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">Shop</p>
            <ul className="mt-3 space-y-2">
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    href={`/shop?category=${encodeURIComponent(c)}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>About</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Sustainability</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Support</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Contact</li>
              <li>Shipping &amp; Returns</li>
              <li>Warranty</li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ELUX. Modern Shopping Redefined.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Next.js on Vercel.
          </p>
        </div>
      </div>
    </footer>
  )
}
