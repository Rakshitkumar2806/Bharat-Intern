const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a schema and model
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model('Post', postSchema);

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    Post.find({}, (err, posts) => {
        if (!err) {
            res.render('index', { posts: posts });
        } else {
            res.send(err);
        }
    });
});

app.get('/compose', (req, res) => {
    res.render('compose');
});

app.post('/compose', (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content
    });

    newPost.save((err) => {
        if (!err) {
            res.redirect('/');
        } else {
            res.send(err);
        }
    });
});

app.get('/posts/:postId', (req, res) => {
    const requestedPostId = req.params.postId;

    Post.findOne({ _id: requestedPostId }, (err, post) => {
        if (!err) {
            res.render('post', { post: post });
        } else {
            res.send(err);
        }
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});