/******************************************************************************
 * vapor
 * 20200000000000000000000000000000
 *
 * appRoot is a user's entry into the 
 * app
 * ***************************************************************************/
"use strict"

/*****************************************************************************/
/*****************************************************************************/


const appRoot = (function() {

    let _app = null

    return {
      configure   : function(app){
         _app = app
      }, 

      render: function(req, res, next) {

            let pageData = {
                title           : _app.name,
                functionalReqs  : _app.features.functionalReqs
            }
            res.render('promo', pageData)
      }, 

      login : function(req, res, next){


      }, 

      getUserData: function(req, res, next) {

      },
 

    }

})()

module.exports = {
    appRoot
}
