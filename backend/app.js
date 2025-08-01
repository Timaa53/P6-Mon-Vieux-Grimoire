import express from 'express';
import mongoose from 'mongoose';
import routesAuth from './routes/auth.js';
import routesBooks from './routes/booksRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';

mongoose.connect('mongodb+srv://Timalo:Timalotest123@cluster0.yhhqq2w.mongodb.net/MonVieuxGrimoireBDD?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connection à MongoDB réussie !'))
  .catch((err) => console.log('❌ Connection à MongoDB échouée !', err.message));

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const app = express();
app.use(express.json());

// Gestion CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Gestion routes
app.use('/api/auth', routesAuth);
app.use('/api/books', routesBooks);
app.use('/images/BooksImages', express.static(path.join(dirName, 'images/BooksImages')));

export default app;
