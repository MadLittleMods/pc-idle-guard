const iohook = require('iohook');
const config = require('./lib/config');
const logger = require('./lib/log');
const playSound = require('./lib/play-sound');
const osLock = require('./lib/os-lock');
const toggleMouse = require('./lib/toggle-mouse');
const keyStringToIohookKeycodeMap = require('./lib/key-string-to-iohook-keycode-map');

let currentIsLockedState = false;
let currentKeyActivitySinceLockedCount = 0;

process.on('unhandledRejection', function(reason, promise) {
  logger.error(`unhandledRejection: ${reason.message} ${reason.stack}`);
});

async function onExit() {
  try {
    // Alert when someone is exiting while we are still locked
    if (currentIsLockedState) {
      logger.warn('Exited PC Idle Guard while still locked');

      // We await here so the sub-process has time to spawn and play before exiting the process
      await playSound('sounds/siren.mp3');
    }
  } finally {
    process.exit();
  }
}

process.on('exit', onExit);
// Catches Ctrl+c event
process.on('SIGINT', onExit);
// Catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', onExit);
process.on('SIGUSR2', onExit);

async function changeLockState(nextIsLockedState) {
  try {
    logger.info(`changeLockState ${nextIsLockedState}`);

    // Fire and forget sound
    playSound(nextIsLockedState ? 'sounds/lock.mp3' : 'sounds/unlock.mp3');

    await toggleMouse(!nextIsLockedState);
  } catch (err) {
    throw err;
  } finally {
    // We switch regardless of whether the command above passed in case we are stuck enabled/disabled
    currentIsLockedState = nextIsLockedState;
    currentKeyActivitySinceLockedCount = 0;
  }
}

// Register global shortcuts/hotkeys listener
async function registerShortcuts() {
  const lockShortcut = config.get('lockShortcut');

  const lockShortcutKeycodes = lockShortcut
    .split('+')
    .map(keyString => keyStringToIohookKeycodeMap[keyString.toLowerCase()]);

  iohook.registerShortcut(
    lockShortcutKeycodes,
    async () => {
      logger.info(`Lock shortcut triggered`);

      await changeLockState(!currentIsLockedState);
    },
    // FIXME: This empty releaseCallback is needed until https://github.com/wilix-team/iohook/issues/131 is fixed
    () => {}
  );
}

const osLockThreshold = config.get('osLockThreshold');

iohook.start();
iohook.on('keydown', async event => {
  if (currentIsLockedState) {
    logger.info(`keydown while locked: ${JSON.stringify(event)}`);

    // Keep track of how many keys people are pressing while locked
    currentKeyActivitySinceLockedCount++;

    // Fire and forget sound
    playSound('sounds/click.mp3');
  }

  if (osLockThreshold && currentKeyActivitySinceLockedCount >= osLockThreshold) {
    try {
      logger.info(
        `Keyboard activity threshold reached (${osLockThreshold}) -> OS-locking computer`
      );
      await osLock();

      // After OS-locking, we can unlock the lock state
      // We only want to do this if the OS-locking succeeded
      await changeLockState(false);
    } catch (err) {
      throw err;
    }
  }
});

registerShortcuts();
