# PC Idle Guard

Stop party guests from messing with your computer by locking/unlocked mouse usage via keyboard shortcut. Not always feasible to use the OS lock feature because you want the movie to continue playing while you go to the bathroom.

Behind the scenes, it just disables the mouse device. If you get in trouble, you can re-enable via Device Manager

**NB:** Only compatible with Windows and tested on Windows 10


## Usage

 1. Install [Node.js](https://nodejs.org/en/)
 1. Clone this project
 1. `npm install`
 1. Run on a command line window with *Administrator privileges* -> `npm start`
 1. Press <kbd>Alt</kbd> + <kbd>L</kbd> to lock/unlock your mouse

It's best to change the shortcut to something custom so your party guests don't know how to lock/unlock. Copy `config/config.default.json` and save as `config/config.user-overrides.json` with your desired settings.

The syntax for shortcuts is [Electron accelerator](https://electronjs.org/docs/api/accelerator)


## Future plans

 - Run in background with tray icon indicating lock state
    - Don't allow easy exiting while in locked state
 - Keep a log of keyboard activity while locked
 - Add some sound-effects when the keyboard is used while locked (like sticky keys)
 - Disable Chrome autofill when locked
    - Perhaps a companion Chrome extension that adds `autofill="off"` to everything
 - Lock/Unlock with password
    - Shortcut brings up a little dialog in the corner to type in password


## Random notes

Find hardware ID's for a certain device,

See https://docs.microsoft.com/en-us/windows-hardware/drivers/devtest/devcon-examples#ddk_example_1_find_all_hardware_ids_tools

```
"C:\Program Files (x86)\Windows Kits\10\Tools\x64\devcon.exe" hwids *mouse*
```
