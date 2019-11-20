"use strict"


const express = require('express')
const router = express.Router()


router.get('/', function(req, res, next) {
    res.render('index', {
        title: "dustChat",
        ver: 1
    })
})





module.exports = router