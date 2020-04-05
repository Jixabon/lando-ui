# Lando UI

Please leave a rating! Feedback is welcome!

## Features

Lando UI was designed to simplify the use of the Lando development tool when inside VSCode. It adds quick button shortcuts and information panels that allow quick, commandless access to your current Lando project, as well as other running projects/containers.

Visit the Lando's website at https://lando.dev/

![Lando UI Overview](media/screenshot.png)

## Requirements

Lando UI requires that you have the lando tool installed and at a minimum version of v3.0.0-rc13. The `--format json` option was added in this release and is required for the functionality of this extension.

To install lando and it's dependencies follow the [installation instructions](https://docs.lando.dev/basics/installation.html) on their website.

## Abilities

### Multi Root

Allows for multiple workspace folders to be present. Switch back and forth with the "Change Workspace Folder" button and the interface will switch with you. Set a default workspace folder in your workspace settings so it can open the right lando project for you when you start VSCode.

### What's running?

See what running, whether it's the project your in or another project you forgot to spin down. Lando UI provides you quick access to stop other running projects from any instance of VSCode. You can also see information about the project you're currently in. Open project links in your default browser directly from the Info Panel. As well as copying project values, such as database credentials or urls, and ssh-ing into a service all with single click!

### Lando Command Mania

Go crazy with the built in lando functionality. This includes Lando init, Lando Start, Lando Stop, Lando Restart, Lando Poweroff, etc. with more being added soon. With a simple button in the bottom right of your window you can quickly and easily start, stop or even initialize your lando projects. Output of these commands is optional and can be turned off if you're confident that your lando project is running like a well oiled machine.

### Database Control - To and From Anywhere on Your Computer

The normal lando commands only allow import and export from the root of the project. Well Lando UI has you covered! With Lando UI you can now select what database service you'd like if there are multiple detected and select any location on your computer to save export files. You can also select a file for import from anywhere on you computer. Save a default export location and give it a file name for quick and easy exports. If that's all more than you're looking for then simply just use the default lando export and expect an export file in your project root.

## Extension Settings

This extension contributes the following settings:

- Output > AutoShow
  - Auto show command output when an App is started or stopped
- WorkspaceFolder > Default
  - Default workspace folder to be used if there are more than one folder in a workspace
- Database > ExportPath
  - Default export location for exporting databases

<!-- ## Known Issues -->

## Release Notes

### v0.6.1

#### Fixed

- Bug where button refresh was overriding earlier button states.
- Bug that make button stuck on "stopping"

### v0.6.0

### Fixed

- New pre-release series not being parsed correctly.
- Parsing new list json format (list is no longer nested under an app name).
- Hiding commands that can't be run outside of the side panels.

### Changed

- Button will now check app running status on Info or List panel refreshes.
- Start, Stop, Restarting, etc messages to include the app name in message.

### v0.5.0

#### Added

- Button to copy values in Lando Info and Lando List panels.
- Button to ssh into a service in Lando Info panel.
- db-export and db-import commands.
- Config setting for db-export default path.

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

- Add Lando Destroy command.
- Add Lando Rebuild command.

---

NOTICE: All logos and lando branded images are created and used from the creators of Lando.
