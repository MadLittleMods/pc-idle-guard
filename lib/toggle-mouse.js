const ChildExecutor = require('./child-executor');
const RethrownError = require('./rethrown-error');
const getDevConPath = require('./get-devcon-path');

async function checkIfWindowsAdmin() {
  const executor = new ChildExecutor();
  try {
    await executor.exec('NET SESSION');
    return true;
  } catch (err) {
    return false;
  }
}

async function toggleMouseWindows(toEnable) {
  const isAdmin = await checkIfWindowsAdmin();
  if (!isAdmin) {
    throw new Error(
      `Unable to enable/disable mouse. You need administrator privileges to enable/disable a mouse on Windows`
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

  const actionToExecute = toEnable ? 'enable' : 'disable';
  const commandToExecute = `"${devConPath}" ${actionToExecute} "HID_DEVICE_SYSTEM_MOUSE"`;

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

async function toggleMouse(toEnable) {
  await toggleMouseWindows(toEnable);
}

module.exports = toggleMouse;
