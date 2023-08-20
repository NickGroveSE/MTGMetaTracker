const mongoose = require('mongoose')

const archetypeSchema = new mongoose.Schema({
    name: String,
    format: String,
    data: [{
        date: String,
        meta: Number,
        price: Number
    }]
})

module.exports = mongoose.model("Archetype", archetypeSchema)