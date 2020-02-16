"use strict"
/*****************************************************************************/
const express   = require('express')
const path      = require('path')
const helmet    = require('helmet')
const favicon = require('express-favicon')
/*****************************************************************************/
const appRoot   = require('@routes/appRoot').appRoot

const configExpress = function( vaporChat ){

    const expressStack = express()

    require('@src/viewSystem').viewSystem({
        app         : expressStack, 
        root        : vaporChat.root,
        layoutsDir  : path.join(vaporChat.root,'views','layouts/'),
        partialsDir : path.join(vaporChat.root,'views','partials/')
    })

    expressStack.use(express.json())
    expressStack.use(express.urlencoded({extended:false}))
    expressStack.use(express.static(path.join(vaporChat.root, 'public')))
    expressStack.use(favicon(vaporChat.faviconPath))
    appRoot.configure( vaporChat )
    expressStack.get('/', appRoot.render)
    vaporChat.expressStack = expressStack 
    return vaporChat
}

module.exports = {
    configExpress
}
