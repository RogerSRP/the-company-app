const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Maak de app aan
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serveert de frontend bestanden

// --- DATABASE CONNECTIE ---
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    tls: true,
    tlsAllowInvalidCertificates: true // Deze optie forceert een succesvolle verbinding
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connectie succesvol!");
});

// --- API ROUTES ---
const authRouter = require('./routes/auth');
const stockRouter = require('./routes/stock');
const financesRouter = require('./routes/finances');
const absencesRouter = require('./routes/absences');
const reservationsRouter = require('./routes/reservations');

app.use('/api/users', authRouter);
app.use('/api/stock', stockRouter);
app.use('/api/finances', financesRouter);
app.use('/api/absences', absencesRouter);
app.use('/api/reservations', reservationsRouter);

// --- START DE SERVER ---
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server draait op poort: ${port}`);
});
