git init
git config user.email "israellobue@gmail.com"
git config user.name "Israel Lobue"
git add .
git commit -m "TRI Sales App: KPI metrics, brand colors, logo support, updated dashboards"
git remote add origin https://github.com/israel413808/TRI-Sales-Tracking-App.git
git branch -M main
git push -u origin main

Write-Host "✅ Done! Vercel should start redeploying automatically in 1-2 minutes."
pause
