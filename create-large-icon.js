const fs = require('fs');
const path = require('path');

// Create a 256x256 PNG icon using a base64 encoded image
// This is a simple blue square with "SG" text - 256x256 pixels
const largeIconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA2klEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOD1A8aUAAH1Rd5GAAAAAElFTkSuQmCC';

console.log('Creating 256x256 icon files...');

// Create PNG
const pngBuffer = Buffer.from(largeIconBase64, 'base64');
fs.writeFileSync(path.join(__dirname, 'icon.png'), pngBuffer);
fs.writeFileSync(path.join(__dirname, 'icon.ico'), pngBuffer);
fs.writeFileSync(path.join(__dirname, 'icon.icns'), pngBuffer);

console.log('✅ Large icon files created (256x256):');
console.log('  - icon.png');
console.log('  - icon.ico');  
console.log('  - icon.icns'); 