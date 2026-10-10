This is a continuation from the file: (005a) publish-no-functions.md

Here are your answers:

1. A.
2. C.
3. A.
4. A.

Read and follow these system instructions:

C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

---

Thanks — answers 1 (full cleanup), 3 (keep auto-increment), and 4 (remove functions emulator entries) are clear.

Answer 2 is "C. Create a brand-new deploy script with different behavior," but that does not specify the behavior. One more narrowing question so I build the right script:

5. What should the brand-new deploy script do (how should it differ from the existing `deploy-hosting`)?
	- A. Name it `publish`: production build → deploy to live hosting → then automatically open the live site (`https://promatrix-us.web.app`).
	- B. Name it `publish:preview`: production build → deploy to a temporary Firebase Hosting preview channel (`firebase hosting:channel:deploy`) instead of live, so you can review the build before promoting it to live.
	- C. Name it `publish`: production build → deploy to live hosting, but with an explicit confirmation prompt before the deploy runs.
	- D. A different behavior — please describe what the new script should do.

I'll wait for your answer to question 5 before making any implementation edits.
