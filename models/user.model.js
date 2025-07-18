const mongoose = require('mongoose');

// Definieer alle mogelijke rangen
const allRanks = [
    'Oyabun', 'Wakagashira', 'Saikō-komon', 'Shateigashira', 
    'Sō-honbuchō', 'Zetsumetsutai', 'Kyōdai', 'Shatei', 
    'Kumi-in', 'Minarai'
];

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: true, 
        enum: allRanks, // Zorgt dat alleen deze waarden mogelijk zijn
        default: 'Minarai' // Standaard is iedereen een leerling
    },
    ingameName: { type: String, trim: true, default: '' },
    discordName: { type: String, trim: true, default: '' },
    steamName: { type: String, trim: true, default: '' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;