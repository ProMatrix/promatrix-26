This is a continuation from the file: (008b) remove-light-mode.md
My goal is to:
refactor the top navigation bar.
 At the moment the top-nar buttons will move to the left as we make the application with more narrow.
 and that's OK however the buttons stops moving to the left too soon and should allow us to make the application less wide while moving the buttons to the left.


Read and follow these system instructions:
prompts/refactor-strategy.md
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

---

The buttons stop moving left because the header `.app` has `min-width: 1440px` (the footer also has `min-width: 1440px`); below that a horizontal scrollbar appears instead of further shrinking. The nav buttons are right-aligned (`justify-content: flex-end`) and the logo/title `.home-frame` is absolutely positioned at `left: 12px` (width ~288px). Before I implement, please confirm:

1. How should the header's minimum width change so the buttons can keep moving left?
	- A. Remove `min-width` entirely so the header is fully fluid to the viewport.
	- B. Lower it to a specific smaller value (please specify px, e.g. 768px).
	- C. Keep a min-width but smaller than 1440px (please specify).

2. As the header narrows, the right-aligned buttons will eventually reach the fixed logo/title. What should happen on collision?
	- A. Shrink button spacing first (reduce the 24px gap / button padding) to fit longer.
	- B. Allow the buttons to wrap to a second row.
	- C. Collapse the buttons into a hamburger/menu below a breakpoint.
	- D. Let them keep moving left with no special handling (accept possible overlap with the logo).

3. What scope should this change cover?
	- A. The top navigation bar only.
	- B. Top navigation bar + footer (which shares `min-width: 1440px`).
	- C. Nav bar + footer + page content (a broader responsive pass).

4. Down to what minimum viewport width should the nav stay usable?
	- A. Tablet (~768px).
	- B. Mobile (~360–480px).
	- C. A specific value (please specify).