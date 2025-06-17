# SolarGard Checklist

Installation checklist manager for solar products.

## Features

- Manage installation checklists for solar products
- Professional user interface
- Cross-platform desktop application (Windows, macOS, Linux)
- Proper Windows installer with Start Menu integration

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run Electron app
npm run electron
```

## Building

### All Platforms
```bash
npm run build
```

### Windows Installer
```bash
npm run build-windows
```

This will create:
- NSIS installer (.exe) - Installs to Program Files and adds to Windows Start Menu
- Portable version - Can be run from any folder

### Individual Platforms
```bash
npm run build-win     # Windows
npm run build-mac     # macOS
npm run build-linux   # Linux
```

## Icon Creation

The app includes a professional solar-themed icon with:
- Gradient blue background
- Sun with radiating rays
- Checklist visual elements
- SolarGard branding

To generate icon files:
```bash
node create-icons.js
```

For best quality icons, consider using tools like:
- [Sharp](https://www.npmjs.com/package/sharp) for Node.js
- Online converters like [favicon.io](https://favicon.io/)
- Adobe Illustrator or similar design tools

## Windows Installation

The Windows installer will:
- Install the app to Program Files
- Create Start Menu shortcuts
- Add to Windows Programs list (Add/Remove Programs)
- Register file associations for .sgc files
- Create desktop shortcut (optional)

### Updates and Upgrades

When you install a new version:
- ✅ **Automatic replacement** - New installer detects and replaces the old version
- ✅ **Single entry** - Only one "SolarGard Checklist" appears in Programs & Features
- ✅ **User data preserved** - Your settings and data are kept safe
- ✅ **No manual uninstall needed** - The installer handles everything

The update process:
1. Run the new installer (`SolarGard Checklist-Setup-1.1.0.exe`)
2. It detects the existing installation
3. Automatically removes the old version
4. Installs the new version in the same location
5. Preserves all your user data and settings

## License

MIT 