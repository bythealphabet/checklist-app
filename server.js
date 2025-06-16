const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Create necessary directories
const dirs = ['data', 'uploads', 'public'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Helper functions
function loadInitialData() {
    const initialDataPath = path.join(__dirname, 'data', 'initial-data.json');
    try {
        if (fs.existsSync(initialDataPath)) {
            const data = fs.readFileSync(initialDataPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading initial data:', error);
    }
    return [];
}

function initializeUserData() {
    const userDataPath = path.join(__dirname, 'data', 'checklists.json');
    
    // Only initialize if user data doesn't exist
    if (!fs.existsSync(userDataPath)) {
        const initialData = loadInitialData();
        if (initialData.length > 0) {
            try {
                fs.writeFileSync(userDataPath, JSON.stringify(initialData, null, 2));
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
    const dataPath = path.join(__dirname, 'data', 'checklists.json');
    
    // If no user data exists, initialize with template data
    if (!fs.existsSync(dataPath)) {
        const initialized = initializeUserData();
        if (initialized) {
            return initialized;
        }
        return [];
    }
    
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading checklists:', error);
        // If user data is corrupted, try to reinitialize
        const initialized = initializeUserData();
        return initialized || [];
    }
}

function saveChecklists(checklists) {
    const dataPath = path.join(__dirname, 'data', 'checklists.json');
    try {
        fs.writeFileSync(dataPath, JSON.stringify(checklists, null, 2));
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

app.post('/api/checklists', upload.single('image'), (req, res) => {
    const checklists = getChecklists();
    const newChecklist = {
        id: Date.now().toString(),
        name: req.body.name,
        image: req.file ? `/uploads/${req.file.filename}` : null,
        items: req.body.items ? JSON.parse(req.body.items) : [],
        reminders: req.body.reminders || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    checklists.push(newChecklist);
    
    if (saveChecklists(checklists)) {
        res.json(newChecklist);
    } else {
        res.status(500).json({ error: 'Failed to save checklist' });
    }
});

app.put('/api/checklists/:id', upload.single('image'), (req, res) => {
    const checklists = getChecklists();
    const index = checklists.findIndex(c => c.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Checklist not found' });
    }
    
    const updatedChecklist = {
        ...checklists[index],
        name: req.body.name || checklists[index].name,
        items: req.body.items ? JSON.parse(req.body.items) : checklists[index].items,
        reminders: req.body.reminders !== undefined ? req.body.reminders : checklists[index].reminders,
        updatedAt: new Date().toISOString()
    };
    
    if (req.file) {
        updatedChecklist.image = `/uploads/${req.file.filename}`;
    }
    
    checklists[index] = updatedChecklist;
    
    if (saveChecklists(checklists)) {
        res.json(updatedChecklist);
    } else {
        res.status(500).json({ error: 'Failed to update checklist' });
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
    console.log(`SolarGard Checklist Manager running on http://localhost:${PORT}`);
}); 