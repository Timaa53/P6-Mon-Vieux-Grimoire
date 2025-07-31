import mongoose from 'mongoose';

const { Schema } = mongoose;

const booksSchema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [{
    userId: { type: String, required: true },
    grade: { type: Number, required: true },
  }],
  averageRating: { type: Number, default: 0 },
});

export default mongoose.model('Book', booksSchema);