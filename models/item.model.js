const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, default: 0 },
    category: { type: String, required: true, trim: true } // bv. 'Wapen', 'Munitie', 'Keycard'
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;