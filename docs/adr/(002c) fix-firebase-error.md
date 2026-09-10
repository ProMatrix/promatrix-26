This is a continuation from the file: (002b) fix-firebase-error.md
My goal is to:
Refactor the project: "promatrix-26" To be at the same version of Node and Angular. 
You can see the issues I see when running the script: "start-server".
These issues have already been solved in the project: "ai-voice-live-realtime", Use the project: "ai-voice-live-realtime" as an example of how to refactor the project: "promatrix-26".

Read and follow these system instructions:
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

1. Should `promatrix-26` match the Node and Angular versions in `ai-voice-live-realtime` exactly, including npm package versions and Angular CLI/build configuration where applicable?
	- A. Yes, mirror the working project's Node/Angular/tooling versions exactly.
	- B. Match only major versions and keep existing compatible package choices.
	- C. Use another explicit target version set, which I will provide.

2. For `start-server`, what should the refactor preserve as the success path?
	- A. Keep the existing `promatrix-26` local Firebase emulator/start behavior, just make it work on the new versions.
	- B. Adopt the equivalent startup scripts/configuration pattern from `ai-voice-live-realtime`.
	- C. Change the startup workflow, which I will describe.

3. Should Firebase and Functions dependencies/config also be updated to match the working project, or only the Angular app dependencies?
	- A. Update app, Firebase tooling, and Functions where needed to make `start-server` work.
	- B. Update only Angular/Node-facing app dependencies and leave Firebase/Functions pinned unless required.
	- C. Use the exact Firebase/Functions versions from `ai-voice-live-realtime`.