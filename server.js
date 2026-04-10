const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 80;

// Island Data Storage (In-memory for this phase)
let islands = [];

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Config for Island Images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(express.static(__dirname)); // Serve current dir as root
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// API Endpoints
app.get('/api/islands', (req, res) => {
    res.json(islands);
});

app.post('/api/islands', upload.single('islandImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No image uploaded.');
    }

    const newIsland = {
        id: Date.now(),
        name: req.body.name || 'Nueva Isla',
        imageUrl: `/uploads/${req.file.filename}`,
        x: parseInt(req.body.x) || 0,
        y: parseInt(req.body.y) || 0
    };

    islands.push(newIsland);
    res.status(201).json(newIsland);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MUTANT-SERVER] Online on port ${PORT}`);
    console.log(`[STORAGE] Uploads directory: ${uploadDir}`);
});
