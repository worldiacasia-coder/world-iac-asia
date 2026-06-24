#!/bin/bash
# Push local main branch to GitHub (worldiacasia-coder/world-iac-asia)
# Usage: bash scripts/push-to-github.sh

set -euo pipefail

REPO="https://github.com/worldiacasia-coder/world-iac-asia.git"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT"

echo "=== Trạng thái git ==="
git status -sb
echo ""
echo "Commits chờ push:"
git log origin/main..HEAD --oneline 2>/dev/null || git log --oneline -3
echo ""

read -r -s -p "Nhập GitHub Personal Access Token (worldiacasia-coder): " TOKEN
echo ""

if [ -z "$TOKEN" ]; then
  echo "Lỗi: Token không được để trống."
  exit 1
fi

git push "https://x-access-token:${TOKEN}@github.com/worldiacasia-coder/world-iac-asia.git" main

echo ""
echo "✓ Push thành công! Vercel sẽ tự deploy trong 1–3 phút."
echo "  Kiểm tra: https://world-iac-asia.vercel.app/vi/map"
