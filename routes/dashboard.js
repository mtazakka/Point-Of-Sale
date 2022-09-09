var express = require('express');
var router = express.Router();
const { currencyFormatter, isLoggedIn } = require('../public/helpers/util')
const bcrypt = require('bcrypt');
const saltRounds = 10; 
var flash = require('connect-flash');


/* GET users listing. */
module.exports = function (db){
    router.get('/dashboard', isLoggedIn, async function(req, res, next) {
        try{
            const dataEmployee = await db.query('SELECT COUNT (*) as total FROM EMPLOYEE')
            const dataVariant = await db.query('SELECT COUNT (*) as total FROM PRODUCT_VARIANT')
            const dataPurchase = await db.query('SELECT SUM(total_price) as total FROM PURCHASE_TRANSACTION')
            const dataSale = await db.query('SELECT SUM(total_price) as total FROM SALE_TRANSACTION')
            res.render('dashboard/list',{
                currencyFormatter,
                user: req.session.user,
                dataEmployee: dataEmployee.rows[0],
                dataVariant: dataVariant.rows[0],
                dataPurchase: dataPurchase.rows[0],
                dataSale: dataSale.rows[0]
            })
        } catch (e){
            res.send(e)
        }
    
    });
    router.get('/', isLoggedIn, async function(req, res, next) {
        try{
            res.redirect('/dashboard')
        } catch (e){
            console.log(e)
            return res.send(e)
        }
    });
    router.get('/login', async function(req, res, next) {
        try{
            res.render('dashboard/login',{
                info:req.flash('info')
            })
        } catch (e){
            console.log(e)
            return res.send(e)
        }
    });
    router.post('/login', async function(req, res, next) {
        try{
            const {email, password} = req.body
            await db.query('SELECT * FROM EMPLOYEE where email = $1', [email],(err,data) => {
                if (err) {
                    console.log(err)
                    return res.send(err)
                }
                if (data.rows.length == 0) {
                    req.flash('info','email not found')
                    return res.redirect('/login')
                }
                bcrypt.compare(password, data.rows[0].password, function(err, result) {
                    if (err) {
                        console.log(err)
                        return res.send(err)
                    }
                    if (!result) {
                        req.flash('info','incorrect password')
                        return res.redirect('/login')
                    }
                    req.session.user = data.rows[0]
                    res.redirect('/dashboard')
                });
            })
        } catch (e){
            console.log(e)
            return res.send(e)
        }
    });
    router.get('/logout', isLoggedIn, async function(req, res, next) {
        try{
            req.session.destroy(function(err) {
                res.redirect('/login')
        })
        } catch (e){
            console.log(e)
            return res.send(e)
        }
    });

return router;
}
