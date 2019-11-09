"use strict"

const express = require('express')
const path = require('path')
const helmet = require('helmet')
const exphbs = require('express-handlebars')

const indexRoutes = require('./routes/index')
const router = express.Router()
const app = express()

let initServer = function(){
    let hbs

    app.use(express.json())
    app.use(express.urlencoded({extended:false}))
    hbs = exphbs.create({
        defaultLayout: 'main', 
        partialsDir: [
            'views/partials'
        ]
    })
    app.engine('handlebars', hbs.engine)
    app.set('view engine', 'handlebars')
    app.use('/', bambiRoutes)
    app.use(function(req, res, next){
        next(createError(404))
    })
}

initServer()

module.exports = app
