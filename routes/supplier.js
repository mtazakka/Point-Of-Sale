var express = require('express');
var router = express.Router();


/* GET users listing. */
module.exports = function (db){
      router.get('/add', async function(req, res, next) {
        try{
           res.render('supplier/addsupplier')
        } catch (e){
            res.send(e)
        }
    });
    router.post('/add', function (req, res, next) {
        const addData = 'INSERT INTO SUPPLIER(name, phone, tin, email, address) values ($1,$2,$3,$4,$5)'
        db.query(addData, [req.body.supplierName, req.body.supplierPhone, req.body.supplierTIN, req.body.supplierEmail, req.body.supplierAddress], (err, data) => {
            if (err) return res.send(err)
            res.redirect('../supplier/list')
    })
    });
    router.get('/list', async function(req, res, next) {
        try{
            db.query('SELECT * FROM SUPPLIER', (err, data)=>{
                if (err) {
                    console.log('Failed to read')
                    throw err;
                }
                res.render('supplier/supplierlist', {data:data.rows})
            })
        } catch (e){
            res.send(e)
        }
    });
     router.get('/edit/:id', (req, res) => {
        const selectData = 'SELECT * FROM SUPPLIER WHERE supplier.id = $1'
        db.query(selectData,[req.params.id], (err, data) => {
            if (err) {
            console.log('Failed to read')
            throw err;
            }
            res.render('supplier/editsupplier', { item:data.rows[0] })   
        })
    })
    router.post('/edit/:id', (req, res) => {
        const editData = 'UPDATE SUPPLIER set name=$1, phone=$2, tin=$3, email=$4, address=$5 where supplier.id = $6'
        db.query(editData, [req.body.supplierName, req.body.supplierPhone, req.body.supplierTIN, req.body.supplierEmail, req.body.supplierAddress, req.params.id], (err) => {
            if (err) {
            console.log('Failed to edit')
            throw err;
            }
            res.redirect('../list')
            })
        })
    router.get('/delete/:id', (req, res) => {
    const deleteData = 'DELETE FROM SUPPLIER WHERE id = $1'
    db.query(deleteData, [req.params.id], (err) => {
        if (err) {
        {
            console.log('Failed to delete')
            throw err
        }
        }
    })
    res.redirect('../list')
    })
return router;
}
