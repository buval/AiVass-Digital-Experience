import app from "./app";
import { logger } from "./lib/logger";
import { ensureSchema } from "./lib/ensure-schema";
import { installArticleReleaseProbe, checkArticlesAfterPublish } from "./lib/article-publish-check";

installArticleReleaseProbe(app);

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

ensureSchema()
  .then(() => {
    app.listen(port, (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }

      logger.info({ port }, "Server listening");
      // Do not block startup health checks or mistake build success for promotion.
      void checkArticlesAfterPublish().catch((err) => {
        logger.error({ err, check: "article-sharing-post-publish" }, "ARTICLE CHECK FAILED unexpectedly");
      });
    });
  })
  .catch((err) => {
    logger.error({ err }, "Failed to ensure database schema");
    process.exit(1);
  });
