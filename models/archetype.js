const mongoose = require('mongoose')
const queue = require('../utilities/data-point')

const archetypeSchema = new mongoose.Schema({
    name: String,
    format: String,
    data: [{DataPoint}]
})