"use strict"
const express = require('express')

const configServerRouter = function( app ){

    let _router = express.Router()

    _router.get('/', function(req, res, next) {
        res.render('index', {
            title: "dustChat",
            ver: 1
        })
    })

    app.use('/', indexRoutes)
    app.router = _router
}


module.exports = {
    configServerRouter
}
