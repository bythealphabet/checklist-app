// This is a placeholder - you should replace this with actual icon files
// For now, we'll create a simple SVG that can be converted to PNG
const fs = require('fs');

const svgIcon = `
<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" fill="#2563eb" rx="32"/>
  <circle cx="128" cy="80" r="40" fill="#fbbf24"/>
  <rect x="88" y="120" width="80" height="8" fill="#10b981" rx="4"/>
  <rect x="88" y="140" width="80" height="8" fill="#10b981" rx="4"/>
  <rect x="88" y="160" width="80" height="8" fill="#10b981" rx="4"/>
  <rect x="88" y="180" width="80" height="8" fill="#10b981" rx="4"/>
  <text x="128" y="220" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">SolarGard</text>
</svg>
`;

fs.writeFileSync('assets/icon.svg', svgIcon);
console.log('SVG icon created. You should convert this to PNG/ICO/ICNS formats for better compatibility.'); 