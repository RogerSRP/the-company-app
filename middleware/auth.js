const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('x-auth-token');

        // Check of er een token is
        if (!token) {
            return res.status(401).json({ msg: 'Geen authenticatie token, toegang geweigerd.' });
        }

        // Verifieer het token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({ msg: 'Token verificatie mislukt, toegang geweigerd.' });
        }

        // Voeg de gebruiker info toe aan het request object
        req.user = verified;
        next(); // Ga door naar de volgende stap

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = auth;