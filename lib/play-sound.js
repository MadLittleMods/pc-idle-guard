const ChildExecutor = require('./child-executor');

function playWithVLC(file) {
  // via https://forum.videolan.org/viewtopic.php?t=79516
  const commandToExecute = `"C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe" -I dummy --dummy-quiet ${file} vlc://quit`;

  const executor = new ChildExecutor();
  return executor.exec(commandToExecute);
}

function playSound(file) {
  return playWithVLC(file);
}

module.exports = playSound;
