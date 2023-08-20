const mongoose = require('mongoose')

const archetypeSchema = new mongoose.Schema({
    name: String,
    format: String,
    data: [{
        date: String,
        meta: String,
        price: String
    }]
})

module.exports = mongoose.model("Archetype", archetypeSchema)