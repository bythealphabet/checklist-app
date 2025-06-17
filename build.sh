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
                else
                    echo "❌ Windows build failed, trying Wine32 fix..."
                    read -p "Fix Wine32 configuration? (y/n): " -n 1 -r
                    echo
                    if [[ $REPLY =~ ^[Yy]$ ]]; then
                        fix_wine32
                        echo "🔄 Retrying Windows build..."
                        npm run build-win
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
                    npm run build-win
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