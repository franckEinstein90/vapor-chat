"use strict"

const express = require('express')
const path = require('path')
const helmet = require('helmet')

const indexRoutes = require('./routes/index')

const app = express()

let initViews = function(){
    app.set('views', path.join(__dirname, 'views'))
    app.set('view engine', 'hbs')
}

let initServer = function(){
    app.use(express.json())
    app.use(express.urlencoded({extended:false}))

    app.use(express.static(path.join(__dirname, 'public')))
    app.use('/', indexRoutes)
    app.use(function(req, res, next){
        next(createError(404))
    })
}

initViews()
initServer()

module.exports = app
