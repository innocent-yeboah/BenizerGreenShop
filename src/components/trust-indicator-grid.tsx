import { Leaf, Phone, Star, Users } from "lucide-react";
import { trustIndicators } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const TRUST_STYLES = [
  {
    Icon: Leaf,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-600/12",
    titleColor: "text-emerald-900",
  },
  {
    Icon: Star,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-500/15",
    titleColor: "text-amber-950",
  },
  {
    Icon: Users,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-600/12",
    titleColor: "text-sky-950",
  },
  {
    Icon: Phone,
    iconColor: "text-red-600",
    iconBg:
      "bg-gradient-to-br from-red-600/12 via-amber-400/14 to-emerald-600/14",
    titleColor: "text-emerald-900",
  },
] as const;

type Props = {
  className?: string;
};

export function TrustIndicatorGrid({ className }: Props) {
  return (
    <div
      className={cn(
        "container-shell grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {trustIndicators.map((label, index) => {
        const { Icon, iconColor, iconBg, titleColor } = TRUST_STYLES[index];
        return (
          <div
            key={label}
            className="surface-card flex flex-col items-center justify-center gap-3 rounded-xl px-4 py-5 text-center sm:gap-3.5 sm:py-6"
          >
            <div
              className={cn(
                "flex size-14 shrink-0 items-center justify-center rounded-full",
                iconBg,
                iconColor,
              )}
            >
              <Icon className="h-9 w-9" strokeWidth={1.5} aria-hidden />
            </div>
            <p
              className={cn(
                "text-sm font-semibold leading-snug md:text-[0.9375rem]",
                titleColor,
              )}
            >
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
