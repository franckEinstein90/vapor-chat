
/*****************************************************************************/
"use strict"
/*****************************************************************************/
/*function authorize(credentials, callback) {
   const {client_secret, client_id, redirect_uris} = credentials.installed;
   const oAuth2Client = new google.auth.OAuth2(
       client_id, client_secret, redirect_uris[0]);
 
   // Check if we have previously stored a token.
   fs.readFile(TOKEN_PATH, (err, token) => {
     if (err) return getAccessToken(oAuth2Client, callback);
     oAuth2Client.setCredentials(JSON.parse(token));
     callback(oAuth2Client);
   });
 }

const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly'


/*****************************************************************************/
const readline = require('readline');
const {google} = require('googleapis');
/*****************************************************************************/


const scope = ['https://www.googleapis.com/auth/drive.metadata.readonly']

let authorize = function({
    clientId, 
    clientSecret, 
    clientRedirectUris, 
    token     
}){
            
        let Auth2Client = new google.auth.OAuth2(clientId, clientSecret, clientRedirectUris[0])
        Auth2Client.setCredentials( token )
        return Auth2Client
}
 
function getAccessToken(oAuth2Client, callback) {
/*
I  let authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    })*/
}

const googleAPI = (function(){


    let _app          = null
    let _auth2Client  = null    
    let _drive        = null

    let _authorize = function( ) {
        _auth2Client = authorize(_app.credentials.googleAPI)
        _drive = google.drive({version : 'v3'}, _auth2Client)
    } 


    return {
        configure   : function( app ){
            _app = app
            _authorize( )
            _app.features.googleAPI = true
        }, 

        listFiles   : function( ){
          return new Promise((resolve, reject) =>{
            _drive.files.list({
              pageSize  : 10,   
              fields: 'nextPageToken, files(id, name)'
            }, (err, res) => {
                debugger
            })
          })
        }
    }
})()

module.exports = {
    googleAPI
}
