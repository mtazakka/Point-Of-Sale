var express = require('express');
var router = express.Router();


/* GET users listing. */
module.exports = function (db){
    router.get('/', async function(req, res, next) {
        try{
           res.render('supplier/addsupplier')
        } catch (e){
            console.log("Error at router Penjualan", e)
            res.send(e)
        }
    
    });

return router;
}
