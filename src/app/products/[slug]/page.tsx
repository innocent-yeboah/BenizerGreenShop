import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { products, siteConfig } from "@/lib/site-data";
import { clampMetaDescription } from "@/lib/seo";
import { currencyFormatter } from "@/lib/utils";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { WishlistToggleButton } from "@/components/wishlist-toggle-button";
import { ProductJsonLd } from "@/components/product-json-ld";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) return {};

  const description = clampMetaDescription(
    [product.shortBenefit, product.tagline].filter(Boolean).join(" · "),
  );

  return {
    title: product.shortTitle,
    description,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.title,
      description,
      type: "website",
      locale: "en_GH",
      siteName: siteConfig.name,
      url: `/products/${product.slug}`,
      countryName: "Ghana",
      images: [
        {
          url: product.images[0],
          alt: product.shortTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();

  return (
    <main className="container-shell py-14">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: product.shortTitle, path: `/products/${product.slug}` },
        ]}
      />
      <ProductJsonLd product={product} />
      <section className="grid gap-8 rounded-3xl border border-brand-green/10 bg-white p-8 shadow-sm lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-brand-green/10 bg-brand-cream">
            <Image
              src={product.images[0]}
              alt={product.shortTitle}
              fill
              className="object-contain p-6"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="rounded-2xl border border-brand-green/10 bg-brand-cream p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">{product.category}</p>
            <h1 className="mt-2 text-4xl font-bold text-brand-green-dark">{product.title}</h1>
            <p className="mt-3 italic text-brand-charcoal/80">{product.tagline}</p>
            <p className="mt-6 text-2xl font-bold text-brand-green">{currencyFormatter.format(product.price)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <WishlistToggleButton slug={product.slug} />
              <AddToCartButton slug={product.slug} />
              <Link href="/cart" className="btn-primary px-6 py-3">Go to Checkout</Link>
              <Link href={`/become-distributor?product=${product.slug}`} className="btn-secondary px-6 py-3">Request More Info</Link>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-brand-green/10 bg-white p-6">
          <h2 className="text-2xl font-bold text-brand-green-dark">Key Benefits</h2>
          <ul className="mt-4 space-y-3">
            {product.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 size-5 text-brand-green" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <h3 className="mt-8 text-xl font-bold text-brand-green-dark">Ingredients</h3>
          <p className="mt-2">{product.ingredients.join(", ")}</p>
          <h3 className="mt-6 text-xl font-bold text-brand-green-dark">How to Use</h3>
          <p className="mt-2">{product.usage}</p>
        </div>
      </section>
    </main>
  );
}
