#!/bin/bash

echo "Testing SolarGard Checklist AppImage..."
echo "======================================="

# Make sure the AppImage is executable
chmod +x "dist/SolarGard Checklist-1.0.0.AppImage"

echo "Starting application..."
echo "If you see a blank page, check the console output below:"
echo ""

# Run the AppImage and capture output
"./dist/SolarGard Checklist-1.0.0.AppImage" 2>&1 | tee app-debug.log &

APP_PID=$!
echo "Application started with PID: $APP_PID"
echo "Console output is being saved to app-debug.log"
echo ""
echo "To stop the application, run: kill $APP_PID"
echo "To view live logs, run: tail -f app-debug.log" 