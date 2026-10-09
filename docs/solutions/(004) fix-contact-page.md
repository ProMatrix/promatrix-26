## Resolution

The ProMatrix contact form now delivers submissions as an email to `admin@promatrixinc.com`. The previous behavior — the Submit handler falling into its error branch / "nothing happening" — was rooted in the backend `sendSms` function being a no-op stub that sent the message to no one, combined with confusion over the local Firebase project id. The fix:

- Kept the local project id as `demo-promatrix-us` (decision: leave both emulator scripts as-is). `npm run start-server` already launches the functions emulator under `demo-promatrix-us`, which matches the environment URLs, so no front-end/config change was required for connectivity.
- Implemented real email delivery in `functions/index.js` using Nodemailer over SMTP. The function validates the request, builds an SMTP transport from environment variables, emails the submission to `admin@promatrixinc.com` (sets `replyTo` to the submitter only when the contact value is a valid email), and returns `status: 'sent'` on success or HTTP 500 on failure so the existing front-end error banner still works.
- Real email is sent from the local emulator too (decision), which the Firebase emulator supports by auto-loading `functions/.env`.

To make it actually send, copy `functions/.env.example` to `functions/.env` and fill in real SMTP credentials:

```
SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM, CONTACT_RECIPIENT
```

`functions/.env` is gitignored and must never be committed.

## Issue Resolved

Clicking Submit on the contact page appeared to do nothing, and a breakpoint showed execution reaching the error branch of `onclickSubmit()`. Analysis confirmed two problems: (1) the backend `sendSms` was a placeholder that returned `queued` without sending the message anywhere, so the form could never actually reach a human recipient; and (2) there was a project-id discrepancy between scripts. The request was to fix the form, summarize what it does and who the message goes to, and make it actually send email to `admin@promatrixinc.com`.

## Solution Details

- `functions/index.js`: `sendSms` rewritten as an async handler that trims and validates `emailAddress` and `message`, returns HTTP 400 on missing input, builds a Nodemailer SMTP transport via a new `createMailTransport()` helper (reads `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`), sends to `CONTACT_RECIPIENT` (default `admin@promatrixinc.com`) from `SMTP_FROM`/`SMTP_USER`, sets `replyTo` only when the contact value matches a basic email pattern, caps the message at 1000 chars, returns `status: 'sent'` on success and HTTP 500 on transport/missing-config failure. CORS handling is unchanged.
- `functions/package.json`: added `nodemailer` `6.10.1` dependency.
- `functions/.env.example`: new template documenting the required SMTP variables; `functions/.env` (gitignored) supplies real values and is auto-loaded by the emulator.
- Front end unchanged: environment URLs stay on `demo-promatrix-us` (matches `scripts/start-server.js`), and the existing error banner behavior is retained.
- Project-id scripts left as-is per decision: `scripts/start-server.js` uses `demo-promatrix-us`; `scripts/start-firebase-emulators.js` uses `promatrix-us`.

## Validation

- `npm.cmd --prefix functions install --no-audit --fund=false --loglevel=error` — installed dependencies successfully.
- `npm.cmd --prefix functions run lint` — loaded `functions/index.js` with no syntax/require errors, printed `functions ok`.
- Confirmed installed `nodemailer` version `6.10.1`.
- Verified `npm run start-server` (`scripts/start-server.js`) starts the functions emulator (`--only functions`, port 5013) under `demo-promatrix-us` and then `ng serve`, matching the environment URLs.

## Follow-up Risks or Limitations

- End-to-end email delivery was not exercised because it requires real SMTP credentials, which cannot be handled by the assistant. The user must create `functions/.env` from `functions/.env.example` and perform a live send test.
- If the production-deployed `sendSms` Cloud Run function (source not in this repo) differs, it must be updated/redeployed with the same SMTP configuration and secrets for production to send email.
- SMTP credentials must be provided as secrets/env vars only; never commit `functions/.env`.
- The contact value may be a phone number; in that case no SMS is sent (only an email with the phone number in the body). Real SMS delivery was explicitly out of scope.

## Rename To `sendSmtp` And 500 Resolution

The contact function was renamed end-to-end from `sendSms` to `sendSmtp`, and the HTTP 500 on submit was diagnosed as a missing `functions/.env` (no SMTP credentials), which the user resolved by adding the file. The rename was applied to the backend export, the Firebase rewrite, the client call, and the local environment URL paths; the deployed production URL value was intentionally left unchanged pending a future redeploy.

## Rename Issue Resolved

The user asked to rename the call from `sendSms` to `sendSmtp` and reported an HTTP 500 (`.../us-central1/sendSms: 500 Internal Server Error`) surfaced by the client-side error handler on submit. Investigation showed the 500 came from the server: with no `functions/.env`, `createMailTransport()` returned `null` and the function responded 500 by design. The user confirmed they added `functions/.env`, so no code change was needed for the 500 beyond the rename.

## Rename Solution Details

- `functions/index.js`: `exports.sendSms` renamed to `exports.sendSmtp`; associated log messages updated to `sendSmtp`.
- `firebase.json`: hosting rewrite `source` and `function` updated from `sendSms` to `sendSmtp`.
- `src/app/contact.component/contact.component.ts`: the `sendSms()` method renamed to `sendSmtp()`, its call site updated, and `environment.postSendSms` changed to `environment.postSendSmtp`.
- `src/environments/environment.ts` and `environment.development.ts`: property renamed to `postSendSmtp` and the URL path changed to `.../us-central1/sendSmtp`.
- `src/environments/environment.production.ts`: property renamed to `postSendSmtp`; the deployed URL value `https://sendsms-aytfenh5ja-uc.a.run.app` was kept as-is per the decision to change local only until a redeploy (answer 2A).
- `functions/.env.example`: header comment updated to reference `functions/sendSmtp`.

## Rename Validation

- `npm.cmd --prefix functions run lint` — loaded `functions/index.js` with no syntax/require errors; printed `functions ok`.
- `npm.cmd run build-development` (`ng build --configuration development`) — compiled with no TypeScript errors, confirming the renamed `postSendSmtp` property and `sendSmtp()` method resolve; output at `dist/pro-matrix-2024`.
- Workspace grep confirmed no remaining `sendSms`/`postSendSms` references in `src/`, `functions/`, or `firebase.json`.

## Rename Follow-up Risks or Limitations

- The emulator must be restarted (`npm run start-server`) so the renamed `sendSmtp` function registers at the new URL path before testing.
- Production still references the old deployed function URL (`sendsms-...`). When the function is redeployed as `sendSmtp`, its Cloud Run URL changes and `environment.production.ts` must be updated to the new `sendsmtp-...` value; until then production points at the old endpoint.
- The 500 depended on the user's `functions/.env`; if it recurs, verify the SMTP host/credentials and connectivity, since those values are not visible to the assistant.

## SMTP TLS Fix ("Greeting never received" 500)

The `sendSmtp` 500 was caused by a TLS mode mismatch. The user's `functions/.env` used `SMTP_HOST=netsol-smtp-oxcs.hostingplatform.com`, `SMTP_PORT=465`, `SMTP_SECURE=StartTLS`. Port 465 requires implicit TLS (`secure: true`), but the loose value `StartTLS` was parsed as non-`true`, so the transport used `secure: false`. On a 465 port with `secure:false`, nodemailer waited for a plaintext SMTP greeting while the server expected an immediate TLS handshake, producing nodemailer's `Greeting never received` error after a 30-second timeout and returning HTTP 500. STARTTLS is a port-587 mechanism, not port 465.

The fix makes TLS selection robust and port-driven, adds fail-fast timeouts, and surfaces the real error locally.

## SMTP TLS Issue Resolved

After the rename, submitting still returned `.../sendSmtp: 500 Internal Server Error`. The emulator log showed `Greeting never received` and a ~30s duration, confirming a TLS handshake mismatch rather than an auth failure. The user had restarted the emulator and used real credentials, so the remaining problem was the `secure` setting for port 465.

## SMTP TLS Solution Details

- `functions/index.js` `createMailTransport()`: `secure` now honors an explicit `true`/`false` in `SMTP_SECURE`, and otherwise derives from the port (`port === 465` ⇒ implicit TLS). This makes a loose value like `StartTLS` resolve correctly to `secure: true` at port 465 instead of silently disabling TLS. Added `greetingTimeout: 15000` and `connectionTimeout: 15000` so a misconfigured TLS mode fails in ~15s instead of hanging ~30s.
- `functions/index.js` `sendSmtp` catch block: now logs nodemailer's `code`, `command`, `response`, and `responseCode` alongside the message, and — only when running under the emulator (`FUNCTIONS_EMULATOR === 'true'`) — includes `reason` and `code` in the 500 JSON body so the underlying cause is visible locally without leaking details in production.
- `functions/.env.example`: added a comment documenting that port 465 uses implicit TLS (`SMTP_SECURE=true`) while port 587 uses STARTTLS (`SMTP_SECURE=false`).

## SMTP TLS Validation

- `npm.cmd --prefix functions run lint` — loaded `functions/index.js` with no syntax/require errors; printed `functions ok`.
- Deterministic reasoning: with `SMTP_PORT=465` and `SMTP_SECURE=StartTLS`, the new logic yields `secure = true` (because `starttls` is neither `true` nor `false`, so it falls back to `port === 465`), which is the correct implicit-TLS mode for port 465.

## SMTP TLS Follow-up Risks or Limitations

- The user must restart the emulator (`npm run start-server`) to load the updated function code before re-testing. For clarity, setting `SMTP_SECURE=true` in `functions/.env` is recommended (the code now handles it either way at port 465).
- If the provider actually expects STARTTLS, switch to `SMTP_PORT=587` with `SMTP_SECURE=false` instead of 465.
- A successful end-to-end send still depends on correct host/credentials and outbound SMTP connectivity, which are not visible to the assistant; the emulator-only `reason`/`code` in the 500 body will reveal any remaining auth/connection errors.
