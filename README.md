# SolarGard Checklist Manager

A professional installation checklist management application for solar products, built with Electron for cross-platform desktop deployment.

## Features

- ✅ **Digital Checklists**: Create and manage installation checklists
- 📸 **Image Support**: Add photos to checklist items for documentation
- 📄 **PDF Export**: Generate professional PDF reports with embedded images
- 🌐 **Network Access**: Access from mobile devices on the same network
- 💻 **Cross-Platform**: Available for Windows, Linux, and macOS

## Quick Start

### Desktop Application (Recommended)

1. **Download** the appropriate version for your platform:
   - **Windows**: `dist/win-unpacked/SolarGard Checklist.exe`
   - **Linux**: `dist/SolarGard Checklist-1.0.0.AppImage`

2. **Run** the application:
   - **Windows**: Double-click the `.exe` file
   - **Linux**: `chmod +x "SolarGard Checklist-1.0.0.AppImage" && ./SolarGard\ Checklist-1.0.0.AppImage`

3. **Access**: The app will automatically start a local server and open the interface

### Development Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run Electron app in development
npm run electron-dev
```

## Building from Source

```bash
# Build for all platforms
npm run build

# Build for specific platforms
npm run build-win    # Windows
npm run build-linux  # Linux AppImage
npm run build-mac    # macOS (requires macOS)
```

## Usage

1. **Create Checklist**: Click "Create New Checklist" to start
2. **Add Items**: Add checklist items with optional images
3. **Track Progress**: Mark items as completed during installation
4. **Generate PDF**: Export completed checklists as professional PDFs
5. **Mobile Access**: Use the network URL to access from phones/tablets

## Network Access

The application displays both local and network URLs:
- **Local**: `http://localhost:3000` (same computer)
- **Network**: `http://[your-ip]:3000` (other devices on same WiFi)

## Technical Details

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express
- **PDF Generation**: Puppeteer with base64 image embedding
- **File Upload**: Multer for image handling
- **Desktop**: Electron for cross-platform deployment

## Project Structure

```
solargard-checklist/
├── electron.js          # Electron main process
├── server.js           # Express server
├── public/             # Frontend files
├── assets/             # Application icons
├── data/               # Application data
├── uploads/            # User uploaded images
├── dist/               # Built applications
└── node_modules/       # Dependencies
```

## Development Notes

- Images are converted to base64 data URIs in PDFs for better compatibility
- Server automatically detects and displays network IP
- Electron builds use unpacked mode (`asar: false`) for better file access
- Path resolution handles both development and packaged environments

## License

MIT License - see LICENSE file for details 