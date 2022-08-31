var express = require('express');
var router = express.Router();


/* GET users listing. */
module.exports = function (db){
    router.get('/addcategory', async function(req, res, next) {
        try{
           res.render('product/addcategory')
        } catch (e){
            res.send(e)
        }
    
    });
    router.get('/categorylist', async function(req, res, next) {
        try{
           res.render('product/categorylist')
        } catch (e){
            res.send(e)
        }
    });
    router.get('/addunit', async function(req, res, next) {
        try{
           res.render('product/addunit')
        } catch (e){
            res.send(e)
        }
    });
    router.get('/unitlist', async function(req, res, next) {
        try{
           res.render('product/unitlist')
        } catch (e){
            res.send(e)
        }
    });
    router.get('/addproduct', async function(req, res, next) {
        try{
           res.render('product/addproduct')
        } catch (e){
            res.send(e)
        }
    });
    router.get('/manageproduct', async function(req, res, next) {
        try{
           res.render('product/manageproduct')
        } catch (e){
            res.send(e)
        }
    });
return router;
}
