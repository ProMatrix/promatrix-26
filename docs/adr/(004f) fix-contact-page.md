This is a continuation from the file: (004e) fix-contact-page.md

Here are your answers:

## Clarifying Questions

1. How far should the rename to `sendSmtp` reach?
	- A. End-to-end: Firebase function export, local emulator URL path, `firebase.json` rewrite, the client `sendSms()` method, and the `postSendSms` property (renamed to `postSendSmtp`).
	- B. Backend + URL path only: rename `exports.sendSms`, `firebase.json`, and the env URL paths to `sendSmtp`, but keep the client method/property names unchanged.
	- C. Client method name only: rename the `sendSms()` method in the component, keep the backend function `sendSms`.

2. The production env URL points to the deployed Cloud Run function `sendsms-aytfenh5ja-uc.a.run.app`. Renaming the function changes that URL on redeploy. How do you want to handle production?
	- A. Change local only for now; leave the production URL as-is until you redeploy and give me the new URL.
	- B. Rename everywhere including production and I will redeploy functions; update the production URL to the new `sendsmtp-...` value afterward.
	- C. Keep the deployed function named `sendSms` (don't rename the export); only rename the client-side call.

3. The 500 is caused by a missing `functions/.env` (no SMTP credentials). How do you want to proceed on that part?
	- A. I will create `functions/.env` from `functions/.env.example` with real SMTP credentials myself (it's gitignored, so you won't see it) — no code change needed.
	- B. I have real credentials but it still fails — please add clearer server-side logging / error detail to diagnose.
	- C. I don't have SMTP credentials yet; leave the behavior as a 500 until I do.

---

Read and follow these system instructions:

C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md
