# PC Idle Guard

Stop party guests from messing with your computer by locking/unlocking mouse usage via configurable keyboard shortcut. Just a command-line script (no GUI)

 - When locked: Disable mouse
    - Behind the scenes, it just disables the mouse device. If you get in trouble, you can re-enable via Device Manager
 - When locked: Play a clicking sound whenever a keyboard key is pressed
 - When locked: OS-lock your computer and quick siren after 5(default, configurable) keystrokes have occurred
 - When locked: OS-lock your computer and quick siren if the process is exited
 - When locked: Log activity to file, see `./logs/*` (default, configurable)

**NB:** Only compatible with Windows and tested on Windows 10

### Why

Not always feasible to use the OS lock feature because you want the movie to continue playing while you go to the bathroom.

This is not fool-proof, just makes things harder

## Usage

 1. This project depends on [VLC media player](https://www.videolan.org/vlc/index.html) for playing sounds (runs a headless command). If you don't care about the sound effects, you can ignore and it should work fine (just some uncaught exceptions).
 1. Install [Node.js](https://nodejs.org/en/)
 1. Clone this project
 1. `npm install`
 1. Run on a command line window with *Administrator privileges* -> `npm start`
 1. Press <kbd>Right Alt</kbd> + <kbd>L</kbd> to lock/unlock your mouse

It's best to change the shortcut to something custom so your party guests don't know how to lock/unlock. Copy `config/config.default.json` and save as `config/config.user-overrides.json` with your desired settings.


## Future plans

 - Run in background/service with tray icon indicating lock state
 - Lock/Unlock with password
    - Shortcut brings up a little dialog in the corner to type in password
 - Capture all keyboard events and "`e.preventDefault()`" for everything. Only passthrough lock/unlock shortcut (or password field mentioned in above point)
    - We can't just disable the keyboard otherwise you won't be able to unlock
 - Disable Chrome autofill when locked
    - Perhaps a companion Chrome extension that adds `autofill="off"` to everything


## Random notes

Find hardware ID's for a certain device,

See https://docs.microsoft.com/en-us/windows-hardware/drivers/devtest/devcon-examples#ddk_example_1_find_all_hardware_ids_tools

```
"C:\Program Files (x86)\Windows Kits\10\Tools\x64\devcon.exe" hwids *mouse*
```

## Attribution

 - `click.mp3` sound from https://opengameart.org/content/zippo-click-sound
 - `lock.mp3`/`unlock.mp3` sounds from https://midi.city/ (picked bass)
 - `siren.mp3` from https://opengameart.org/content/sirens-and-alarm-noise
