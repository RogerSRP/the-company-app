const router = require('express').Router();
const Finance = require('../models/finance.model');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth'); // Nieuwe import

async function getFinances() {
    let finances = await Finance.findOne({ identifier: 'main_finances' });
    if (!finances) {
        finances = new Finance();
        await finances.save();
    }
    return finances;
}

// READ: Haal de financiële data op
router.get('/', auth, async (req, res) => {
    try {
        const finances = await getFinances();
        res.json(finances);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE: Pas de financiële data aan (alleen voor leiderschap)
router.put('/update', [auth, adminAuth], async (req, res) => {
    try {
        const { gangpot, zwartgeld } = req.body;
        const updatedFinances = await Finance.findOneAndUpdate(
            { identifier: 'main_finances' },
            { gangpot, zwartgeld },
            { new: true, upsert: true }
        );
        res.json(updatedFinances);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;