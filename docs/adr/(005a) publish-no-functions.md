My goal is to:
Publish a new version of this web app.
This application has not been published for months and I'm not exactly sure how to do it.
also, there used to be "functions" that lived on the server, but we remove that functionality, so we only need to update the front-end server.
Examine this project structure and how to publish this application to firebase.
Also, remove anything that has to do with starting the server that was used for the "functions".
We only need to publish the Angular application.
I need you to tell me what script I run in order to publish this angular app to the firebase server.


Read and follow these system instructions:
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

---

Before implementing, I examined the project structure. Key findings:

- Publishing is already wired up: `npm run deploy-hosting` runs `build-production` and then `firebase deploy --only hosting --project promatrix-us`. `npm run deploy-all` just calls `deploy-hosting`.
- `firebase.json` only configures `hosting` (public folder `dist/pro-matrix-2024/browser`) plus local `emulators`. It no longer references `functions`, so deploys already skip functions.
- There is a leftover `functions/` folder that still contains `node_modules` and a `package-lock.json` for `firebase-admin` / `firebase-functions`, but no `package.json` or source — a remnant of the removed functions.
- The `start-server` npm script and `scripts/start-server.js` actually launch the Angular dev server (`ng serve`), not a functions backend. `scripts/start-firebase-emulators.js` starts the Firebase hosting emulator.

To avoid removing the wrong things, I have a few narrowing questions:

1. When you say "remove anything that has to do with starting the server that was used for the functions," what should I remove? (Note: `start-server.js` serves the Angular front-end locally via `ng serve`, it is not a functions backend.)
	- A. Full cleanup: remove the `functions/` folder, the `start-server` npm script, `scripts/start-server.js`, and `scripts/start-firebase-emulators.js`.
	- B. Remove the `functions/` folder and `scripts/start-firebase-emulators.js` only; keep `start-server.js` since it serves the Angular front-end locally.
	- C. Remove only the leftover `functions/` folder and leave all scripts in place.

2. Which command should be the official "publish to Firebase" script going forward?
	- A. Keep and use the existing `npm run deploy-hosting` (production build + `firebase deploy --only hosting --project promatrix-us`).
	- B. Keep that behavior but also add a simpler alias such as `npm run publish`.
	- C. Create a brand-new deploy script with different behavior.

3. The production build runs a `prebuild` step that auto-bumps the patch version (`npm version patch`) on every publish. Keep this auto-increment on publish?
	- A. Keep the auto-increment.
	- B. Remove the auto-increment and bump versions manually.

4. Should I also remove the functions-related emulator entries (`eventarc`, `tasks`) from the `emulators` block in `firebase.json`?
	- A. Yes, remove the functions-only emulator entries.
	- B. No, leave `firebase.json` emulators as-is.

I'll wait for your answers before making any implementation edits.