This is a continuation from the file: (008f) remove-light-mode.md
My goal is to:
Perform a few small tweaks: 
- Round the corners of all of the images.
- If you every other image is on the right side. By that account the last image should be on the right side currently it's on the left side. Move the image to the other side.

Read and follow these system instructions:
prompts/refactor-strategy.md
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

---

I confirmed the current layout before answering. The showcase images alternate sides: ChatMate = right, Smart Build = left, Help System = right, Hands-Free = left, Translation Agent = right, AI Training = left, Voice eBook = right, SharePoint Reports = left, Dynamics 365 = right, Copilot Studio = left, and Power Automate = left. So the final (11th) Power Automate block breaks the right/left rhythm — it should sit on the right. The images share five reused CSS classes (`chatmate/smart-build/help-system/hands-free/translation-agent-rationale-image`) in `showcase.component.scss`, and none currently have rounded corners.

1. Which images should get rounded corners?
	- A. Only the 11 showcase solution images. (Recommended)
	- B. Every image across the whole site (home headshot, logos, side graphics, etc.).

2. How rounded should the corners be?
	- A. Subtle (~8px).
	- B. Medium (~14px). (Recommended)
	- C. Pronounced (~24px).

3. To fix the alternation, I'll move only the Power Automate (last) block's image from the left to the right, so odd blocks sit right and even blocks sit left. Is that the intended fix?
	- A. Yes — move only the Power Automate image to the right. (Recommended)
	- B. No — re-flow a different/every block instead (I'll clarify).