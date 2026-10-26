import { fileURLToPath } from "node:url";
import { writeArticlePublishMarker } from "../../../scripts/article-publish-release.mjs";

const release = writeArticlePublishMarker(fileURLToPath(new URL("../dist/public/", import.meta.url)));
console.log(`Article publish marker written for release ${release}`);
