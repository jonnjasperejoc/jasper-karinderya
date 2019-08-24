const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const router = express.Router();

// Food Model
const Food = require('../../models/Food');

router.get('/', async (req, res) => {
    await Food.find()
        .select('-date')
        .select('-image')
        .sort({ date: 1 })
        .then(foods => res.json(foods))
});

router.get('/:owner', (req, res) => {
    Food.find({
        owner: req.params.owner
    })
        .select('-date')
        .select('-image')
        .sort({ date: 1 })
        .then(foods => res.json(foods))
});

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }

        cb(undefined, true)
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const dir = path.join(__dirname, 'git.png');
    let buffer = fs.readFileSync(dir);

    if (typeof req.file !== "undefined") {
        buffer = await sharp(req.file.buffer).resize({
            width: 250,
            height: 250
        }).png().toBuffer();
    }

    const newFood = new Food({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        owner: req.body.owner,
        image: buffer
    });

    newFood.save().then(food => res.json({
        name: food.name,
        owner: food.owner,
        quantity: food.quantity,
        price: food.price,
        _id: food._id
    }));
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    });
});

router.patch('/:id', upload.single('image'), async (req, res) => {
    let buffer = null;

    if (typeof req.file !== "undefined") {
        buffer = await sharp(req.file.buffer).resize({
            width: 250,
            height: 250
        }).png().toBuffer();
    }

    let updates = {
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        _id: req.params.id
    }

    if (buffer !== null) {
        updates = {
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price,
            _id: req.params.id,
            image: buffer
        }
    }

    await Food.findByIdAndUpdate(req.params.id, updates)
        .then(food => res.send({
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price,
            _id: req.params.id
        }))
        .catch(err => res.status(404).json({ success: false }));
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    });
});

router.get('/:id/image', async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);

        if (!food || !food.image) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(food.image);
    } catch (e) {
        res.sendStatus(404);
    }
});

router.post('/:id', async (req, res) => {
    await Food.findOne({ _id: req.params.id })
        .select('-image')
        .then(food => {
            Food.findByIdAndUpdate(req.params.id, { quantity: food.quantity - 1 })
                .then(food => res.send({ success: true }))
                .catch(err => res.status(404).json({ success: false }));
        })
        .catch(err => res.status(404).json({ success: false }));
});

router.delete('/:id', (req, res) => {
    Food.findById(req.params.id)
        .then(food => food.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;