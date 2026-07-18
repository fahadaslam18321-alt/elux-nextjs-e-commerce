import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type ProductInput = {
  name: string;
  tagline?: string;
  description?: string;
  category: string;
  price: number;
  image?: string;
  stock?: number;
  featured?: boolean;
  badge?: string | null;
};

type OrderInput = {
  email: string;
  total: number;
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }[];
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/store-api/, "");
    const method = req.method;

    // POST /products — create a product
    if (path === "/products" && method === "POST") {
      const body = (await req.json()) as ProductInput;
      if (!body.name || !body.price || !body.category) {
        return jsonResponse({ error: "name, price, and category are required" }, 400);
      }
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: body.name,
          tagline: body.tagline ?? body.name,
          description: body.description ?? "",
          category: body.category,
          price: body.price,
          image: body.image ?? "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800",
          stock: body.stock ?? 0,
          featured: body.featured ?? false,
          badge: body.badge ?? null,
          rating: 4.5,
          reviews: 0,
        })
        .select()
        .single();
      if (error) return jsonResponse({ error: error.message }, 500);
      return jsonResponse({ product: data }, 201);
    }

    // DELETE /products/:id — delete a product
    const productMatch = path.match(/^\/products\/([^/]+)$/);
    if (productMatch && method === "DELETE") {
      const id = productMatch[1];
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) return jsonResponse({ error: error.message }, 500);
      return jsonResponse({ success: true }, 200);
    }

    // POST /orders — place an order with items
    if (path === "/orders" && method === "POST") {
      const body = (await req.json()) as OrderInput;
      if (!body.email || !body.total || !body.items?.length) {
        return jsonResponse({ error: "email, total, and items are required" }, 400);
      }
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({ email: body.email, total: body.total, status: "completed" })
        .select("id")
        .single();
      if (orderError) return jsonResponse({ error: orderError.message }, 500);

      const orderItems = body.items.map((i) => ({
        order_id: orderData.id,
        product_id: i.product_id,
        product_name: i.product_name,
        quantity: i.quantity,
        price: i.price,
      }));
      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) return jsonResponse({ error: itemsError.message }, 500);

      return jsonResponse({ orderId: orderData.id }, 201);
    }

    return jsonResponse({ error: "Not found" }, 404);
  } catch (err) {
    return jsonResponse({ error: (err as Error).message }, 500);
  }
});
