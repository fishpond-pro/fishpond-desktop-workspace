const fs = require('node:fs')
const path = require('node:path')

const packagesDir = path.join(__dirname, '../.git/modules/packages')

const postCommitHookTmp = pkg => `#!/bin/bash

echo "git params $GIT_PARAMS $1"

commit_info=$(git log -1 HEAD --pretty=format:"%s")

echo "commit_message: $commit_info"

cd /Users/zhouyunge/Documents/fishpond-desktop-workspace

pwd

nohup node scripts/git-commit.js ${pkg} "$commit_info"

exit 0
`

const prePushHookTmp = `#!/bin/bash

current_hour=$(date +%H)
target_hour=23

if [ "$current_hour" -ne "$target_hour" ]; then
  echo "Push rejected. You can only push after 11 PM."
  exit 1
fi

echo "Push enabled."

exit 0`


fs.writeFileSync(
  path.join(__dirname, '../.git/hooks/post-push'),
  prePushHookTmp,
)
fs.chmodSync(path.join(__dirname, '../.git/hooks/post-push'), '755');


fs.readdirSync(packagesDir).map(f => {
  const packagePath = path.join(packagesDir, f);
  const hooksDir = path.join(packagePath, './hooks');
  [
    path.join(hooksDir, 'pre-commit'),
    path.join(hooksDir, 'commit-msg'),
  ].forEach(v => {
    if (fs.existsSync(v)) {
      fs.unlinkSync(v)
    }
  });

  const prePushHook = path.join(hooksDir, 'pre-push')

  fs.writeFileSync(
    prePushHook,
    prePushHookTmp,
  )
  fs.chmodSync(prePushHook, '755');

  const postCommitHook = path.join(hooksDir, 'post-commit')
  fs.writeFileSync(
    postCommitHook,
    postCommitHookTmp(f),
  )
  fs.chmodSync(postCommitHook, '755')
})


console.log( "sync pre-commit, pre-push done")