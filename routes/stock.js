var express = require('express');
var router = express.Router();


/* GET users listing. */
module.exports = function (db){
    router.get('/', async function(req, res, next) {
        try{
           res.render('stock/stockreport')
        } catch (e){
            res.send(e)
        }
    
    });

return router;
}
