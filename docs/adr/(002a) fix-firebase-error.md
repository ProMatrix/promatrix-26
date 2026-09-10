My goal is to:
Fix the problem I'm having trying to run the script: "start-server".
Many of these problems have already been solved in another workspace: "ai-voice-live-realtime", And I would like to use that workspace as an example of how to fix this workspace that has the same problems.


Read and follow these system instructions:
C:/adr/prompts/narrow-request.md
C:/adr/prompts/append-prompt.md
C:/adr/prompts/scripting-assistance.md
C:/adr/prompts/increment-adr-counter.md
C:/adr/prompts/solution-summary.md

1. Should I apply the same general Firebase approach used by `ai-voice-live-realtime` to this workspace?
	- A. Yes. Replace `firebase serve --only functions` with a Node-based launcher that calls the local `firebase-tools` CLI through `node`, and add the missing local Functions project structure needed by `firebase.json`.
	- B. Partially. Change `start-server` to `firebase emulators:start --only functions`, but do not add a local launcher or Functions project structure yet.
	- C. No. Keep the existing `firebase serve` command shape and only troubleshoot the immediate error message.

2. What should `start-server` run locally for this Angular/Firebase workspace?
	- A. Functions emulator only, keeping `start-client` as the separate Angular dev-server command.
	- B. Hosting and Functions emulators together, so Firebase serves the built Angular app and function endpoints from one command.
	- C. A custom Node server copied or adapted from `ai-voice-live-realtime` if its behavior is needed here.