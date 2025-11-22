#!/bin/bash

# ========================================
# Create New Lead Magnet Landing Page
# ========================================
# This script duplicates an existing lead magnet page
# and updates it for a new Brevo list.
#
# Usage:
#   ./create-lead-page.sh 9

set -e  # Exit on error

# ========================================
# Configuration
# ========================================
SOURCE_PAGE="lead-gift-8"
BASE_DIR="src/app/(public)"

# ========================================
# Validate Input
# ========================================
if [ -z "$1" ]; then
  echo "❌ Error: Missing list ID"
  echo ""
  echo "Usage: ./create-lead-page.sh <list-id>"
  echo "Example: ./create-lead-page.sh 9"
  exit 1
fi

LIST_ID=$1
TARGET_PAGE="lead-gift-$LIST_ID"
SOURCE_PATH="$BASE_DIR/$SOURCE_PAGE"
TARGET_PATH="$BASE_DIR/$TARGET_PAGE"

# ========================================
# Check if source exists
# ========================================
if [ ! -d "$SOURCE_PATH" ]; then
  echo "❌ Error: Source page not found at $SOURCE_PATH"
  exit 1
fi

# ========================================
# Check if target already exists
# ========================================
if [ -d "$TARGET_PATH" ]; then
  echo "⚠️  Warning: Target page already exists at $TARGET_PATH"
  read -p "Do you want to overwrite it? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
  fi
  rm -rf "$TARGET_PATH"
fi

# ========================================
# Copy the directory
# ========================================
echo "📁 Creating new landing page directory..."
cp -r "$SOURCE_PATH" "$TARGET_PATH"

# ========================================
# Update LIST_ID in page.tsx
# ========================================
echo "✏️  Updating LIST_ID to $LIST_ID..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s/const LIST_ID = [0-9]\+;/const LIST_ID = $LIST_ID;/" "$TARGET_PATH/page.tsx"
else
  # Linux
  sed -i "s/const LIST_ID = [0-9]\+;/const LIST_ID = $LIST_ID;/" "$TARGET_PATH/page.tsx"
fi

# ========================================
# Success!
# ========================================
echo ""
echo "✅ Success! New landing page created!"
echo ""
echo "📍 Location: $TARGET_PATH"
echo "🔗 URL: /lead-gift-$LIST_ID"
echo ""
echo "🎯 Next steps:"
echo "  1. Make sure list #$LIST_ID exists in Brevo"
echo "  2. Customize the copy in $TARGET_PATH/page.tsx"
echo "  3. Test it: npm run dev"
echo "  4. Visit: http://localhost:3000/lead-gift-$LIST_ID"
echo ""
echo "📝 Need help? Check guides/LEAD_MAGNET_GUIDE.md"
echo ""

