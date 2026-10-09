My goal is to:
Fix the contact page.
When I click the submit button, nothing happens.
Analyze the code and assess if this code could actually work.
Summarize what the functionality is and wWho the message is sent to.


Read and follow these system instructions:
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

---

## Analysis

Functionality: The Contact page collects an email/phone value, a message, and an Email/Phone toggle. `onclickSubmit()` builds `{ emailAddress, message, privateKey: Date.now() }` and POSTs it to `environment.postSendSms` via `HttpClient`. Success shows a thank-you message; failure sets `httpError` and shows an error banner.

Who the message is sent to: As written, nobody. The local emulator function `sendSms` (`functions/index.js`) is a stub that only logs whether the fields are present and returns `{ status: 'queued' }`. There is no email recipient, no SMS provider, no storage, and no forwarding. Production uses a separate deployed Cloud Run URL whose source is not in this repo.

Could it work / why "nothing happens":
- Definite bug: project-id mismatch. The environment URLs call `http://127.0.0.1:5013/demo-promatrix-us/...` but the emulator is launched with `--project promatrix-us` (`scripts/start-firebase-emulators.js`). The POST therefore targets a project id the emulator does not serve, the request fails, and the error branch runs.
- Secondary: if the emulator is not running, the POST fails the same way.
- Even after connectivity is fixed, the stub backend delivers the message to no one.

## Clarifying Questions

1. The root connectivity bug is the project-id mismatch (`demo-promatrix-us` in the environment URLs vs `promatrix-us` used to launch the emulator). How should I resolve it?
	- A. Change the environment URLs to `promatrix-us` (match the emulator launch).
	- B. Change the emulator launch to `demo-promatrix-us`.
	- C. Standardize on the Firebase hosting rewrite paths (e.g. `/promatrix-us/us-central1/sendSms`) instead of absolute emulator URLs.

2. The backend `sendSms` currently sends the message to no one. Where should a submitted message actually go?
	- A. Email it to a destination inbox (please provide the address / provider).
	- B. Send a real SMS via a provider such as Twilio (please provide account details later).
	- C. Store it (e.g. Firestore) for later retrieval.
	- D. Out of scope for now — just make the front end reach the stub successfully.

3. What is the scope of this fix?
	- A. Front end / config only — make the POST succeed against the existing stub.
	- B. Also implement real delivery in the `sendSms` function.
	- C. Both, in this ADR.

4. Error-handling UX when the backend is unavailable:
	- A. Keep the current behavior (show the error banner).
	- B. Improve it (clearer message, allow retry, re-enable the form).

5. For local development, should the Firebase emulator start automatically alongside the app?
	- A. Yes — wire it into an npm script so startup launches both the app and the emulator.
	- B. No — I'll start the emulator manually; just fix the code/config.