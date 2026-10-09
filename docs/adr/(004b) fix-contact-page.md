This is a continuation from the file: (004a) fix-contact-page.md

Here are your answers:

## Clarifying Questions

1. A.
2. A. Email it to: "admin@promatrixinc.com"
3. C.
4. A.
5. A. Yes, but I think I'm doing that when I use the script: "start-server". 
Verify this!


---

Read and follow these system instructions:

C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

---

## Verification Of Answer 5 (and a conflict with Answer 1)

Verified: `npm run start-server` runs `scripts/start-server.js`, which starts the Firebase functions emulator (`emulators:start --only functions`, port 5013 from `firebase.json`) and, once functions report ready, starts `ng serve` on port 4200. So yes — `start-server` launches both the functions emulator and the Angular dev server.

Conflict found: `scripts/start-server.js` launches the emulator with project id `demo-promatrix-us` (line 17), which already matches the environment URLs (`demo-promatrix-us`). The `promatrix-us` id only appears in the other script `scripts/start-firebase-emulators.js` (not used by `start-server`), the `firebase.json` hosting rewrites, and the deployed production URLs. This means Answer 1 (change the environment URLs to `promatrix-us`) would break the match when you run `start-server`, because `start-server` serves functions under `demo-promatrix-us`. The original "mismatch" only exists against the script you do not use.

Also relevant: the local emulator runs as a Firebase "demo-" project, which by convention does not use real cloud credentials or send real outbound traffic. That affects how/where email to `admin@promatrixinc.com` can actually be sent.

## Follow-up Questions

1. Given `start-server` already uses `demo-promatrix-us` (matching the environment), how should we reconcile the project id instead of the original Answer 1?
	- A. Keep local on `demo-promatrix-us`; update `scripts/start-firebase-emulators.js` to also use `demo-promatrix-us` so both emulator scripts agree. (Recommended — least disruptive; leaves your working `start-server` flow intact.)
	- B. Standardize everything local (environment URLs + `start-server.js`) on `promatrix-us` (your original Answer 1), and accept that `start-server` must change too.
	- C. Leave both scripts as-is; they intentionally differ.

2. How should the backend `sendSms` actually send the email to `admin@promatrixinc.com`?
	- A. Nodemailer over SMTP (you provide SMTP host + account; app password stored as an env var / secret, never in source).
	- B. SendGrid (or similar) HTTP API (you provide an API key stored as an env var / secret).
	- C. Firebase "Trigger Email" extension (writes the message to Firestore; the extension sends the mail).
	- D. You decide a reasonable default and document what credentials I must supply.

3. Where should real email actually be sent from, given the local emulator is a "demo-" project?
	- A. Send real email only in deployed production; in the local emulator just log/simulate the send and return success. (Recommended for local testing.)
	- B. Send real email even from the local emulator (requires real SMTP/API credentials available locally).
