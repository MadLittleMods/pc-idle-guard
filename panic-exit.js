const playSound = require('./lib/play-sound');
const osLock = require('./lib/os-lock');
const toggleMouse = require('./lib/toggle-mouse');

async function panicExit() {
  try {
    await osLock();
    await toggleMouse(true);
  } finally {
    await playSound('sounds/siren.mp3');
  }
}

panicExit();
