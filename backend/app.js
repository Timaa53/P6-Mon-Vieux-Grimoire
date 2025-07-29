import express from 'express';
import mongoose from 'mongoose';
import Book from './models/Books.js';

mongoose.connect('mongodb+srv://Timalo:Timalotest123@cluster0.yhhqq2w.mongodb.net/MonVieuxGrimoireBDD?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connection à MongoDB réussie !'))
    .catch((err) => console.log('❌ Connection à MongoDB échouée !', err.message))

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


// ROUTES GET (bdd, id, rating)
// ROUTE GET RATING
app.get('/api/books/bestrating', (req, res) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(404).json({ error }));
});

// ROUTE GET BDD LIVRES
app.get('/api/books', (req, res) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
});

// ROUTE GET ID LIVRE PRECIS
app.get('/api/books/:id', (req, res) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
});


// ROUTES POST
// ROUTE POST SIGNUP
app.post('/api/auth/signup', (req, res) => {
    res.json({ message: 'signup' });
});

// ROUTE POST LOGIN
app.post('/api/auth/login', (req, res) => {
    res.json({ message: 'login' });
});

// ROUTE POST LIVRES
app.post('/api/books', (req, res) => { // error 500
    delete req.body._id;
    const book = new Book({
        ...req.body
    });
    book.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
});

// ROUTE POST RATING
app.post('/api/books/:id/rating', (req, res) => {
    const { userId, rating } = req.body;
    function validValueRating(value) {
        return typeof value === 'number' && value >= 0 && value <= 5
    };
    if (!validValueRating(rating)) {
        return res.status(400).json({ message: 'note invalide' })
    };

    Book.findOne({ _id: req.params.id })
    .then(book => {
        function isUserIdAlreadyKnown(userId) {
            return book.ratings.some(rating => rating.userId === userId);
        }
        if (isUserIdAlreadyKnown(userId)) {
            return res.status(400).json({ message: "l'utilisateur à déjà voté !" })
        };
        book.ratings.push({ userId, grade: rating });

        const grades = book.ratings.map(rating => rating.grade);
        const sum = grades.reduce((acc, val) => acc + val, 0);
        const average = sum / grades.length;
        book.averageRating = average;
        book.save()
            .then(updatedBook => res.status(201).json(updatedBook))
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(404).json({ error }));
});

// ROUTE PUT
app.put('/api/books/:id', (req, res) => {
    delete req.body._id
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
});

// ROUTE DELETE
app.delete('/api/books/:id', (req, res) => {
    res.json({ message: `Suppression book id : ${req.params.id}` });
});

export default app