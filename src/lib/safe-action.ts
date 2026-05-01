import { createSafeActionClient } from "next-safe-action";

/**
 * Forward safe Action errors to the client so checkout/payments show real messages
 * (next-safe-action defaults to a generic string otherwise).
 */
export const actionClient = createSafeActionClient({
  handleServerError(e: unknown) {
    if (e instanceof Error) {
      console.error("[safe-action]", e.message);
      return e.message;
    }
    console.error("[safe-action]", e);
    return "Something went wrong while executing the operation.";
  },
});
