// import jsdom
const jsdom = require('jsdom')

// create a window with the document object
const dom = new jsdom.JSDOM('../views/index.ejs')

// import jquery and supply it with the new dom
const $ = require('jquery')(dom.window)
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
})

module.exports = router