var express = require('express');
var router = express.Router();
const { currencyFormatter } = require('../helpers/util')
const moment = require ('moment')

/* GET users listing. */
module.exports = function (db){
    //PRODUCT VARIANT
    router.get('/add', async function(req, res, next) {
        try{
            const {rows} = await db.query('INSERT INTO sale_transaction(total_price) VALUES (0) returning *')
            res.redirect(`/sale/show/${rows[0].no_invoice}`)
        } catch (e){
            console.log("Error at router /add", e)
            res.send(e)
        }
    });
    router.get('/manage', async function (req, res, next) {
    try{
        const {rows} = await db.query('SELECT * FROM SALE_TRANSACTION')
        const noInvoice = req.query.noInvoice ? req.query.noInvoice : rows.length > 0 ? rows[0].no_invoice : '';
        const details  = await db.query('SELECT SD.*, PV.name FROM SALE_DETAIL as SD LEFT JOIN PRODUCT_VARIANT as PV ON SD.idproduct_variant = PV.id WHERE SD.no_invoice = $1 ORDER BY SD.id', [noInvoice])
        res.render ('sale/managesale',{
            currentPage: 'sale/manage',
            rows,
            currencyFormatter,
            moment,
            details: details.rows
        })
    } catch (e){
        res.send(e)
    }
    })
    router.get('/show/:no_invoice', async function(req, res, next) {
        try{
            const dataProduct = await db.query('SELECT * FROM PRODUCT')
            const dataSupplier = await db.query('SELECT * FROM SUPPLIER')
            const dataStorage = await db.query('SELECT * FROM STORAGE')
            const dataCategory = await db.query('SELECT * FROM CATEGORY')
            const dataUnit = await db.query('SELECT * FROM UNIT')
            const dataProductVariant= await db.query('SELECT * FROM PRODUCT_VARIANT')
            const saleTransaction = await db.query('SELECT * FROM SALE_TRANSACTION WHERE no_invoice = $1', [req.params.no_invoice])
            // const dataSaleTransaction = await db.query('SELECT * FROM SALE_TRANSACTION')
            const {rows} = await db.query('SELECT id, name from PRODUCT_VARIANT ORDER BY id')
            res.render('sale/newtransaction', {
                dataProduct: dataProduct.rows,
                dataSupplier: dataSupplier.rows,
                dataStorage: dataStorage.rows,
                dataCategory: dataCategory.rows,
                dataUnit: dataUnit.rows,
                dataProductVariant: dataProductVariant.rows,
                currentPage: 'saleTransaction',
                product_variant : rows,
                saleTransaction: saleTransaction.rows[0],
                moment,
                // dataSaleTransaction: dataSaleTransaction.rows
            })
            
        } catch (e){
            console.log("Error at router /show", e)
            res.send(e)
        }
    
    });

    router.get('/product_variant/:id', async function(req, res, next) {
            try{
                const { rows } = await db.query('SELECT PV.id, PV.qrcode, PV.image, product.name as product_name, storage.name as storage_name, PV.name, category.name as category_name, PV.price, PV.stock, unit.name as unit_name, PV.remarks, supplier.name as supplier_name, PV.supplier_price FROM PRODUCT_VARIANT as PV, PRODUCT, SUPPLIER, CATEGORY, UNIT, STORAGE WHERE PV.idproduct = product.id AND PV.idstorage = storage.id AND PV.idcategory = category.id AND PV.idunit = unit.id AND PV.idsupplier = supplier.id AND PV.id = $1', [req.params.id])
                res.json(rows[0])
                
            } catch (e){
                console.log("Error at /product_variant", e)
                res.send(e)
            }
        
        });
    router.post('/additem',async function(req, res, next) {
        try{
            const detail = await db.query('INSERT INTO sale_detail(no_invoice, idproduct_variant, qty) VALUES ($1, $2, $3) returning *', [req.body.no_invoice, req.body.id, req.body.qty])
           const { rows } = await db.query('SELECT * FROM SALE_TRANSACTION WHERE no_invoice = $1', [req.body.no_invoice])
            res.json(rows[0])            
        } catch (e){
            console.log("Error at router /additem", e)
            res.send(e)
        }
    
    });

    router.get('/details/:no_invoice', async function(req, res, next) {
            try{
                const { rows }  = await db.query('SELECT SD.*, PV.name FROM SALE_DETAIL as SD LEFT JOIN PRODUCT_VARIANT as PV ON SD.idproduct_variant = PV.id WHERE SD.no_invoice = $1 ORDER BY SD.id', [req.params.no_invoice]);
                res.json(rows)
                
            } catch (e){
                console.log("Error at router New Transaction", e)
                res.send(e)
            }
        
        });


return router;
}
