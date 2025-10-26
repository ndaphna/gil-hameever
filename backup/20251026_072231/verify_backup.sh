#!/bin/bash
# Backup Verification Script for Gil Hameever
# Generated: 2025-01-26 07:22:31

echo "🔍 Verifying Gil Hameever System Backup..."
echo "=========================================="

BACKUP_DIR="backup/20251026_072231"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "📅 Backup Date: $TIMESTAMP"
echo "📁 Backup Directory: $BACKUP_DIR"
echo ""

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ Backup directory not found!"
    exit 1
fi

echo "✅ Backup directory exists"

# Check database backup
if [ -f "$BACKUP_DIR/database/complete_schema_backup.sql" ]; then
    echo "✅ Complete database schema backup found"
    DB_SIZE=$(du -h "$BACKUP_DIR/database/complete_schema_backup.sql" | cut -f1)
    echo "   📊 Database backup size: $DB_SIZE"
else
    echo "❌ Database schema backup missing!"
fi

# Check source code backup
if [ -d "$BACKUP_DIR/source_code" ]; then
    echo "✅ Source code backup found"
    SRC_SIZE=$(du -sh "$BACKUP_DIR/source_code" | cut -f1)
    echo "   📊 Source code size: $SRC_SIZE"
    
    # Count files
    FILE_COUNT=$(find "$BACKUP_DIR/source_code" -type f | wc -l)
    echo "   📄 Files backed up: $FILE_COUNT"
else
    echo "❌ Source code backup missing!"
fi

# Check configuration backup
if [ -d "$BACKUP_DIR/config" ]; then
    echo "✅ Configuration files backup found"
    CONFIG_FILES=$(ls "$BACKUP_DIR/config" | wc -l)
    echo "   📄 Configuration files: $CONFIG_FILES"
else
    echo "❌ Configuration backup missing!"
fi

# Check documentation
if [ -f "$BACKUP_DIR/documentation/BACKUP_README.md" ]; then
    echo "✅ Backup documentation found"
    DOC_SIZE=$(du -h "$BACKUP_DIR/documentation/BACKUP_README.md" | cut -f1)
    echo "   📊 Documentation size: $DOC_SIZE"
else
    echo "❌ Backup documentation missing!"
fi

echo ""
echo "📊 Backup Summary:"
echo "=================="

# Calculate total backup size
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
echo "📦 Total backup size: $TOTAL_SIZE"

# Count total files
TOTAL_FILES=$(find "$BACKUP_DIR" -type f | wc -l)
echo "📄 Total files backed up: $TOTAL_FILES"

echo ""
echo "🔒 Security Check:"
echo "=================="

# Check for sensitive data in backup
if grep -r "sk-" "$BACKUP_DIR" > /dev/null 2>&1; then
    echo "⚠️  WARNING: Potential API keys found in backup!"
else
    echo "✅ No obvious API keys found in backup"
fi

if grep -r "password" "$BACKUP_DIR" > /dev/null 2>&1; then
    echo "⚠️  WARNING: Potential passwords found in backup!"
else
    echo "✅ No obvious passwords found in backup"
fi

echo ""
echo "✅ Backup verification completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Store backup in secure location"
echo "2. Test restoration process"
echo "3. Update environment variables"
echo "4. Verify all functionality"
echo ""
echo "🆘 For support, refer to BACKUP_README.md"
