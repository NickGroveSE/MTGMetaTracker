const express = require('express')
const router = express.Router()
const Archetype = require('../models/archetype')

router.get('/', (req, res) => {
    res.render('format/index')
})

router.get('/:format', async (req,res) =>{
    const formatUpper = req.params.format.charAt(0).toUpperCase() + req.params.format.slice(1)
    try {
        const archetypes = await Archetype.find({format: formatUpper})
        res.render(`format/${req.params.format}`, {archetypes: archetypes})
    } catch (err) {
        res.redirect('/')
    }
})

router.get('/:format/:id', async (req, res) => {

    let archetype
    try {
        archetype = await Archetype.findById(req.params.id)
        res.render(`format/${req.params.format}/show`)
    } catch {

    }
})

module.exports = router