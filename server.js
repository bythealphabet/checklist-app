const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Determine if running in Electron and packaged
const isElectron = process.env.ELECTRON_IS_PACKAGED === '1' || process.versions.electron;
const isPackaged = process.env.ELECTRON_IS_PACKAGED === '1';

// Get the appropriate data directory
function getDataDirectory() {
    if (isElectron && isPackaged) {
        // For packaged Electron app, use a directory next to the executable
        const execDir = path.dirname(process.execPath);
        return path.join(execDir, 'SolarGard-Data');
    } else if (isElectron) {
        // For development Electron, use current directory
        return __dirname;
    } else {
        // For standalone Node.js server
        return __dirname;
    }
}

// Get paths for data and uploads
const DATA_DIR = getDataDirectory();
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const DATA_FILE = path.join(DATA_DIR, 'data', 'checklists.json');
const INITIAL_DATA_FILE = path.join(__dirname, 'data', 'initial-data.json');

console.log('🗂️  Data directory:', DATA_DIR);
console.log('📁 Uploads directory:', UPLOADS_DIR);
console.log('📄 Data file:', DATA_FILE);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static(UPLOADS_DIR));

// Create necessary directories
const dirs = [
    path.join(DATA_DIR, 'data'),
    UPLOADS_DIR,
    'public'
];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log('✅ Created directory:', dir);
    }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Helper functions
function loadInitialData() {
    // Try to load from initial-data.json first, then fallback to hardcoded data
    try {
        if (fs.existsSync(INITIAL_DATA_FILE)) {
            const data = fs.readFileSync(INITIAL_DATA_FILE, 'utf8');
            const parsed = JSON.parse(data);
            // Convert initial-data format to checklists format if needed
            if (parsed.length > 0 && parsed[0].title) {
                return parsed.map(item => ({
                    id: item.id,
                    name: item.title,
                    items: item.items ? item.items.map(subItem => ({
                        name: subItem.text || subItem.name,
                        amount: subItem.quantity || subItem.amount || 1,
                        image: subItem.image || '',
                        completed: subItem.completed || false
                    })) : [],
                    createdAt: item.createdAt || new Date().toISOString(),
                    updatedAt: item.updatedAt || new Date().toISOString()
                }));
            }
            return parsed;
        }
    } catch (error) {
        console.log('Could not load initial-data.json, using fallback data');
    }

    // Fallback hardcoded data
    const initialChecklists = [
        {
            id: '1',
            name: 'Vertical Drop Awning',
            items: [
                { name: 'Wall Brackets (Set)', amount: 2, image: '', completed: false },
                { name: 'Awning Fabric', amount: 1, image: '', completed: false },
                { name: 'Bottom Rail', amount: 1, image: '', completed: false },
                { name: 'Side Guides', amount: 2, image: '', completed: false },
                { name: 'Mounting Screws', amount: 8, image: '', completed: false },
                { name: 'Wall Plugs', amount: 8, image: '', completed: false },
                { name: 'Wind Sensor (Optional)', amount: 1, image: '', completed: false }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: '2',
            name: 'Retractable Patio Awning',
            items: [
                { name: 'Awning Frame', amount: 1, image: '', completed: false },
                { name: 'Support Arms', amount: 2, image: '', completed: false },
                { name: 'Wall Mounting Brackets', amount: 3, image: '', completed: false },
                { name: 'Fabric Cover', amount: 1, image: '', completed: false },
                { name: 'Crank Handle', amount: 1, image: '', completed: false },
                { name: 'Heavy Duty Screws', amount: 12, image: '', completed: false },
                { name: 'Wall Anchors', amount: 12, image: '', completed: false },
                { name: 'Weather Shield', amount: 1, image: '', completed: false }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    return initialChecklists;
}

function initializeUserData() {
    // Only initialize if user data doesn't exist
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = loadInitialData();
        if (initialData.length > 0) {
            try {
                fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
                console.log('✅ Initialized user data with sample checklists');
                return initialData;
            } catch (error) {
                console.error('Error initializing user data:', error);
            }
        }
    }
    return null;
}

function getChecklists() {
    // If no user data exists, initialize with template data
    if (!fs.existsSync(DATA_FILE)) {
        const initialized = initializeUserData();
        if (initialized) {
            return initialized;
        }
        return [];
    }
    
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading checklists:', error);
        // If user data is corrupted, try to reinitialize
        const initialized = initializeUserData();
        return initialized || [];
    }
}

function saveChecklists(checklists) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(checklists, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving checklists:', error);
        return false;
    }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/create', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'create.html'));
});

app.get('/edit/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'edit.html'));
});

// API Routes
app.get('/api/checklists', (req, res) => {
    const checklists = getChecklists();
    res.json(checklists);
});

app.get('/api/checklists/:id', (req, res) => {
    const checklists = getChecklists();
    const checklist = checklists.find(c => c.id === req.params.id);
    if (!checklist) {
        return res.status(404).json({ error: 'Checklist not found' });
    }
    res.json(checklist);
});

// Get network info
app.get('/api/network-info', (req, res) => {
    const networkInterfaces = os.networkInterfaces();
    let networkIP = null;
    
    console.log('Available network interfaces:', Object.keys(networkInterfaces));
    
    // Find the first non-internal IPv4 address
    for (const interfaceName in networkInterfaces) {
        const addresses = networkInterfaces[interfaceName];
        console.log(`Interface ${interfaceName}:`, addresses.map(addr => ({
            family: addr.family,
            address: addr.address,
            internal: addr.internal
        })));
        
        for (const address of addresses) {
            if (address.family === 'IPv4' && !address.internal) {
                networkIP = address.address;
                console.log(`Found network IP: ${networkIP} on interface ${interfaceName}`);
                break;
            }
        }
        if (networkIP) break;
    }
    
    // If no network IP found, try to get a reasonable fallback
    if (!networkIP) {
        console.log('No external IPv4 address found, checking for common private network ranges...');
        
        // Look for common private network addresses as fallback
        for (const interfaceName in networkInterfaces) {
            const addresses = networkInterfaces[interfaceName];
            for (const address of addresses) {
                if (address.family === 'IPv4' && !address.internal) {
                    // Check for private network ranges
                    const ip = address.address;
                    if (ip.startsWith('192.168.') || 
                        ip.startsWith('10.') || 
                        (ip.startsWith('172.') && parseInt(ip.split('.')[1]) >= 16 && parseInt(ip.split('.')[1]) <= 31)) {
                        networkIP = ip;
                        console.log(`Using private network IP: ${networkIP}`);
                        break;
                    }
                }
            }
            if (networkIP) break;
        }
    }
    
    // Ultimate fallback
    if (!networkIP) {
        console.log('Still no network IP found, using localhost as fallback');
        networkIP = 'localhost';
    }
    
    const result = {
        localUrl: `http://localhost:${PORT}`,
        networkUrl: `http://${networkIP}:${PORT}`,
        networkIP: networkIP
    };
    
    console.log('Returning network info:', result);
    res.json(result);
});

// Generate PDF for checklist
app.get('/api/checklists/:id/pdf', async (req, res) => {
    console.log('PDF request received for checklist:', req.params.id);
    
    const checklists = getChecklists();
    const checklist = checklists.find(c => c.id === req.params.id);
    
    if (!checklist) {
        console.log('Checklist not found:', req.params.id);
        return res.status(404).json({ error: 'Checklist not found' });
    }

    console.log('Generating PDF for checklist:', checklist.name);
    console.log('Items count:', checklist.items ? checklist.items.length : 0);

    let browser;
    try {
        console.log('Launching Puppeteer...');
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]
        });
        
        const page = await browser.newPage();
        
        // Generate simplified HTML content for PDF
        console.log('Generating HTML content...');
        const htmlContent = generateSimplePDFHTML(checklist);
        console.log('HTML content length:', htmlContent.length);
        
        console.log('Setting HTML content...');
        await page.setContent(htmlContent, { 
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        console.log('Generating PDF...');
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });
        
        console.log('PDF generated successfully, size:', pdf.length, 'bytes');
        
        // Validate PDF buffer
        if (!pdf || pdf.length === 0) {
            throw new Error('Generated PDF is empty');
        }
        
        // Check if it starts with PDF signature
        const first5Bytes = pdf.slice(0, 5);
        const pdfSignature = String.fromCharCode(...first5Bytes);
        console.log('PDF signature:', pdfSignature);
        if (pdfSignature !== '%PDF-') {
            console.log('Invalid PDF signature, first 5 bytes:', Array.from(first5Bytes));
            throw new Error('Generated file is not a valid PDF');
        }
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${checklist.name.replace(/[^a-zA-Z0-9\s]/g, '_')}_checklist.pdf"`);
        res.setHeader('Content-Length', pdf.length);
        res.send(pdf);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Failed to generate PDF', 
            details: error.message 
        });
    } finally {
        if (browser) {
            try {
                await browser.close();
                console.log('Browser closed successfully');
            } catch (closeError) {
                console.error('Error closing browser:', closeError);
            }
        }
    }
});

// Simplified PDF HTML generation for debugging
function generateSimplePDFHTML(checklist) {
    const checklistName = checklist.name || 'Unnamed Checklist';
    const currentDate = new Date().toLocaleDateString();
    
    const itemsHTML = checklist.items && checklist.items.length > 0 
        ? checklist.items.map((item, index) => {
            const itemName = item.name || item.text || 'Unnamed item';
            const itemAmount = parseInt(item.amount) || 1;
            
            return `
            <tr>
                <td style="width: 30px; text-align: center;">☐</td>
                <td style="width: 60px; text-align: center;">${itemAmount}</td>
                <td>${itemName}</td>
            </tr>`;
        }).join('')
        : '<tr><td colspan="3" style="text-align: center; padding: 20px;">No items found</td></tr>';

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${checklistName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
        th { background-color: #f5f5f5; }
    </style>
</head>
<body>
    <h1>${checklistName}</h1>
    <p>Date: ${currentDate}</p>
    
    <table>
        <thead>
            <tr>
                <th>✓</th>
                <th>Qty</th>
                <th>Item</th>
            </tr>
        </thead>
        <tbody>
            ${itemsHTML}
        </tbody>
    </table>
    
    <div style="margin-top: 40px; border: 1px solid #333; padding: 20px; min-height: 100px;">
        <strong>Notes:</strong><br>
        <br><br><br>
    </div>
</body>
</html>`;
}

// Upload single image for checklist item
app.post('/api/upload-item-image', upload.single('itemImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
    }
    
    res.json({
        success: true,
        imagePath: `/uploads/${req.file.filename}`,
        filename: req.file.filename
    });
});

app.post('/api/checklists', (req, res) => {
    console.log('Creating new checklist...');
    
    try {
        const { name, items } = req.body;
        
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Checklist name is required' });
        }

        const newChecklist = {
            id: Date.now().toString(),
            name: name.trim(),
            items: items || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Save checklist
        const checklists = getChecklists();
        checklists.push(newChecklist);
        saveChecklists(checklists);

        console.log('Checklist created successfully:', newChecklist.id);
        res.json({ success: true, checklist: newChecklist });
    } catch (error) {
        console.error('Error creating checklist:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.put('/api/checklists/:id', (req, res) => {
    console.log('Updating checklist:', req.params.id);
    
    try {
        const checklistId = req.params.id;
        const { name, items } = req.body;
        
        const checklists = getChecklists();
        const checklistIndex = checklists.findIndex(c => c.id === checklistId);
        
        if (checklistIndex === -1) {
            return res.status(404).json({ success: false, message: 'Checklist not found' });
        }

        // Update checklist
        checklists[checklistIndex] = {
            ...checklists[checklistIndex],
            name: name || checklists[checklistIndex].name,
            items: items || checklists[checklistIndex].items,
            updatedAt: new Date().toISOString()
        };

        saveChecklists(checklists);
        
        console.log('Checklist updated successfully:', checklistId);
        res.json({ success: true, checklist: checklists[checklistIndex] });
    } catch (error) {
        console.error('Error updating checklist:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.delete('/api/checklists/:id', (req, res) => {
    const checklists = getChecklists();
    const index = checklists.findIndex(c => c.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Checklist not found' });
    }
    
    checklists.splice(index, 1);
    
    if (saveChecklists(checklists)) {
        res.json({ message: 'Checklist deleted successfully' });
    } else {
        res.status(500).json({ error: 'Failed to delete checklist' });
    }
});

app.listen(PORT, () => {
    const networkInterfaces = os.networkInterfaces();
    let networkIP = 'localhost';
    
    // Find the first non-internal IPv4 address
    for (const interfaceName in networkInterfaces) {
        const addresses = networkInterfaces[interfaceName];
        for (const address of addresses) {
            if (address.family === 'IPv4' && !address.internal) {
                networkIP = address.address;
                break;
            }
        }
        if (networkIP !== 'localhost') break;
    }
    
    console.log(`\n🚀 SolarGard Checklist Manager is running!`);
    console.log(`\n📱 Access Options:`);
    console.log(`   Local (this computer): http://localhost:${PORT}`);
    console.log(`   Network (phone/tablet): http://${networkIP}:${PORT}`);
    console.log(`\n💡 To access from your phone:`);
    console.log(`   1. Make sure phone is on same WiFi network`);
    console.log(`   2. Open browser on phone`);
    console.log(`   3. Go to: http://${networkIP}:${PORT}`);
    console.log(`\n🔧 Press Ctrl+C to stop the server\n`);
}); 