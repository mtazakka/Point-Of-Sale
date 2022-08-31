var express = require('express');
var router = express.Router();


/* GET users listing. */
module.exports = function (db){
    router.get('/add', async function(req, res, next) {
        try{
           res.render('costumer/addcostumer')
        } catch (e){
            res.send(e)
        }
    
    });
    router.get('/list', async function(req, res, next) {
        try{
           res.render('costumer/costumerlist')
        } catch (e){
            res.send(e)
        }
    
    });

return router;
}
