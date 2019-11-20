"use strict"


const app = require('../app')
const http = require('http')
const server = http.createServer(app)

const serverUtils = require('./serverUtils').serverUtils
const port = serverUtils.normalizePort(process.env.port || '3000')

server.listen(port)


console.log(`Running on port ${port}`)
