/*
# Lock down write policies on products, orders, order_items

## Purpose
The previous migration allowed anon + authenticated to INSERT/UPDATE/DELETE
on all three tables with `WITH CHECK (true)` / `USING (true)`, which meant
anyone with the anon key could modify or delete any row. This migration
removes those open write policies and restricts anon/authenticated to
SELECT only. All writes (create product, delete product, place order) now
go through the `store-api` edge function, which runs with the service role
key and bypasses RLS.

## Changes
- products: drop anon insert/update/delete policies. Keep anon select.
- orders: drop anon insert/update/delete policies. Keep anon select.
- order_items: drop anon insert/update/delete policies. Keep anon select.

## Security
- anon + authenticated can READ all rows (single-tenant public storefront).
- Only the service role (edge function) can INSERT / UPDATE / DELETE.
*/

-- products: remove open write policies
DROP POLICY IF EXISTS "anon_insert_products" ON products;
DROP POLICY IF EXISTS "anon_update_products" ON products;
DROP POLICY IF EXISTS "anon_delete_products" ON products;

-- orders: remove open write policies
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
DROP POLICY IF EXISTS "anon_update_orders" ON orders;
DROP POLICY IF EXISTS "anon_delete_orders" ON orders;

-- order_items: remove open write policies
DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
DROP POLICY IF EXISTS "anon_update_order_items" ON order_items;
DROP POLICY IF EXISTS "anon_delete_order_items" ON order_items;
