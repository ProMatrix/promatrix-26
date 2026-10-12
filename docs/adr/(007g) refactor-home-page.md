This is a continuation from the file: (007f) refactor-home-page.md
My goal is to:
Refactor the button on the contact page to have the same sequencing behavior as the button on the home page.

Read and follow these system instructions:
prompts/refactor-strategy.md
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

---

Context I gathered: on the home page the button is the **last step of a full staged reveal** — `HomeComponent.ngOnInit` runs a timed chain (title → welcome → middle/bottom titles → more-info → the two new sections → `showMoreInfoButton`), each block gated by an `*ngIf` and fading in with `w3-animate-zoom`, using a `ChangeDetectorRef`/`DestroyRef` `updateView` helper. The Contact page currently has **no** staged sequence at all: `ContactComponent` has no `ngOnInit`/flags, and every block (title, intro, reach-out, and the "Connect on LinkedIn" button) renders immediately. So "same sequencing behavior as the home button" could mean two different things.

1. What scope should match the home behavior?
	- A. Stage the whole Contact page like home (Let's Connect title → intro → reach-out → button), with the button revealing last — the truest match to the home pattern (recommended)
	- B. Leave the Contact content rendering immediately and only delay-reveal the button (with the same fade-in) after a timed pause
	- C. Other (please specify)

2. Timing/animation cadence for the reveal?
	- A. Mirror the home cadence exactly (initial ~1250ms, then ~250–500ms steps) and reuse the same `w3-animate-zoom` fade-in and the `ChangeDetectorRef`/`DestroyRef` `updateView` pattern (recommended)
	- B. Use a single short delay before the button only
	- C. Other (please specify)