const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const stat = promisify(fs.stat);
const Promise = require('bluebird');

const possibleProgramFilePaths = ['C:\\Program Files (x86)', 'C:\\Program Files'];

const possibleDevConPaths = [
  'Windows Kits\\10\\Tools\\x64\\devcon.exe',
  'Windows Kits\\10\\Tools\\x86\\devcon.exe',
  'Windows Kits\\8.1\\Tools\\x64\\devcon.exe',
  'Windows Kits\\8.1\\Tools\\x86\\devcon.exe',
  'Windows Kits\\8.0\\Tools\\x64\\devcon.exe',
  'Windows Kits\\8.0\\Tools\\x86\\devcon.exe',
  'Microsoft SDKs\\Windows\\v7.1\\Tools\\devcon.exe',
  'Microsoft SDKs\\Windows\\v7.1A\\Tools\\devcon.exe'
];

const statResults = possibleProgramFilePaths.reduce(function(statResults, programFilePath) {
  return statResults.concat(
    possibleDevConPaths.map(function(devConPath) {
      const fullDevConPath = path.join(programFilePath, devConPath);
      return stat(fullDevConPath).then(function() {
        return fullDevConPath;
      });
    })
  );
}, []);

const anyStatResultPromise = Promise.any(statResults);

function getDevConPath() {
  return anyStatResultPromise;
}

module.exports = getDevConPath;
