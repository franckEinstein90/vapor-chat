/*******************************************************************************
 *  Holds critical app data 
 *
 ******************************************************************************/
"use strict"

/*****************************************************************************/
const config = require('config')
/*****************************************************************************/

const normalizePort = function( val){
    let port = parseInt(val, 10)
    if( isNaN (port))   return val    
    if( port >= 0 )     return port
    return false
}

const APICredentials = function( host ) {
        this.hostName           = config.get(`${host}HostUrl`),
        this.clientId           = config.get(`${host}ClientId`),
        this.clientSecret       = config.get(`${host}ClientSecret`)
        this.clientRedirectUris = config.get(`${host}RedirectUris`)

        this.token = config.has(`${host}AuthToken`) 
                        ? config.get(`${host}AuthToken`): null
}

const appKernel = (function() {
    
    let _credentials = {
            googleAPI   : new APICredentials( 'googleDrive' )
    }  

    return {

        name        : config.get('appName'), 
    
        port        : normalizePort( process.env.PORT || 3000 ), 

        credentials : _credentials, 

        features    : {

        }
    }

})()


module.exports = {
    appKernel
}
