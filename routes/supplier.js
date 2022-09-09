var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../public/helpers/util')


/* GET users listing. */
module.exports = function (db){
    router.get('/add', isLoggedIn, async function(req, res, next) {
        try{
            res.render('supplier/addsupplier',{
                user:req.session.user
            })
        } catch (err){
                    console.log(err)
                    return res.send(err)
        }
    });
    router.post('/add', isLoggedIn, async function (req, res, next) {
        try{
            const addData = 'INSERT INTO SUPPLIER(name, phone, tin, email, address) values ($1,$2,$3,$4,$5)'
            await db.query(addData, [req.body.supplierName, req.body.supplierPhone, req.body.supplierTIN, req.body.supplierEmail, req.body.supplierAddress], (err, data) => {
                if (err) {
                    console.log(err)
                    return res.send(err)
                }
                res.redirect('../supplier/list')
            })
        } catch (err){
            console.log(err)
            return res.send(err)
        }});
    router.get('/list', isLoggedIn, async function(req, res, next) {
        try{
            db.query('SELECT * FROM SUPPLIER', (err, data)=>{
                if (err) {
                    console.log(err)
                    return res.send(err)
                }
                res.render('supplier/supplierlist', {
                    data:data.rows,
                    user:req.session.user
                })
            })
        } catch (err){
            console.log(err)
            return res.send(err)
        }
    });
    router.get('/edit/:id', isLoggedIn, async function (req, res, next) {
        try{
            const selectData = 'SELECT * FROM SUPPLIER WHERE supplier.id = $1'
            await db.query(selectData,[req.params.id], (err, data) => {
                if (err) {
                    console.log(err)
                    return res.send(err)
            }
            res.render('supplier/editsupplier', { 
                item:data.rows[0],
                user:req.session.user 
            })   
        })
        } catch (err){
            console.log(err)
            return res.send(err)
        }})
    router.post('/edit/:id', isLoggedIn, async function (req, res, next) {
        try{
            const editData = 'UPDATE SUPPLIER set name=$1, phone=$2, tin=$3, email=$4, address=$5 where supplier.id = $6'
            await db.query(editData, [req.body.supplierName, req.body.supplierPhone, req.body.supplierTIN, req.body.supplierEmail, req.body.supplierAddress, req.params.id], (err) => {
                if (err) {
                    console.log(err)
                    return res.send(err)
            }
            res.redirect('../list')
            })
        }catch (err) {
            console.log(err)
            return res.send(err)
        }})
    router.get('/delete/:id', isLoggedIn, async function (req, res, next) {
        try{
            const deleteData = 'DELETE FROM SUPPLIER WHERE id = $1'
            await db.query(deleteData, [req.params.id], (err) => {
                if (err) {
                        console.log(err)
                        return res.send(err)
                    }
                res.redirect('../list')
                })
            }catch (err) {
                console.log(err)
                return res.send(err)
            }})
return router;
}
