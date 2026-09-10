This is a continuation from the file: (002d) fix-firebase-error.md
My goal is to:
When I run this NPM script: "start-server" I get a series of warnings.
fix the warnings!

Read and follow these system instructions:
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

1. Should the fix target every warning printed by `npm.cmd run start-server`, including dependency/toolchain warnings, or only warnings caused by project-owned scripts and configuration?
	- A. Fix every warning the script prints, including dependency/toolchain warnings where practical.
	- B. Only fix warnings caused by project-owned scripts and configuration; document external tool warnings if any remain.
	- C. First capture the warning output and propose the smallest scoped fix before changing code.

2. Is it acceptable to update package versions or lockfile entries if that is the cleanest way to remove warnings?
	- A. Yes, update dependencies and lockfiles if needed.
	- B. No, keep dependency versions fixed and only change local scripts/configuration.
	- C. Ask before any dependency or lockfile change.