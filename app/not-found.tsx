import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-32 text-center sm:px-6">
      <p className="font-serif text-7xl">404</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        Back to home <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}
