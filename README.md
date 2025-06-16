# SolarGard Installation Checklist Manager

A simple Node.js web application for managing installation checklists for solar products. This application helps ensure you don't forget anything before leaving for an installation.

## Features

- 📋 **Create Checklists**: Add new installation checklists for different solar products
- 🖼️ **Product Images**: Upload and display product images for easy identification
- ✅ **Interactive Checklists**: Check off items as you complete them with real-time progress tracking
- 📝 **Reminders Section**: Add notes about extra items to buy or special installation requirements
- ✏️ **Edit Mode**: Update existing checklists, add/remove items, and modify content
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 💾 **Auto-save**: Automatically saves progress when checking off items

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Setup

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd solargard-checklist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

### Creating a New Checklist

1. Click "Create New Checklist" on the home page
2. Enter the product name (e.g., "Solar Panel System Model X")
3. Upload a product image (optional)
4. Add checklist items - the form comes with some default items, but you can:
   - Modify existing items
   - Add new items with the "+ Add Item" button
   - Remove items with the "Remove" button
5. Add any reminders or extra items in the text area
6. Click "Create Checklist"

### Using a Checklist

1. From the home page, click "View" on any checklist
2. Check off items as you complete them
3. Progress is automatically saved and displayed with a progress bar
4. View reminders and extra items in the right panel

### Editing a Checklist

1. Click "Edit" on any checklist from the home page, or
2. Click "Edit Checklist" when viewing a checklist
3. In edit mode you can:
   - Add new checklist items
   - Remove existing items
   - Modify item text
   - Update the reminders section
4. Click "Save Changes" to save your modifications

### Managing Checklists

- **View All**: The home page shows all your checklists with preview images
- **Delete**: Remove checklists you no longer need
- **Search**: Checklists show item count and last updated date

## File Structure

```
solargard-checklist/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── public/                # Static web files
│   ├── index.html        # Home page
│   ├── create.html       # Create new checklist
│   └── edit.html         # View/edit checklist
├── data/                 # JSON data storage
│   └── checklists.json   # Checklist data
├── uploads/              # Uploaded images
└── README.md            # This file
```

## Data Storage

The application stores data in JSON files:
- **Checklists**: Stored in `data/checklists.json`
- **Images**: Stored in the `uploads/` directory

Each checklist contains:
```json
{
  "id": "unique-id",
  "name": "Product Name",
  "image": "/uploads/image-file.jpg",
  "items": [
    {
      "text": "Check site conditions",
      "completed": false
    }
  ],
  "reminders": "Extra items to buy...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Customization

### Default Checklist Items
You can modify the default checklist items in `public/create.html` by editing the `defaultItems` array:

```javascript
const defaultItems = [
    'Check site conditions and safety',
    'Verify all equipment is present',
    'Prepare installation tools',
    'Review installation manual'
];
```

### Styling
The application uses inline CSS for simplicity. You can modify the styles in each HTML file to match your branding.

### Port Configuration
By default, the application runs on port 3000. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in `server.js` or kill the process using port 3000
   - Use: `lsof -ti:3000 | xargs kill -9` (macOS/Linux)

2. **Images not displaying**
   - Check that the `uploads/` directory exists and has proper permissions
   - Ensure uploaded files are valid image formats

3. **Data not saving**
   - Check that the `data/` directory exists and is writable
   - Look for error messages in the console

### Development

To run in development mode with automatic restarts:
```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when files change.

## License

MIT License - feel free to modify and use for your solar installation business!

## Support

For issues or questions, please check the console for error messages and ensure all dependencies are properly installed. 