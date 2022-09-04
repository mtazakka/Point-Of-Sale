var express = require('express');
var router = express.Router();
const fileUpload = require('express-fileupload');
var path = require('path');
const { currencyFormatter } = require('../helpers/util')
var app = express();
app.use(fileUpload());

/* GET users listing. */
module.exports = function (db){
        //PRODUCT VARIANT
    router.get('/new', async function(req, res, next) {
        try{
        const dataProduct = await db.query('SELECT * FROM PRODUCT')
        const dataSupplier = await db.query('SELECT * FROM SUPPLIER')
        const dataStorage = await db.query('SELECT * FROM STORAGE')
        const dataCategory = await db.query('SELECT * FROM CATEGORY')
        const dataUnit = await db.query('SELECT * FROM UNIT')
        const dataProductVariant= await db.query('SELECT * FROM PRODUCT_VARIANT')
        const dataSaleTransaction = await db.query('SELECT * FROM SALE_TRANSACTION')
        res.render('sale/newtransaction', {
            dataProduct: dataProduct.rows,
            dataSupplier: dataSupplier.rows,
            dataStorage: dataStorage.rows,
            dataCategory: dataCategory.rows,
            dataUnit: dataUnit.rows,
            dataProductVariant: dataProductVariant.rows,
            dataSaleTransaction: dataSaleTransaction.rows
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
                const addData = `INSERT INTO PRODUCT_VARIANT(qrcode, image, idproduct, idstorage, name, idcategory, sale_price, stock, idunit, remarks, idsupplier, supplier_price) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, $12)`
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
            const dataVariant = await db.query('SELECT PV.id, PV.qrcode, PV.image, product.name as product_name, storage.name as storage_name, PV.name, category.name as category_name, PV.sale_price, PV.stock, unit.name as unit_name, PV.remarks, supplier.name as supplier_name, PV.supplier_price FROM PRODUCT_VARIANT as PV, PRODUCT, SUPPLIER, CATEGORY, UNIT, STORAGE WHERE PV.idproduct = product.id AND PV.idstorage = storage.id AND PV.idcategory = category.id AND PV.idunit = unit.id AND PV.idsupplier = supplier.id')
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
            const selectData = 'SELECT PV.id, PV.qrcode, PV.image, product.name as product_name, storage.name as storage_name, PV.name, category.name as category_name, PV.sale_price, PV.stock, unit.name as unit_name, PV.remarks, supplier.name as supplier_name, PV.supplier_price FROM PRODUCT_VARIANT as PV, PRODUCT, SUPPLIER, CATEGORY, UNIT, STORAGE WHERE PV.idproduct = product.id AND PV.idstorage = storage.id AND PV.idcategory = category.id AND PV.idunit = unit.id AND PV.idsupplier = supplier.id AND PV.id = $1'
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
                const editData = 'UPDATE PRODUCT_VARIANT set qrcode=$1, idproduct=$2, idstorage=$3, name=$4, idcategory=$5, sale_price=$6, stock=$7, idunit=$8, remarks=$9, idsupplier=$10, supplier_price=$11 where product_variant.id = $12'
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
