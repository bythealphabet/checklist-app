#!/bin/bash

# SolarGard Checklist Build Script
# Handles cross-platform builds with proper Wine setup

echo "🚀 SolarGard Checklist Build Script"
echo "=================================="

# Ensure /usr/local/bin is in PATH for wine
export PATH="/usr/local/bin:$PATH"

# Check if Wine is installed
check_wine() {
    if command -v wine &> /dev/null; then
        echo "✅ Wine is installed"
        
        # Check if wine works properly
        if wine --version &> /dev/null; then
            echo "✅ Wine is functional"
            return 0
        else
            echo "⚠️  Wine is installed but may have issues"
            return 1
        fi
    else
        echo "❌ Wine is not installed"
        return 1
    fi
}

# Fix Wine32 issues
fix_wine32() {
    echo "🔧 Fixing Wine32 configuration..."
    
    # Remove and recreate Wine prefix
    rm -rf $HOME/.wine
    export WINEPREFIX=$HOME/.wine
    export WINEARCH=win32
    
    # Initialize Wine
    if command -v wineboot &> /dev/null; then
        wineboot --init
        echo "✅ Wine32 fix complete"
    else
        echo "⚠️  wineboot not found, Wine may not be properly installed"
    fi
}

# Install Wine if not present
install_wine() {
    echo "📦 Installing Wine..."
    
    # Try to install Wine from Ubuntu repositories (simpler approach)
    sudo apt update
    sudo apt install -y wine winetricks
    
    # Initialize Wine with proper configuration
    echo "🔧 Initializing Wine..."
    export WINEPREFIX=$HOME/.wine
    export WINEARCH=win32
    
    # Initialize Wine (this may take a moment)
    if command -v wineboot &> /dev/null; then
        wineboot --init
        
        # Configure Wine for better compatibility
        echo "🔧 Configuring Wine for compatibility..."
        if command -v winetricks &> /dev/null; then
            winetricks --unattended corefonts vcrun2019
        else
            echo "⚠️  winetricks not available, skipping additional configuration"
        fi
    else
        echo "⚠️  wineboot not found after installation"
    fi
    
    echo "✅ Wine setup complete"
}

# Build function
build_app() {
    local target=$1
    echo "🔨 Building for $target..."
    
    case $target in
        "linux")
            npm run build-linux
            ;;
        "windows")
            if check_wine; then
                echo "🔨 Attempting Windows build..."
                if npm run build-win; then
                    echo "✅ Windows build successful"
                    create_portable_archives
                else
                    echo "❌ Windows build failed, trying Wine32 fix..."
                    read -p "Fix Wine32 configuration? (y/n): " -n 1 -r
                    echo
                    if [[ $REPLY =~ ^[Yy]$ ]]; then
                        fix_wine32
                        echo "🔄 Retrying Windows build..."
                        if npm run build-win; then
                            create_portable_archives
                        fi
                    else
                        echo "❌ Skipping Wine32 fix"
                    fi
                fi
            else
                echo "⚠️  Wine is required for Windows builds"
                read -p "Install Wine? (y/n): " -n 1 -r
                echo
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    install_wine
                    if npm run build-win; then
                        create_portable_archives
                    fi
                else
                    echo "❌ Skipping Windows build"
                fi
            fi
            ;;
        "all")
            build_app "linux"
            build_app "windows"
            ;;
        *)
            echo "❌ Unknown target: $target"
            echo "Available targets: linux, windows, all"
            exit 1
            ;;
    esac
}

# Create portable archives for Windows build
create_portable_archives() {
    if [ -d "dist/win-unpacked" ]; then
        echo "📦 Creating portable archives..."
        
        # Create tar.gz archive (more reliable)
        cd dist
        tar -czf "SolarGard-Checklist-1.0.0-Portable.tar.gz" win-unpacked/
        echo "✅ Created: SolarGard-Checklist-1.0.0-Portable.tar.gz ($(du -h SolarGard-Checklist-1.0.0-Portable.tar.gz | cut -f1))"
        
        # Create instructions file
        cat > "PORTABLE-INSTRUCTIONS.txt" << EOF
SolarGard Checklist - Portable Windows Version
=============================================

TRANSFER TO WINDOWS PC:
1. Copy 'SolarGard-Checklist-1.0.0-Portable.tar.gz' to your Windows PC via USB
2. Extract the archive using 7-Zip, WinRAR, or Windows built-in extractor
3. Navigate to the extracted 'win-unpacked' folder
4. Double-click 'SolarGard Checklist.exe' to run the application

DATA TRANSFER:
- Your current data is NOT included in the portable app (for clean distribution)
- To transfer your data, run: npm run package-data
- This creates 'SolarGard-Data-Package.tar.gz' with your checklists and images
- Extract this package on the Windows PC and follow the included instructions

AUTOMATIC DATA LOCATION:
- The portable app creates a 'SolarGard-Data' folder next to the executable
- All user data and uploads are stored there for easy backup/transfer
- To move data between computers, just copy the 'SolarGard-Data' folder

NO INSTALLATION REQUIRED:
- The application runs directly from the extracted folder
- All dependencies are included
- You can run it from USB drive or any folder
- No admin rights needed

SYSTEM REQUIREMENTS:
- Windows 10 or newer (64-bit)
- ~200MB disk space when extracted

TROUBLESHOOTING:
- If Windows shows a security warning, click "More info" then "Run anyway"
- The app may take a few seconds to start on first run
- Make sure all files in the win-unpacked folder stay together

Created: $(date)
EOF
        
        echo "✅ Created: PORTABLE-INSTRUCTIONS.txt"
        cd ..
        
        # Create data package if data exists
        if [ -d "data" ] || [ -d "uploads" ]; then
            echo "📦 Creating data package..."
            npm run package-data
            if [ -f "SolarGard-Data-Package.tar.gz" ]; then
                mv "SolarGard-Data-Package.tar.gz" "dist/"
                echo "✅ Data package moved to dist/ folder"
            fi
        else
            echo "ℹ️  No existing data to package"
        fi
        
        echo "📁 Portable files ready in dist/ folder:"
        ls -lh dist/SolarGard-Checklist-1.0.0-Portable.tar.gz dist/PORTABLE-INSTRUCTIONS.txt
        if [ -f "dist/SolarGard-Data-Package.tar.gz" ]; then
            ls -lh dist/SolarGard-Data-Package.tar.gz
        fi
    else
        echo "⚠️  Windows build not found, skipping portable archive creation"
    fi
}

# Main script
if [ $# -eq 0 ]; then
    echo "Usage: $0 [linux|windows|all]"
    echo "Example: $0 linux"
    exit 1
fi

# Ensure dependencies are installed
echo "📦 Installing dependencies..."
npm install

# Build for specified target
build_app $1

echo "✅ Build complete!"
echo "📁 Check the 'dist' folder for built applications" 