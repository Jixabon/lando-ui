# Lando UI

Please leave a rating! Feedback is welcome!

## Features

Lando UI was designed so simplify the use of the Lando development tool when inside VSCode. It adds quick button shortcuts and information panels that allow quick, 'no command' access to your current Lando project, as well as other running projects/containers.

Visit the Lando's website at https://lando.dev/

![Lando UI Overview](media/screenshot.png)

## Requirements

Lando UI requires that you have the lando tool installed and at a minimum version of v3.0.0-rc13. The `--format json` option was added in this release and is required for the functionality of this extension.

To install lando and it's dependencies follow the [installation instructions](https://docs.lando.dev/basics/installation.html) on their website.

<!-- ## Extension Settings -->

<!-- This extension contributes the following settings: -->

<!-- ## Known Issues -->

## Release Notes

### v0.4.1

#### Fixed

- App not found message displaying wrong.

### v0.4.0

#### Added

- Config setting to turn off auto show of command output.
- Now handles multiple Workspace folders.
- Message in List panel to show no running services.
- Info Panel shows what workspace folder (if one) is being used.

#### Fixed

- Reworked message when no app is found for the Info panel.

### v0.3.1

#### Fixed

- Removed stop option from the '_global_' proxy container as you can not directly stop it.
- Set all 1st level items in the List panel to start collapsed to give a simple list of what is running.

### v0.3.0

#### Added

- Button to stop other currently running projects in the Lando List view.
- Clean up Lando Info and Lando List outputs to be more visually appealing and first glance understandable.

### v0.2.0

#### Added

- Button to open links in info and list views in the system default browser.
- Lando restart, Lando poweroff and Lando init to available commands.
- Output auto shows when Start/Stop commands have been run. (config option will be added soon if this is not the desired functionality)

#### Fixed

- Improved .lando.yml file detection and error handling.
- Now checks lando version and enforces requirement.
- General clean up of code and refactoring.

### v0.1.3

#### Fixed

- jsonc-parser moved to an external webpack resource.

### v0.1.0

#### Added

- Status Bar Item that shows status of current workspace lando project and also provides ability to toggle status.
- View for Lando Info to show basic info about the current workspace lando project.
- View for Lando List to show basic info about the containers that are running.
- Refresh button to both views.
- Menu items to run lando commands.

---

## To Do

- Add multi-root compatibility.
- Add button to copy values in Lando Info and Lando List views.
- Add config setting to turn off auto show of command output.
- Add db-export and db-import commands.
- Add config setting for db-export and db-import default path.
- Add Lando Destroy command.
- Add Lando Rebuild command.

---

NOTICE: All logos and lando branded images are created and used from the creators of Lando.
