@echo off
echo Creating SolarGard Checklist Portable Package...

REM Create the portable package directory
mkdir "SolarGard-Checklist-Portable" 2>nul

REM Copy the executable
copy "dist\solargard-checklist.exe" "SolarGard-Checklist-Portable\" >nul

REM Create a simple README for users
echo SolarGard Installation Checklist Manager > "SolarGard-Checklist-Portable\README.txt"
echo. >> "SolarGard-Checklist-Portable\README.txt"
echo HOW TO USE: >> "SolarGard-Checklist-Portable\README.txt"
echo 1. Double-click solargard-checklist.exe >> "SolarGard-Checklist-Portable\README.txt"
echo 2. Open your web browser >> "SolarGard-Checklist-Portable\README.txt"
echo 3. Go to: http://localhost:3000 >> "SolarGard-Checklist-Portable\README.txt"
echo 4. Create and manage your installation checklists! >> "SolarGard-Checklist-Portable\README.txt"
echo. >> "SolarGard-Checklist-Portable\README.txt"
echo NOTES: >> "SolarGard-Checklist-Portable\README.txt"
echo - Windows may ask for firewall permission (click Allow) >> "SolarGard-Checklist-Portable\README.txt"
echo - Your checklists and images are saved in data/ and uploads/ folders >> "SolarGard-Checklist-Portable\README.txt"
echo - No installation required - just run the exe! >> "SolarGard-Checklist-Portable\README.txt"
echo. >> "SolarGard-Checklist-Portable\README.txt"
echo For support, contact: [your-email@company.com] >> "SolarGard-Checklist-Portable\README.txt"

echo.
echo ✅ Portable package created in: SolarGard-Checklist-Portable\
echo.
echo You can now:
echo - Copy this folder to other computers
echo - Zip it for email distribution
echo - Put it on a USB drive
echo.
pause 