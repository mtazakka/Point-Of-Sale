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
    router.post('/addcategory', async function (req, res, next) {
        try{
            const addData = 'INSERT INTO CATEGORY(name) values ($1)'
            await db.query(addData, [req.body.categoryName], (err, data) => {
                if (err) {
                    return res.send(err)
                }
                res.redirect('../product/categorylist')
                }) 
            }catch (err) {
                res.send(err)
            }
    });
    router.get('/categorylist', async function(req, res, next) {
        try{
            await db.query('SELECT * FROM CATEGORY', (err, data)=>{
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
    router.get('/editcategory/:id', async function (req, res, next)  {
        try{
            const selectData = 'SELECT * FROM CATEGORY WHERE category.id = $1'
            await db.query(selectData,[req.params.id], (err, data) => {
                if (err) {
                console.log('Failed to read')
                throw err;
                }
                res.render('product/editcategory', { item:data.rows[0] })   
            })
        } catch (err) {
            res.send(err)}
    })
    router.post('/editcategory/:id', async function (req, res, next) {
        try{
            const editData = 'UPDATE CATEGORY set name=$1 where category.id = $2'
            await db.query(editData, [req.body.categoryName, req.params.id], (err) => {
            if (err) {
            console.log('Failed to edit')
            throw err;
            }
            res.redirect('../categorylist')
            })
        } catch (err) {
            res.send(err)}
    })
    router.get('/deletecategory/:id', async function (req, res, next) {
        try{
            const deleteData = 'DELETE FROM CATEGORY WHERE id = $1'
            await db.query(deleteData, [req.params.id], (err) => {
                if (err) {
                    console.log('Failed to delete')
                    throw err
                }
            res.redirect('../categorylist')
            })
        } catch (err) {
            res.send(err)
        }
    })

    //UNIT
    router.get('/addunit', async function(req, res, next) {
        try{
           res.render('product/addunit')
        } catch (e){
            res.send(e)
        }
    });
    router.post('/addunit', async function (req, res, next) {
        try{
            const addData = 'INSERT INTO UNIT(name) values ($1)'
            await db.query(addData, [req.body.unitName], (err, data) => {
                if (err) return res.send(err)
                res.redirect('../product/unitlist')
            })
        } catch (e){
            res.send(e)}
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
    router.get('/editunit/:id', async function(req, res,next){
    try{
        const selectData = 'SELECT * FROM UNIT WHERE unit.id = $1'
        db.query(selectData,[req.params.id], (err, data) => {
            if (err) {
            console.log('Failed to read')
            throw err;
            }
            res.render('product/editunit', { item:data.rows[0] })   
        })
    }catch (err) {
        res.send(err)}
    })
    router.post('/editunit/:id', async function(req, res, next){
        try{
        const editData = 'UPDATE UNIT set name=$1 where unit.id = $2'
        db.query(editData, [req.body.unitName, req.params.id], (err) => {
            if (err) {
            console.log('Failed to edit')
            throw err;
            }
            res.redirect('../unitlist')
            })
        }catch (err) {
            res.send(err)
    }})
    router.get('/deleteunit/:id', async function(req, res, next) {
        try{
            const deleteData = 'DELETE FROM UNIT WHERE id = $1'
            await db.query(deleteData, [req.params.id], (err) => {
                if (err) {
                    console.log('Failed to delete')
                    throw err
                } res.redirect('../unitlist')
        })
        } catch(err){
            res.send(err)
    }})

    //STORAGE1
    router.get('/addstorage', async function(req, res, next) {
        try{
           res.render('product/addstorage')
        } catch (e){
            res.send(e)
        }
    });
    router.post('/addstorage', async function (req, res, next) {
    try{
        const addData = 'INSERT INTO storage(name) values ($1)'
        await db.query(addData, [req.body.storageName], (err, data) => {
            if (err) return res.send(err)
            res.redirect('../product/storagelist')
        })
        }catch (err) {
            res.send(err)
            }
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
    router.get('/editstorage/:id', async function (req, res, next) {
        try{
        const selectData = 'SELECT * FROM storage WHERE storage.id = $1'
        await db.query(selectData,[req.params.id], (err, data) => {
            if (err) {
            console.log('Failed to read')
            throw err;
            }
            res.render('product/editstorage', { item:data.rows[0] })   
        })}
        catch (err) {
            res.send(err)
    }
    })
    router.post('/editstorage/:id', async function (req, res, next) {
        try{
            const editData = 'UPDATE storage set name=$1 where storage.id = $2'
            await db.query(editData, [req.body.storageName, req.params.id], (err) => {
                if (err) {
                    console.log('Failed to edit')
                    throw err;
                }
            res.redirect('../storagelist')
            })
        } catch (err) {
            res.send(err)
    }})
    router.get('/deletestorage/:id', async function (req, res, next)  {
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
    router.post('/addproduct', async function (req, res, next) {
        const addData = 'INSERT INTO PRODUCT(name) values ($1)'
        await db.query(addData, [req.body.productName], (err, data) => {
            if (err) return res.send(err)
            res.redirect('../product/productlist')
    })
    });
    router.get('/productlist', async function (req, res, next) {
        try{
            await db.query('SELECT * FROM PRODUCT', (err, data)=>{
                if (err) {
                    console.log('Failed to read')
                    throw err;
                }
                res.render('product/productlist', {data:data.rows})
            })
        } catch (e){
            res.send(e)
        }
    });
    router.get('/editproduct/:id', async function (req, res, next) {
        try{
            const selectData = 'SELECT * FROM PRODUCT WHERE product.id = $1'
            await db.query(selectData,[req.params.id], (err, data) => {
                if (err) {
                console.log('Failed to read')
                throw err;
                }
                res.render('product/editproduct', { item:data.rows[0] })   
            })
        } catch (e){
            res.send(e)
    }})
    router.post('/editproduct/:id',async function (req, res, next) {
        try{
            const editData = 'UPDATE PRODUCT set name=$1 where product.id = $2'
            await db.query(editData, [req.body.productName, req.params.id], (err) => {
                if (err) {
                console.log('Failed to edit')
                throw err;
                }
                res.redirect('../productlist')
                })
            } catch (e){
                res.send(e)
    }})
    router.get('/deleteproduct/:id', async function (req, res, next) {
        try{
            const deleteData = 'DELETE FROM PRODUCT WHERE id = $1'
            await db.query(deleteData, [req.params.id], (err) => {
                if (err) {
                {
                    console.log('Failed to delete')
                    throw err
                }
                }
            })
            res.redirect('../productlist')
         } catch (err) {
            res.send(err)
         }})

    //PRODUCT VARIANT
    router.get('/addproductvariant', async function(req, res, next) {
        try{
        const dataProduct = await db.query('SELECT * FROM PRODUCT')
        const dataSupplier = await db.query('SELECT * FROM SUPPLIER')
        const dataStorage = await db.query('SELECT * FROM STORAGE')
        const dataCategory = await db.query('SELECT * FROM CATEGORY')
        const dataUnit = await db.query('SELECT * FROM UNIT')
        res.render('product/addproductvariant', {
            dataProduct: dataProduct.rows,
            dataSupplier: dataSupplier.rows,
            dataStorage: dataStorage.rows,
            dataCategory: dataCategory.rows,
            dataUnit: dataUnit.rows
           })
        } catch (e){
            res.send(e)
        }
    });
    router.get('/add', async function(req, res, next) {
        try{
            const {rows} = await db.query('INSERT INTO penjualan(total_harga) VALUES (0) returning *')
            res.redirect(`/penjualan/show/${rows[0].no_invoice}`)
        } catch (e){
            console.log("Error at router New Transaction", e)
            res.send(e)
        }
    });
        router.post('/addproductvariant', function (req, res, next) {
        const addData = 'INSERT INTO PRODUCT_VARIANT(qrcode, image, idproduct, idstorage, name, idcategory, sale_price, qty, idunit, remarks, supplier.id, supplier.price) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)'
        db.query(addData, [req.body.productVariantName], (err, data) => {
            if (err) return res.send(err)
            res.redirect('../product/manageproduct')
    })
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
