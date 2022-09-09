var express = require('express');
var router = express.Router();
const fileUpload = require('express-fileupload');
var path = require('path');
const { currencyFormatter, isLoggedIn } = require('../public/helpers/util')
var app = express();
app.use(fileUpload());
const moment = require ('moment')

/* GET users listing. */
module.exports = function (db){
    //CATEGORY
    router.get('/addcategory', isLoggedIn, async function(req, res, next) {
        try{
            res.render('product/addcategory',{
                user:req.session.user
            })
        } catch (e){
            console.log(e)
            return res.send(e)
        }
    });
    router.post('/addcategory', isLoggedIn, async function (req, res, next) {
        try{
            const addData = 'INSERT INTO CATEGORY(name) values ($1)'
            await db.query(addData, [req.body.categoryName], (err, data) => {
                if (err) {
                    console.log(err)
                    return res.send(err)
                }
                res.redirect('../product/categorylist')
                }) 
            }catch (err) {
                console.log(err)
                return res.send(err)
            }
    });
    router.get('/categorylist', isLoggedIn, async function(req, res, next) {
        try{
            await db.query('SELECT * FROM CATEGORY', (err, data)=>{
                if (err) {
                    console.log(err)
                    return res.send(err)
                }
                res.render('product/categorylist', {
                    data:data.rows,
                    user:req.session.user
                })
            })
        } catch (e){
            console.log(e)
            return res.send(err)
        }
    });
    router.get('/editcategory/:id', isLoggedIn, async function (req, res, next)  {
        try{
            const selectData = 'SELECT * FROM CATEGORY WHERE category.id = $1'
            await db.query(selectData,[req.params.id], (err, data) => {
                if (err) {
                    console.log(err)
                    return res.send(err)
                }
                res.render('product/editcategory', { 
                    item:data.rows[0], 
                    user:req.session.user
                })   
            })
        } catch (err) {
            res.send(err)
            return res.send(err)
        }
    })
    router.post('/editcategory/:id', isLoggedIn, async function (req, res, next) {
        try{
            const editData = 'UPDATE CATEGORY set name=$1 where category.id = $2'
            await db.query(editData, [req.body.categoryName, req.params.id], (err) => {
                if (err) {
                    console.log(err)
                    return res.send(err)
            }
            res.redirect('../categorylist')
            })
        } catch (err) {
            console.log(err)
            return res.send(err)
        }
    })
    router.get('/deletecategory/:id', isLoggedIn, async function (req, res, next) {
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
            console.log(err)
            res.send(err)
        }
    })

    //UNIT
    router.get('/addunit', isLoggedIn, async function(req, res, next) {
        try{
            res.render('product/addunit',{
                user:req.session.user
            })
        } catch (e){
            console.log(e)
            return res.send(err)
        }
    });
    router.post('/addunit', isLoggedIn, async function (req, res, next) {
        try{
            const addData = 'INSERT INTO UNIT(name) values ($1)'
            await db.query(addData, [req.body.unitName], (err, data) => {
                if (err) {
                    console.log(err)
                    return res.send(err)
                }
                res.redirect('../product/unitlist')
            })
        } catch (e){
            console.log(e)
            res.send(e)
        }
    });
    router.get('/unitlist', isLoggedIn, async function(req, res, next) {
        try{
            db.query('SELECT * FROM UNIT', (err, data)=>{
                if (err) {
                    console.log(err)
                    return res.send(err)
                }
                res.render('product/unitlist', {
                    data:data.rows,
                    user:req.session.user
                })
            })
        } catch (e){
            console.log(e)
            return res.send(err)
        }
    });
    router.get('/editunit/:id', isLoggedIn, async function(req, res,next){
    try{
        const selectData = 'SELECT * FROM UNIT WHERE unit.id = $1'
        db.query(selectData,[req.params.id], (err, data) => {
            if (err) {
                console.log(err)
                return res.send(err);
            }
            res.render('product/editunit', { 
                item:data.rows[0],
                user:req.session.user
            })   
        })
    }catch (err) {
        console.log(err);
        return res.send(err)
    }
    })
    router.post('/editunit/:id', isLoggedIn, async function(req, res, next){
        try{
        const editData = 'UPDATE UNIT set name=$1 where unit.id = $2'
        db.query(editData, [req.body.unitName, req.params.id], (err) => {
            if (err) {
                console.log(err)
                return res.send(err);
            }
            res.redirect('../unitlist')
            })
        }catch (err) {
                console.log(err)
                return res.send(err);
    }})
    router.get('/deleteunit/:id', isLoggedIn, async function (req, res, next) {
        try{
            const deleteData = 'DELETE FROM unit WHERE id = $1'
            await db.query(deleteData, [req.params.id], (err) => {
                if (err) {
                    console.log('Failed to delete')
                    throw err
                }
            res.redirect('../unitlist')
            })
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    })
    //STORAGE1
    router.get('/addstorage', isLoggedIn, async function(req, res, next) {
        try{
            res.render('product/addstorage',{
                user:req.session.user
            })
        } catch (e){
            console.log(err)
            return res.send(err);
        }
    });
    router.post('/addstorage', isLoggedIn, async function (req, res, next) {
    try{
        const addData = 'INSERT INTO storage(name) values ($1)'
        await db.query(addData, [req.body.storageName], (err, data) => {
            if (err) {
                console.log(err)
                return res.send(err);
            }
            res.redirect('../product/storagelist')
        })
        }catch (err) {
            console.log(err)
            return res.send(err);
        }
    });
    router.get('/storagelist', isLoggedIn, async function(req, res, next) {
        try{
            db.query('SELECT * FROM storage', (err, data)=>{
                if (err) {
                    console.log(err)
                    return res.send(err);
                }
                res.render('product/storagelist', {
                    data:data.rows,
                    user:req.session.user
                })
            })
        } catch (e){
            console.log(err)
            return res.send(err);
        }
    });
    router.get('/editstorage/:id', isLoggedIn, async function (req, res, next) {
        try{
        const selectData = 'SELECT * FROM storage WHERE storage.id = $1'
        await db.query(selectData,[req.params.id], (err, data) => {
            if (err) {
                console.log(err)
                return res.send(err);
            }
            res.render('product/editstorage', { 
                item:data.rows[0],
                user:req.session.user
            })   
        })}
        catch (err) {
            console.log(err)
            return res.send(err);
    }
    })
    router.post('/editstorage/:id', isLoggedIn, async function (req, res, next) {
        try{
            const editData = 'UPDATE storage set name=$1 where storage.id = $2'
            await db.query(editData, [req.body.storageName, req.params.id], (err) => {
                if (err) {
                    console.log(err)
                    return res.send(err);
                }
            res.redirect('../storagelist')
            })
        } catch (err) {
            console.log(err)
            return res.send(err);
    }})
    router.get('/deletestorage/:id', isLoggedIn, async function (req, res, next)  {
        try{ 
            const deleteData = 'DELETE FROM storage WHERE id = $1'
            await db.query(deleteData, [req.params.id], (err) => {
                if (err) {
                    console.log(err)
                    return res.send(err);      
                } 
            res.redirect('../storagelist')
            })
        }catch (err) {
            console.log(err)
            return res.send(err)
        }})

    //PRODUCT
    router.get('/addproduct', isLoggedIn, async function(req, res, next) {
        try{
            res.render('product/addproduct',{
                user:req.session.user
            })
        } catch (e){
            console.log(err)
            return res.send(err)
        }
    });
    router.post('/addproduct', isLoggedIn, async function (req, res, next) {
        try{
            const addData = 'INSERT INTO PRODUCT(name) values ($1)'
            await db.query(addData, [req.body.productName], (err, data) => {
                if (err) {
                    console.log(err)
                    return res.send(err)
                }res.redirect('../product/productlist')
            })
        } catch (err){
            console.log(err)
            return res.send(err)
        }});
    router.get('/productlist', isLoggedIn, async function (req, res, next) {
        try{
            await db.query('SELECT * FROM PRODUCT', (err, data)=>{
                if (err) {
                    console.log(err)
                    throw err;
                }
                res.render('product/productlist', {
                    data:data.rows,
                    user:req.session.user
                })
            })
        } catch (err){
            console.log(err)
            return res.send(err)
        }
    });
    router.get('/editproduct/:id', isLoggedIn, async function (req, res, next) {
        try{
            const selectData = 'SELECT * FROM PRODUCT WHERE product.id = $1'
            await db.query(selectData,[req.params.id], (err, data) => {
                if (err) {
                        console.log(err)
                        return res.send(err)
                }
                res.render('product/editproduct', { 
                    item:data.rows[0],
                    user:req.session.user 
                })   
            })
        } catch (err){
            console.log(err)
            return res.send(err)
    }})
    router.post('/editproduct/:id', isLoggedIn, async function (req, res, next) {
        try{
            const editData = 'UPDATE PRODUCT set name=$1 where product.id = $2'
            await db.query(editData, [req.body.productName, req.params.id], (err) => {
                if (err) {
                        console.log(err)
                        return res.send(err)
                }
                res.redirect('../productlist')
                })
            } catch (err){
                        console.log(err)
                        return res.send(err)
    }})
    router.get('/deleteproduct/:id', isLoggedIn, async function (req, res, next) {
        try{
            const deleteData = 'DELETE FROM PRODUCT WHERE id = $1'
            await db.query(deleteData, [req.params.id], (err) => {
                if (err) {
                    console.log('Failed to delete')
                    throw err
                }
                res.redirect('../productlist')
            }) 
        } catch (err) {
            console.log(err)
            return res.send(err)
    }})

    //PRODUCT VARIANT
    router.get('/addproductvariant', isLoggedIn, async function(req, res, next) {
        try{
        const dataProduct = await db.query('SELECT * FROM PRODUCT ORDER BY name asc')
        const dataSupplier = await db.query('SELECT * FROM SUPPLIER ORDER BY name asc')
        const dataStorage = await db.query('SELECT * FROM STORAGE ORDER BY name asc')
        const dataCategory = await db.query('SELECT * FROM CATEGORY ORDER BY name asc')
        const dataUnit = await db.query('SELECT * FROM UNIT')
        res.render('product/addproductvariant', {
            user:req.session.user,
            dataProduct: dataProduct.rows,
            dataSupplier: dataSupplier.rows,
            dataStorage: dataStorage.rows,
            dataCategory: dataCategory.rows,
            dataUnit: dataUnit.rows
        })
        } catch (err){
            console.log(err)
            return res.send(err)
        }
    });
    router.post('/addproductvariant', isLoggedIn, async function (req, res, next) {
        try{
            let variantImage;
            let uploadPath;
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('No files were uploaded.');
            }            
            variantImage = req.files.variantImage;
            const filename = `V${Date.now()}-${variantImage.name}`
            uploadPath = path.join(__dirname, "../", "public", "uploads", "imagevariant", filename);
            await variantImage.mv(uploadPath, function(err) {
                if (err){
                    console.log(err)    
                    return res.status(500).send(err);
                }
                const addData = `INSERT INTO PRODUCT_VARIANT(qrcode, image, idproduct, idstorage, name, idcategory, price, idunit, remarks, idsupplier, supplier_price) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`
                db.query(addData, [req.body.variantQrcode, filename, req.body.productName, req.body.variantStorage, req.body.variantName, req.body.variantCategory, req.body.variantSalePrice, req.body.variantUnit, req.body.variantRemarks, req.body.variantSupplier, req.body.variantSupplierPrice ], (err, data) => {
                    if (err) {
                        console.log(err);
                        return res.send(err)}
                    res.redirect('../product/manageproduct')
                    })
            });
        } catch (err) {
            console.log(err)
            return res.send(err)
    }});
    router.get('/manageproduct', isLoggedIn, async function(req, res, next) {
        try{ 
            const dataVariant = await db.query('SELECT PV.idvariant, PV.qrcode, PV.image, product.name as product_name, storage.name as storage_name, PV.name, category.name as category_name, PV.price, PV.stock, unit.name as unit_name, PV.remarks, supplier.name as supplier_name, PV.supplier_price FROM PRODUCT_VARIANT as PV, PRODUCT, SUPPLIER, CATEGORY, UNIT, STORAGE WHERE PV.idproduct = product.id AND PV.idstorage = storage.id AND PV.idcategory = category.id AND PV.idunit = unit.id AND PV.idsupplier = supplier.id ORDER BY PV.reg_date asc')
            res.render('product/manageproduct',{
                user:req.session.user,
                dataVariant: dataVariant.rows,
                currencyFormatter
            })
        } catch (e){
            console.log(err)
            return res.send(err)
        }
    });
    router.get('/deletevariant/:id', isLoggedIn, async function (req, res, next) {
        try{
            const deleteData = 'DELETE FROM PRODUCT_VARIANT WHERE idvariant = $1'
            await db.query(deleteData, [req.params.id], (err) => {
                if (err) {
                    console.log(err)
                    return res.send(err)
                }
            res.redirect('../manageproduct')
            })
        } catch (err) {
            console.log(err)
            return res.send(err)
    }})
    router.get('/editvariant/:id', isLoggedIn, async function (req, res, next) {
        try{
            const dataProduct = await db.query('SELECT * FROM PRODUCT')
            const dataSupplier = await db.query('SELECT * FROM SUPPLIER')
            const dataStorage = await db.query('SELECT * FROM STORAGE')
            const dataCategory = await db.query('SELECT * FROM CATEGORY')
            const dataUnit = await db.query('SELECT * FROM UNIT')
            const selectData = 'SELECT PV.idvariant, PV.qrcode, PV.image, PV.reg_date, product.name as product_name, storage.name as storage_name, PV.name, category.name as category_name, PV.price, PV.stock, unit.name as unit_name, PV.remarks, supplier.name as supplier_name, PV.supplier_price FROM PRODUCT_VARIANT as PV, PRODUCT, SUPPLIER, CATEGORY, UNIT, STORAGE WHERE PV.idproduct = product.id AND PV.idstorage = storage.id AND PV.idcategory = category.id AND PV.idunit = unit.id AND PV.idsupplier = supplier.id AND PV.idvariant = $1'
            await db.query(selectData,[req.params.id], (err, data) => {
                if (err) {
                        console.log(err)
                        return res.send(err)
                }
                console.log(data.rows[0])
                res.render('product/editvariant', { 
                    user:req.session.user,
                    item:data.rows[0],
                    dataProduct: dataProduct.rows,
                    dataSupplier: dataSupplier.rows,
                    dataStorage: dataStorage.rows,
                    dataCategory: dataCategory.rows,
                    dataUnit: dataUnit.rows,
                    moment
                })   
            })
        } catch (err){
            console.log(err)
            return res.send(err)
    }})
    router.post('/editvariant/:id', isLoggedIn, async function (req, res, next) {
        try{
            const editData = 'UPDATE PRODUCT_VARIANT set qrcode=$1, idproduct=$2, idstorage=$3, name=$4, idcategory=$5, price=$6, stock=$7, idunit=$8, remarks=$9, idsupplier=$10, supplier_price=$11 where idvariant = $12'
            await db.query(editData, [req.body.variantQrcode, req.body.productName, req.body.variantStorage, req.body.variantName, req.body.variantCategory, req.body.variantSalePrice, req.body.variantStock, req.body.variantUnit, req.body.variantRemarks, req.body.variantSupplier, req.body.variantSupplierPrice, req.params.id], (err) => {
                    if (err) {
                            res.send(err)
                        }
                        res.redirect('../manageproduct')
                    })
            } catch (err){
                    console.log(err)
                    return res.send(err)
    }})

return router;
}
