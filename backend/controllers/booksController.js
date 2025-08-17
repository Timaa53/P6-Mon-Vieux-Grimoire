import Book from '../models/Books.js';
import fs from 'fs';

// ROUTES GET (rating, bdd, id livre)
export const bestRating = (req, res) => {
  Book.find().sort({ averageRating: -1 }).limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(404).json({ error }));
};

export const allBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

export const getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// ROUTES POST (livre, rating)
export const addBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId, // liaison livre-user
    imageUrl: `${req.protocol}://${req.get('host')}/images/BooksImages/${req.file.filename}`
  });
  book.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch((error) => res.status(400).json({ error }));
};

export const addRate = (req, res) => {
  const userId = req.auth.userId; // sécurisation livre-user
  const { rating } = req.body;
  function validValueRating(value) {
    return typeof value === 'number' && value >= 0 && value <= 5;
  }
  if (!validValueRating(rating)) {
    return res.status(400).json({ message: 'note invalide' });
  }

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      function isUserIdAlreadyKnown(userId) {
        return book.ratings.some((rating) => rating.userId === userId);
      }
      if (isUserIdAlreadyKnown(userId)) {
        return res.status(400).json({ message: "l'utilisateur à déjà voté !" });
      }
      book.ratings.push({ userId, grade: rating });

      const grades = book.ratings.map((rating) => rating.grade); // calcul moyenne
      const sum = grades.reduce((acc, val) => acc + val, 0);
      const average = sum / grades.length;
      book.averageRating = average;
      book.save()
        .then((updatedBook) => res.status(201).json(updatedBook))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(404).json({ error }));
};

// ROUTE PUT (livre)
export const updateBook = (req, res) => {
    const bookObject = req.file? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/BooksImages/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
    .then(book => {
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé !' });
        }

        if(book.userId !== req.auth.userId) {
            return res.status(403).json({ message: 'Modification refusée !' });
        }

        delete req.body._id;
        if(req.file) {
        const filename = book.imageUrl.split('/images/BooksImages/')[1];
        fs.unlink(`images/BooksImages/${filename}`, () => { // suppression physique de l'image dans booksImages
            Book.updateOne(
                { _id: req.params.id },
                { ...bookObject, _id: req.params.id }
            )
            .then(() => res.status(200).json({ message: 'Livre modifié !' }))
            .catch((error) => res.status(400).json({ error }));
        });
        return
        }
        return Book.updateOne(
            { _id: req.params.id },
            { ...bookObject, _id: req.params.id }
        )
        .then(() => res.status(200).json({ message: 'Livre modifié !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// ROUTE DELETE (livre)
export const deleteBook = (req, res) => {
  Book.findOne({_id: req.params.id})
  .then(book => {
    if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé !' });
    }

    if(book.userId !== req.auth.userId) {
        return res.status(403).json({ message: 'Suppression refusée !' });
    }

    const filename = book.imageUrl.split('/images/BooksImages/')[1];
    fs.unlink(`images/BooksImages/${filename}`, () => { // suppression physique de l'image dans booksImages
        Book.deleteOne({_id: req.params.id})
        .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
        .catch(error => res.status(500).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};
