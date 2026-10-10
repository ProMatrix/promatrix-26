## How to publish this app to Firebase

Run a single npm script from the project root:

```
npm run publish
```

`publish` does three things in order, matching the chosen workflow (answer 5-A):

1. **Production build** — via `deploy-hosting` → `build-production`, which first runs `prebuild` (`npm --no-git-tag-version version patch`, auto-incrementing the patch version) and then `ng build` (production is the default configuration) into `dist/pro-matrix-2024/browser`.
2. **Deploy to live Firebase Hosting** — `firebase deploy --only hosting --project promatrix-us` using the locally installed `firebase-tools`.
3. **Open the live site** — launches `https://promatrix-us.web.app` so you can confirm the release.

There are no server-side Functions to deploy anymore; Hosting is the only deploy target. If you prefer not to open the browser automatically, `npm run deploy-hosting` performs just the build-and-deploy steps.

Prerequisite: you must be authenticated to Firebase once on the machine. If the deploy reports an auth error, run `node ./node_modules/firebase-tools/lib/bin/firebase.js login` and then re-run `npm run publish`.

## Issue Resolved

The ProMatrix Angular web app had not been published for months and the owner was unsure of the current publish procedure. The project also still carried leftovers from a removed Firebase Functions backend (a `functions/` folder, a `start-server` launcher, a Functions emulator launcher, and Functions-only emulator ports), which no longer serve any purpose now that only the Angular front-end is deployed. The goal was to (1) provide a single clear publish command and (2) remove the dead Functions/server tooling, publishing only the Angular application.

## Solution Details

Decisions came from the (005a)–(005c) ADR narrowing (answers: 1-A full cleanup, 2-C new deploy script, 3-A keep auto-increment, 4-A remove Functions emulator entries, 5-A build → deploy live → open site).

- [package.json](../../package.json)
  - Removed the `start-server` script (`node scripts/start-server.js`).
  - Added `publish`: `npm run deploy-hosting && npm run launch-hosting-from-firebase` — production build, live Hosting deploy, then open the live site. Reuses the existing `deploy-hosting` and `launch-hosting-from-firebase` scripts.
  - Kept the `prebuild` auto patch-version bump (answer 3-A).
- [firebase.json](../../firebase.json) — removed the Functions-only emulator entries `eventarc` (port 9312) and `tasks` (port 9512) from the `emulators` block; kept `hub`, `hosting`, `ui`, `logging`, and `singleProjectMode`. Hosting config and the SPA rewrite were unchanged.
- Deleted `scripts/start-server.js` (Angular dev-server launcher that was labeled the "server").
- Deleted `scripts/start-firebase-emulators.js` (hosting/functions emulator launcher).
- Deleted the leftover `functions/` folder (contained only `node_modules` and `package-lock.json` for `firebase-admin`/`firebase-functions`, no source).

Local Angular development is unaffected: `npm run start-client` (and `start-2`) still run `ng serve`.

## Validation

- `grep` across the repo (excluding `node_modules`) for `start-server|start-firebase-emulators|functions|emulators|eventarc|tasks` confirmed no remaining references in build/config/code (`.vscode/tasks.json`, HTML files, and READMEs were clean; remaining hits are only historical ADR/solution docs).
- Confirmed deletions: `functions/` no longer exists and the `scripts/` folder no longer contains the two launchers.
- Ran `ng build --configuration production` — completed successfully ("Application bundle generation complete", exit code 0) with output to `dist/pro-matrix-2024`, verifying the production build still compiles after the changes.
- Reviewed the final `package.json` scripts and `firebase.json` to confirm the intended edits.

## Follow-up Risks or Limitations

- `npm run publish` does not run the firebase deploy here; a real publish requires network access and a valid Firebase login on the machine. If not logged in, run `firebase login` (via the local CLI) first.
- The `launch-hosting-from-firebase` step uses `start chrome ...`, which assumes Chrome is installed on a Windows shell (the repo's `.npmrc` sets `script-shell=cmd.exe`). On a machine without Chrome, use `npm run deploy-hosting` instead and open the site manually.
- The kept `prebuild` step bumps the patch version on every build/publish, so the `version` in `package.json` will increment each time you publish — intended, but worth noting for version tracking.
- Firebase project/site targets remain `promatrix-us`; publishing to a different project would require updating the `--project` flag.
