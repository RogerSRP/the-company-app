const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth'); // De nieuwe admin-check

// POST /api/users/register : Een nieuwe gebruiker registreren
router.post('/register', async (req, res) => {
    try {
        const { username, password, ingameName, discordName, steamName } = req.body;

        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ msg: 'Een gebruiker met deze naam bestaat al.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password: hashedPassword,
            ingameName,
            discordName,
            steamName
        });

        await newUser.save();
        res.status(201).json({ msg: 'Gebruiker succesvol geregistreerd!' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/users/login : Een gebruiker inloggen
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(400).json({ msg: 'Ongeldige gegevens. Probeer opnieuw.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Ongeldige gegevens. Probeer opnieuw.' });
        }

        const payload = {
            id: user._id,
            username: user.username,
            role: user.role
        };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { id: user._id, username: user.username, role: user.role }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/users/ : Haal alle gebruikers op (voor ingelogde leden)
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/users/role/:id : Update de rol van een gebruiker (alleen voor leiderschap)
router.put('/role/:id', [auth, adminAuth], async (req, res) => {
    try {
        const { role } = req.body;
        const userIdToUpdate = req.params.id;

        const allRanks = ['Oyabun', 'Wakagashira', 'Saikō-komon', 'Shateigashira', 'Sō-honbuchō', 'Zetsumetsutai', 'Kyōdai', 'Shatei', 'Kumi-in', 'Minarai'];
        if (!allRanks.includes(role)) {
            return res.status(400).json({ msg: 'Ongeldige rang.'});
        }

        const adminRanks = ['Oyabun', 'Wakagashira', 'Saikō-komon'];
        if (req.user.id === userIdToUpdate && !adminRanks.includes(role)) {
            return res.status(400).json({ msg: 'Je kunt je eigen leiderschapsstatus niet verwijderen.' });
        }

        const updatedUser = await User.findByIdAndUpdate(userIdToUpdate, { role: role }, { new: true }).select('-password');
        if (!updatedUser) return res.status(404).json({ msg: 'Gebruiker niet gevonden.' });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/users/profile : Haal de profielgegevens van de ingelogde gebruiker op
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/users/profile : Update de profielgegevens van de ingelogde gebruiker
router.put('/profile', auth, async (req, res) => {
    try {
        const { ingameName, discordName, steamName } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { ingameName, discordName, steamName },
            { new: true }
        ).select('-password');
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/users/password : Wijzig het wachtwoord van de ingelogde gebruiker
router.put('/password', auth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'Gebruiker niet gevonden.' });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Oude wachtwoord is incorrect.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.json({ msg: 'Wachtwoord succesvol gewijzigd.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;