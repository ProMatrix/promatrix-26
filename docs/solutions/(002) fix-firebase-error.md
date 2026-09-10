## Implementation Result

`start-server` now uses the same durable Firebase CLI pattern as `ai-voice-live-realtime`: it runs Firebase through the project-local `firebase-tools` package with Node instead of depending on a globally installed `firebase` command. The script also starts both Hosting and Functions emulators, matching the selected ADR answer.

Run it from the repo root with:

```cmd
npm.cmd run start-server
```

The local app is served by Firebase Hosting at `http://127.0.0.1:5002/`, the Emulator UI is at `http://127.0.0.1:4002/`, and the Functions emulator runs at `http://127.0.0.1:5003/`.

## Issue Resolved

The previous `start-server` script ran `firebase serve --only functions`. That failed because `firebase` was not installed globally or available on `PATH`. The workspace also had `firebase.json` pointing to a missing `functions` source folder, so even a working CLI would not have had local function definitions to load.

The Angular build also failed during validation because `home.component.ts` imported an unused generated type from the absolute path `C:/ProMatrix.2/anima-to-angular/frame/src/controlModel`. That stale import prevented Hosting from getting a local build to serve.

## Solution Details

Updated `package.json` so `start-server` now builds the Angular app, installs the local Functions dependencies, and starts Firebase through `scripts/start-firebase-emulators.js`. Added `firebase-tools` as a root dev dependency and added a helper `npm-functions` script.

Added `scripts/start-firebase-emulators.js`, adapted from the working pattern in `ai-voice-live-realtime`. It invokes `node ./node_modules/firebase-tools/lib/bin/firebase.js emulators:start --only hosting,functions --project promatrix-us`, sets `FUNCTIONS_EMULATOR=true`, and raises `FUNCTIONS_DISCOVERY_TIMEOUT` to 30 seconds.

Added a local `functions` package with `firebase-functions` and `firebase-admin`, plus function exports that match the existing frontend environment URLs: `helloWorld`, `getUtcDateTime`, `sendSms`, and `getAudioFromText`.

Updated `firebase.json` to use the local `functions` source, run Hosting and Functions emulators together, and avoid default emulator ports that failed in this Windows session. Hosting now runs on 5002, Functions on 5003, UI on 4002, Hub on 4402, and Logging on 4502.

Updated development environment URLs to call the Hosting emulator on port 5002, where Firebase rewrites the existing `/promatrix-us/us-central1/...` paths to the local Functions emulator.

Removed the unused absolute `controlModel` import and unused `page` field from `home.component.ts` so Angular builds work on this machine.

## Validation

Reproduced the original `start-server` failure: `firebase` was not recognized as an internal or external command.

Installed root and Functions dependencies with `npm.cmd install` and `npm.cmd --prefix ".\functions" install`; both completed successfully.

Ran `npm.cmd --prefix ".\functions" run lint`; it loaded `functions/index.js` and printed `functions ok`.

Ran `npm.cmd run build-development`; after removing the stale absolute import, the Angular development build completed successfully and produced `dist/pro-matrix-2024`.

Ran `npm.cmd run start-server`; it completed the build and Functions install, loaded function definitions for `helloWorld`, `getUtcDateTime`, `sendSms`, and `getAudioFromText`, and reached `All emulators ready`. Firebase reported Hosting at `127.0.0.1:5002`, Functions at `127.0.0.1:5003`, and Emulator UI at `127.0.0.1:4002`.

Checked editor diagnostics for the changed JSON, JavaScript, TypeScript, and environment files; no errors were reported.

## Follow-up Risks or Limitations

The local machine is running Node `v26.8.2`, while the Functions package declares Firebase runtime Node `22`. The install and emulator startup succeed because `functions/.npmrc` sets `engine-strict=false`, but Firebase warns that the local host Node version does not match the requested runtime.

Firebase also warns that the CLI is not authenticated, so Admin SDK configuration and hosted app config cannot be fetched locally. The emulator still starts, but production-like Firebase Admin behavior may require `firebase login`.

The new local `sendSms` and `getAudioFromText` functions are emulator-oriented placeholders. `sendSms` returns a queued status without sending a real SMS, and `getAudioFromText` returns a 501 response. Do not treat these as final production function implementations without replacing them with the real service logic.

This repo's `.gitignore` ignores `package-lock.json`, so npm generated local lockfiles during install but they are not part of the durable workspace changes.

## Implementation Result

`promatrix-26` is now aligned to the same Angular 22/Firebase generation used by `ai-voice-live-realtime`, while preserving the existing ProMatrix NgModule application shape. The root Angular framework packages are pinned to `22.1.1`, Angular CLI/build tooling is pinned to `22.1.3`, TypeScript is on `~6.0.3`, Firebase client/tooling is pinned to `firebase` `12.17.1` and `firebase-tools` `15.26.0`, and Functions dependencies are pinned to `firebase-admin` `14.2.0` plus `firebase-functions` `7.3.2`.

Run the updated local workflow from the `promatrix-26` repo root with:

```cmd
npm.cmd run start-server
```

The workflow installs Functions dependencies, starts the Firebase Functions emulator, waits for Functions readiness, then starts Angular's dev server. The app is served at `http://127.0.0.1:4200/`, the Functions emulator runs at `http://127.0.0.1:5013/`, and the Emulator UI is at `http://127.0.0.1:4012/`.

## Issue Resolved

The ADR request was to refactor `promatrix-26` to the same Node/Angular generation as `ai-voice-live-realtime` and fix the current `start-server` workflow using the working project as the reference. Before this step, `promatrix-26` still used Angular 18 packages and `@angular-devkit/build-angular` builders. After moving to Angular 22, Angular also surfaced the framework default change where components are standalone unless explicitly marked otherwise, which broke the existing NgModule declarations until corrected.

The previous local emulator ports also became unavailable during validation, causing Firebase to shut down with `Could not start emulator hub, port taken`. The local development URLs still targeted the old Firebase Hosting emulator shape, while the selected answer requested adopting the working project's Angular-dev-server plus Functions-emulator startup pattern.

## Solution Details

Updated `package.json` to match the reference generation: Angular framework and Material/CDK packages at `22.1.1`, `@angular/build` and `@angular/cli` at `22.1.3`, `@angular/compiler-cli` at `22.1.1`, `typescript` at `~6.0.3`, `firebase` at `12.17.1`, `firebase-tools` at `15.26.0`, and `packageManager` set to `npm@12.0.2`. The deploy scripts now use the project-local Firebase CLI through Node instead of a global `firebase` command.

Updated `angular.json` from the Angular 18 `@angular-devkit/build-angular` builders to Angular 22 `@angular/build` builders and added the same npm package-manager CLI metadata used by the reference project.

Kept the existing NgModule architecture by adding `standalone: false` to `AppComponent`, `FooterComponent`, `SettingsComponent`, `ContactComponent`, `HomeComponent`, `ShowcaseComponent`, and `AboutComponent`.

Added `scripts/start-server.js` as the Node-owned coordinator for the local development workflow. It installs Functions dependencies with npm, starts Firebase Functions through the local `firebase-tools` package, forwards child-process output with prefixes, detects Functions readiness from raw output chunks, and then starts Angular dev server at `127.0.0.1:4200`.

Updated `firebase.json` emulator ports to a fresh local set: Hub `4412`, Hosting `5012`, Functions `5013`, UI `4012`, Logging `4512`, Eventarc `9312`, and Tasks `9512`. Updated development environment URLs to call the Functions emulator directly on `http://127.0.0.1:5013/promatrix-us/us-central1/...`.

Pinned `functions/package.json` Firebase dependencies to the exact versions resolved by the working project: `firebase-admin` `14.2.0` and `firebase-functions` `7.3.2`.

## Validation

Regenerated root and Functions npm install state after the version changes. Verified installed root packages included `@angular/core` `22.1.1`, `@angular/material` `22.1.1`, `@angular/build` `22.1.3`, `firebase` `12.17.1`, and `firebase-tools` `15.26.0`. Verified Functions packages included `firebase-admin` `14.2.0` and `firebase-functions` `7.3.2`.

Ran `npm.cmd run build-development`; Angular completed the development build successfully and wrote `dist/pro-matrix-2024`. The remaining build output contained Sass `@import` deprecation warnings only.

Ran `npm.cmd run start-server`; the script installed Functions dependencies, loaded function definitions for `helloWorld`, `getUtcDateTime`, `sendSms`, and `getAudioFromText`, reached `All emulators ready`, and started Angular dev server at `http://127.0.0.1:4200/`.

Fetched `http://127.0.0.1:5013/promatrix-us/us-central1/getUtcDateTime`; it returned JSON with `status: "ok"`. Fetched `http://127.0.0.1:4200/`; it returned the ProMatrix app page content.

Checked editor diagnostics for the changed JSON and JavaScript files; no errors were reported there. The editor still reported a stale `@angular/forms` import error in `app.module.ts`, but the package is installed and the Angular 22 build completed successfully.

## Follow-up Risks or Limitations

The current machine is running Node `v26.8.2` and npm `11.19.1`. Angular 22 accepts Node 26, but the Functions package declares runtime Node `22`, so Firebase warns that it is using host Node 26 locally. The project metadata now matches the reference `packageManager` value `npm@12.0.2`, but this terminal still ran npm 11.19.1.

Firebase warns that the CLI is not authenticated, so Admin SDK configuration may be incomplete locally until `firebase login` is run.

Npm reported moderate audit findings and install-script approval warnings for generated dependencies. Those warnings were not required to complete this ADR but should be reviewed separately if this repo is being prepared for release.

The Sass `@import` warnings come from existing stylesheet imports and will need a later Sass module-system migration before Dart Sass 3.0 removes `@import` support.

The local `sendSms` and `getAudioFromText` functions remain emulator-oriented placeholders from the earlier ADR step; this refactor did not replace them with production service implementations.

## Implementation Result

`npm.cmd run start-server` now starts without the warning series that appeared during the ADR validation run. The launcher keeps the `ai-voice-live-realtime` pattern of starting Firebase Functions first and Angular hosting after Functions readiness, but it no longer runs `npm install` on every server start.

The local Functions emulator now runs through the Functions package's local Node 22 runtime and uses Firebase's emulator-only demo project ID, `demo-promatrix-us`. That removes the Firebase auth/Admin SDK/non-emulated-service warnings while keeping production deploy scripts pointed at `promatrix-us`.

The Angular dev-server launch now detects whether port `4200` is already occupied. If it is, `start-server` uses the next available port instead of failing with Angular's port-in-use exception.

The Sass deprecation warnings from Angular's build were also removed by replacing the remaining SCSS `@import` rules in `src/styles.scss` with Sass module `@use` rules.

## Issue Resolved

Running `npm.cmd run start-server` printed several warning groups: npm engine/install-script/audit output from installing Functions dependencies during every launch, Firebase real-project warnings when running unauthenticated locally, a Firebase Node runtime mismatch warning on machines using Node 26, Angular's port-in-use failure when another dev server already owned `4200`, and Sass `@import` deprecation warnings from the global stylesheet build.

The requested outcome was to fix those warnings, using `ai-voice-live-realtime` as the working launcher reference and allowing dependency updates where needed.

## Solution Details

Updated `scripts/start-server.js` so it validates required local dependencies instead of invoking `npm install` during startup. Missing root or Functions dependencies now produce a direct instruction to run `npm.cmd install` or `npm.cmd run npm-functions` before starting the server.

Added a local Node 22 runtime dependency to `functions/package.json` and changed `start-server` to launch Firebase CLI with `functions/node_modules/node/bin/node.exe`. This keeps `functions/package.json` on Firebase runtime Node `22` while preventing the local Node 26 mismatch warning.

Changed local Functions emulator startup to use `--project demo-promatrix-us`. Updated `src/environments/environment.ts` and `src/environments/environment.development.ts` so local function calls target `http://127.0.0.1:5013/demo-promatrix-us/us-central1/...`. Production environment URLs and deploy scripts still use the real Firebase project.

Updated the root `npm-functions` helper to install Functions dependencies with `--no-audit --fund=false --loglevel=error`, added `node` `22.23.2` under Functions dev dependencies, and updated the root Firebase CLI dev dependency to `firebase-tools` `15.30.0`.

Converted the SCSS imports for `assets/mat-controls`, `mat-light-theme`, and `mat-dark-theme` in `src/styles.scss` to `@use` rules. The CSS imports remain plain CSS imports because they were not the source of the Sass deprecation warnings.

## Validation

Ran `npm.cmd run npm-functions`; it installed the new Functions runtime dependency and completed without warnings or errors.

Ran `node --check scripts/start-server.js`; the launcher parsed successfully.

Ran `npm.cmd install --no-audit --fund=false --loglevel=error`; the root install metadata was already up to date and completed without warnings or errors.

Ran `npm.cmd run start-server`; Firebase Functions started with `demo-promatrix-us`, loaded `helloWorld`, `getUtcDateTime`, `sendSms`, and `getAudioFromText`, reported `Using node@22 from host`, reached `All emulators ready`, and Angular completed the dev-server build without Sass warnings. Because another dev server already owned `4200`, the launcher used `http://127.0.0.1:4201/` for this validation run.

Requested `http://127.0.0.1:5013/demo-promatrix-us/us-central1/getUtcDateTime`; it returned `status: "ok"`, a current `timeAndDate`, and `machineName: "getUtcDateTime"`. Requested `http://127.0.0.1:4201/`; it returned HTTP `200`.

Checked editor diagnostics for `scripts/start-server.js`, `src/styles.scss`, `src/environments/environment.ts`, `src/environments/environment.development.ts`, `package.json`, and `functions/package.json`; no errors were reported.

## Follow-up Risks or Limitations

The local emulator now intentionally uses `demo-promatrix-us`. This is safer and warning-free for local emulation, but any local code that tries to call a non-emulated Firebase service for that demo project will fail instead of reaching production.

`start-server` no longer installs Functions dependencies automatically. After a clean clone or dependency change, run `npm.cmd install` at the repo root and `npm.cmd run npm-functions` before `npm.cmd run start-server`.

Port `4200` remains the preferred Angular port. If it is already in use, the launcher reports the alternate port it selected; browser shortcuts that hard-code `4200` may still point at whichever process owns that port.