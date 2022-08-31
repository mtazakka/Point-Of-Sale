var express = require('express');
var router = express.Router();


/* GET users listing. */
module.exports = function (db){
    router.get('/', async function(req, res, next) {
        try{
           res.render('dashboard/list')
        } catch (e){
            res.send(e)
        }
    
    });

return router;
}
