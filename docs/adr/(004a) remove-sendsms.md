My goal is to:
to remove the functionality of sending a message from the contact page.
 I'm not happy with the complexity of the contact page and think I want to support an SMTP or an SMS messaging system.
I want to remove that functionality totally. And if this is the only reason why we need back-end support, I wanna remove all the back-end.
All the form for the send message can be removed and replaced with some kind of "please reach out" message.
Use the same look and feel from other pages, such as the "showcase" page. Notice how the text expands and emulate this behavior. Modify the contact angular page however necessary to achieve these goals.
Include one button that will open in another tab this page: "https://www.linkedin.com/company/promatrix-inc./home/"

Read and follow these system instructions:
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

---

## Clarifying Questions (Copilot)

Context found while investigating:
- The contact page is the only place in the Angular app that calls the backend. It POSTs to `environment.postSendSms` (the `sendSms` Firebase Function). The other functions (`helloWorld`, `getUtcDateTime`, `getAudioFromText`) are defined in `functions/index.js` but are never invoked by the app code — they are emulator placeholders.
- Firebase Hosting (`firebase.json`) is still used to serve the static Angular build; only Firebase **Functions** constitute the "back-end" that exists because of the contact form.

1. When you say "remove all the back-end," what should that cover?
	- A. Remove only the `sendSms` function; leave the other function placeholders and config.
	- B. Remove the entire `functions/` folder, the function rewrites in `firebase.json`, the backend URLs in the `environment*.ts` files, and `HttpClientModule` — but keep Firebase **Hosting** so the static site still deploys.
	- C. Remove everything including Firebase Hosting (I will host the site elsewhere).

2. What should the replacement "please reach out" message say?
	- A. Keep the existing marketing copy already on the contact page ("ProMatrix offers a rapid approach…") and just add a short "Please reach out" line plus the LinkedIn button.
	- B. Replace with a brief new "Let's connect — please reach out to ProMatrix" message that I will leave to your wording.
	- C. I will provide exact copy (paste it in the continuation ADR).

3. The LinkedIn button — label and placement?
	- A. A single prominent button labeled "Connect on LinkedIn" centered below the message, styled like the existing `mat-flat-button` theme.
	- B. Same as A but labeled "Visit us on LinkedIn".
	- C. Other (specify label/placement in the continuation ADR).

4. Besides LinkedIn, should the new contact page also show a direct contact method (e.g., an email `mailto:` link or phone number)?
	- A. No — LinkedIn button only.
	- B. Yes — add an email `mailto:` link (provide the address).
	- C. Yes — add email and phone (provide details).