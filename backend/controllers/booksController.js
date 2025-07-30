import Book from '../models/Books.js';

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
  delete req.body._id;
  const book = new Book({
    ...req.body,
  });
  book.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch((error) => res.status(400).json({ error }));
};

export const addRate = (req, res) => {
  const { userId, rating } = req.body;
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
        return res.status(400).json({ message: 'l\'utilisateur à déjà voté !' });
      }
      book.ratings.push({ userId, grade: rating });

      const grades = book.ratings.map((rating) => rating.grade);
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
  delete req.body._id;
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch((error) => res.status(400).json({ error }));
};

// ROUTE DELETE (livre)
export const deleteBook = (req, res) => {
  res.json({ message: `Suppression book id : ${req.params.id}` });
};