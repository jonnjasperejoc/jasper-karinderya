const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

// User Model
const User = require('../../models/User');

router.get('/', async (req, res) => {
    try {
        await User.find()
            .select('-password')
            .select('-__v')
            .select('-date')
            .then(users => {
                res.send(users);
            })
            .catch(err => res.status(404).json({ msg: "Something went wrong!" }));
    } catch (e) {
        res.sendStatus(404);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            throw new Error();
        }

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            type: user.type
        });
    } catch (e) {
        res.sendStatus(404);
    }
});

router.post('/', (req, res) => {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check for existing user
    User.findOne({ email })
        .then((user) => {
            if (user) return res.status(400).json({ msg: 'User already exist' });

            const newUser = new User({
                name,
                email,
                password
            });

            // Create salt & hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then((user => {
                            jwt.sign(
                                { id: user.id },
                                config.get('jwtSecret'),
                                { expiresIn: 3600 },
                                (err, token) => {
                                    if (err) throw err;
                                    res.json({
                                        token,
                                        user: {
                                            id: user.id,
                                            name: user.name,
                                            email: user.email
                                        }
                                    });
                                }
                            )
                        }));
                });
            });
        });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check for existing user
    User.findOne({ email })
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'User does not exist' });

            // Validate password
            bcrypt.compare(password, user.password)
                .then((isMatch) => {
                    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

                    jwt.sign(
                        { id: user.id },
                        config.get('jwtSecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                }
                            });
                        }
                    )
                });
        });
});

router.patch('/:id', async (req, res) => {
    let type = "user";
    if (req.body.type === "user") {
        type = "admin";
    }

    let updates = { type }

    await User.findByIdAndUpdate(req.params.id, updates)
        .then(user => res.send({ success: true }))
        .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;