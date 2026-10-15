My goal is to:
Refactor the "contact" page in the same way as previously refactored pages.

Read and follow these system instructions:
prompts/refactor-strategy.md
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

---

Before implementing, I need to narrow this request. The contact page is marketing content rendered in `src/app/contact.component/contact.component.html`. It has a "Let's Connect" title, a rationale paragraph (currently mentions "low-cost, low-code solutions", "integration with AI, multiple languages, help desks, and contact centers", and "compatibility with major services like GCP, Azure, and AWS"), a "reach out" line, and a "Connect on LinkedIn" button. The staggered reveal animation and button are wired in `contact.component.ts`. The previous page refactors (home, showcase, about) were content-only: re-theme the copy onto the Microsoft stack, keep existing class hooks/images/behavior, and remove Google/AWS mentions.

1. What is the scope of this change?
	- A. Content only — rewrite the "Let's Connect" copy to re-theme onto Microsoft technologies (no routing, SCSS, or behavior changes); matches the prior page refactors.
	- B. Content plus light structural/SCSS work if a new contact element is added.
	- C. Content plus functional wiring (e.g., a real contact form or scheduling integration).

2. The copy currently name-drops "GCP, Azure, and AWS." How should that be handled?
	- A. Replace with Microsoft-only (e.g., "Microsoft Azure, Microsoft 365, and Microsoft Fabric").
	- B. Keep Azure, drop GCP and AWS.
	- C. You'll specify the exact wording.

3. How should the generic offerings (low-code, AI, multiple languages, help desks, contact centers) be re-themed?
	- A. Map to Microsoft equivalents (Power Platform / Power Apps low-code, Microsoft Copilot & Copilot Studio agents, Azure AI Translator, Dynamics 365 Customer Service for help desks / contact centers).
	- B. Broad mentions only (Microsoft 365, Copilot, Power Platform) without the specific product names.
	- C. You'll specify per-offering.

4. Should the "ProMatrix AI Solutions" branding (used on the about and showcase pages) appear in the contact copy?
	- A. Yes, weave "ProMatrix AI Solutions" into the rationale for consistency.
	- B. No, keep the contact copy product-name-neutral.

5. The "Connect on LinkedIn" button, LinkedIn URL, and staggered reveal animation — keep as-is?
	- A. Keep all of it exactly as-is (only change the descriptive text).
	- B. Keep the button but adjust the animation/reveal.
	- C. Add another contact method (email, phone, or scheduling link).

6. Should this stay a single "Let's Connect" section, or do you want a new section added?
	- A. Keep the single section, content-only (consistent with "same way as previously refactored pages").
	- B. Add a new section (you'll specify its purpose).