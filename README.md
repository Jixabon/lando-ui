# Lando UI

## Features

Lando UI was designed so simplify the use of the lando development tool when inside VSCode. It adds quick button shortcuts and information panels that allow quick, 'no command' access to your current lando project, as well as other running projects/containers.

Visit the tool's website at https://docs.lando.dev/

<!-- \!\[feature X\]\(images/feature-x.png\) -->

## Requirements

Lando UI requires that you have the lando too installed and at a minimum version of v3.0.0-rc13. The `--format json` option was added in this release and is required for the functionality of this extension.

To install lando and it's dependencies follow the [installation instruction](https://docs.lando.dev/basics/installation.html) on their website.

<!-- ## Extension Settings -->

<!-- This extension contributes the following settings: -->

<!-- ## Known Issues -->

## Release Notes

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
- Clean up Lando Info and Lando List outputs to be more visually appealing and first glance understandable.
- Make URLs Clickable in the Lando Info and List views.
- Add button to stop projects in the Lando List view.
- Integrate more lando commands to the interface.

---

NOTICE: All logos and lando branded images are created and used from the creators of Lando.
