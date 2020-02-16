/******************************************************************************
 * vaporChat - By FranckEinstein90
 * 0000000002002000000000000000000
 * 0000000002002000000000000000000
 *
 * ***************************************************************************/

"use strict"

/*****************************************************************************/
const hbs = require('express-handlebars')
/*****************************************************************************/

const viewSystem = function({
    app,
    root,
    layoutsDir,
    partialsDir
}) {
    app.engine('hbs', hbs({
        extname: 'hbs',
        defaultLayout: 'main',
        layoutsDir,
        partialsDir
    }))
    app.set('view engine', 'hbs');

}

module.exports = {
    viewSystem
}
