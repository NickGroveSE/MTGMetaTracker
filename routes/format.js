const express = require('express')
const router = express.Router()
const Archetype = require('../models/archetype')

router.get('/', (req, res) => {
    res.render('format/index')
})

router.get('/pioneer', async (req, res) => {
    try {
        const archetypes = await Archetype.find({format: "Pioneer"})
        res.render('format/pioneer', {archetypes: archetypes})
    } catch {
        res.redirect('/')
    }
})

router.get('/modern', async (req, res) => {
    try {
        const archetypes = await Archetype.find({format: "Modern"})
        res.render('format/modern', {archetypes: archetypes})
    } catch {
        res.redirect('/')
    }
})

router.get('/pauper', async (req, res) => {
    try {
        const archetypes = await Archetype.find({format: "Pauper"})
        res.render('format/pauper', {archetypes: archetypes})
    } catch {
        res.redirect('/')
    }
})

module.exports = router