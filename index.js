const { app, BrowserWindow, globalShortcut } = require('electron');
const config = require('./lib/config');
const getDevConPath = require('./lib/get-devcon-path');
const ChildExecutor = require('./lib/child-executor');
const RethrownError = require('./lib/rethrown-error');

/* */
process.on('unhandledRejection', function(reason, promise) {
  console.error('unhandledRejection', reason);
});
/* */

let win;
let currentIsLockedState = false;

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 });

  win.loadFile('index.html');

  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

async function checkIfAdmin() {
  const executor = new ChildExecutor();
  try {
    await executor.exec('NET SESSION');
    return true;
  } catch (err) {
    return false;
  }
}

async function changeLockState(isLocked) {
  console.log(`changeLockState ${isLocked}`);

  const isAdmin = await checkIfAdmin();
  if (!isAdmin) {
    console.warn(
      `You need administrator privileges to enable/disable devices on Windows. This shortcut probably won't work`
    );
  }

  let devConPath;
  try {
    devConPath = await getDevConPath();
  } catch (err) {
    throw new RethrownError(
      'DevCon.exe not found, you probably need to download/install it, https://docs.microsoft.com/en-us/windows-hardware/drivers/devtest/devcon',
      err
    );
  }

  const actionToExecute = isLocked ? 'disable' : 'enable';
  const commandToExecute = `"${devConPath}" ${actionToExecute} "HID_DEVICE_SYSTEM_MOUSE"`;
  console.log('commandToExecute', commandToExecute);

  try {
    const executor = new ChildExecutor();
    await executor.exec(commandToExecute);
  } catch (resultInfo) {
    throw new RethrownError(
      `Failed to ${actionToExecute} the mouse, running ${resultInfo.command}`,
      resultInfo.error
    );
  }
}

// Register global shortcuts/hotkeys listener
async function registerShortcuts() {
  const lockShortcut = config.get('lockShortcut');

  // Syntax for shortcut string, https://electronjs.org/docs/api/accelerator
  globalShortcut.register(lockShortcut, async () => {
    console.log(`Lock shortcut ${lockShortcut} triggered`);

    const nextIsLockedState = !currentIsLockedState;
    await changeLockState(nextIsLockedState);

    // We switch regardless of whether the command above passed in case we are stuck enabled/disabled
    currentIsLockedState = nextIsLockedState;
  });
}

app.on('ready', () => {
  registerShortcuts();

  createWindow();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
