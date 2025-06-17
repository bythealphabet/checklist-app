#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 SolarGard Data Package Creator');
console.log('=================================');

const DATA_DIR = './data';
const UPLOADS_DIR = './uploads';
const OUTPUT_DIR = './data-package';
const PACKAGE_NAME = 'SolarGard-Data-Package.tar.gz';

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('✅ Created output directory');
}

// Copy data directory
if (fs.existsSync(DATA_DIR)) {
    execSync(`cp -r ${DATA_DIR} ${OUTPUT_DIR}/`, { stdio: 'inherit' });
    console.log('✅ Copied data directory');
} else {
    console.log('⚠️  No data directory found');
}

// Copy uploads directory
if (fs.existsSync(UPLOADS_DIR)) {
    execSync(`cp -r ${UPLOADS_DIR} ${OUTPUT_DIR}/`, { stdio: 'inherit' });
    console.log('✅ Copied uploads directory');
    
    // Count files in uploads
    const uploadFiles = fs.readdirSync(UPLOADS_DIR).filter(f => f !== '.gitkeep');
    console.log(`📁 Packaged ${uploadFiles.length} uploaded files`);
} else {
    console.log('⚠️  No uploads directory found');
}

// Create instructions file
const instructions = `SolarGard Checklist - Data Package
=====================================

This package contains your checklist data and uploaded images.

TRANSFER TO WINDOWS PORTABLE APP:
1. Extract the Windows portable app (SolarGard-Checklist-1.0.0-Portable.tar.gz)
2. Extract this data package
3. Copy the 'data' and 'uploads' folders to the same directory as the 'SolarGard Checklist.exe'
4. Your directory structure should look like:
   📁 SolarGard-Checklist/
   ├── 📄 SolarGard Checklist.exe
   ├── 📁 data/
   │   └── 📄 checklists.json
   ├── 📁 uploads/
   │   └── 📄 [your uploaded images]
   └── 📁 [other app files...]

AUTOMATIC DATA LOCATION:
The portable app will automatically create a 'SolarGard-Data' folder next to the executable
and use that for storing new data. Your existing data will be imported on first run.

BACKUP YOUR DATA:
- Keep this data package as a backup
- The app will create new data in 'SolarGard-Data' folder
- You can copy data between computers by copying the 'SolarGard-Data' folder

Created: ${new Date().toISOString()}
Package contents:
- ${fs.existsSync(DATA_DIR) ? 'data/' : 'No data directory'}
- ${fs.existsSync(UPLOADS_DIR) ? 'uploads/ (' + fs.readdirSync(UPLOADS_DIR).filter(f => f !== '.gitkeep').length + ' files)' : 'No uploads directory'}
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'TRANSFER-INSTRUCTIONS.txt'), instructions);
console.log('✅ Created transfer instructions');

// Create the package
try {
    execSync(`tar -czf ${PACKAGE_NAME} -C ${OUTPUT_DIR} .`, { stdio: 'inherit' });
    console.log(`✅ Created data package: ${PACKAGE_NAME}`);
    
    // Get package size
    const stats = fs.statSync(PACKAGE_NAME);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📦 Package size: ${sizeInMB} MB`);
    
    // Clean up temporary directory
    execSync(`rm -rf ${OUTPUT_DIR}`, { stdio: 'inherit' });
    console.log('✅ Cleaned up temporary files');
    
    console.log('\n🎉 Data package created successfully!');
    console.log(`📁 Transfer file: ${PACKAGE_NAME}`);
    console.log('📋 Instructions: Extract and follow TRANSFER-INSTRUCTIONS.txt');
    
} catch (error) {
    console.error('❌ Error creating package:', error.message);
    process.exit(1);
} 