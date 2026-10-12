## Home page refactor: Microsoft-focused mentions, two new sections, and a flow layout

The home page was refactored from a rigid absolute-positioned layout into a natural vertical flow, the two requested blocks gained their new mentions, and two new animated sections were added.

- **"Innovative Solutions"** now adds: integrating Microsoft technologies is easier than ever with GitHub Copilot, and most development can be done by using the natural language processor to convert words into actions.
- **"The future of AI Development — by Bridging Technologies"** now adds: we bridge technologies using MCP servers, APIs, and connectors.
- **New section "Microsoft-Powered Services"** (Copilot Studio agents, Microsoft Foundry, Teams/SharePoint integration).
- **New section "Built with GitHub Copilot"** (natural-language development).
- The layout is now a flex column that sizes to its content, so the longer copy and the two new sections fit without overflow. Both new sections join the existing staged fade-in sequence.

Per the narrowing answers (1-A **and** B add both sections, 2-A flow layout, 3-B keep existing copy generic + only the requested mentions, 4-A animate the new sections).

## Issue Resolved

The home page needed content and structure changes: the two existing blocks had to mention GitHub Copilot + natural-language development and MCP servers/APIs/connectors, and the page needed room for additional Microsoft-focused sections. The original layout used hard-coded absolute positions (fixed `top`/`height` per block and a fixed `720px` container), so any added copy or section would overflow the fixed boxes — the layout had to be refactored first.

## Solution Details

- [src/app/home.component/home.component.html](../../src/app/home.component/home.component.html) — restructured into flowing `<section class="home-section">` blocks:
  - Wrapped the two-line "The future of AI Development / by Bridging Technologies" heading in a `.heading-group` so it reads as one tight heading.
  - Added the GitHub Copilot + NLP sentence to the welcome copy and the MCP servers/APIs/connectors sentence to the "bridging" copy (existing wording otherwise kept generic per 3-B).
  - Added two new sections — "Microsoft-Powered Services" and "Built with GitHub Copilot" — each with `w3-animate-zoom` and gated by its own `*ngIf` reveal flag, reusing the existing `neuropol-regular-normal-deep-cerulean-32px` title style and `roboto-normal-gravel-16px` body style.
- [src/app/home.component/home.component.ts](../../src/app/home.component/home.component.ts) — added `showMicrosoftServices` and `showCopilotSection` flags and extended the timed `setTimeout` reveal chain so the two new sections fade in after `showMoreInfoText` (answer 4-A).
- [src/app/home.component/home.component.scss](../../src/app/home.component/home.component.scss) — replaced the absolute-positioned rules with a flow layout: `.home` is now `display:flex; flex-direction:column; gap:32px; min-height:720px; padding:64px 115px 56px`. Text blocks use `max-width` instead of fixed widths/heights, the decorative `.landing-background` is pinned top-right (`right:0; z-index:0; pointer-events:none`) behind the content (`z-index:1`), and new `.home-section`, `.heading-group`, `.section-title`, and `.section-text` rules were added. The button/`.textfield`/`.text-2` rules were left intact.

No PowerShell was used; validation ran with `npm.cmd`.

## Validation

- `npm.cmd run build-development` completed successfully; `get_errors` on the three home files reported no errors.
- Served on `http://127.0.0.1:4200/?page=HOME` and visually verified in the browser: all blocks flow vertically in order (Innovative Solutions → Bridging Technologies → Microsoft-Powered Services → Built with GitHub Copilot → More Information button), both new sections render with the blue title + body styling, the two-line heading stays tight, and the decorative background sits behind the content.

## Follow-up Risks or Limitations

- **Out-of-scope purple spotted:** the dark-mode toggle switch (settings component) still shows a purple checkmark on its thumb — a remnant of the broader "remove purple" goal from ADR 006, not part of this home refactor. It uses the Material switch selected-icon color and would need a separate `--mat-sys-primary`/switch-icon override; left unchanged to stay within the approved ADR 007 scope.
- The flow layout keeps a `min-height: 720px` so the page still fills the viewport when copy is short; very long future copy will simply extend the page (intended).
- `min-width: 1440px` is still inherited from the app shell, so the home page is not yet responsive below that width; narrowing/responsiveness was not part of this request.
- The decorative background remains a fixed 658×402 element pinned top-right; on very wide viewports it stays anchored to the right edge rather than scaling.

## Follow-up: deferred button reveal + transparent content over imagery (all pages)

Two further refinements completed in the (007c)/(007d) continuation (answers 1-A deferred button, 2-A fully transparent, 3-B all pages, 4-B transparent + text-shadow):

- **"More Information" button now reveals only after every section.** It is gated behind a new `showMoreInfoButton` flag that flips one timed step after `showCopilotSection`, with the same `w3-animate-zoom` fade-in. The `.spacer` reserves the button's height, so nothing jumps when it appears.
- **Content text no longer blanks out the background image.** The content blocks previously used an opaque `background-color: var(--background-color)`, which masked the decorative image wherever the flowing text overlapped it on narrower windows (the transparent-background titles never had this problem). All content blocks across every page were set to `background-color: transparent`, and a subtle theme-aware halo `text-shadow` was added globally to `.rationale-component` so the overlaid text stays legible over the image in both light and dark modes.

### Issue Resolved

The button appeared immediately instead of after the staged reveal, and the content paragraphs' opaque backgrounds cut rectangular holes in the right-side imagery when the viewport narrowed — a problem present on every page, with the home page prioritized.

### Solution Details

- [src/app/home.component/home.component.ts](../../src/app/home.component/home.component.ts) — added `showMoreInfoButton` and an extra `setTimeout` step after `showCopilotSection`.
- [src/app/home.component/home.component.html](../../src/app/home.component/home.component.html) — the button now has `*ngIf="showMoreInfoButton"` and `w3-animate-zoom`.
- [src/app/home.component/home.component.scss](../../src/app/home.component/home.component.scss) — the combined content rule (`.welcome-conditional-text, .more-info-conditional-text, .section-text`) background set to `transparent`.
- [src/assets/mat-controls.scss](../../src/assets/mat-controls.scss) — `.rationale-component` now sets `background-color: transparent` and `text-shadow: 0 0 4px var(--background-color), 0 0 2px var(--background-color)` (a page-colored halo that keeps overlaid text legible in both themes).
- Content blocks set to transparent across the other pages: [about.component.scss](../../src/app/about.component/about.component.scss) (company-profile, ai-strategies, automation, integration, innovation, courses, founder-cto rationales), [contact.component.scss](../../src/app/contact.component/contact.component.scss) (lets-connect / reach-out rationales), and [showcase.component.scss](../../src/app/showcase.component/showcase.component.scss) (ai-strategies, chatmate, smart-build, help-system, hands-free, translation-agent rationales). Page-container backgrounds (`.about`, `.home`, `.contact`, `.showcase`) and decorative spacers were intentionally left opaque.

### Validation

- `npm.cmd run build-development` completed successfully.
- Verified in the browser at `127.0.0.1:4200`: on load the home sections fade in and the "More Information" button appears only after the final "Built with GitHub Copilot" section. The "Innovative Solutions" paragraph now shows the hexagonal background image through the text, with the halo shadow keeping the copy readable in dark mode.

### Follow-up Risks or Limitations

- The halo `text-shadow` now applies to all `.rationale-component` text (including titles) site-wide; it is subtle, but it is a global typographic change, not scoped only to blocks that overlap imagery.
- Decorative spacer frames (`.frame-5`) on contact/showcase were left opaque; they are tiny (18px) and not content text, so they were out of scope.

## Follow-up: home-style layout applied to About, Showcase, and Contact

The layout half of the home pattern was applied to the remaining pages (answers 1-A pin top-right + widen content, 2-A natural flow, 3-A anchored top-right, 4-A content images overlay too). Previously these pages were flex **rows** with `.side-animation` (854×264) as a sibling to the right of the content, so the image and content sat side-by-side and never overlapped. They now match the home page: the side image is pinned behind the content, and the content flows in a column on top of it.

### Issue Resolved

"Complete the refactoring of all the pages" — About, Showcase, and Contact needed the same treatment as the home page so that the text and section images sit on top of the right-side decorative image, rather than beside it, and so the pages flow naturally instead of relying on hard-coded heights.

### Solution Details

For each of [about.component.scss](../../src/app/about.component/about.component.scss), [showcase.component.scss](../../src/app/showcase.component/showcase.component.scss), and [contact.component.scss](../../src/app/contact.component/contact.component.scss):

- **Page container** (`.about` / `.showcase` / `.contact`) changed from a `display:flex` row (with `gap`) to `display:flex; flex-direction:column; position:relative; overflow:hidden`, and the fixed `height` became `min-height` so content sizes the page.
- **Side image** (`.side-animation`) changed from `position:relative` (in-flow sibling) to `position:absolute; right:0; top:0; z-index:0; pointer-events:none`, pinning it to the top-right behind the content (anchored at the top only, like home).
- **Content container** (`.ui-expanding-container-text` / `.ui-expanding-container`) got `z-index:1` so it layers above the image, and was widened (About 980→1210px, Showcase set to 1172px, Contact 992→1172px) so the content — including right-aligned section images — extends over the pinned image where they meet. Showcase's container also changed from `inline-flex` to `flex` so its `width:100%` rows resolve against the new width.

Content backgrounds were already transparent with the legibility halo shadow from the previous (007c/007d) pass, so the overlaid text and images read cleanly over the image.

### Validation

- `npm.cmd run build-development` completed successfully; `get_errors` on all three SCSS files reported none.
- Verified each page in the browser at `127.0.0.1:4200` (including a 1440px viewport via Playwright): About, Showcase, and Contact now flow vertically with the decorative image pinned top-right behind the content, and the text/section images overlay it where they meet (e.g. the About "Company Profile" copy sits over the hexagon image, Showcase section images layer in the flow). No layout breakage; nav/footer unaffected.

### Follow-up Risks or Limitations

- **Content still references non-Microsoft platforms.** Showcase and Contact copy still mention Google/Dialogflow/GCP/AWS, which conflicts with the `refactor-strategy.md` Microsoft-only goal. That content migration is a separate effort, out of scope for this layout/background ADR.
- The widened content columns (1172–1210px) assume the app's `min-width: 1440px` shell; the overlap is most visible near that width. On much wider viewports the pinned image sits at the far-right edge with a gap before the content, same as the home page.
- Fixed `min-height` values (2289/2232/1080px) were preserved as minimums; if content grows the pages extend naturally, but the minimums are still hand-tuned rather than purely content-driven.
