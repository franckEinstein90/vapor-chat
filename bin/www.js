"use strict"


const app = require('../app')
const http = require('http')

const serverUtils = require('./serverUtils').serverUtils


const port = serverUtils.normalizePort(process.env.port || '3000')
app.set('port', port)
console.log(`Running on port ${port}`)
let server = http.createServer(app)
server.listen(port)
