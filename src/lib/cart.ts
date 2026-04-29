export type CartItem = {
  slug: string;
  quantity: number;
};

export const CART_KEY = "bgs_cart_v1";

/** Same-tab listeners (localStorage does not fire `storage` in the active tab). */
export const CART_UPDATED_EVENT = "bgs-cart-updated";

export function dispatchCartUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Total units across all lines (standard cart badge count). */
export function getCartTotalQuantity(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + Math.max(0, i.quantity), 0);
}
