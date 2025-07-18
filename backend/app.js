import express from 'express';
import mongoose from 'mongoose';
import Book from './models/Books.js';

mongoose.connect('mongodb+srv://Timalo:Andy53andy53.@cluster0.yhhqq2w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connection à MongoDB réussie !'))
    .catch(() => console.log('Connection à MongoDB échouée !'))

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


// ROUTES GET (bdd, id, rating)
// ROUTE GET BDD LIVRES
app.get('/api/books', (req, res) => {
    res.json({ message: 'liste des livres' });
});

// ROUTE GET ID USER
app.get('/api/books/:id', (req, res) => {
    res.json({ message: `id user : ${req.params.id}` });
});

// ROUTE GET RATING
app.get('/api/books/bestrating', (req, res) => {
    res.json({ message: 'notation' });
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
app.post('/api/books', (req, res) => {
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
    res.json({ message: `id book : ${req.params.id} / route : rating` });
});

// ROUTE PUT
app.put('/api/books/:id', (req, res) => {
    res.json({ message: `Ajout book id : ${req.params.id}` });
});

// ROUTE DELETE
app.delete('/api/books/:id', (req, res) => {
    res.json({ message: `Suppression book id : ${req.params.id}` });
});

export default app