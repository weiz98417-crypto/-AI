#!/bin/bash
# GitHub Pages deploy script for 逛逛AI MVP
# Usage: bash scripts/deploy-gh-pages.sh

set -e

echo "Building 逛逛AI MVP..."

# Build both apps
npx pnpm install
npx pnpm build

# Create gh-pages directory
rm -rf gh-pages
mkdir -p gh-pages/user-app gh-pages/admin-app

# Copy built files
cp -r packages/user-app/dist/* gh-pages/user-app/
cp -r packages/admin-app/dist/* gh-pages/admin-app/

# Create index redirect
cat > gh-pages/index.html << 'HTML'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>逛逛AI</title>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fcf9f8; }
    a { display: block; padding: 20px 40px; margin: 12px; background: #874c63; color: white; text-decoration: none; border-radius: 16px; font-size: 18px; text-align: center; }
  </style>
</head>
<body>
  <div>
    <h1 style="text-align:center; color:#1b1c1c;">逛逛AI MVP</h1>
    <a href="/user-app/">用户端</a>
    <a href="/admin-app/">后台管理</a>
  </div>
</body>
</html>
HTML

echo ""
echo "Deploy to GitHub Pages:"
echo "  1. Push gh-pages directory to gh-pages branch:"
echo "     git subtree push --prefix gh-pages origin gh-pages"
echo ""
echo "  2. Or manually:"
echo "     cd gh-pages && git init && git add . && git commit -m 'deploy'"
echo "     git push -f origin main:gh-pages"
echo ""
echo "  3. Enable GitHub Pages in repo Settings → Pages → Source: gh-pages branch"
echo ""

# EdgeOne Pages config
cat > gh-pages/edgeone.json << 'JSON'
{
  "user-app": {
    "buildCommand": "pnpm -F @ggai/user-app build",
    "outputDirectory": "packages/user-app/dist"
  },
  "admin-app": {
    "buildCommand": "pnpm -F @ggai/admin-app build",
    "outputDirectory": "packages/admin-app/dist"
  }
}
JSON

echo "EdgeOne Pages config written to gh-pages/edgeone.json"
echo "Done!"
