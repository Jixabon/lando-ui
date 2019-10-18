# Change Log

All notable changes to the "lando-ui" extension will be documented in this file.

## [Unreleased]

- Clean up Lando Info and Lando List outputs to be more visually appealing and first glance understandable.
- Make URLs Clickable in the Lando Info and List views.
- Add button to stop projects in the Lando List view.
- Integrate more lando commands to the interface.

## [0.2.0] - 2019-10-14

### Added

- Button to open links in info and list views in the system default browser.
- Lando restart, Lando poweroff and Lando init to available commands.

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
