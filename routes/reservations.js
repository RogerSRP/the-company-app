const router = require('express').Router();
const Reservation = require('../models/reservation.model');
const Item = require('../models/item.model');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth'); // Nieuwe import

// CREATE: Een lid maakt een reservering
router.post('/', auth, async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const item = await Item.findById(itemId);
        if (!item) return res.status(404).json({ msg: 'Item niet gevonden.' });
        if (item.quantity < quantity) return res.status(400).json({ msg: 'Niet genoeg items in stock.'});

        const newReservation = new Reservation({
            item: itemId,
            quantity,
            user: req.user.id,
            username: req.user.username,
            itemName: item.name
        });
        await newReservation.save();
        res.status(201).json({ msg: 'Reservering succesvol aangevraagd.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ: Haal alle reserveringen op (alleen voor leiderschap)
router.get('/', [auth, adminAuth], async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ createdAt: -1 });
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE: Update de status van een reservering (alleen voor leiderschap)
router.put('/status/:id', [auth, adminAuth], async (req, res) => {
    try {
        const { status } = req.body;
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ msg: 'Reservering niet gevonden.' });

        if (status === 'Goedgekeurd' && reservation.status === 'In afwachting') {
            const item = await Item.findById(reservation.item);
            if (item.quantity < reservation.quantity) {
                return res.status(400).json({ msg: 'Actie mislukt: niet genoeg items in stock.' });
            }
            item.quantity -= reservation.quantity;
            await item.save();
        }

        reservation.status = status;
        await reservation.save();
        res.json(reservation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;