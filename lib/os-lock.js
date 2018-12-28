const ChildExecutor = require('./child-executor');
const RethrownError = require('./rethrown-error');

async function lockWindows() {
  // via https://docs.microsoft.com/en-us/powershell/scripting/samples/changing-computer-state?view=powershell-5.1
  const commandToExecute = `rundll32.exe user32.dll,LockWorkStation`;

  try {
    const executor = new ChildExecutor();
    await executor.exec(commandToExecute);
  } catch (resultInfo) {
    throw new RethrownError(
      `Failed to lock the computer, running ${resultInfo.command}`,
      resultInfo.error
    );
  }
}

async function osLock() {
  await lockWindows();
}

module.exports = osLock;
