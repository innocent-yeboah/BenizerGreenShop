import type { ReactNode } from "react";
import Link from "next/link";
import { Mail, MapPin, Navigation } from "lucide-react";
import { BrandSealMark } from "@/components/brand-seal";
import { SocialLinks } from "@/components/social-links";
import { siteConfig } from "@/lib/site-data";
import { cn } from "@/lib/utils";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

type ContactRowProps = {
  href: string;
  label: string;
  value: string;
  external?: boolean;
  icon: ReactNode;
  iconClassName?: string;
};

function FooterContactRow({ href, label, value, external, icon, iconClassName }: ContactRowProps) {
  const content = (
    <>
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-gold-light transition-colors group-hover:bg-brand-gold/25 group-hover:text-white",
          iconClassName,
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">{label}</span>
        <span className="mt-0.5 block text-sm font-medium leading-snug text-white/92 group-hover:text-brand-gold-light">
          {value}
        </span>
      </span>
    </>
  );

  const rowClass =
    "group flex gap-3 rounded-xl p-2 transition-colors hover:bg-white/6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-light";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={rowClass}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={rowClass}>
      {content}
    </Link>
  );
}

type FooterLink = { href: string; label: string; prefetch?: boolean };

const shopLinks: FooterLink[] = [
  { href: "/products", label: "All products" },
  { href: "/wishlist", label: "Wishlist", prefetch: false },
  { href: "/become-distributor", label: "Become a distributor" },
];

const supportLinks: FooterLink[] = [
  { href: "/contact", label: "Contact us" },
  { href: "/contact#visit", label: "Store & map" },
  { href: "/about", label: "About us" },
  { href: "/order-status", label: "Track order" },
  { href: "/account", label: "My account", prefetch: false },
];

function FooterNavColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold-light">{title}</h2>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              prefetch={item.prefetch}
              className="text-sm text-white/85 transition-colors hover:text-brand-gold-light"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Global footer — four-column layout with icon contact rows (international e-commerce pattern). */
export function SiteFooter() {
  const loc = siteConfig.location;
  const waDigits = siteConfig.whatsappAi.replace("+", "");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-green-dark text-white" role="contentinfo">
      <div className="container-shell border-b border-white/10 py-12 md:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-light">
              <BrandSealMark variant="nav" />
              <span>
                <span className="block font-heading text-base font-bold leading-tight text-white">{siteConfig.name}</span>
                <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-brand-gold-light/90">
                  {siteConfig.brandLockupSubtitle}
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">{siteConfig.description}</p>
            <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">Follow us</p>
              <SocialLinks variant="footer" layout="icons" className="mt-3" />
            </div>
          </div>

          {/* Shop + Support */}
          <div className="grid gap-8 sm:col-span-2 sm:grid-cols-2 lg:col-span-4">
            <FooterNavColumn title="Shop" links={shopLinks} />
            <FooterNavColumn title="Customer care" links={supportLinks} />
          </div>

          {/* Contact with icons */}
          <div className="sm:col-span-2 lg:col-span-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold-light">Get in touch</h2>
            <ul className="mt-4 flex flex-col gap-1">
              <li>
                <FooterContactRow
                  href={`https://wa.me/${waDigits}`}
                  label="WhatsApp"
                  value={siteConfig.whatsappDirect}
                  external
                  icon={<WhatsAppIcon className="size-5" />}
                  iconClassName="text-[#25D366] group-hover:text-[#25D366]"
                />
              </li>
              <li>
                <FooterContactRow
                  href={`mailto:${siteConfig.email}`}
                  label="Email"
                  value={siteConfig.email}
                  external
                  icon={<Mail className="size-5" strokeWidth={1.75} />}
                />
              </li>
              <li>
                <FooterContactRow
                  href={loc.mapsUrl}
                  label="Visit us"
                  value={`${loc.name}, ${loc.locality}`}
                  external
                  icon={<MapPin className="size-5" strokeWidth={1.75} />}
                />
              </li>
            </ul>
            <p className="mt-2 px-2 text-xs leading-relaxed text-white/55">
              {loc.streetAddress}, {loc.region}
            </p>
            <a
              href={loc.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-gold px-4 py-2.5 text-sm font-bold text-brand-green-dark transition-colors hover:bg-brand-gold-light"
            >
              <Navigation className="size-4 shrink-0" aria-hidden />
              Get directions
            </a>
          </div>
        </div>
      </div>

      {/* Legal bar */}
      <div className="container-shell py-6 md:py-7">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <p className="text-xs text-white/70">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
            <li>
              <Link
                href="/privacy"
                className="text-white/80 underline decoration-white/25 underline-offset-[3px] transition-colors hover:text-brand-gold-light hover:decoration-brand-gold-light/50"
              >
                Privacy policy
              </Link>
            </li>
            <li>
              <Link
                href="/cookies"
                className="text-white/80 underline decoration-white/25 underline-offset-[3px] transition-colors hover:text-brand-gold-light hover:decoration-brand-gold-light/50"
              >
                Cookies policy
              </Link>
            </li>
            <li className="text-white/55">
              <span className="sr-only">Site by </span>
              <a
                href="https://buildwithinnocent.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/75 transition-colors hover:text-brand-gold-light"
              >
                buildwithinnocent.com
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
