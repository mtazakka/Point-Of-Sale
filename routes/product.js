var express = require('express');
var router = express.Router();


/* GET users listing. */
module.exports = function (db){
    //CATEGORY
    router.get('/addcategory', async function(req, res, next) {
        try{
           res.render('product/addcategory')
        } catch (e){
            res.send(e)
        }
    });

    router.post('/addcategory', function (req, res, next) {
        const addData = 'INSERT INTO CATEGORY(name) values ($1)'
        db.query(addData, [req.body.categoryName], (err, data) => {
            if (err) return res.send(err)
            res.redirect('../product/categorylist')
    })
    });

    router.get('/categorylist', async function(req, res, next) {
        try{
            db.query('SELECT * FROM CATEGORY', (err, data)=>{
                if (err) {
                    console.log('Failed to read')
                    throw err;
                }
                res.render('product/categorylist', {data:data.rows})
            })
        } catch (e){
            res.send(e)
        }
    });

    router.get('/editcategory/:id', (req, res) => {
        const selectData = 'SELECT * FROM CATEGORY WHERE category.id = $1'
        db.query(selectData,[req.params.id], (err, data) => {
            if (err) {
            console.log('Failed to read')
            throw err;
            }
            res.render('product/editcategory', { item:data.rows[0] })   
        })
    })
    router.post('/editcategory/:id', (req, res) => {
        const editData = 'UPDATE CATEGORY set name=$1 where category.id = $2'
        db.query(editData, [req.body.categoryName, req.params.id], (err) => {
            if (err) {
            console.log('Failed to edit')
            throw err;
            }
            res.redirect('../categorylist')
            })
        })
    router.get('/deletecategory/:id', (req, res) => {
    const deleteData = 'DELETE FROM CATEGORY WHERE id = $1'
    db.query(deleteData, [req.params.id], (err) => {
        if (err) {
        {
            console.log('Failed to delete')
            throw err
        }
        }
    })
    res.redirect('../categorylist')
    })

    //UNIT
    router.get('/addunit', async function(req, res, next) {
        try{
           res.render('product/addunit')
        } catch (e){
            res.send(e)
        }
    });
     router.post('/addunit', function (req, res, next) {
        const addData = 'INSERT INTO UNIT(name) values ($1)'
        db.query(addData, [req.body.unitName], (err, data) => {
            if (err) return res.send(err)
            res.redirect('../product/unitlist')
    })
    });

    router.get('/unitlist', async function(req, res, next) {
        try{
            db.query('SELECT * FROM UNIT', (err, data)=>{
                if (err) {
                    console.log('Failed to read')
                    throw err;
                }
                res.render('product/unitlist', {data:data.rows})
            })
        } catch (e){
            res.send(e)
        }
    });
    router.get('/editunit/:id', (req, res) => {
        const selectData = 'SELECT * FROM UNIT WHERE unit.id = $1'
        db.query(selectData,[req.params.id], (err, data) => {
            if (err) {
            console.log('Failed to read')
            throw err;
            }
            res.render('product/editunit', { item:data.rows[0] })   
        })
    })
    router.post('/editunit/:id', (req, res) => {
        const editData = 'UPDATE UNIT set name=$1 where unit.id = $2'
        db.query(editData, [req.body.unitName, req.params.id], (err) => {
            if (err) {
            console.log('Failed to edit')
            throw err;
            }
            res.redirect('../unitlist')
            })
        })
    router.get('/deleteunit/:id', (req, res) => {
    const deleteData = 'DELETE FROM UNIT WHERE id = $1'
    db.query(deleteData, [req.params.id], (err) => {
        if (err) {
        {
            console.log('Failed to delete')
            throw err
        }
        }
    })
    res.redirect('../unitlist')
    })

    //STORAGE

    router.get('/addstorage', async function(req, res, next) {
        try{
           res.render('product/addstorage')
        } catch (e){
            res.send(e)
        }
    });
     router.post('/addstorage', function (req, res, next) {
        const addData = 'INSERT INTO storage(name) values ($1)'
        db.query(addData, [req.body.storageName], (err, data) => {
            if (err) return res.send(err)
            res.redirect('../product/storagelist')
    })
    });

    router.get('/storagelist', async function(req, res, next) {
        try{
            db.query('SELECT * FROM storage', (err, data)=>{
                if (err) {
                    console.log('Failed to read')
                    throw err;
                }
                res.render('product/storagelist', {data:data.rows})
            })
        } catch (e){
            res.send(e)
        }
    });
    router.get('/editstorage/:id', (req, res) => {
        const selectData = 'SELECT * FROM storage WHERE storage.id = $1'
        db.query(selectData,[req.params.id], (err, data) => {
            if (err) {
            console.log('Failed to read')
            throw err;
            }
            res.render('product/editstorage', { item:data.rows[0] })   
        })
    })
    router.post('/editstorage/:id', (req, res) => {
        const editData = 'UPDATE storage set name=$1 where storage.id = $2'
        db.query(editData, [req.body.storageName, req.params.id], (err) => {
            if (err) {
            console.log('Failed to edit')
            throw err;
            }
            res.redirect('../storagelist')
            })
        })
    router.get('/deletestorage/:id', (req, res) => {
    const deleteData = 'DELETE FROM storage WHERE id = $1'
    db.query(deleteData, [req.params.id], (err) => {
        if (err) {
        {
            console.log('Failed to delete')
            throw err
        }
        }
    })
    res.redirect('../storagelist')
    })





    //PRODUCT
    router.get('/addproduct', async function(req, res, next) {
        try{
           res.render('product/addproduct')
        } catch (e){
            res.send(e)
        }
    });
    router.get('/addstorage', async function(req, res, next) {
        try{
           res.render('product/addstorage')
        } catch (e){
            res.send(e)
        }
    });
    router.get('/storagelist', async function(req, res, next) {
        try{
           res.render('product/storagelist')
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
