var express = require('express');
var router = express.Router();


/* GET users listing. */
module.exports = function (db){
    router.get('/add', async function(req, res, next) {
        try{
           res.render('user/adduser')
        } catch (e){
            res.send(e)
        }
    
    });
    router.get('/list', async function(req, res, next) {
        try{
           res.render('user/userlist')
        } catch (e){
            res.send(e)
        }
    
    });
    router.get('/submiterror', async function(req, res, next) {
        try{
           res.render('user/submiterror')
        } catch (e){
            res.send(e)
        }
    
    });

return router;
}
