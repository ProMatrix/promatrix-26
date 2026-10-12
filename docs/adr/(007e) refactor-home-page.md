This is a continuation from the file: (007d) refactor-home-page.md
My goal is to:
 Complete the refactoring of all the pages.
 Apply the same background fix to all pages (about, showcase, contact). Use the home page as an example.
 The text and images should go on top of the right-image.


Read and follow these system instructions:
prompts/refactor-strategy.md
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

---

Context I gathered: content backgrounds are already transparent + legibility shadow on all pages (done in 007c/007d). What remains is the *layout* side of the home pattern. On About, Showcase, and Contact the page container is `display:flex` (a row), and `.side-animation` (854×264) is a flex sibling to the **right** of the content column — so the image and content sit side-by-side and never overlap. On home, by contrast, the decorative image is pinned (`position:absolute; right:0; z-index:0`) and the content flows in a column on top of it. The pages also have hard-coded heights (About 2289px, Showcase 2232px, Contact 1080px), and the side image (854px tall) is much shorter than those pages.

1. To make the text and images sit on top of the right-side image (home-style), how should the image be positioned?
	- A. Pin it to the top-right corner behind the content (like home) and let the content column widen so it overlays the image where they meet (recommended)
	- B. Position it behind the right portion of the current content column so text/images overlay it, without widening content
	- C. Make it a full-height decorative strip down the right edge behind all content

2. These pages use fixed pixel heights. Like the home refactor, should I convert them to natural flow?
	- A. Yes — `position:relative` + `min-height`/auto so content sizes the page, matching home (recommended)
	- B. Keep the current fixed heights

3. The side image is 854px tall but the pages are much taller. How should it behave down the page?
	- A. Keep it anchored at the top-right only, like home; the rest of the right side is plain background (recommended)
	- B. Make it sticky so it follows while scrolling
	- C. Repeat/stretch it to cover the full height of the right side

4. Should this also apply to the per-section images inside the content (e.g. Showcase's chatmate/smart-build images), i.e. let them overlay the pinned background image too?
	- A. Yes — content images overlay the pinned image just like the text (recommended, matches "text and images on top")
	- B. No — only text overlays; keep content images clear of the image area