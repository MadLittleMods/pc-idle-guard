const spawn = require('child_process').spawn;

class ChildExecutor {
  constructor() {
    this.child = null;
    this.stdout = '';
    this.stderr = '';
  }

  exec(command, options) {
    return new Promise((resolve, reject) => {
      // We use `child` so we can manually send a kill
      // ex.
      // var executor = new ChildExecutor();
      // executor.exec('SOMECOMMAND').then((resultInfo) => { console.log('resultInfo'); });
      // executor.child.kill('SIGINT');
      //
      // We have to use `spawn` instead of `exec` because you can't kill it
      //console.log('spawn', commandParts[0], commandParts.slice(1), options);
      this.child = spawn(
        command,
        [],
        Object.assign(
          {
            // We use the `shell` command so we don't have to split and parse the command parts
            // via https://stackoverflow.com/a/45134890/796832
            shell: true
          },
          // We pass the options second so the user can override the `shell` option if need be
          options
        )
      );

      this.child.stdout.on('data', data => {
        //console.log('ce data', String(data));
        this.stdout += data;
      });

      this.child.stderr.on('data', data => {
        //console.log('ce err data', String(data));
        this.stderr += data;
      });

      this.child.on('close', exitCode => {
        //console.log('ce close', exitCode, this.stdout, '|', this.stderr);

        const resultInfo = {
          exitCode,
          command,
          stdout: this.stdout,
          stderr: this.stderr
        };

        if (exitCode === 0) {
          resolve(resultInfo);
        } else {
          reject(resultInfo);
        }
      });

      this.child.on('error', err => {
        //console.log('ce error', err, this.stdout, '|', this.stderr);
        reject({
          command,
          stdout: this.stdout,
          stderr: this.stderr,
          error: err
        });
      });

      //this.child.stdout.pipe(process.stdout);
      //this.child.stderr.pipe(process.stderr);
    });
  }
}

module.exports = ChildExecutor;
