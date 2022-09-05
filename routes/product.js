var express = require('express');
var router = express.Router();
const fileUpload = require('express-fileupload');
var path = require('path');
const { currencyFormatter } = require('../helpers/util')
var app = express();
app.use(fileUpload());

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
    router.post('/addproductvariant', async function (req, res, next) {
        try{
            
            let variantImage;
            let uploadPath;

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('No files were uploaded.');
            }

            // The name of the input field (i.e. "variantImage") is used to retrieve the uploaded file
            variantImage = req.files.variantImage;
            const filename = `V${Date.now()}-${variantImage.name}}`
            uploadPath = path.join(__dirname, "../", "public", "uploads", "imagevariant", filename);
            // Use the mv() method to place the file somewhere on your server
            await variantImage.mv(uploadPath, function(err) {
                if (err)
                return res.status(500).send(err);
                const addData = `INSERT INTO PRODUCT_VARIANT(qrcode, image, idproduct, idstorage, name, idcategory, price, stock, idunit, remarks, idsupplier, supplier_price) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, $12)`
                db.query(addData, [req.body.variantQrcode, filename, req.body.productName, req.body.variantStorage, req.body.variantName, req.body.variantCategory, req.body.variantSalePrice, req.body.variantStock, req.body.variantUnit, req.body.variantRemarks, req.body.variantSupplier, req.body.variantSupplierPrice ], (err, data) => {
                    if (err) return res.send(err)
                    res.redirect('../product/manageproduct')
                    })
            });
        } catch (err) {
            res.send(err)
    }});
    router.get('/manageproduct', async function(req, res, next) {
        try{ 
            const dataVariant = await db.query('SELECT PV.id, PV.qrcode, PV.image, product.name as product_name, storage.name as storage_name, PV.name, category.name as category_name, PV.price, PV.stock, unit.name as unit_name, PV.remarks, supplier.name as supplier_name, PV.supplier_price FROM PRODUCT_VARIANT as PV, PRODUCT, SUPPLIER, CATEGORY, UNIT, STORAGE WHERE PV.idproduct = product.id AND PV.idstorage = storage.id AND PV.idcategory = category.id AND PV.idunit = unit.id AND PV.idsupplier = supplier.id')
            res.render('product/manageproduct',{
                dataVariant: dataVariant.rows,
                currencyFormatter
            })
            console.log(dataVariant.rows)
        } catch (e){
            res.send(e)
        }
    });
    router.get('/deletevariant/:id', async function (req, res, next) {
        try{
            const deleteData = 'DELETE FROM PRODUCT_VARIANT WHERE id = $1'
            await db.query(deleteData, [req.params.id], (err) => {
                if (err) {
                {
                    console.log('Failed to delete')
                    throw err
                }
                }
            })
            res.redirect('../manageproduct')
         } catch (err) {
            res.send(err)
    }})
    router.get('/editvariant/:id', async function (req, res, next) {
        try{
            const dataProduct = await db.query('SELECT * FROM PRODUCT')
            const dataSupplier = await db.query('SELECT * FROM SUPPLIER')
            const dataStorage = await db.query('SELECT * FROM STORAGE')
            const dataCategory = await db.query('SELECT * FROM CATEGORY')
            const dataUnit = await db.query('SELECT * FROM UNIT')
            const selectData = 'SELECT PV.id, PV.qrcode, PV.image, product.name as product_name, storage.name as storage_name, PV.name, category.name as category_name, PV.price, PV.stock, unit.name as unit_name, PV.remarks, supplier.name as supplier_name, PV.supplier_price FROM PRODUCT_VARIANT as PV, PRODUCT, SUPPLIER, CATEGORY, UNIT, STORAGE WHERE PV.idproduct = product.id AND PV.idstorage = storage.id AND PV.idcategory = category.id AND PV.idunit = unit.id AND PV.idsupplier = supplier.id AND PV.id = $1'
            await db.query(selectData,[req.params.id], (err, data) => {
                if (err) {
                console.log('Failed to read')
                throw err;
                }
                console.log(data.rows[0])
                res.render('product/editvariant', { 
                    item:data.rows[0],
                    dataProduct: dataProduct.rows,
                    dataSupplier: dataSupplier.rows,
                    dataStorage: dataStorage.rows,
                    dataCategory: dataCategory.rows,
                    dataUnit: dataUnit.rows
                })   
            })
        } catch (e){
            res.send(e)
    }})
    router.post('/editvariant/:id',async function (req, res, next) {
        try{
            // let variantImage;
            // let uploadPath;

            // if (!req.files || Object.keys(req.files).length === 0) {
            //     return res.status(400).send('No files were uploaded.');
            // }

            // // The name of the input field (i.e. "variantImage") is used to retrieve the uploaded file
            // variantImage = req.files.variantImage;
            // const filename = `V${Date.now()}-${variantImage.name}}`
            // uploadPath = path.join(__dirname, "../", "public", "uploads", "imagevariant", filename);
            // // Use the mv() method to place the file somewhere on your server
            // await variantImage.mv(uploadPath, function(err) {
            //     if (err)
            //     return res.status(500).send(err);
                const editData = 'UPDATE PRODUCT_VARIANT set qrcode=$1, idproduct=$2, idstorage=$3, name=$4, idcategory=$5, price=$6, stock=$7, idunit=$8, remarks=$9, idsupplier=$10, supplier_price=$11 where product_variant.id = $12'
                await db.query(editData, [req.body.variantQrcode, req.body.productName, req.body.variantStorage, req.body.variantName, req.body.variantCategory, req.body.variantSalePrice, req.body.variantStock, req.body.variantUnit, req.body.variantRemarks, req.body.variantSupplier, req.body.variantSupplierPrice, req.params.id], (err) => {
                    if (err) {
                    res.send(err)}
                    res.redirect('../manageproduct')
                    })
                // })
            } catch (e){
                    res.send(e)
    }})

return router;
}
