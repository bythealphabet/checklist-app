# SolarGard Checklist - Data Transfer Guide

## How Data is Stored

Your **SolarGard Checklist** application uses a smart data storage system that adapts to different environments:

### 🖥️ **Development Mode** (Linux/Mac)
- **Location**: `./data/checklists.json` and `./uploads/`
- **Behavior**: Data stored in the project directory

### 📦 **Portable Windows App**
- **Location**: `SolarGard-Data/` folder next to the executable
- **Behavior**: Creates a dedicated data folder for portability

### 📁 **Data Structure**
```
SolarGard-Data/
├── data/
│   └── checklists.json          # Your checklists and progress
└── uploads/                     # Your uploaded images
    ├── image-123456789.jpg
    └── itemImage-987654321.png
```

## 🚀 Building and Transferring

### **Step 1: Build the Windows Portable App**
```bash
# Build for Windows (creates portable executable)
./build.sh windows
```

This creates:
- `dist/SolarGard-Checklist-1.0.0-Portable.tar.gz` - The app
- `dist/SolarGard-Data-Package.tar.gz` - Your data (if any exists)
- `dist/PORTABLE-INSTRUCTIONS.txt` - Transfer instructions

### **Step 2: Package Your Data** (Optional)
```bash
# Create a separate data package
npm run package-data
```

This creates `SolarGard-Data-Package.tar.gz` containing:
- Your current checklists
- All uploaded images
- Transfer instructions

## 📤 Transfer to Windows Computer

### **Method 1: Fresh Installation (No Data)**
1. Copy `SolarGard-Checklist-1.0.0-Portable.tar.gz` to Windows PC
2. Extract with 7-Zip/WinRAR
3. Run `SolarGard Checklist.exe`
4. App starts with template checklists

### **Method 2: With Your Data**
1. Copy both files to Windows PC:
   - `SolarGard-Checklist-1.0.0-Portable.tar.gz`
   - `SolarGard-Data-Package.tar.gz`
2. Extract the app first
3. Extract the data package
4. Copy `data/` and `uploads/` folders to the app directory
5. Run `SolarGard Checklist.exe`

## 🔄 Moving Data Between Computers

### **Easy Method: Copy SolarGard-Data Folder**
Once the portable app is running:
1. Close the app
2. Copy the entire `SolarGard-Data/` folder
3. Paste it next to the executable on the new computer
4. Start the app

### **Backup Method: Use Data Package Script**
```bash
# On source computer
npm run package-data

# Transfer SolarGard-Data-Package.tar.gz
# On destination computer, extract to app directory
```

## 📂 Directory Structures

### **Linux Development**
```
solargard-checklist/
├── server.js
├── data/
│   ├── checklists.json      # Your data
│   └── initial-data.json    # Templates
├── uploads/                 # Your images
└── [other app files]
```

### **Windows Portable**
```
SolarGard-Checklist/
├── SolarGard Checklist.exe
├── SolarGard-Data/          # Created automatically
│   ├── data/
│   │   └── checklists.json
│   └── uploads/
├── resources/
└── [other app files]
```

## 🛠️ Advanced Tips

### **Clean Distribution**
- The portable build excludes your personal data
- Only template data (`initial-data.json`) is included
- This allows clean distribution to other users

### **Data Migration**
- App automatically detects packaged vs development environment
- In packaged mode, creates `SolarGard-Data` next to executable
- Data is never lost - always stored in accessible location

### **Backup Strategy**
1. **Regular backups**: Copy `SolarGard-Data` folder
2. **Before transfers**: Run `npm run package-data`
3. **Cross-platform**: Data format is identical on all platforms

## 🚨 Troubleshooting

### **Data Not Appearing**
- Check if `SolarGard-Data` folder exists next to executable
- Verify `checklists.json` is in `SolarGard-Data/data/`
- Ensure uploaded images are in `SolarGard-Data/uploads/`

### **Images Not Loading**
- Images must be in the `uploads/` directory
- Image paths in `checklists.json` should match filenames
- Both data and uploads folders must be transferred together

### **App Shows Template Data**
- This is normal for fresh installations
- Your data package may not have been extracted correctly
- Check directory structure matches the examples above

## 📋 Quick Reference

| Action | Command | Output |
|--------|---------|--------|
| Build Windows app | `./build.sh windows` | `dist/SolarGard-Checklist-1.0.0-Portable.tar.gz` |
| Package current data | `npm run package-data` | `SolarGard-Data-Package.tar.gz` |
| Transfer data | Copy `SolarGard-Data/` folder | Preserves all data |

---

**💡 Pro Tip**: Keep your data package as a backup - you can always restore from it by extracting to the app directory! 