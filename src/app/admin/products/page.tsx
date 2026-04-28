import { upsertProductAction } from "@/app/admin/actions";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminProductsPage() {
  const supabase = createAdminClient();
  const { data: products } = supabase
    ? await supabase
        .from("products")
        .select("id,slug,title,price,stock,featured,category,tagline")
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <main className="container-shell py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
        Catalog Control
      </p>
      <h1 className="text-3xl font-bold text-brand-green-dark">Admin Products</h1>
      <p className="mt-2 text-sm text-brand-charcoal/70">
        Create and update live catalog products.
      </p>

      <form action={upsertProductAction} className="mt-6 grid gap-3 surface-card rounded-xl p-5 md:grid-cols-2">
        <input name="slug" className="rounded border border-brand-green/20 p-2" placeholder="Slug" required />
        <input name="title" className="rounded border border-brand-green/20 p-2" placeholder="Title" required />
        <input name="tagline" className="rounded border border-brand-green/20 p-2" placeholder="Tagline" required />
        <input name="category" className="rounded border border-brand-green/20 p-2" placeholder="Category" required />
        <input name="price" type="number" className="rounded border border-brand-green/20 p-2" placeholder="Price" required />
        <input name="stock" type="number" className="rounded border border-brand-green/20 p-2" placeholder="Stock" required />
        <select name="featured" className="rounded border border-brand-green/20 p-2">
          <option value="false">Not Featured</option>
          <option value="true">Featured</option>
        </select>
        <button className="btn-primary rounded px-4 py-2">Create Product</button>
      </form>

      <ul className="mt-6 space-y-3">
        {(products || []).map((product) => (
          <li key={product.id} className="surface-card rounded-xl p-4">
            <p className="font-semibold">{product.title}</p>
            <p className="text-xs text-brand-charcoal/70">{product.slug} | {product.category}</p>
            <form action={upsertProductAction} className="mt-3 grid gap-2 md:grid-cols-4">
              <input name="id" type="hidden" value={product.id} />
              <input name="slug" defaultValue={product.slug} className="rounded border border-brand-green/20 p-2" />
              <input name="title" defaultValue={product.title} className="rounded border border-brand-green/20 p-2" />
              <input name="tagline" defaultValue={product.tagline} className="rounded border border-brand-green/20 p-2" />
              <input name="category" defaultValue={product.category} className="rounded border border-brand-green/20 p-2" />
              <input name="price" type="number" defaultValue={Number(product.price)} className="rounded border border-brand-green/20 p-2" />
              <input name="stock" type="number" defaultValue={product.stock} className="rounded border border-brand-green/20 p-2" />
              <select name="featured" defaultValue={String(product.featured)} className="rounded border border-brand-green/20 p-2">
                <option value="false">Not Featured</option>
                <option value="true">Featured</option>
              </select>
              <button className="btn-ghost rounded px-4 py-2">Save</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
