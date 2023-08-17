const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index')
const aboutRouter = require('./routes/about')
const contactRouter = require('./routes/contact')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

app.use('/', indexRouter)
app.use('/about', aboutRouter)
app.use('/contact', contactRouter)

app.listen(process.env.PORT || 3000)