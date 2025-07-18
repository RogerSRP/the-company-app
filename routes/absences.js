const router = require('express').Router();
const Absence = require('../models/absence.model');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth'); // Nieuwe import

// CREATE: Een ingelogde gebruiker meldt zich afwezig
router.post('/', auth, async (req, res) => {
    try {
        const { startDate, endDate, reason } = req.body;
        const newAbsence = new Absence({
            startDate,
            endDate,
            reason,
            user: req.user.id,
            username: req.user.username
        });
        const savedAbsence = await newAbsence.save();
        res.json(savedAbsence);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ: Haal alle afmeldingen op (alleen voor leiderschap)
router.get('/', [auth, adminAuth], async (req, res) => {
    try {
        const absences = await Absence.find().sort({ startDate: -1 });
        res.json(absences);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Verwijder een afmelding (alleen voor leiderschap)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
    try {
        const deletedAbsence = await Absence.findByIdAndDelete(req.params.id);
        res.json(deletedAbsence);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;