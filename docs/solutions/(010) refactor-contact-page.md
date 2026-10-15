## Decision: contact page re-themed onto the Microsoft stack

The contact page "Let's Connect" rationale was rewritten to remove the multi-cloud "GCP, Azure, and AWS" mention and re-theme ProMatrix's offerings onto Microsoft technologies, consistent with the home, showcase, and about page refactors. The change is content-only: the "Let's Connect" title, the "reach out" line, the "Connect on LinkedIn" button, the LinkedIn URL, and the staggered reveal animation in `contact.component.ts` were all left unchanged, and no SCSS was modified.

The refreshed rationale now presents:

- Low-cost, low-code solutions with Microsoft Power Platform and Power Apps.
- "ProMatrix AI Solutions" branding (matching the about/showcase pages) covering Microsoft Copilot and Copilot Studio agents.
- Multilingual support mapped to Azure AI Translator.
- Help desks and contact centers mapped to Dynamics 365 Customer Service.
- A Microsoft-only platform statement: Microsoft Azure, Microsoft 365, and Microsoft Fabric (replacing "GCP, Azure, and AWS").

## Issue Resolved

ADR (010a)/(010b) requested refactoring the contact page in the same way as the previously refactored pages: re-theme the marketing copy onto Microsoft technologies and remove Google/AWS mentions. The specific problem on this page was the rationale paragraph, which advertised generic offerings ("integration with AI, multiple languages, help desks, and contact centers") and "compatibility with major services like GCP, Azure, and AWS" — inconsistent with the Microsoft-only strategy.

Confirmed choices from (010b), all option A: content-only refactor matching the prior pages (1-A); replace "GCP, Azure, and AWS" with Microsoft-only services (2-A); map the generic offerings to specific Microsoft equivalents — Power Platform/Power Apps, Copilot & Copilot Studio agents, Azure AI Translator, Dynamics 365 Customer Service (3-A); weave in the "ProMatrix AI Solutions" branding (4-A); keep the LinkedIn button, URL, and staggered reveal animation exactly as-is (5-A); and keep the single "Let's Connect" section with no new section (6-A).

## Solution Details

- [src/app/contact.component/contact.component.html](../../src/app/contact.component/contact.component.html) — rewrote only the `lets-connect-rationale` paragraph. "GCP, Azure, and AWS" became "Microsoft Azure, Microsoft 365, and Microsoft Fabric"; "low-code solutions" now names Power Platform and Power Apps; "integration with AI" became Microsoft Copilot and Copilot Studio agents under the "ProMatrix AI Solutions" banner; "multiple languages" became Azure AI Translator; and "help desks, and contact centers" became Dynamics 365 Customer Service. The second sentence (consultation/scheduling) and the `*ngIf` reveal hooks were preserved verbatim.
- All existing CSS class hooks (`lets-connect-rationale`, `text-1`, etc.) were kept, so `contact.component.scss` was not modified.
- `contact.component.ts` (LinkedIn URL and the staggered `showLetsConnectTitle` / `showLetsConnectText` / `showReachOutText` / `showConnectButton` animation) was left unchanged, as was the "reach out" line and the "Connect on LinkedIn" button.

## Validation

- `npm.cmd run build-development` — build succeeded (Application bundle generation complete, 13.527s), no errors.
- `get_errors` on `contact.component.html` — no errors.
- Verified the rewritten rationale contains no remaining "GCP" or "AWS" references and that `contact.component.scss` / `contact.component.ts` were untouched.

## Follow-up Risks or Limitations

- The copy describes Microsoft capabilities (Power Platform/Power Apps, Copilot Studio agents, Azure AI Translator, Dynamics 365 Customer Service) as marketing claims; none are wired to live services in this content-only change.
- `.contact` retains `min-height: 1080px` with `overflow: hidden`; because it is a min-height on a flex column, the slightly longer rationale expands the column rather than clipping, but exact vertical rhythm was not pixel-tuned for every viewport.
