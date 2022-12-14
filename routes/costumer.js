var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../public/helpers/util')

/* GET users listing. */
module.exports = function (db){
    router.get('/list', isLoggedIn, async function(req, res, next) {
        try{
            db.query('SELECT * FROM COSTUMER', (err, data)=>{
                if (err) {
                    console.log('Failed to read')
                    throw err;
                }
                res.render('costumer/costumerlist', {data:data.rows, user:req.session.user})
            })
            console.log(req.session.user)
        } catch (e){
            res.send(e)
        }
    
    });
    router.get('/add', isLoggedIn, async function(req, res, next) {
        try{
           res.render('costumer/addcostumer', {user:req.session.user})
        } catch (e){
            res.send(e)
        }
    });
    router.post('/add', isLoggedIn, async function(req, res, next) {
        try{
            const addData = 'INSERT INTO costumer(id, name, phone, idcard, email, address, member) values ($1,$2,$3,$4,$5,$6,$7)'
            db.query(addData, [req.body.costumerId, req.body.costumerName, req.body.costumerPhone, req.body.costumerIdCard, req.body.costumerEmail, req.body.costumerAddress, req.body.costumerMember], (err, data) => {
                if (err) return res.send(err)
                res.redirect('../costumer/list') 
            })
        } catch (err) {
            console.log(err)
            return res.send(err)
    }});

    router.get('/edit/:id', isLoggedIn, async function(req, res, next) {
        try{
            const selectData = 'SELECT * FROM costumer WHERE costumer.id = $1'
            db.query(selectData,[req.params.id], (err, data) => {
                if (err) {
                console.log('Failed to read')
                throw err;
                }
                res.render('costumer/editcostumer', { 
                    item:data.rows[0],
                    user:req.session.user
                })   
            })
        } catch (e){
            console.log(e)
            return res.send(e)
        }
    })
    router.post('/edit/:id', isLoggedIn, async function(req, res, next) {
        try{
            const editData = 'UPDATE costumer set name=$1, phone=$2, idcard=$3, email=$4, address=$5, member=$6 where costumer.id = $7'
            db.query(editData, [req.body.costumerName, req.body.costumerPhone, req.body.costumerIdCard, req.body.costumerEmail, req.body.costumerAddress, req.body.costumerMember, req.body.costumerId], (err) => {
                if (err) {
                    console.log('Failed to edit')
                    throw err;
                }
                res.redirect('../list')
                })
            } catch (e){
                console.log(e)
                return res.send(e)
            }
        })
    router.get('/delete/:id', isLoggedIn, async function(req, res, next) {
        try{
            const deleteData = 'DELETE FROM costumer WHERE id = $1'
            db.query(deleteData, [req.params.id], (err) => {
                if (err) {
                    console.log('Failed to delete')
                    throw err
                }
                res.redirect('../list')
            })
        } catch (err) {
            console.log(err)
            return res.send(err)
        }})
return router;
}
