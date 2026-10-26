/**
 * Test-only exports for API contract tests. These functions are never mounted
 * independently; production continues to use the default route instances.
 */
export { GUIDE_CATALOG, getGuideSlugsForPurchase } from "./lib/guide-catalog.js";
export { createCheckoutRouter } from "./routes/checkout.js";
export { createOrderRouter } from "./routes/order.js";
export { default as legacyArticlesRouter } from "./routes/legacy-articles.js";
export {
  checkArticlesAfterPublish, installArticleReleaseProbe, articleReleasePath,
  articleStaticReleasePath, articleReleaseId,
} from "./lib/article-publish-check.js";
export {
  createWebhookRouter,
  fulfillCheckoutSession,
  type WebhookFulfillmentDependencies,
  type WebhookVerificationAlertDependencies,
  WebhookVerificationAlertMonitor,
} from "./routes/webhook.js";