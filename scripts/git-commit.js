const execSync = require('child_process').execSync

const [_1, _2, pkg, commitMsg] = process.argv

execSync(`git add packages/${pkg}`, {
  cwd: process.cwd(),
  env: {
    ...process.env,
    GIT_DIR: process.cwd() + '/.git',
    GIT_INDEX_FILE: process.cwd() + '/.git/index',
    OLDPWD: process.cwd(),
    GIT_EXEC_PATH: '/usr/bin/git',
  }
})


execSync(`git commit -m "${pkg}:${commitMsg}"`, {
  cwd: process.cwd(),
  env: {
    ...process.env,
    GIT_DIR: process.cwd() + '/.git',
    GIT_INDEX_FILE: process.cwd() + '/.git/index',
    OLDPWD: process.cwd(),
    GIT_EXEC_PATH: '/usr/bin/git',
  }
})


