import { useRef, useState } from "react";
import {
  useCreateCheckoutSession,
  type CheckoutSelectionGuideSlug,
} from "@workspace/api-client-react";

const CHECKOUT_ERROR =
  "Secure checkout could not be opened. Please try again in a moment.";

function getCheckoutErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object" || !("data" in error)) {
    return CHECKOUT_ERROR;
  }

  const data = (error as { data?: unknown }).data;
  if (
    data &&
    typeof data === "object" &&
    "error" in data &&
    typeof (data as { error?: unknown }).error === "string"
  ) {
    return (data as { error: string }).error;
  }

  return CHECKOUT_ERROR;
}

/**
 * Requests a brand-new Stripe Checkout Session and redirects in the same tab.
 * Same-tab navigation is intentional: async window.open calls are commonly
 * blocked by iOS and in-app browsers.
 */
export function useGuideCheckout() {
  const mutation = useCreateCheckoutSession();
  const inFlight = useRef(false);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorSlug, setErrorSlug] = useState<string | null>(null);

  async function openCheckout(slug: string) {
    if (inFlight.current) return;

    inFlight.current = true;
    setPendingSlug(slug);
    setError(null);
    setErrorSlug(null);

    try {
      const { url } = await mutation.mutateAsync({
        data: { guideSlug: slug as CheckoutSelectionGuideSlug },
      });
      window.location.assign(url);
    } catch (checkoutError) {
      setError(getCheckoutErrorMessage(checkoutError));
      setErrorSlug(slug);
      setPendingSlug(null);
      inFlight.current = false;
    }
  }

  return { openCheckout, pendingSlug, error, errorSlug };
}