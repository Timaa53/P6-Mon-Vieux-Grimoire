import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema);
