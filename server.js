const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const scraper = require('./utilities/scraper')
const node_cron = require('node-cron')
const bodyParser = require('body-parser')

// Initializing Routers
const indexRouter = require('./routes/index')
const aboutRouter = require('./routes/about')
const contactRouter = require('./routes/contact')
const formatRouter = require('./routes/format')

// Express Setup
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

// MongoDB Setup
const mongoose = require('mongoose')
mongoose.connect('mongodb://0.0.0.0:27017/mtgmetatracker', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Database Connected"))

// Router Setup
app.use('/', indexRouter)
app.use('/about', aboutRouter)
app.use('/contact', contactRouter)
app.use('/format', formatRouter)

var currently = "frontend"

if (currently == "live") {
    // Schedule Weekly Web Scraping
    const job = node_cron.schedule(" 0 0 0 * * Monday", () => {
        scraper.scrape()
    });
} else if (currently == "scrapetest") {
    scraper.scrape()
} else if (currently == "frontend")

app.listen(process.env.PORT || 3000)