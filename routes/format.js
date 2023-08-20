const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('format/index')
})

router.get('/pioneer', (req, res) => {
    require('../utilities/parser')
    res.render('format/pioneer')
})

router.get('/modern', (req, res) => {
    res.render('format/modern')
})

router.get('/pauper', (req, res) => {
    res.render('format/pauper')
})

module.exports = router