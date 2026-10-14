## Decision: about page re-themed around ProMatrix AI Solutions on the Microsoft stack

The about page now presents ProMatrix as a Microsoft-centered software engineering firm. All existing sections were kept and re-themed in place: Company Profile, ProMatrix AI Solutions (renamed from "ProMatrix AI Strategies"), Automation, Integration, Innovation, and Courses & Training. The Founder section was left unchanged. The "ProMatrix AI Solutions" name is used throughout the copy, and the marketing narrative now frames modern single-page applications (Angular + React) plus integration with Microsoft 365 Dynamics 365 and Microsoft Fabric as part of the ProMatrix AI Solutions offering. The change is content-only: no routing, SCSS, images, or live service wiring were added, and all existing images were kept in place.

Section-by-section result:

1. Company Profile — kept the founding facts (2003, Minneapolis, fewer than ten stakeholder employees, lean model) and refreshed the positioning to "Microsoft-centered software development" delivered through ProMatrix AI Solutions on the Microsoft stack (Microsoft 365, Microsoft Copilot, Dynamics 365, Microsoft Fabric, Azure). The "Video: Software Development Strategy" link was preserved.
2. ProMatrix AI Solutions (renamed) — re-themed around Microsoft Copilot and Copilot Studio agents, with single-page apps built in Angular and React, Power Automate automation, Microsoft Fabric OneLake insights, Dynamics 365 personalization, and Azure AI Foundry trend prediction. The existing `home-page-neuro-1@2x.png` image was retained.
3. Automation — re-themed around Power Automate flows and Copilot Studio agents, with Microsoft 365 operations, Microsoft Fabric insights, and Dynamics 365 inventory examples.
4. Integration — re-themed around Microsoft 365, Microsoft Graph, Dynamics 365 connectors, Microsoft Fabric / OneLake, Teams, and SharePoint, explicitly tying the Angular/React SPAs into the Microsoft ecosystem.
5. Innovation — re-themed around Microsoft Copilot, Azure AI Foundry, Copilot Studio agents, and Microsoft Fabric.
6. Courses & Training — added React alongside Angular/NodeJS/C#, plus new offerings for building Copilot Studio agents, pipeline and deployment strategies, and testing strategies for Microsoft 365 solutions.
7. Founder — left as-is per the request.

## Issue Resolved

ADR (009a)/(009b) requested refactoring the about page to follow the same outline as the previously refactored pages: keep the existing technology stack but introduce additional front-end technologies (single-page applications using Angular and React) and integration with external Microsoft platforms (Microsoft 365 Dynamics 365 and Microsoft Fabric). No new images were to be added unless a new section was deemed important. The first AI-branded section was to be renamed "ProMatrix AI Solutions" and that name used throughout the content.

Confirmed choices from (009b): scope treated pragmatically for a static marketing site — content refactor of the about HTML, since true functional wiring of Dynamics 365 / Fabric / Copilot is not possible without a backend and the user framed these as part of the ProMatrix AI Solutions offering (1-C clarified by 4-A's note); rename the "ProMatrix AI Strategies" section to "ProMatrix AI Solutions" (2-B); keep and re-theme all existing sections with no new section (3-A); present the Angular/React SPA capability in the copy as part of ProMatrix AI Solutions (4-A); include broad plus specific Microsoft capability mentions such as Fabric OneLake/data pipelines, Dynamics 365 connectors, and Copilot Studio agents (5-B); keep every existing image exactly where it is (6-A); and keep the Founder section as-is (7-A).

## Solution Details

- [src/app/about.component/about.component.html](../../src/app/about.component/about.component.html) — rewrote the marketing copy for the Company Profile, ProMatrix AI Solutions, Automation, Integration, Innovation, and Courses & Training sections. The AI section title was changed from "ProMatrix AI Strategies" to "ProMatrix AI Solutions", and that name is reused across the Company Profile, Automation, Integration, and Innovation copy. The Angular + React single-page-application capability and integration with Microsoft 365, Dynamics 365, and Microsoft Fabric are woven into the copy as ProMatrix AI Solutions offerings, with specific capability mentions (Fabric OneLake / data pipelines, Dynamics 365 connectors, Copilot Studio agents, Power Automate, Azure AI Foundry, Microsoft Graph, Teams, SharePoint).
- All existing CSS class hooks (`ai-strategies-title`, `ai-strategies-rationale-text`, `automation-rationale`, etc.) were preserved; only the visible text inside them changed, so `about.component.scss` was not modified and no new SCSS was required.
- No images were added, removed, or moved — `home-page-neuro-1@2x.png` and `headshot-1.png` remain in place.
- The Founder section (David Donovan bio, Pluralsight/Udemy/LinkedIn mention, YouTube/Amazon music links) was left unchanged.

## Validation

- `npm.cmd run build-development` — build succeeded (Application bundle generation complete, 13.801s), no errors.
- `get_errors` on `about.component.html` — no errors.
- Grep confirmed no remaining "AI Strategies", "Google", "Dialogflow", "AWS", or "Amazon Web" references in the about template; the renamed section and Microsoft re-theming are in place.
- Verified `about.component.scss` was left unchanged and all content renders through the pre-existing class hooks.

## Follow-up Risks or Limitations

- The copy describes Microsoft capabilities (Copilot Studio agents, Dynamics 365 connectors, Microsoft Fabric OneLake / data pipelines, Azure AI Foundry, Power Automate) as marketing claims; none are wired to live services in this content-only change. True "functional wiring" (answer 1-C) would require a backend, authentication, and credentials that this static Angular marketing site does not have, and would also conflict with the "same outline as previous pages" and "no new images" directives. It should be scoped as a separate ADR if real integrations are wanted.
- `.about` retains `min-height: 2289px` with `overflow: hidden`; because it is a min-height on a flex column, the refreshed copy expands the column rather than clipping, but exact vertical rhythm was not pixel-tuned for every viewport.
- The `.text-3` founder intro line keeps `white-space: nowrap`; it was intentionally left unchanged (7-A) so it cannot clip.
