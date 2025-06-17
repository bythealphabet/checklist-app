const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Building SolarGard Checklist for Windows...');

// Step 1: Ensure build directory exists
if (!fs.existsSync('build')) {
  fs.mkdirSync('build');
  console.log('✅ Created build directory');
}

// Step 2: Generate icons
console.log('🎨 Generating icons...');
try {
  execSync('node create-icons.js', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️  Icon generation completed with warnings');
}

// Step 3: Clean previous builds
console.log('🧹 Cleaning previous builds...');
try {
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
} catch (error) {
  console.log('⚠️  Could not clean previous builds');
}

// Step 4: Build for Windows
console.log('🏗️  Building Windows installer and portable version...');
try {
  execSync('npm run build-win', { stdio: 'inherit' });
  console.log('✅ Windows build completed successfully!');
  
  // List the generated files
  if (fs.existsSync('dist')) {
    const files = fs.readdirSync('dist');
    console.log('\n📦 Generated files:');
    files.forEach(file => {
      const filePath = path.join('dist', file);
      const stats = fs.statSync(filePath);
      const size = (stats.size / 1024 / 1024).toFixed(2);
      console.log(`   ${file} (${size} MB)`);
    });
  }
  
  console.log('\n🎉 Build complete!');
  console.log('📋 Installation options:');
  console.log('   1. NSIS Installer (.exe) - Installs to Program Files and adds to Start Menu');
  console.log('   2. Portable version - Can be run from any folder');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 