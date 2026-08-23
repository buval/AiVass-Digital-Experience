import Stripe from "stripe";

interface StripeConnection {
  environment?: string;
  settings?: {
    secret?: string;
  };
}

interface StripeConnectionResponse {
  items?: StripeConnection[];
}

/**
 * Returns a fresh Stripe client for the live account attached to this Repl.
 *
 * Replit's injected STRIPE_SECRET_KEY is a managed-key handle, not a raw Stripe
 * API key. The usable key is resolved server-side from the connection API and
 * never sent to the browser or stored in the repository.
 */
export async function getUncachableStripeClient(): Promise<Stripe> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const identity = process.env.REPL_IDENTITY
    ? `repl ${process.env.REPL_IDENTITY}`
    : process.env.WEB_REPL_RENEWAL
      ? `depl ${process.env.WEB_REPL_RENEWAL}`
      : null;

  if (!hostname || !identity) {
    throw new Error("The Replit Stripe connection is unavailable");
  }

  const baseUrl = hostname.startsWith("http")
    ? hostname
    : `https://${hostname}`;
  const response = await fetch(
    `${baseUrl}/api/v2/connection?include_secrets=true&connector_names=stripe`,
    {
      headers: {
        Accept: "application/json",
        X_REPLIT_TOKEN: identity,
      },
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!response.ok) {
    throw new Error(`Could not resolve Stripe connection (${response.status})`);
  }

  const payload = (await response.json()) as StripeConnectionResponse;
  const liveConnection = payload.items?.find(
    (connection) => connection.environment === "production",
  );
  const secretKey = liveConnection?.settings?.secret;

  if (!secretKey) {
    throw new Error("The connected live Stripe account is missing its API key");
  }

  return new Stripe(secretKey, { apiVersion: "2026-07-29.dahlia" });
}