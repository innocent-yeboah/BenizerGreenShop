/** Saved product slugs in localStorage (same-tab listeners like cart). */
export const WISHLIST_KEY = "bgs_wishlist_v1";

export const WISHLIST_UPDATED_EVENT = "bgs-wishlist-updated";

export function dispatchWishlistUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(WISHLIST_UPDATED_EVENT));
}

export function readWishlistFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(WISHLIST_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === "string" && s.length > 1);
  } catch {
    return [];
  }
}

export function writeWishlist(slugs: string[]): void {
  if (typeof window === "undefined") return;
  const unique = [...new Set(slugs)];
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(unique));
  dispatchWishlistUpdated();
}

export function isInWishlist(slug: string, list: string[]): boolean {
  return list.includes(slug);
}
