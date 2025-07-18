const mongoose = require('mongoose');

const absenceSchema = new mongoose.Schema({
    // Link naar de gebruiker die de melding maakt
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, trim: true, default: '' },
}, {
    timestamps: true // Voegt automatisch 'createdAt' en 'updatedAt' toe
});

const Absence = mongoose.model('Absence', absenceSchema);

module.exports = Absence;