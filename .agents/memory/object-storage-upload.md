---
name: Object Storage upload pattern
description: How to upload files to GCS Object Storage from within the workspace
---

## Rule
Upload scripts must run from `artifacts/api-server/` directory using the Replit sidecar credential config. Running from the workspace root fails with "Could not load the default credentials."

**Why:** The `@google-cloud/storage` package is installed only in `artifacts/api-server`. The GCS sidecar auth endpoint (`http://127.0.0.1:1106`) provides credentials via external_account config that must be constructed explicitly.

**How to apply:**
```javascript
// Run from: cd artifacts/api-server && node --input-type=module << 'EOF'
import { Storage } from "@google-cloud/storage";
const SIDECAR = "http://127.0.0.1:1106";
const storage = new Storage({
  credentials: {
    audience: "replit", subject_token_type: "access_token",
    token_url: `${SIDECAR}/token`, type: "external_account",
    credential_source: { url: `${SIDECAR}/credential`, format: { type: "json", subject_token_field_name: "access_token" } },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});
const bucket = storage.bucket("replit-objstore-46edb847-551b-4dde-91e9-145c1a7d338f");
await bucket.upload("../../path/to/file.pdf", { destination: "guides/slug.pdf", metadata: { contentType: "application/pdf" } });
```
