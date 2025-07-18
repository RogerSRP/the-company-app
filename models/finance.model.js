const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
    // Uniek veld om altijd hetzelfde document te kunnen vinden
    identifier: { type: String, default: 'main_finances', unique: true },
    gangpot: { type: Number, default: 0 },
    zwartgeld: { type: Number, default: 0 }
});

const Finance = mongoose.model('Finance', financeSchema);

module.exports = Finance;