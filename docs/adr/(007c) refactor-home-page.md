This is a continuation from the file: (007b) refactor-home-page.md
My goal is to:
Continue refactoring the home page.
There are a few small details that need to be fixed:
- The "More Information" button should not appear until after all of the sections are rendered.
- When the  browser window becomes less wide then the text for the section is going top of the right-side image. This looks fine for the section title: "Innovative solutions", but the content text does not look good, and here's the reason why:
The section titles background is transparent so the title looks fine overlaying the right-side image. However the content for that section doesn't look good because the background color for that element is not transparent which means it's blocking out the underlying image.

Note: This same problem is on every page, maybe it is rational to fix the home page first.

Read and follow these system instructions:
prompts/refactor-strategy.md
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

---

Context I gathered: the "More Information" button (`.ui-expanding-row` in `home.component.html`) currently has no `*ngIf`, so it is visible immediately. The content blocks (`.welcome-conditional-text`, `.more-info-conditional-text`, `.section-text` in `home.component.scss`) set `background-color: var(--background-color)` (opaque), while the title blocks have no background — which is exactly the difference you described. The decorative image (`.landing-background`) is pinned top-right; on narrower windows the flowing content overlaps it, and the opaque content background blanks out the image behind the paragraph text.

1. The "More Information" button should appear only after all sections render. How should it behave?
	- A. Gate it behind a new reveal flag that triggers one step after the last section (`showCopilotSection`), with the same fade-in as the other blocks (recommended)
	- B. Reveal it at the same moment as the last section (no extra delay)
	- C. Other (please specify)

2. For the content-text overlap, what should the fix be?
	- A. Make the content blocks' background fully transparent so the paragraph text overlays the image just like the titles do (recommended, matches your description)
	- B. Keep readability with a subtle translucent background (e.g. a low-opacity surface tint) instead of fully transparent
	- C. Don't change the background — instead make the layout responsive so content never overlaps the image (e.g. hide/reflow the image on narrow widths)

3. You noted this overlap problem exists on every page. What scope should this ADR cover?
	- A. Fix the home page only now, as you suggested; handle the other pages in a later ADR (recommended)
	- B. Apply the same background fix to all pages (home, about, showcase, contact) in this pass

4. If fully transparent (2-A): on narrow widths the text will sit directly over a busy image. Is readability over the image acceptable, or should the text also get a subtle shadow/weight bump to stay legible?
	- A. Transparent only — accept the overlay look, no extra treatment (recommended)
	- B. Transparent plus a subtle text-shadow for legibility over the image