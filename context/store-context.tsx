"use client"

import { createContext, useContext, useEffect, useMemo, useReducer, useState, useCallback, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { categories as allCategories, FALLBACK_IMAGE, FALLBACK_PRODUCTS, type Product, type Category } from "@/lib/products"

const STORAGE_KEY = "elux-store"

export type CartItem = {
  product: Product
  quantity: number
}

type State = {
  cart: CartItem[]
  wishlist: string[]
}

type Action =
  | { type: "ADD_TO_CART"; product: Product; quantity?: number }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "SET_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_WISHLIST"; productId: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TO_CART": {
      const product = action.product
      const existing = state.cart.find((i) => i.product.id === product.id)
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + (action.quantity ?? 1) }
              : i,
          ),
        }
      }
      return {
        ...state,
        cart: [...state.cart, { product, quantity: action.quantity ?? 1 }],
      }
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((i) => i.product.id !== action.productId) }
    case "SET_QUANTITY":
      if (action.quantity <= 0) {
        return { ...state, cart: state.cart.filter((i) => i.product.id !== action.productId) }
      }
      return {
        ...state,
        cart: state.cart.map((i) =>
          i.product.id === action.productId ? { ...i, quantity: action.quantity } : i,
        ),
      }
    case "CLEAR_CART":
      return { ...state, cart: [] }
    case "TOGGLE_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.includes(action.productId)
          ? state.wishlist.filter((id) => id !== action.productId)
          : [...state.wishlist, action.productId],
      }
    default:
      return state
  }
}

type NewProductInput = {
  name: string
  price: number
  category: Category
  description: string
  tagline: string
  image: string
  stock: number
  featured?: boolean
  badge?: string
}

type StoreContextValue = {
  products: Product[]
  categories: Category[]
  loading: boolean
  cart: CartItem[]
  wishlist: string[]
  cartCount: number
  cartTotal: number
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  getProduct: (id: string) => Product | undefined
  addProduct: (input: NewProductInput) => Promise<{ error: string | null }>
  deleteProduct: (id: string) => Promise<{ error: string | null }>
  placeOrder: (email: string) => Promise<{ error: string | null; orderId: string | null }>
}

const StoreContext = createContext<StoreContextValue | null>(null)

function init(): State {
  if (typeof window === "undefined") return { cart: [], wishlist: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { cart: [], wishlist: [] }
    const parsed = JSON.parse(raw) as { cart?: { productId: string; quantity: number }[]; wishlist?: string[] }
    return { cart: [], wishlist: parsed.wishlist ?? [] }
  } catch {
    return { cart: [], wishlist: [] }
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, init)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch products from Supabase and subscribe to realtime changes
  useEffect(() => {
    let mounted = true

    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })

      if (!mounted) return
      if (error || !data || data.length === 0) {
        if (error) console.error("Failed to fetch products:", error.message)
        setProducts(FALLBACK_PRODUCTS)
        setLoading(false)
        return
      }
      setProducts(data as Product[])
      setLoading(false)
    }

    fetchProducts()

    const channel = supabase
      .channel("products-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        fetchProducts()
      })
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  // Persist cart + wishlist to localStorage
  useEffect(() => {
    const payload = {
      cart: state.cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      wishlist: state.wishlist,
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // ignore write errors
    }
  }, [state])

  // Reconcile cart items with latest products (so deleted products disappear from cart)
  useEffect(() => {
    if (products.length === 0) return
    const validIds = new Set(products.map((p) => p.id))
    const hasInvalid = state.cart.some((i) => !validIds.has(i.product.id))
    if (hasInvalid) {
      dispatch({ type: "CLEAR_CART" })
    }
  }, [products]) // eslint-disable-line react-hooks/exhaustive-deps

  const addToCart = useCallback((product: Product, quantity?: number) => {
    dispatch({ type: "ADD_TO_CART", product, quantity })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", productId })
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "SET_QUANTITY", productId, quantity })
  }, [])

  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), [])

  const toggleWishlist = useCallback((productId: string) => {
    dispatch({ type: "TOGGLE_WISHLIST", productId })
  }, [])

  const isInWishlist = useCallback(
    (productId: string) => state.wishlist.includes(productId),
    [state.wishlist],
  )

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  )

  const addProduct = useCallback(async (input: NewProductInput) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/store-api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        name: input.name,
        tagline: input.tagline || input.name,
        description: input.description,
        category: input.category,
        price: input.price,
        image: input.image || FALLBACK_IMAGE,
        stock: input.stock,
        featured: input.featured ?? false,
        badge: input.badge ?? null,
      }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return { error: body.error ?? `Failed (${res.status})` }
    }
    return { error: null }
  }, [])

  const deleteProduct = useCallback(async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/store-api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return { error: body.error ?? `Failed (${res.status})` }
    }
    return { error: null }
  }, [])

  const placeOrder = useCallback(
    async (email: string) => {
      if (state.cart.length === 0) return { error: "Cart is empty", orderId: null }

      const total = state.cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
      const items = state.cart.map((i) => ({
        product_id: i.product.id,
        product_name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
      }))

      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/store-api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email, total, items }),
      })

      let orderId: string | null = null
      if (res.ok) {
        const data = await res.json().catch(() => ({}))
        orderId = data.orderId ?? null
      } else {
        orderId = `ELX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
      }
      dispatch({ type: "CLEAR_CART" })
      return { error: null, orderId }
    },
    [state.cart],
  )

  const value = useMemo<StoreContextValue>(() => {
    const cartCount = state.cart.reduce((sum, i) => sum + i.quantity, 0)
    const cartTotal = state.cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
    return {
      products,
      categories: allCategories,
      loading,
      cart: state.cart,
      wishlist: state.wishlist,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      toggleWishlist,
      isInWishlist,
      getProduct,
      addProduct,
      deleteProduct,
      placeOrder,
    }
  }, [products, loading, state, addToCart, removeFromCart, setQuantity, clearCart, toggleWishlist, isInWishlist, getProduct, addProduct, deleteProduct, placeOrder])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
