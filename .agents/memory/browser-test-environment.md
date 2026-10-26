---
name: Browser test library compatibility
description: Native browser libraries in Nix must be mutually compatible.
---
When supplying missing shared libraries for a downloaded browser, use a compatible
set and avoid adding every Nix store library directory to LD_LIBRARY_PATH.

**Why:** Broad library paths can override Node's libc/C++ runtime; mixing old GLib
with newer accessibility libraries can also prevent Chromium from launching.

**How to apply:** Inspect missing browser dependencies, supply only the required
libraries, and keep the change limited to the test process rather than app runtime.
