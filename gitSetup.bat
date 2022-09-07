@echo off
cls
echo Initial Git Setup...
echo.
git init
git add .
git commit -m "Initial"
git branch -M main
git remote add origin https://github.com/xxxxxxxxx.git
git push -u origin main
git push --set-upstream origin main
echo.
echo Done!


