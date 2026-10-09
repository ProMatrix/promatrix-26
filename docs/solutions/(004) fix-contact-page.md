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
