## Decision: showcase modernized to 12 Microsoft 365 solutions

The showcase page now presents 12 ProMatrix solutions, all built on Microsoft technologies. The original six Google Dialogflow CX solutions were refactored onto the Microsoft stack and renamed per the request, and six new solutions were added. All references to Google (Dialogflow CX, Model Garden) were removed and replaced with Microsoft equivalents (Copilot, Copilot Studio agents, Azure AI Foundry, Teams, SharePoint, Dynamics 365, Power Automate/Workflow, Power BI, Azure AI Translator). The change is content-only: no routing, forms, or live AI wiring was added, and the existing showcase SCSS was reused unchanged. The six new blocks use neutral dark-theme SVG placeholder images.

The final 12-solution lineup:

1. ProMatrix AI Solutions (renamed from "ProMatrix AI Strategies")
2. ChatMate Integration (revamped onto Copilot Studio + Azure AI Foundry)
3. Smart Build for Architecture Decisions (re-themed from "Smart Build for Translations" to an ADR system)
4. AI Help System (vision + screen share over real-time bidirectional multimodal streaming)
5. Hands-Free Apps (bidirectional multimodal streaming assisted)
6. Translation Agent (Copilot agents with translation feature + Azure AI Translator)
7. AI Training Material Generator (new)
8. Real-Time Voice eBook Assistant (new)
9. SharePoint Quarterly Reports with graphs and charts (new)
10. Dynamics 365 Enterprise Integration (new)
11. Copilot Studio Agent Builder (new)
12. Power Automate Workflow Automation (new)

## Issue Resolved

ADR (008a)/(008b) requested modernizing the showcase page to the latest Microsoft 365 technologies: refactor or replace the existing solutions with more practical, popular ones; remove all Google technology mentions (Dialogflow CX, Model Garden) in favor of comparable Microsoft technologies; integrate enterprise scenarios via Microsoft 365 and Dynamics 365; name-drop Copilot Studio, Microsoft Copilot, Teams, and SharePoint; and grow the list to a total of 12 solutions. Specific per-solution direction was given: rename "AI Strategies" to "AI Solutions" and highlight easy connection to Microsoft-resourced technologies; keep and revamp ChatMate; change Smart Build's underlying technology to an architecture design record system; use vision/screen-share multimodal streaming for the Help System; use bidirectional multimodal streaming for Hands-Free; and use Copilot agents with a translation feature for the Translation Agent.

Confirmed choices from (008b): content-only refactor of the showcase HTML (1-A); keep and refactor all 6 existing solutions and add 6 new ones to reach 12 (2-A); keep existing images and add neutral placeholder images for the 6 new blocks (3-B); rename "Smart Build for Translations" and re-theme it around an ADR workflow (4-B); include broad plus specific Microsoft capability mentions (5-B); and proceed with the proposed 12-solution lineup (6-A).

## Solution Details

- [src/app/showcase.component/showcase.component.html](../../src/app/showcase.component/showcase.component.html) — rewrote all marketing copy for the 12 solutions. The first title was changed to "ProMatrix AI Solutions" and its rationale now emphasizes effortless connection to Microsoft tooling (Microsoft 365, Copilot, Copilot Studio, Azure AI Foundry, Teams, SharePoint, Dynamics 365, Power Automate). ChatMate, Smart Build (now "Smart Build for Architecture Decisions"), AI Help System, Hands-Free Apps, and Translation Agent were re-written onto Microsoft technologies with their original images retained. Six new blocks (AI Training Material Generator, Real-Time Voice eBook Assistant, SharePoint Quarterly Reports, Dynamics 365 Enterprise Integration, Copilot Studio Agent Builder, Power Automate Workflow Automation) were appended, each separated by the existing `spacer spacer-4` / `frame-5` spacer markup.
- To honor the content-only constraint, the new blocks reuse the existing solution CSS class groups (`smart-build`, `chatmate`, `hands-free` and their `-title` / `-rationale` / `-rationale-text` / `-rationale-image` variants) so no new SCSS was required; `showcase.component.scss` was not modified.
- New placeholder images (neutral, dark-theme SVGs matching the app palette — background `#1c1c1c`, cerulean accent `#57a5cb`, text `#d9d9d9`), each labeled with its solution name and "Placeholder image":
  - [src/img/placeholder-ai-training.svg](../../src/img/placeholder-ai-training.svg)
  - [src/img/placeholder-voice-ebook.svg](../../src/img/placeholder-voice-ebook.svg)
  - [src/img/placeholder-sharepoint-reports.svg](../../src/img/placeholder-sharepoint-reports.svg)
  - [src/img/placeholder-dynamics365.svg](../../src/img/placeholder-dynamics365.svg)
  - [src/img/placeholder-copilot-studio.svg](../../src/img/placeholder-copilot-studio.svg)
  - [src/img/placeholder-power-automate.svg](../../src/img/placeholder-power-automate.svg)
- `src/img` is already an asset root in [angular.json](../../angular.json), so the SVGs resolve at the existing `img/...` request paths with no configuration change.

## Validation

- `npm.cmd run build-development` — build succeeded (Application bundle generation complete, 12.662s), no errors; the six new SVG assets resolved and were emitted.
- `get_errors` on `showcase.component.html` — no errors.
- Grep/read confirmed no remaining "Dialogflow", "DialogFlow CX", or "Model Garden" references in the showcase template; all solution blocks now name Microsoft technologies.
- Verified the showcase SCSS was left unchanged and the new blocks render through reused, pre-existing class groups.

## Follow-up Risks or Limitations

- The six placeholder SVGs are intentional stand-ins (3-B); they should be replaced with real artwork before a production marketing release.
- Reusing existing per-solution CSS classes keeps the change content-only but inherits each class's fixed widths and alternating text/image orientation; a future pass may want dedicated classes per new solution for finer layout control. The fixed-height text classes (`help-system-rationale-text`, `translation-agent-rationale-text`) were intentionally avoided for new blocks to prevent clipping.
- `.showcase` retains `min-height: 2232px` with `overflow: hidden`; because it is a min-height on a flex column, the taller 12-block content expands rather than clips, but this was not pixel-tuned for every viewport.
- The copy describes Microsoft capabilities (e.g., Azure AI Foundry real-time bidirectional multimodal streaming, Copilot Studio agents, Power BI in SharePoint, Dynamics 365 connectors) as marketing claims; none are wired to live services in this content-only change (1-A).
