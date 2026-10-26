# Free sample delivery verification

Measured on 2026-10-26. Production URL was confirmed through deployment metadata.
These are single-request observations from the workspace, not global latency claims.

## Published baseline (https://aivass.com)

All six sample URLs returned 200, application/pdf, zero redirects,
Accept-Ranges: bytes, and Cache-Control: private. Athletics also returned a correct
206 response for bytes 0–1023. No redirect or analytics-network wait was found.
Analytics only queues an event; the old UI independently showed “Opening…” and
prevented repeat activation for 2.5 seconds.

| Sample | Original bytes | First byte (s) | Total (s) | Optimized bytes |
| --- | ---: | ---: | ---: | ---: |
| Arts | 1649099 | .178 | .248 | 557903 |
| Athletics | 1614744 | .097 | .253 | 495488 |
| Business | 1678393 | .165 | .344 | 493372 |
| Education | 1718301 | .209 | .402 | 488716 |
| Master | 2477365 | .210 | .422 | 1144047 |
| Science | 1696133 | .177 | .355 | 482185 |

PDF cleanup removes unused resources retained from source guides. All samples
retain six pages, identical extracted text, and pixel-identical rendered pages.
No image downsampling, font substitution, or text rasterization.
At a curl transfer limit of 100 KiB/s, Athletics took 15.95s from production
(original) versus 4.83s from preview (optimized). Different hosts, same client
and limit: this supports the byte-size improvement, not a server latency claim.
Cache policy was left unchanged because measurement did not justify changing it.

## Local verification

- TypeScript check and production build passed (existing bundle-size and tooltip sourcemap warnings).
- Chromium desktop and Pixel 7 touch emulation passed:
  six real PDF responses and range requests, all six storefront links and six
  detail links, correct URLs, normal/touch/Enter/repeat/middle/Ctrl activation,
  unchanged labels during delayed delivery, HTTP 503 failure and visible recovery
  guidance, working download fallback, purchase button still enabled.
- Browser navigation fixtures intentionally replace PDF bodies with HTML for
  deterministic popup observation; PDF byte delivery is checked separately.
- Athletics PDF cover and detail page visually inspected.
- Checkout handlers and paid fulfillment were not changed; no payment created.

Run `SAMPLE_TEST_URL=https://<preview-host>/ node scripts/validate-guide-samples.mjs`
from the web artifact after installing Playwright Chromium. On Nix, Chromium needs
compatible native shared libraries supplied by the environment.

## Not claimed

The new assets and UI have not been published by this task. Live post-merge delivery
and real Safari/iOS/Android PDF viewers have not been tested. Emulation tests touch
activation and responsive behavior, not a phone's native PDF renderer.
The original device-specific perceived lag cannot be fully reproduced from here;
confirmed issues are excess transfer bytes and misleading/retry-blocking feedback.
