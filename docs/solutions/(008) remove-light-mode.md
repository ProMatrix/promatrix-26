## Decision: dark mode only

ProMatrix now ships dark mode only. The light theme, the theme toggle, and the left settings panel were removed; the page content was shifted left into the freed space; and the only light-mode-specific image backgrounds (the toggle icon and the light landing/side-animation GIFs) were eliminated.

The dark theme is applied statically on the root element, so no runtime theme switching code remains:

```html
<html lang="en" class="mat-dark-theme app-dark-theme">
```

## Issue Resolved

The ADR (008a/008b) requested removing the application's light mode so only dark mode is used. Concretely this meant: remove the light/dark slide toggle from the left panel, move the main content panel further left to reclaim the space the settings panel occupied, and clean up light-mode-specific image backgrounds and related UI issues.

Confirmed choices (from (008b)): fully remove all light-mode code paths and `src/mat-light-theme.scss` (1-B); remove the entire `app-settings` component (2-A); remove the reserved left gutter so content starts at a normal page margin (3-A); audit all images/components for light-mode-specific backgrounds and fix for dark mode (4-B).

## Solution Details

Theme hardcoded to dark:
- `src/index.html` — root element now carries `class="mat-dark-theme app-dark-theme"` so the dark theme is active without JavaScript.
- `src/app/app.services.ts` — removed the `darkModeState` signal, `isDarkMode`, the `darkMode` getter/setter, `readStoredDarkMode()`, `switchDarkMode()`, the constructor theme application, and the now-unused `signal` import.
- `src/styles.scss` — removed the `@use "./mat-light-theme"` rule, the `.app-light-theme` block, and the `.side-animation-model-light` / `.landing-background-model-light` selectors; dark equivalents retained.
- `src/mat-light-theme.scss` — deleted.

Settings panel / toggle removed:
- Deleted the entire `src/app/settings.component/` folder (`.ts`, `.html`, `.scss`), which held the dark-mode icon (`dark-mode2-1.png`) and the slide toggle.
- `src/app/app.module.ts` — removed the `SettingsComponent` declaration/import and the now-unused `MatSlideToggleModule` import.
- `src/app/app.component.html` and `src/app/app.content.html` — removed the `<app-settings>` usage.
- `src/assets/mat-controls.scss` — removed the fixed-position `app-settings` rule (`left: 30px; top: 125px`).

Content shifted left (reclaimed settings-panel gutter, uniform 40px left margin):
- `src/app/home.component/home.component.scss` — `.home` padding `64px 115px 56px` → `64px 40px 56px`.
- `src/app/about.component/about.component.scss` — `.ui-expanding-container-text` `margin-left: 115px` → `40px`.
- `src/app/showcase.component/showcase.component.scss` — `.ui-expanding-container` `margin-left: 134px` → `40px`.
- `src/app/contact.component/contact.component.scss` — `.ui-expanding-container` `margin-left: 134px` → `40px`.

Image-background cleanup (dark only):
- The light-mode toggle icon was removed with the settings component.
- Theme-conditional bindings were replaced with the static dark class so no light GIF can load:
  - `home.component.html` — `landing-background landing-background-model-dark`.
  - `about`/`showcase`/`contact` `.html` — `side-animation side-animation-model-dark`.
- Audit result: content blocks were already `background-color: transparent` (ADR 007) and page containers use the dark `--background-color`; the only light-mode-specific image backgrounds were the toggle icon and the `*-light` GIF selectors, all now removed.

## Validation

- `npm.cmd run build-development` — build succeeded (Application bundle generation complete), no errors.
- `get_errors` on `app.services.ts`, `app.module.ts`, `styles.scss`, and `home.component.html` — no errors.
- Workspace grep for `SettingsComponent`, `isDarkMode`, `appServices.darkMode`, `app-settings`, `mat-light-theme`, `app-light-theme`, `side-animation-model-light`, `landing-background-model-light` — no remaining references in compiled source (only docs and the non-compiled `project-px-settings.json`).

## Follow-up Risks or Limitations

- `project-px-settings.json` still contains a generator entry referencing the removed settings component and `appServices.darkMode`. It is not part of the build, but regenerating components from it would recreate the toggle; update it if the generator is rerun.
- Light-specific CSS variables in `src/assets/styleguide.css` (e.g. `--color-*-light`) and `src/img/*-light.gif` / `dark-mode*.png` assets remain on disk but are now unreferenced by the app; they were left in place to avoid touching shared style tokens still consumed by `globals.css`.
- The `40px` left margin was chosen as a uniform "normal page margin"; if a different gutter is preferred it is a single value per page component.
- Photographic/illustration PNGs (headshot, DALL·E showcase images) carry their own baked-in backgrounds that cannot be recolored via CSS; they were verified to render acceptably on the dark background but would need asset edits to change.

## Decision: responsive top navigation (buttons move left to 768px, hamburger below)

The top navigation bar now keeps its nav buttons moving left as the window narrows all the way down to 768px, instead of stopping at 1440px. At 768px and below, the three nav links (SHOWCASE / ABOUT US / CONTACT) collapse into a hamburger menu that opens a dropdown.

## Issue Resolved

The ADR (008c/008d) reported that the right-aligned top-nav buttons stopped moving left too soon when narrowing the window, preventing the app from being made less wide. The cause was `.app` (the fixed header) carrying `min-width: 1440px`: below 1440px the header stopped shrinking (horizontal overflow), so the `justify-content: flex-end` buttons no longer tracked the viewport.

Confirmed choices (from (008d)): lower the header min-width to a specific smaller value — 768px (1-B); collapse the nav into a hamburger menu below the breakpoint (2-C); limit scope to the top navigation bar only (3-A); keep the nav usable down to the tablet width ~768px (4-A).

## Solution Details

- [src/app/app.component.scss](../../src/app/app.component.scss) — `.app` `min-width: 1440px` → `768px`, so the fixed header (and its right-aligned buttons) shrink with the viewport down to 768px. Added `.nav-menu` (hidden on desktop), `.nav-menu-toggle`, and an absolutely-positioned `.nav-menu-dropdown`. Added `@media (max-width: 768px)` that sets `.app { min-width: auto }`, hides `.auto-layout-frame`, and shows `.nav-menu`.
- [src/app/app.component.html](../../src/app/app.component.html) — added a hamburger block between the desktop button row and the logo: a `mat-icon-button` (`<mat-icon>menu</mat-icon>`, with `aria-haspopup`/`aria-expanded`) toggling an `*ngIf` dropdown containing the same three nav links.
- [src/app/app.component.ts](../../src/app/app.component.ts) — added `menuOpen` state, `toggleMenu()`, and `navigate(page)` which sets `appServices.pageToDisplay` and closes the menu. Reused `getClassBySelection` for the dropdown links.
- Scope limited to the top nav bar: the footer's own `min-width: 1440px` and page-content widths were intentionally left unchanged (3-A). Because the header is `position: fixed` and tracks the viewport, the buttons move left independently of the footer-driven document width.

## Validation

- `npm.cmd run build-development` — build succeeded, no errors; `get_errors` on the three `app.component.*` files reported none.
- Ran the dev server and confirmed via the compiled stylesheet that the `@media (max-width: 768px)` rule is present with the encapsulated selectors `.app`, `.app .auto-layout-frame` (`display: none`), and `.app .nav-menu` (`display: block`).
- Exercised the hamburger logic live: opening the toggle rendered the dropdown, selecting SHOWCASE navigated (`app-showcase` rendered, `localStorage.pageDisplayed = "SHOWCASE"`) and closed the menu.

## Follow-up Risks or Limitations

- The integrated test browser clamped/scaled the emulated viewport (set 500px reported ~1695px inner width), so the breakpoint crossover could not be screenshotted directly; it was verified through the compiled media rule and the toggle behavior instead. Worth a manual resize check in a normal browser.
- The dropdown closes on item selection and on toggle, but not on outside-click; add an outside-click/overlay handler if that interaction is desired.
- The footer still has `min-width: 1440px` (out of scope per 3-A), so the document can still show a horizontal scrollbar below 1440px even though the fixed header shrinks; revisit if full-page responsiveness is wanted.
- Below ~700px the fixed logo (`left: 12px`, width ~288px) and the hamburger approach each other; the supported floor is 768px (4-A), so narrower widths were not tuned.
