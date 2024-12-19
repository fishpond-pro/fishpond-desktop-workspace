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

dayOfWeek=$(date +%u)  # 获取当前星期几，1代表星期一，7代表星期日
hourOfDay=$(date +%H)  # 获取当前小时数

if [[ $dayOfWeek -eq 6 || $hourOfDay -ge 23 || $hourOfDay -lt 10 ]]; then
  echo "Yes we can"
  exit 0  # 允许推送
else
  echo "Error: Push rejected. Pushes are only allowed after 23:00 or on Saturdays."
  exit 1  # 拒绝推送
fi
`

const post = path.join(__dirname, '../.git/hooks/post-push')
if (fs.existsSync(post)) {
  fs.unlinkSync(post)
}

fs.writeFileSync(
  path.join(__dirname, '../.git/hooks/pre-push'),
  prePushHookTmp,
)
fs.chmodSync(path.join(__dirname, '../.git/hooks/pre-push'), '755');


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