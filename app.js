const express = require('express')
const session = require('express-session') 
const {engine} = require('express-handlebars')
const cors = require('cors')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000
const FrontRouter = require('./src/routes/FrontRouter')
const BackRouter = require('./src/routes/BackRouter')

app.use(
    cors(),
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true
    }),
    express.json(),
    express.urlencoded({extended:true}),
    express.static('public')
)

app.engine('hbs',engine({
    extname: '.hbs',
    helpers: require('./src/librarys/handlebars-helpers')
}))
app.set('view engine','hbs')
app.use('/', FrontRouter)
app.use('/back', BackRouter)

app.listen(port, ()=>{
    console.log('The server is listening on port ' + port)
})
