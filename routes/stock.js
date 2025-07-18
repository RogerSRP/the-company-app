const router = require('express').Router();
const Item = require('../models/item.model');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth'); // Nieuwe import

// READ: Haal alle stock items op (voor iedereen die ingelogd is)
router.get('/', auth, async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE: Voeg een nieuw item toe (alleen voor leiderschap)
router.post('/add', [auth, adminAuth], async (req, res) => {
    try {
        const { name, quantity, category } = req.body;
        const newItem = new Item({ name, quantity, category });
        const savedItem = await newItem.save();
        res.json(savedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE: Pas een item aan (alleen voor leiderschap)
router.put('/update/:id', [auth, adminAuth], async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Verwijder een item (alleen voor leiderschap)
router.delete('/delete/:id', [auth, adminAuth], async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        res.json(deletedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;