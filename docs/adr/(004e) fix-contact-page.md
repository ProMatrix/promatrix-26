This is a continuation from the file: (004d) fix-contact-page.md
My goal is to:
Fix the contact page.
1) Change the name of the call from: "SendSms" to: "SendSmtp".
2) Also when I collect the "submit" button, after a delay, I get this error message:'Http failure response for http://127.0.0.1:5013/demo-promatrix-us/us-central1/sendSms: 500 Internal Server Error'

The message is from a breakpoint that I put in the contact component, which means it's client side error handling.


Read and follow these system instructions:
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

---

## Investigation

Root cause of the 500: `functions/.env` does not exist in the workspace. With `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` unset, `createMailTransport()` returns `null` and `sendSms` intentionally responds with HTTP 500 ("Email transport is not configured"). The client then surfaces that 500 in its error handler. This is a configuration gap (missing real SMTP credentials), not a code defect. The actual secret values cannot be supplied by the assistant.

Rename scope: `sendSms` currently appears in `functions/index.js` (`exports.sendSms`), `firebase.json` (rewrite source + `"function": "sendSms"`), `src/app/contact.component/contact.component.ts` (the `sendSms()` method and `environment.postSendSms`), the local env URLs (`.../us-central1/sendSms`), and the production env URL (`https://sendsms-aytfenh5ja-uc.a.run.app`, a deployed Cloud Run URL). Renaming the deployed function changes its production URL, which is a breaking change until redeployed.

## Clarifying Questions

1. A.
2. A.
3. A. I have already added the "functions/.env" file