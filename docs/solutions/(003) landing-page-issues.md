## Implementation Result

The home page now restores the existing landing-page DOM content and styling expected by the reference screenshot. The delayed title, body-copy, Chatbot Talk Show heading, Chatbot Talk Show text, and Talk Show image control render after the staged reveal timers. The top navigation links use the light cyan Material primary color instead of the upgraded purple default.

## Issue Resolved

After upgrading the project dependencies, the home page UI had visible regressions: existing landing-page text did not appear, the top navigation links used the wrong purple color, and the Chatbot Talk Show visual control was missing even though the component and styles still contained state and CSS for it.

## Solution Details

Updated `src/app/home.component/home.component.ts` so timer-driven reveal state changes explicitly trigger Angular change detection. This restores the existing `*ngIf` controlled home-page content without changing the page copy.

Updated `src/assets/mat-controls.scss` so `.nav-button-link` overrides Angular Material's text-button color tokens and uses the app's light cyan `--sys-primary` value, with a fallback to `--primary-color`.

Updated `src/app/home.component/home.component.html` to restore the missing Chatbot Talk Show control using the existing `showTalkShowCtrl`, `hostSoundwave`, and `guestSoundwave` state and the existing bot/soundwave image assets.

## Validation

Ran `npm.cmd run build-development`; the Angular development build completed successfully with no TypeScript, template, or SCSS errors.

Started the Angular dev server with `npm.cmd run start-client` and validated the live home page at `http://127.0.0.1:4200/` using browser automation. After the reveal delay, the DOM contained the restored home text, the Chatbot Talk Show control with four images, and the top navigation color computed to `rgb(142, 207, 242)` / `#8ecff2`.

## Follow-up Risks or Limitations

The app shell still uses a fixed 1440px layout, so narrow browser viewports can show horizontal scrolling. That behavior existed outside the focused landing-page repair and was not changed in this ADR.

The Talk Show control retains the existing project setting behavior of showing a `Talkshow coming soon!` alert because no concrete video URL was present in the source.

## Implementation Result

The follow-up landing-page cleanup removed the entire Chatbot Talk Show section from the home page, including the graphic, heading, descriptive text, click behavior, and timer-driven state that previously revealed it. The dark-mode slide-toggle track now uses the same primary cyan/blue color as the restored navigation links.

## Issue Resolved

The continued ADR request asked to remove the Chatbot Talk Show image altogether and fix the background color on the dark-mode toggle button. The selected narrowing answers clarified that the entire Chatbot Talk Show section should be removed and that only the slide-toggle track behind the thumb should use the primary cyan/blue color.

## Solution Details

Updated `src/app/home.component/home.component.html` to remove the Chatbot Talk Show graphic, heading, and text block.

Updated `src/app/home.component/home.component.ts` to remove the now-unused Chatbot Talk Show reveal flags, soundwave loop, random delay getter, and alert click handler.

Updated `src/app/home.component/home.component.scss` to remove unused styles for the deleted Chatbot Talk Show section.

Updated `src/assets/mat-controls.scss` to set the dark-mode `.mat-slide-toggle` track color variables and track pseudo-elements to `--sys-primary`, with `--primary-color` as a fallback.

## Validation

Ran `npm.cmd run build-development`; the Angular development build completed successfully.

Checked VS Code diagnostics for the touched home component and Material controls stylesheet; no errors were reported.

Validated the live page at `http://127.0.0.1:4200/` with browser automation. The Chatbot Talk Show selectors were absent, the text `Chatbot Talk Show` was absent from the page body, the remaining landing-page title/body content was still present, and the toggle track computed to `rgb(142, 207, 242)` / `#8ecff2`.

Captured a browser screenshot after the fix to confirm the home page no longer shows the Chatbot Talk Show section.

## Follow-up Risks or Limitations

The home page still uses fixed absolute positioning inherited from the existing design. Removing the Chatbot Talk Show section leaves the remaining controls at their existing positions rather than reflowing the page into a responsive layout.

## Implementation Result

The home page now switches the right-side landing image immediately when the dark-mode toggle changes. The landing background binding uses a signal-backed dark-mode state, so the image class updates from the dark GIF to the light GIF without requiring a page refresh.

The home page height was reduced from `1080px` to `720px`, and the More Information button was moved upward into the remaining space below the last text section.

## Issue Resolved

The continued ADR request identified two remaining landing-page issues: switching to light mode changed the app theme but did not update the right-side landing image, and the page remained much taller than needed after removing the Chatbot Talk Show section.

## Solution Details

Updated `src/app/app.services.ts` so dark-mode state is backed by an Angular signal while preserving the existing `darkMode` getter/setter used by the settings toggle.

Updated `src/app/home.component/home.component.html` so the landing background reads the signal-backed state with `appServices.isDarkMode()` and switches between the existing `landing-background-model-dark` and `landing-background-model-light` classes immediately.

Updated `src/app/home.component/home.component.scss` to reduce the home page height to `720px` and move `.ui-expanding-row` to `top: 600px`.

## Validation

Ran `npm.cmd run build-development`; the Angular development build completed successfully.

Checked VS Code diagnostics for `src/app/app.services.ts`, `src/app/home.component/home.component.html`, and `src/app/home.component/home.component.scss`; no errors were reported.

Validated the live page at `http://127.0.0.1:4200/` with browser automation. Toggling dark mode changed the landing background from `landing-background-model-light` / `landing-background-light.gif` to `landing-background-model-dark` / `landing-background-dark.gif`, then back to the light class and GIF on the next toggle. The home height computed to `720px`, and the button row computed to `top: 600px`.

Captured a browser screenshot after the fix to confirm the shorter home page layout and earlier More Information button placement.

## Follow-up Risks or Limitations

The light landing GIF is visually subtle against the light page background, so screenshots can make the right-side image appear low contrast even though the asset URL and class are switching correctly.