# Change Log

All notable changes to the "lando-ui" extension will be documented in this file.

## [Unreleased]

- Add button to copy values in Lando Info and Lando List views.
- Add db-export and db-import commands.
- Add config setting for db-export and db-import default path.
- Add Lando Destroy command.
- Add Lando Rebuild command.

## [0.4.0] - 2019-10-26

### Added

- Config setting to turn off auto show of command output.
- Now handles multiple Workspace folders.
- Message in List panel to show no running services.
- Info Panel shows what workspace folder (if one) is being used.

### Fixed

- Reworked message when no app is found for the Info panel.

## [0.3.1] - 2019-10-20

### Fixed

- Removed stop option from the '_global_' proxy container as you can not directly stop it.
- Set all 1st level items in the List panel to start collapsed to give a simple list of what is running.

## [0.3.0] - 2019-10-19

### Added

- Button to stop other currently running projects in the Lando List view.
- Clean up Lando Info and Lando List outputs to be more visually appealing and first glance understandable.

## [0.2.0] - 2019-10-17

### Added

- Button to open links in info and list views in the system default browser.
- Lando restart, Lando poweroff and Lando init to available commands.
- Output auto shows when Start/Stop commands have been run. (config option will be added soon if this is not the desired functionality)

### Fixed

- Improved .lando.yml file detection and error handling.
- Now checks lando version and enforces requirement.
- General clean up of code and refactoring.

## [0.1.3] - 2019-10-14

### Fixed

- jsonc-parser moved to an external webpack resource.

## [0.1.2] - 2019-10-13

### Added

- Updating README.md to add notice about logos used.

## [0.1.1] - 2019-10-13

### Added

- Updating README.md and package.json to include full description and marketplace icons and info.

## [0.1.0] - 2019-10-13

### Added

- Status Bar Item that shows status of current workspace lando project and also provides ability to toggle status.
- View for Lando Info to show basic info about the current workspace lando project.
- View for Lando List to show basic info about the containers that are running.
- Refresh button to both views.
- Menu items to run lando commands.
