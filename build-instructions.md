# Building SolarGard Checklist as Windows Executable

## 🎯 **Quick Start**

To create a Windows executable (.exe) file:

```bash
# Install pkg (if not already installed)
npm install

# Build Windows executable
npm run build
```

The executable will be created at: `dist/solargard-checklist.exe`

## 📦 **Build Options**

### **Windows Only**
```bash
npm run build
```
Creates: `dist/solargard-checklist.exe` (Windows 64-bit)

### **All Platforms**
```bash
npm run build-all
```
Creates executables for:
- Windows 64-bit
- Linux 64-bit  
- macOS 64-bit

## 🚀 **How to Use the Executable**

1. **Copy the executable** to your desired location
2. **Double-click** `solargard-checklist.exe` to run
3. **Open browser** and go to `http://localhost:3000`
4. **Use the application** normally

## 📁 **What Gets Included**

The executable includes:
- ✅ Node.js runtime
- ✅ All application code
- ✅ HTML/CSS/JS files
- ✅ Dependencies
- ✅ Empty data and uploads folders

## ⚠️ **Important Notes**

### **First Run**
- The exe creates `data/` and `uploads/` folders automatically
- No installation required - just run the exe!

### **Data Location**
- Data files are created **next to the executable**
- Your checklists are saved in `data/checklists.json`
- Uploaded images go in the `uploads/` folder

### **Firewall**
- Windows may ask for firewall permission (allow it)
- The app runs a local web server on port 3000

### **Antivirus**
- Some antivirus software may flag the exe (false positive)
- Add exception if needed

## 🔧 **Advanced Build Options**

### **Custom Output Name**
```bash
pkg . --targets node18-win-x64 --output my-custom-name.exe
```

### **Different Node Version**
```bash
pkg . --targets node16-win-x64 --output dist/solargard-checklist.exe
```

### **Include Additional Files**
Edit `package.json` and modify the `pkg.assets` section:
```json
"pkg": {
  "assets": [
    "public/**/*",
    "data/**/*", 
    "uploads/**/*",
    "my-extra-files/**/*"
  ]
}
```

## 🐛 **Troubleshooting**

### **Build Fails**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
npm run build
```

### **Executable Won't Start**
- Check Windows version (requires Windows 7+)
- Run from command prompt to see error messages:
  ```cmd
  solargard-checklist.exe
  ```

### **Port Already in Use**
- Close other applications using port 3000
- Or modify `server.js` to use a different port

### **Missing Files**
If the exe can't find files, make sure they're listed in `pkg.assets` in `package.json`

## 📋 **Distribution Checklist**

When sharing the executable:

- [ ] Test the exe on a clean Windows machine
- [ ] Include a README with basic instructions
- [ ] Mention firewall/antivirus considerations
- [ ] Provide your contact info for support

## 🎁 **Alternative: Portable Package**

Instead of just the exe, you can create a complete portable package:

1. Create a folder: `SolarGard-Checklist-Portable`
2. Copy the exe into it
3. Add a `README.txt` with instructions
4. Zip the folder for distribution

This makes it clear to users what they're getting and how to use it.

## 🔄 **Updating**

To update the application:
1. Make your code changes
2. Run `npm run build` again
3. Replace the old exe with the new one
4. User data (checklists, images) will be preserved 