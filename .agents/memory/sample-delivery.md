---
name: Sample delivery decisions
description: Preserve native PDF activation and lossless samples; avoid inferred cross-tab load state.
---
Keep free samples as native PDF links rather than fetching blobs before navigation.
Do not use elapsed-time feedback to claim that a PDF in another tab has loaded.

**Why:** The originating page cannot reliably observe another tab's PDF renderer.
Timers both misrepresent loading and can prevent an immediate retry. Native links
preserve touch, keyboard, modified-click, download, and no-JavaScript browser behavior.

**How to apply:** Provide truthful new-tab guidance and a download recovery path.
When slimming future sample extracts, remove unused source-document resources
before considering lossy image compression; verify text and rendered equivalence.

Sample PDF purchase buttons must link to the matching guide's stable detail page,
not a stored Stripe Checkout Session.

**Why:** PDFs can stay downloaded for months; embedded payment sessions would
expire. The guide page can always create a fresh checkout when the reader buys.
