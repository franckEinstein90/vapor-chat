/*******************************************************************************
 *  vapor
 *  Holds critical app data 
 *
 ******************************************************************************/
"use strict"

/*****************************************************************************/
require('module-alias/register')
const path      = require('path')
/*****************************************************************************/
let vaporApp = require('@src/appData').appKernel

vaporApp.features.functionalReqs = [
    {id: 1, promo: '<strong>real-time type</strong> - a faster, more intuitive way to chat</li>'}, 
    {id: 2, promo: 'decisions <strong>to</strong> actions - connect your decisions to  actions'}, 
    {id: 3, promo: 'Integrate with your admin, coms, <strong>and</strong> dev stacks -- twitter, jira, github, confluence, facebook, google drive, ...  discuss it, then make it happen...right away'}, 
    {id: 4, promo: '<strong>auto translate</strong> - chat with anyone, anywhere in the world'}, 
    {id: 5, promo: 'reach your chat...on facebook, by text, email, on twitter ...make sure your urgent chats reach their targete'},  
    {id: 6, promo: `<strong>insane privacy features</strong> - set your chat to <strong>vaporize</strong> and chat in perfect privacy. <a href="https://privacyMode.com">Vaporize mode</a> goes beyond any other product in the market to ensure your sensitive chats can't be saved, recorded, intercepted or read again. We go as far as encrypting every single letter of your chat with a different key <strong>and</strong> a different algorithm`} 
] 

vaporApp.root        =  __dirname 
vaporApp.faviconPath = path.join(__dirname, '/public/favicon.png') 
/*****************************************************************************/ 
let gapi = require('@connections/googleAPI').googleAPI 
gapi.configure( vaporApp ) 
require('./src/vaporChat').configExpress( vaporApp ) 
const http = require('http') 
const server = http.createServer(vaporApp.expressStack) 
const serverUtils = require('./src/serverUtils').serverUtils
const port = serverUtils.normalizePort(process.env.port || '3000')

server.listen(port)


console.log(`Running on port ${port}`)
