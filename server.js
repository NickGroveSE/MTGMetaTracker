const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const parser = require('./utilities/parser')
const node_cron = require("node-cron")

const indexRouter = require('./routes/index')
const aboutRouter = require('./routes/about')
const contactRouter = require('./routes/contact')
const formatRouter = require('./routes/format')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

const mongoose = require('mongoose')
mongoose.connect('mongodb://0.0.0.0:27017/mtgmetatracker', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Database Connected"))

app.use('/', indexRouter)
app.use('/about', aboutRouter)
app.use('/contact', contactRouter)
app.use('/format', formatRouter)

const job = node_cron.schedule(" 0 50 23 * * Sunday", () => {
    parser.parse();
});

app.listen(process.env.PORT || 3000)