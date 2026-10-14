My goal is to:
Remove the application light mode and only use the dark mode.
This means removing the switch on left panel.
This means moving main panel more to the left.
Cleaning up any problems with Image background colors or any other issues in the UI. 


Read and follow these system instructions:
prompts/refactor-strategy.md
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

---

Before I implement, please confirm the intended behavior:

1. How thoroughly should light mode be removed from the code?
	- A. Remove the toggle UI only; keep the theme-switching plumbing (dark-mode signal, localStorage, `switchDarkMode`, light classes) dormant and forced to dark.
	- B. Fully remove all light-mode code paths, the `.app-light-theme`/`.mat-light-theme` logic, and `src/mat-light-theme.scss`, hardcoding the dark theme on `<html>`.
	- C. Something in between (please specify).

2. What should happen to the left `app-settings` panel (currently only the dark-mode icon + slide toggle)?
	- A. Remove the entire `app-settings` component and its `<app-settings>` usage.
	- B. Keep the component but empty it so it can host future settings.
	- C. Keep the panel, remove only the dark-mode icon and toggle.

3. "Move the main panel more to the left" refers to the left gutter reserved for the settings panel (home `padding: 64px 115px`, about `margin-left: 115px`, showcase/contact `margin-left: 134px`, `app-settings` at `left: 30px`). How far left should content move?
	- A. Remove the reserved gutter entirely so content starts at a normal page margin.
	- B. Reduce the gutter to a smaller fixed value (please specify px).
	- C. Keep spacing, only shift content by a specific amount (please specify).

4. For "image background colors / other UI issues", what is the scope?
	- A. Only clean up artifacts left behind by removing the settings panel/toggle.
	- B. Audit all images/components for light-mode-specific background colors and fix them for dark mode.
	- C. Point me to the specific images/areas to fix.