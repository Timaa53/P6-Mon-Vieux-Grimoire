import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// ROUTES POST
// ROUTE SIGNUP
export const signUp = (req, res) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
        email: req.body.email,
        password: hash
    });
    user.save()
    .then(() => res.status(201).json({ message: 'utilisateur créé !' }))
    .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};

// ROUTE LOGIN
export const login = (req, res) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user) {
            return res.status(401).json({ message: 'Identifiant/mot de passe incorrect' });
        }
        
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ message: 'Identifiant/mot de passe incorrect' });
            }
            const token = jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
            )
            res.status(200).json({
                userId: user._id,
                token
            });
        })
        .catch(error => res.status(500).json({ error }));
        })
    .catch(error => res.status(500).json({ error }));
};