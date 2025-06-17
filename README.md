# SolarGard Checklist - Desktop Application

A desktop application for managing solar installation checklists, built with Electron and Express.

## Features

- ✅ Desktop application (no browser required)
- 📋 Create and manage installation checklists
- 📸 Photo attachments for checklist items
- 💾 Local data storage
- 🖥️ Cross-platform (Windows, macOS, Linux)

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation
```bash
npm install
```

### Running in Development
```bash
# Run the Electron app in development mode
npm run electron-dev

# Or run just the web server (for browser testing)
npm start
```

## Building for Production

### Build for Current Platform
```bash
npm run build
```

### Build for Specific Platforms
```bash
# Windows
npm run build-win

# macOS
npm run build-mac

# Linux
npm run build-linux
```

### Build All Platforms
```bash
npm run dist
```

The built applications will be available in the `dist/` directory.

## File Structure

```
solargard-checklist/
├── electron.js          # Main Electron process
├── server.js           # Express server
├── package.json        # Dependencies and build config
├── public/            # Static web assets
│   ├── index.html
│   ├── style.css
│   └── script.js
├── data/              # Data storage
│   └── initial-data.json
├── uploads/           # Photo uploads
└── assets/           # Application icons
```

## How It Works

1. **Electron Main Process**: `electron.js` creates the desktop window and manages the application lifecycle
2. **Express Server**: `server.js` runs internally to serve the web interface and handle API requests
3. **Web Interface**: The familiar web interface runs inside the Electron window
4. **Data Storage**: All data is stored locally in JSON files

## Usage

1. **Development**: Run `npm run electron-dev` to start the app with developer tools
2. **Production**: Run `npm run build` to create an executable for your platform
3. **Distribution**: Share the built executable - no installation of Node.js required on target machines

## Customization

- **Icons**: Replace files in `assets/` directory with your custom icons
- **Window Settings**: Modify `electron.js` to change window size, title, etc.
- **Build Settings**: Update the `build` section in `package.json` for custom build configurations

## Troubleshooting

- **Port Issues**: The app uses port 3000 internally. If you have conflicts, modify the port in both `server.js` and `electron.js`
- **Build Issues**: Ensure all dependencies are installed with `npm install`
- **Icon Issues**: The app will work without custom icons, but you may see warnings during build

## License

MIT 