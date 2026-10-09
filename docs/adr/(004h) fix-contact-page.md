This is a continuation from the file: (004g) fix-contact-page.md
My goal is to:
Fix!
Now I am seeing this error: "
message =
'Http failure response for http://127.0.0.1:5013/demo-promatrix-us/us-central1/sendSmtp: 500 Internal Server Error'"

Read and follow these system instructions:
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

---

## Investigation

The rename worked: the request now hits `.../us-central1/sendSmtp` and returns 500, which means the function is registered and running but failing internally. The 500 comes from either the "transport not configured" branch (missing `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS`) or, more likely now, the `catch` branch where `transport.sendMail(...)` throws (auth/connection error).

There is no emulator log file in the workspace; the failure reason is written only to the running emulator terminal, and the current code logs just `error.message` — not nodemailer's richer `code`, `command`, `response`, or `responseCode`. So the exact cause is not yet visible to me.

Key likely cause: the Firebase emulator loads `functions/.env` only at startup. If `functions/.env` was created or edited while `start-server` was already running, or if it still contains the `smtp.example.com` placeholder values from `functions/.env.example`, the SMTP send will fail with a connection/auth error and return 500. The actual secret values and the live emulator terminal output are not visible to the assistant.

## Clarifying Questions

1. After creating/editing `functions/.env`, did you stop and restart the emulator (re-run `npm run start-server`)? It only reads `.env` at startup.
	- A. Yes — I fully restarted it after saving `functions/.env`.
	- B. No / not sure — it may have been running when I edited `.env`.

2. Are the `functions/.env` values real provider settings (not the `smtp.example.com` / `your-smtp-...` placeholders from the example)?
	- A. Real values for a real SMTP account.
	- B. Still the placeholder values.

3. What does the emulator terminal show for the failing request (the `sendSmtp failed to deliver the contact email` log line)?
	- A. An auth failure (e.g. `EAUTH`, `535`, "Username and Password not accepted").
	- B. A connection failure (e.g. `ECONNECTION`, `ETIMEDOUT`, `ESOCKET`, `ENOTFOUND`).
	- C. Not sure — I will paste the exact line.

4. May I add clearer server-side diagnostics to pinpoint the cause — log nodemailer's `code`/`command`/`response`/`responseCode` and return a sanitized reason in the 500 body for local development only?
	- A. Yes, add the diagnostics so the real reason is visible, then I'll re-test.
	- B. No — I already know the cause (see my answer to Q3) and will fix the config.

5. Which SMTP provider and host/port/secure combination is in `functions/.env`? (Do not share the password.)
	- A. Gmail (`smtp.gmail.com`) — requires an App Password; use port 465 with `SMTP_SECURE=true`, or 587 with `SMTP_SECURE=false`.
	- B. Microsoft 365 / Outlook (`smtp.office365.com`, port 587, `SMTP_SECURE=false`).
	- C. Other — I will provide host/port/secure.