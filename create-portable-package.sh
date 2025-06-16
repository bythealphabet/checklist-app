#!/bin/bash

echo "Creating SolarGard Checklist Portable Package..."

# Create the portable package directory
mkdir -p "SolarGard-Checklist-Portable"

# Copy the executable
cp "dist/solargard-checklist.exe" "SolarGard-Checklist-Portable/"

# Create a simple README for users
cat > "SolarGard-Checklist-Portable/README.txt" << EOF
SolarGard Installation Checklist Manager

HOW TO USE:
1. Double-click solargard-checklist.exe
2. Open your web browser
3. Go to: http://localhost:3000
4. Create and manage your installation checklists!

NOTES:
- Windows may ask for firewall permission (click Allow)
- Your checklists and images are saved in data/ and uploads/ folders
- No installation required - just run the exe!

For support, contact: [your-email@company.com]
EOF

echo ""
echo "✅ Portable package created in: SolarGard-Checklist-Portable/"
echo ""
echo "You can now:"
echo "- Copy this folder to other computers"
echo "- Zip it for email distribution"
echo "- Put it on a USB drive"
echo "" 