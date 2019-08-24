const express = require('express');
const router = express.Router();

// Order Model
const Order = require('../../models/Order');

router.get('/:id', async (req, res) => {
    await Order.find({ owner: req.params.id })
        .select('-date')
        .select('-v')
        .sort({ date: 1 })
        .then(orders => res.json(orders))
});

router.post('/', async (req, res) => {
    const newOrder = new Order({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        owner: req.body.owner,
        foodId: req.body.foodId
    });

    newOrder.save().then(order => res.json({
        _id: order._id,
        name: order.name,
        quantity: order.quantity,
        price: order.price,
        owner: order.owner,
        foodId: order.foodId
    }));
},
    (error, req, res, next) => {
        res.status(400).send({
            error: error.message
        });
    });

router.patch('/:id', async (req, res) => {
    const updates = {
        quantity: req.body.quantity
    }

    await Order.findByIdAndUpdate(req.params.id, updates)
        .then(food => res.send({
            success: true
        }))
        .catch(err => res.status(404).json({ success: false }));
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    });
});

router.delete('/:id', (req, res) => {
    Order.findById(req.params.id)
        .then(food => food.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;