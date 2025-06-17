# Changelog

## [1.0.0] - 2024-06-17

### 🎉 Major Release - Fully Working Electron Builds

### ✅ Fixed
- **PDF Generation**: Fixed image corruption by converting to base64 data URIs
- **Electron Builds**: Fixed blank page issues on Windows and Linux builds
- **Path Resolution**: Added robust path detection for packaged applications
- **Icon Issues**: Created proper 256x256 icons for Windows builds
- **ASAR Packaging**: Disabled asar for better file access in builds

### 🧹 Cleanup
- Removed temporary test files (`test*.pdf`, `test-*.sh`)
- Removed old portable build artifacts
- Cleaned up unused icon generation scripts
- Removed unused pkg configuration from package.json
- Updated .gitignore to ignore test files
- Reorganized project structure

### 🚀 Features
- **Network Access**: Added IP address display for mobile device access
- **Cross-Platform**: Working Windows (.exe) and Linux (AppImage) builds
- **Professional PDFs**: Images properly embedded in PDF exports
- **Loading Screen**: Added proper loading indication during startup

### 📁 Final Project Structure
```
solargard-checklist/
├── assets/             # Application icons
├── data/               # Application data
├── public/             # Frontend files
├── uploads/            # User uploaded images
├── electron.js         # Electron main process
├── server.js          # Express server
├── package.json       # Dependencies and build config
└── README.md          # Documentation
```

### 🛠️ Technical Details
- Electron 36.4.0
- Express 4.18.2
- Puppeteer 24.10.1 for PDF generation
- Disabled asar packaging for better compatibility
- Base64 image embedding for PDF reliability 