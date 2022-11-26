#! /bin/bash +x

git switch dev
git add .
git commit -m "update bot"
git push


git switch stage
git pull
git merge dev
git add .
git commit -m "update bot"
git push


git switch main
git pull
git merge stage
git add .
git commit -m "update bot"
git push

git switch dev