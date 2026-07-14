"use client"

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react"
import { products, type Product } from "@/lib/products"

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
  | { type: "ADD_TO_CART"; productId: string; quantity?: number }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "SET_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_WISHLIST"; productId: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TO_CART": {
      const product = products.find((p) => p.id === action.productId)
      if (!product) return state
      const existing = state.cart.find((i) => i.product.id === action.productId)
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.product.id === action.productId
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

type StoreContextValue = {
  cart: CartItem[]
  wishlist: string[]
  cartCount: number
  cartTotal: number
  addToCart: (productId: string, quantity?: number) => void
  removeFromCart: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

const StoreContext = createContext<StoreContextValue | null>(null)

function init(): State {
  if (typeof window === "undefined") return { cart: [], wishlist: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { cart: [], wishlist: [] }
    const parsed = JSON.parse(raw) as { cart?: { productId: string; quantity: number }[]; wishlist?: string[] }
    const cart: CartItem[] = (parsed.cart ?? [])
      .map((entry) => {
        const product = products.find((p) => p.id === entry.productId)
        return product ? { product, quantity: entry.quantity } : null
      })
      .filter((i): i is CartItem => i !== null)
    return { cart, wishlist: parsed.wishlist ?? [] }
  } catch {
    return { cart: [], wishlist: [] }
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, init)

  useEffect(() => {
    const payload = {
      cart: state.cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      wishlist: state.wishlist,
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // ignore write errors (e.g. storage disabled)
    }
  }, [state])

  const value = useMemo<StoreContextValue>(() => {
    const cartCount = state.cart.reduce((sum, i) => sum + i.quantity, 0)
    const cartTotal = state.cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
    return {
      cart: state.cart,
      wishlist: state.wishlist,
      cartCount,
      cartTotal,
      addToCart: (productId, quantity) => dispatch({ type: "ADD_TO_CART", productId, quantity }),
      removeFromCart: (productId) => dispatch({ type: "REMOVE_FROM_CART", productId }),
      setQuantity: (productId, quantity) => dispatch({ type: "SET_QUANTITY", productId, quantity }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
      toggleWishlist: (productId) => dispatch({ type: "TOGGLE_WISHLIST", productId }),
      isInWishlist: (productId) => state.wishlist.includes(productId),
    }
  }, [state])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
