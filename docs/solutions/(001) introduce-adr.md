## Implementation Result

The workspace now treats `npm.cmd run new-adr` as the primary supported Windows command for creating a new ADR through npm. This avoids PowerShell resolving `npm` to `C:\Program Files\nodejs\npm.ps1`, which can fail when script execution is disabled.

## Issue Resolved

Running the `new-adr` npm script from PowerShell could fail before the package script executed because Windows found the PowerShell npm shim, `npm.ps1`. The workspace needed to guide users and VS Code toward the Windows command shim, `npm.cmd`, while keeping the existing Node-based ADR script unchanged.

## Solution Details

Updated `docs/adr/(000a) adr-instructions.md` so ADR creation instructions now say to run `npm.cmd run new-adr` from a terminal.

Added a VS Code shell task in `.vscode/tasks.json` named `ADR: new (npm.cmd)`. The task runs `npm.cmd` with arguments `run` and `new-adr`, so invoking ADR creation through the VS Code task runner also avoids the blocked PowerShell shim.

The existing `package.json` script remains `new-adr -> .\new-adr.cmd`, and `new-adr.cmd` still delegates to the Node script at `C:\adr\script\new-adr.mjs`.

## Validation

Validated `.vscode/tasks.json` and `docs/adr/(000a) adr-instructions.md` with the editor diagnostics tool; no errors were reported.

Ran `npm.cmd --version`; it succeeded and reported version `11.19.0`.

Ran `npm.cmd run`; it succeeded and listed `new-adr -> .\new-adr.cmd`.

Did not run `npm.cmd run new-adr` during validation because the ADR creator is interactive and can create files or prompt for git actions.

## Follow-up Risks or Limitations

This fix cannot make plain `npm run new-adr` safe in a PowerShell session where execution policy blocks `npm.ps1`; users must use `npm.cmd run new-adr` or the new VS Code task.

The ADR referenced `./docs/guidance/project-endeavor.md`, but that file was not present in this workspace, so no instructions from that file could be applied.

## Implementation Result

The workspace now uses a general Windows fix for npm script launches instead of a script-by-script workaround. VS Code terminals created for this workspace default to Command Prompt, automation terminals use `cmd.exe`, and npm package-script bodies are configured to run under `cmd.exe` through the project `.npmrc`.

This is the recommended solution for the full script set because the failure happens before any individual package script starts: PowerShell resolves bare `npm` to `C:\Program Files\nodejs\npm.ps1`, and this machine blocks PowerShell script execution. Running through Command Prompt resolves `npm` to the working `npm.cmd` shim instead. The project-level npm shell setting also protects scripts such as `build-production`, `deploy-all`, and future scripts that call other npm scripts internally.

## Issue Resolved

Choosing VS Code's package.json Run Script action could fail for any npm script, not only the ADR scripts, because the launch terminal used PowerShell and PowerShell selected the blocked `npm.ps1` shim. The workspace needed a scalable fix that applied to all current and future npm scripts.

## Solution Details

Added `.vscode/settings.json` with Windows terminal settings that make new integrated terminals use the `Command Prompt` profile and make VS Code automation terminals use `cmd.exe`.

Added `.npmrc` with `script-shell=cmd.exe`, so npm package-script bodies run under Command Prompt in this project. This keeps nested script calls such as `npm run prebuild`, `npm run deploy-hosting`, and `npm run deploy-functions` on the working Windows command path.

No package.json script bodies needed to be duplicated into one-off VS Code shell tasks. The existing `new-adr`, `continue-adr`, and `remove-adr` scripts still delegate to their `.cmd` wrappers, and the same launcher fix applies to the rest of the scripts.

## Validation

Confirmed the root cause before editing: PowerShell resolves `npm` as `C:\Program Files\nodejs\npm.ps1`, bare `npm --version` fails with the execution-policy error, and `npm.cmd --version` succeeds with version `11.19.0`.

Validated the Command Prompt path after editing with `cmd.exe /d /c npm --version`; it reported npm version `11.19.0`.

Validated the project npm configuration with `npm.cmd config get script-shell`; it reported `cmd.exe`.

Validated the package script list with `npm.cmd run`; it still listed `new-adr`, `continue-adr`, `remove-adr`, `build-production`, and `deploy-all`.

Checked editor diagnostics for `.vscode/settings.json` and `.npmrc`; no errors were reported.

## Follow-up Risks or Limitations

Existing PowerShell terminals that were already open before the settings change can still fail on bare `npm`; use a new VS Code terminal or rerun the script from the package.json Run Script action after the workspace settings are loaded.

This workspace is now explicitly Windows-oriented for npm script execution. That matches the ADR scripting guidance and the existing `.cmd` scripts, but it is not intended as a cross-platform npm script-shell configuration.

The referenced `./docs/guidance/project-endeavor.md` file is still absent from this workspace, so no instructions from that file could be applied.