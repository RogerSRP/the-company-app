const adminRanks = ['Oyabun', 'Wakagashira', 'Saikō-komon'];

const adminAuth = (req, res, next) => {
    try {
        // We gaan ervan uit dat de normale 'auth' middleware al is uitgevoerd
        const userRole = req.user.role;

        if (!adminRanks.includes(userRole)) {
            return res.status(403).json({ msg: 'Toegang geweigerd: alleen voor leiderschap.' });
        }

        next(); // De gebruiker heeft een admin-rang, ga door

    } catch (err) {
        res.status(500).json({ error: 'Authenticatiefout.' });
    }
};

module.exports = adminAuth;