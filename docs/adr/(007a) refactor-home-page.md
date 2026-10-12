My goal is to:
Refactor the home page.

Innovative Solutions: mention How easy it is to Integrate Microsoft technologies Using Github copilot. Most development can be done just using the Natural Language processor to convert Words into actions.

The future of AI Developmentby Bridging Technologies: Mention using MCP servers, APIs and connectors To bridge technologies.

Add a new section If you recommend it for the homepage. 

Read and follow these system instructions:
prompts/refactor-strategy.md
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

---

Context I gathered: `refactor-strategy.md` resolves to `docs/prompts/refactor-strategy.md` — the overarching goal is to focus the whole site on Microsoft technologies (Microsoft 365, Teams, Microsoft Copilot, Microsoft Foundry, SharePoint, Copilot Studio agents, Workflow, Custom Engine agents) and new services (Copilot Studio agents, pipeline/deployment and testing strategies). The home page (`home.component.html/scss/ts`) uses **rigid absolute positioning** — each block has a fixed `top` and `height`, the `.home` container is a fixed `720px` tall, and the sections reveal in a timed sequence (`showTopTitle` → `showWelcomeText` → `showMiddleTitle` → `showBottomTitle` → `showMoreInfoText`). Expanding the copy and adding a section will overflow those fixed boxes, so layout is the main decision.

1. "Add a new section if you recommend it" — do you want one, and what focus? (My recommendation: add it.)
	- A. Yes — a "Microsoft-Powered Services" section highlighting Copilot Studio agents, Microsoft Foundry, and Teams/SharePoint integration (recommended)
	- B. Yes — a "Built with GitHub Copilot" section focused on natural-language development
	- C. No new section — only update the two existing blocks
	- D. Other (please specify)

2. The home layout is fixed/absolute with hard-coded tops and heights. How should I accommodate the longer copy and any new section?
	- A. Refactor the home layout to a natural vertical flow (flex/stack) so blocks size to their content and a new section fits cleanly (recommended)
	- B. Keep absolute positioning and just re-tune the `top`/`height` coordinates and `.home` height
	- C. Keep the layout exactly as-is and fit the new wording within the current box sizes (shortest copy)

3. How far should the home copy align to the Microsoft-only strategy right now?
	- A. Align fully — name Microsoft 365, Microsoft Copilot, Foundry, Copilot Studio, Teams, SharePoint where natural (recommended)
	- B. Keep it generic — only add the specifically requested mentions (GitHub Copilot + NLP in "Innovative Solutions"; MCP servers, APIs and connectors in "Bridging Technologies")

4. If a new section is added (Q1 A/B/D), should it join the timed reveal sequence with its own fade-in step, consistent with the other blocks?
	- A. Yes — add a reveal flag and timing step so it animates in like the rest (recommended)
	- B. No — render it statically without the staged animation