git commit -am 'feat: update'

# 获取当前目录下的所有文件夹
folders=$(ls packages)
pwd=$(pwd)
echo $pwd
# 遍历文件夹
for folder in $folders
do
  cd "$pwd/$folder"
  git push
done