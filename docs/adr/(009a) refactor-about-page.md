My goal is to:
Hello
Refactor the "about" page.
Follow the same basic outline that we did with previous pages, this means using the same technology stack but introducing some other technologies such as single page applications using Angular React in view. Integration with external platforms such as Microsoft 365 Dynamics and Fabric.
No new images are needed on this page. Use what is already there.
Unless you think it's important to add a new section.

Change the name of the first section to ProMatrix AI Solutions. And use that name throughout content.

Read and follow these system instructions:
prompts/refactor-strategy.md
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

---

Before implementing, I need to narrow this request. The about page is marketing content rendered in `src/app/about.component/about.component.html`. Its current sections are: Company Profile, ProMatrix AI Strategies (image `home-page-neuro-1@2x.png`), Automation, Integration, Innovation, Courses & Training, and Founder (headshot + David Donovan bio with music links). Refactoring will re-theme this copy around Microsoft technologies, mirroring the home and showcase page refactors.

1. What is the scope of this change?
	- A. Content only — rewrite the marketing copy, titles, and Microsoft technology mentions in `about.component.html` (no routing, SCSS, or live AI wiring).
	- B. Content plus light structural/SCSS work if a new section is added.
	- C. Content plus functional wiring (actual Dynamics 365 / Fabric / Copilot integrations).

2. "Change the name of the first section to ProMatrix AI Solutions" — which section do you mean?
	- A. The literal first section, currently "Company Profile".
	- B. The first AI-branded section, currently "ProMatrix AI Strategies" (this matches the showcase page rename to "ProMatrix AI Solutions").
	- C. Add a new leading "ProMatrix AI Solutions" section above the current Company Profile.

3. Which sections should the refactor keep?
	- A. Keep and re-theme all current sections (Company Profile, AI Strategies→Solutions, Automation, Integration, Innovation, Courses & Training, Founder) around Microsoft tech.
	- B. Keep all of the above and add one new section (e.g., Microsoft 365 Dynamics & Fabric integration).
	- C. I'll specify exactly which sections to add or remove.

4. The request mentions "single page applications using Angular React" — how should SPA / Angular / React be presented?
	- A. Mention in content only (describe the SPA capability and the Angular + React stack).
	- B. Mention plus specific technical detail (hydration, micro-frontends, component libraries).
	- C. Keep Angular as the named stack and omit React.

5. For "Microsoft 365 Dynamics and Fabric" integration, how specific should the copy be?
	- A. Broad mentions only (Microsoft 365, Dynamics 365, Microsoft Fabric, Copilot, Teams, SharePoint, Power Automate).
	- B. Broad mentions plus specific capabilities (Fabric OneLake / data pipelines, Dynamics 365 connectors, Copilot Studio agents).
	- C. You'll specify which products each section should name.

6. How should the existing images be handled?
	- A. Keep every existing image exactly where it is and only change the text.
	- B. Keep existing images but reuse one of them if a new section is added.
	- C. Other (you'll specify).

7. The Founder section (David Donovan bio, Pluralsight/Udemy/LinkedIn, YouTube/Amazon music links) — keep it?
	- A. Keep it as-is.
	- B. Keep the bio but refresh the wording toward the Microsoft focus.
	- C. Remove the personal/music content.