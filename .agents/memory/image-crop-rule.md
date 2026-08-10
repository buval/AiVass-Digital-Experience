---
name: Never crop faces in editorial images
description: Object-position rule for portrait/editorial images across the AiVass site
---

## Rule
Editorial images containing a person's face must never crop the head. Use `object-cover` with an object-position that keeps the full face visible at all responsive heights — typically `object-[center_10-15%]` for portraits where the face is in the upper third. Verify at both mobile (45vh) and desktop (58vh) container heights.

**Why:** User explicitly requested this ("make sure we are not cutting faces… remember this forever") after the Businesses page hero cut the top of the subject's head at `object-[center_30%]`.

**How to apply:** Any time an editorial/hero image with a person is added or a container height changes, check the face is fully visible. Current values: businesses 12%, individuals 25%, about 18% — adjust these if faces get clipped after layout changes.
