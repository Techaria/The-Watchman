const express = require('express');
const multer = require('multer');
const path = require('path');
const { sequelize, Article } = require('./db'); // Import the Article model from db.js

const app = express();
const PORT = process.env.PORT || 4000;

// Set up EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Save files in the public/uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to file name
    }
});

const upload = multer({ storage: storage });

// Handle article submission
app.post('/upload', upload.fields([{ name: 'image' }, { name: 'video' }]), async (req, res) => {
    try {
        const { title, category, content } = req.body;
        const image = req.files['image'] ? req.files['image'][0].path.replace('public/', '') : null;
        const video = req.files['video'] ? req.files['video'][0].path.replace('public/', '') : null;

        // Create new article
        await Article.create({
            title,
            category,
            content,
            image,
            video
        });

        res.redirect('/articles');
    } catch (err) {
        console.error('Failed to upload article:', err);
        res.status(500).send('Failed to upload article');
    }
});

// Display articles with optional category filtering
app.get('/articles', async (req, res) => {
    try {
        const category = req.query.category;
        let articles;

        if (category) {
            articles = await Article.findAll({
                where: { category },
                order: [['createdAt', 'DESC']]
            });
        } else {
            articles = await Article.findAll({
                order: [['createdAt', 'DESC']]
            });
        }

        res.render('articles', { articles });
    } catch (err) {
        console.error('Failed to retrieve articles:', err);
        res.status(500).send('Failed to retrieve articles');
    }
});

// Display a single article
app.get('/article/:id', async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (article) {
            res.render('article', { article });
        } else {
            res.status(404).send('Article not found');
        }
    } catch (err) {
        console.error('Failed to retrieve article:', err);
        res.status(500).send('Failed to retrieve article');
    }
});

// Sync database and start server
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to sync database:', err);
    });
