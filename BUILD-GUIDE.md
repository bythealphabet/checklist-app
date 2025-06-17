# SolarGard Checklist Build Guide

This guide addresses common build issues and provides step-by-step instructions for building the SolarGard Checklist application on Linux and Windows.

## 🚨 Common Issues & Solutions

### Issue 1: Windows Build Fails with "wine32 is missing"
**Solution**: Install Wine for cross-platform builds on Linux:
```bash
sudo apt update
sudo apt install wine wine32 winetricks
winecfg  # Initialize Wine
```

### Issue 2: "Not found" errors in built applications
**Solution**: The build configuration has been updated to properly include all necessary files. The application should now work correctly.

### Issue 3: Graphics warnings in Linux AppImage
**Solution**: These are harmless graphics driver warnings. The application works correctly despite these messages.

## 🛠️ Build Methods

### Method 1: Using Our Build Script (Recommended)
```bash
# Make script executable (first time only)
chmod +x build.sh

# Build for Linux only
./build.sh linux

# Build for Windows only (requires Wine)
./build.sh windows

# Build for both platforms
./build.sh all
```

### Method 2: Using NPM Scripts
```bash
# Install dependencies
npm install

# Build for Linux
npm run build-linux

# Build for Windows (requires Wine)
npm run build-win

# Build for Linux only (no cross-compilation)
npm run build-linux-only
```

### Method 3: Using Docker (Consistent builds)
```bash
# Build the Docker image
docker build -f Dockerfile.build -t solargard-builder .

# Run the build
docker run --rm -v $(pwd)/dist:/app/dist solargard-builder
```

## 🧪 Testing Your Builds

After building, test your applications:
```bash
# Make test script executable (first time only)
chmod +x test-build.sh

# Run tests
./test-build.sh
```

## 📦 Build Outputs

Successful builds create:
- **Linux**: `dist/SolarGard Checklist-1.0.0.AppImage` (portable application)
- **Windows**: `dist/win-unpacked/SolarGard Checklist.exe` (portable executable)

## 🚀 Running the Built Applications

### Linux AppImage
```bash
# Make executable (if not already)
chmod +x "dist/SolarGard Checklist-1.0.0.AppImage"

# Run the application
./dist/SolarGard\ Checklist-1.0.0.AppImage
```

### Windows Executable
On Windows:
```cmd
dist\win-unpacked\SolarGard Checklist.exe
```

On Linux with Wine:
```bash
wine "dist/win-unpacked/SolarGard Checklist.exe"
```

## 🔧 Advanced Configuration

### Building Without Wine (Linux Only)
If you only need Linux builds and want to avoid Wine:
```bash
npm run build-linux-only
```

### Custom Build Configuration
Edit `package.json` in the `build` section to customize:
- Output formats
- Icon files  
- Included resources
- Target platforms

## 📋 Troubleshooting Checklist

### Before Building:
- [ ] Node.js and npm are installed
- [ ] Dependencies installed (`npm install`)
- [ ] Icon files exist in `assets/` folder

### For Windows Builds:
- [ ] Wine is installed (`wine --version`)
- [ ] Wine is initialized (`winecfg`)
- [ ] 32-bit Wine architecture is set

### For Linux Builds:
- [ ] AppImage tools are available (usually automatic)
- [ ] Sufficient disk space in `dist/` folder

### If Builds Fail:
1. Clear cache and reinstall:
   ```bash
   rm -rf node_modules dist
   npm cache clean --force
   npm install
   ```

2. Check build logs for specific errors
3. Try building one platform at a time
4. Use the Docker method for consistent results

## 🎯 Quick Start Summary

For most users, this is all you need:
```bash
# One-time setup
npm install
chmod +x build.sh test-build.sh

# Build for your platform
./build.sh linux          # Linux users
./build.sh windows        # Windows users (requires Wine)

# Test the build
./test-build.sh

# Run the application
./dist/SolarGard\ Checklist-1.0.0.AppImage  # Linux
```

## 📞 Need Help?

If you encounter issues not covered here:
1. Check the console output for specific error messages
2. Try the Docker build method
3. Consider building on the target platform directly
4. Check that all required files are present in your project 