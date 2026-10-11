My goal is to:
 Fix the small issues that remain in this web app.

 These issues are mostly cosmetic, but content issues need fixing.
 - The buttons on the top NAV have a hover effect that needs to be changed to a different color. Currently it's kind of purplish when we are in dark mode.
 In fact we should remove The color Purple anywhere in this app to another color that's part of the existing color scheme.

- Places within the content when we are referring to ProMatrix products and services, we've referred to "their" instead of "our".

- Places within the content are words that connected without a space. This should be fixed.

- Content that has sentence structure errors should be fixed.

- The button on the contact us page should have the same properties as button on the landing page. Fix it.


Read and follow these system instructions:
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

---

Before implementing, I need to narrow a few choices. The "purplish" hover comes from Angular Material's default system primary color (the dark theme resolves `--sys-primary` to a Material purple), applied to the top-nav `mat-button` buttons. The existing scheme has no purple of its own — primary is blue (`--primary-color` ≈ `#0479b1` light / `#57a5cb` dark) and accent is a deeper blue (`--accent-color` ≈ `#044472`). Purple is also baked into a few SVG assets (`caret.svg`, `active-indicator-5.svg`, `icon-17.svg`, `icon-19.svg`, `icons-check-24px-1.svg` using `#6750A4` / `#21005D`).

1. Which existing scheme color should replace the purple nav hover (and any other purple) in both light and dark modes?
	- A. Primary blue (`--primary-color`)
	- B. Accent blue (`--accent-color`)
	- C. A neutral control color (e.g. `--ctl-selected-color`) so the hover is subtle rather than branded
	- D. Other (please specify)

2. Purple also lives inside SVG image assets, not just the CSS/theme. How far should the "remove purple anywhere" cleanup go?
	- A. Only fix the live CSS/Material theme so no purple is visible in the running app
	- B. Also recolor the purple SVG assets that are actually rendered in the app
	- C. Recolor every purple SVG asset, even ones that appear unused/legacy

3. The Contact page button is the "Connect on LinkedIn" anchor (`mat-flat-button`), and the landing-page button is the Home "More Information" button (`more-information-button mat-flat-button`). What does "same properties" mean here?
	- A. Match the full visual style (size, padding, color, radius) of the Home button
	- B. Match only the color/theme, keep LinkedIn's current size/padding
	- C. Other (please specify)

4. For the content/grammar fixes (joined words like "dataand", "customerattention", "automaticallysolves"; "their" → "our"; sentence-structure errors), what scope should I apply?
	- A. Fix all occurrences across every content page (home, about, showcase, contact)
	- B. Fix only the specific examples I can clearly identify as errors, leaving stylistic wording alone
	- C. Fix joined words and "their" → "our" only; leave larger sentence rewrites for a later pass