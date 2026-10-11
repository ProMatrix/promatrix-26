This is a continuation from the file: (006b) quick-tweaks.md
My goal is to:
Fix some of the same things.
The NAV buttons at the top still have the purplish hover effect.
the change of the button on the contact page looks better but it needs the same font as the button on the landing page.

Read and follow these system instructions:
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

---

Root cause found. My previous fix overrode the legacy `--sys-primary`, but Angular Material 22 actually reads `--mat-sys-*` variables. Those are still the default purple: `--mat-sys-primary: #7d00fa` and `--mat-sys-tertiary: #7d00fa` (plus light-purple `--mat-sys-primary-container`, `--mat-sys-tertiary-container`, `--mat-sys-primary-fixed`, `--mat-sys-inverse-primary`). The nav button's hover state-layer/ripple uses `--mat-sys-primary`, which is why it is still purplish. For the font: the landing "More Information" button renders in Roboto 24px (via the `.mat-button` class), while the Contact "Connect on LinkedIn" button uses `.mat-form-button`, so it gets a different font.

1. How should I remap the purple Material 22 system tokens (theme-aware, light + dark)?
	- A. Remap the purple `--mat-sys-*` tokens (primary, tertiary, and their container/fixed/inverse variants) to the app's blue scheme in both themes — removes purple from every Material component
	- B. Only override `--mat-sys-primary` and `--mat-sys-tertiary` to blue — minimal, fixes the nav hover/ripple
	- C. Make the nav hover a subtle neutral tint rather than brand blue

2. What should "same font as the landing page button" mean for the Contact button?
	- A. Match font-family only (Roboto)
	- B. Match the landing button's full text style — Roboto, 24px (and weight) — so the two look identical
	- C. Other (please specify)