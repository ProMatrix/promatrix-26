## Decision

The message-sending feature was removed from the Contact page and replaced with a showcase-style "Let's Connect" layout plus a single "Connect on LinkedIn" button that opens `https://www.linkedin.com/company/promatrix-inc./home/` in a new tab. Because the contact form's `sendSms` call was the only live use of the backend, the entire Firebase **Functions** backend was removed while Firebase **Hosting** was retained so the static Angular site still deploys.

Answers that drove the implementation: (1) B — remove the full Functions backend but keep Hosting; (2) A — keep the existing marketing copy and add a short "please reach out" line; (3) A — one centered "Connect on LinkedIn" button styled like the existing `mat-flat-button`; (4) A — LinkedIn button only, no email/phone.

## Issue Resolved

The Contact page carried unwanted complexity: an email/phone toggle, validated form controls, and an HTTP POST to a `sendSms` Firebase Function. The owner wanted the send-message capability gone entirely, and — since it was the sole reason the backend existed — wanted the backend removed too, with a simpler "please reach out" presentation consistent with the rest of the site (notably the Showcase page's expanding-text look and feel).

## Solution Details

Frontend (Contact page):
- [src/app/contact.component/contact.component.ts](src/app/contact.component/contact.component.ts) — stripped `FormControl`/`Validators`, `HttpClient`, `environment`, and the `sendSms` logic. Now only injects `AppServices` and exposes `linkedInUrl`.
- [src/app/contact.component/contact.component.html](src/app/contact.component/contact.component.html) — replaced the form with a Showcase-style `ui-expanding-container`: a "Let's Connect" title, the retained marketing copy, a "Please reach out" message, and a `Connect on LinkedIn` anchor button (`target="_blank" rel="noopener noreferrer"`).
- [src/app/contact.component/contact.component.scss](src/app/contact.component/contact.component.scss) — rewritten to mirror the Showcase flex layout (`ui-expanding-container`, rationale blocks, spacer/frame, centered LinkedIn button) and drop all form-specific styles.

Backend removal:
- Deleted the `functions/` folder (Firebase Functions source).
- [firebase.json](firebase.json) — removed the four function rewrites, the `functions` config block, and the `functions` emulator port; kept Hosting and its SPA rewrite.
- [src/app/app.module.ts](src/app/app.module.ts) — removed `HttpClientModule`.
- [src/environments/environment.ts](src/environments/environment.ts), [src/environments/environment.development.ts](src/environments/environment.development.ts), [src/environments/environment.production.ts](src/environments/environment.production.ts) — removed the `getHelloWorld`, `getUtcDateTime`, `postSendSms`, and `getAudioFromText` URLs.
- [package.json](package.json) — removed `npm-functions` and `deploy-functions` scripts and the `launch-get-function-from-firebase` script; `deploy-all` now runs only `deploy-hosting`.
- [scripts/start-server.js](scripts/start-server.js) — removed Functions-emulator startup/readiness orchestration; now starts only the Angular dev server with the existing port-selection logic.
- [scripts/start-firebase-emulators.js](scripts/start-firebase-emulators.js) — emulator target changed from `hosting,functions` to `hosting`.

## Validation

- Ran `npm.cmd run build-development`; the Angular build succeeded with no compiler or TypeScript errors.
- `get_errors` on the contact component, `app.module.ts`, `environment.ts`, and `firebase.json` reported no errors.
- `grep_search` across `src/`, `scripts/`, `package.json`, and `firebase.json` for `postSendSms|getAudioFromText|getHelloWorld|getUtcDateTime|HttpClient|npm-functions|deploy-functions|functions/` returned no matches.
- Confirmed the `functions/` folder no longer exists.

## Follow-up Risks or Limitations

- Firebase Hosting is intentionally retained; if the site is hosted elsewhere, further Hosting/emulator cleanup would be needed.
- If a messaging capability (SMTP or SMS) is reintroduced later, the backend wiring (`HttpClientModule`, environment URLs, Functions, firebase.json rewrites, and startup scripts) will need to be re-added.
- The LinkedIn URL is hard-coded in the component; update `linkedInUrl` if the company page changes.
- Documentation/links outside the app (e.g., `project-links.html`) still reference old function URLs and were left untouched since they are not part of the app build.
