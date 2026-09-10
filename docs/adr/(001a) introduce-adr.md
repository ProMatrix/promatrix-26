My goal is to:
update the workspace: "promatrix-26".

Let's fix the error in the workspace: "promatrix-26" when trying to run the script: "new-adr".

I see this error: "npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running 
scripts is disabled on this system. For more information"

Read and follow these system instructions:
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

1. Which command path should this workspace make the primary supported way to create a new ADR on Windows?
	- A. `npm.cmd run new-adr`, so PowerShell avoids the blocked `npm.ps1` shim.
	- B. `new-adr.cmd` directly from the project root, bypassing npm.
	- C. A Node-based wrapper run with `node`, avoiding PowerShell scripts and npm shims.
