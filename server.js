// Importeer de pakketten
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Laad de geheimen

// Maak de app aan
const app = express();
app.use(cors()); // Sta cross-origin requests toe
app.use(express.json()); // Sta de server toe om JSON te lezen

// --- DATABASE CONNECTIE ---
const uri = process.env.ATLAS_URI; // Zet je connectie-string in een .env bestand!
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connectie succesvol!");
})

// --- API ROUTES ---
// Voorbeeld: een route om wapens op te halen
// const weaponsRouter = require('./routes/weapons');
// app.use('/api/weapons', weaponsRouter);
const authRouter = require('./routes/auth');
app.use('/api/users', authRouter);

const stockRouter = require('./routes/stock');
app.use('/api/stock', stockRouter);

const financesRouter = require('./routes/finances');
app.use('/api/finances', financesRouter);

const absencesRouter = require('./routes/absences');
app.use('/api/absences', absencesRouter);

const reservationsRouter = require('./routes/reservations');
app.use('/api/reservations', reservationsRouter);
// Voorbeeld: een route voor authenticatie
// const authRouter = require('./routes/auth');
// app.use('/api/users', authRouter);


// --- START DE SERVER ---
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server draait op poort: ${port}`);
});
app.use(express.static('public'));