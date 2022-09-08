var express = require('express');
var router = express.Router();
const { currencyFormatter } = require('../helpers/util')
const moment = require ('moment')

/* GET users listing. */
module.exports = function (db){
    //PRODUCT VARIANT
    router.get('/add', async function(req, res, next) {
        try{
            const {rows} = await db.query('INSERT INTO PURCHASE_TRANSACTION(total_price) VALUES (0) returning *')
            res.redirect(`/purchase/show/${rows[0].id}`)
            // res.redirect(`/purchase/show/`)
        } catch (e){
            console.log("Error at router /add", e)
            res.send(e)
        }
    });
    router.get('/manage', async function (req, res, next) {
    try{
        const {rows} = await db.query('SELECT * FROM PURCHASE_TRANSACTION')
        const noInvoice = req.query.noInvoice ? req.query.noInvoice : rows.length > 0 ? rows[0].no_invoice : '';
        const details  = await db.query('SELECT SD.*, PV.name FROM PURCHASE_DETAIL as SD LEFT JOIN PRODUCT_VARIANT as PV ON SD.idvariant = PV.idvariant WHERE SD.no_invoice = $1 ORDER BY SD.id', [noInvoice])
        res.render ('purchase/managepurchase',{
            currentPage: 'purchase/manage',
            rows,
            currencyFormatter,
            moment,
            details: details.rows
        })
    } catch (e){
        res.send(e)
    }
    })
    router.get('/show/:id', async function(req, res, next) {
        try{     
                   
            // const dataProduct = await db.query('SELECT * FROM PRODUCT')
            // const dataSupplier = await db.query('SELECT * FROM SUPPLIER')
            // const dataStorage = await db.query('SELECT * FROM STORAGE')
            // const dataCategory = await db.query('SELECT * FROM CATEGORY')
            // const dataUnit = await db.query('SELECT * FROM UNIT')
            // const dataProductVariant= await db.query('SELECT * FROM PRODUCT_VARIANT')
            const purchaseTransaction = await db.query('SELECT * FROM purchase_TRANSACTION WHERE id = $1', [req.params.id])
            const {rows} = await db.query('SELECT idvariant, name from PRODUCT_VARIANT ORDER BY idvariant')
            res.render('purchase/newtransaction', {
                // currencyFormatter,
                // dataProduct: dataProduct.rows,
                // dataSupplier: dataSupplier.rows,
                // dataStorage: dataStorage.rows,
                // dataCategory: dataCategory.rows,
                // dataUnit: dataUnit.rows,
                // dataProductVariant: dataProductVariant.rows,
                currentPage: 'purchaseTransaction',
                product_variant : rows,
                purchaseTransaction: purchaseTransaction.rows[0],
                moment,
            })
        } catch (e){
            console.log("Error at router /show", e)
            res.send(e)
        }
    
    });

    router.get('/product_variant/:idvariant', async function(req, res, next) {
            try{                
                const { rows } = await db.query('SELECT PV.idvariant, PV.qrcode, PV.image, product.name as product_name, storage.name as storage_name, PV.name, category.name as category_name, PV.price, PV.stock, unit.name as unit_name, PV.remarks, supplier.name as supplier_name, PV.supplier_price FROM PRODUCT_VARIANT as PV, PRODUCT, SUPPLIER, CATEGORY, UNIT, STORAGE WHERE PV.idproduct = product.id AND PV.idstorage = storage.id AND PV.idcategory = category.id AND PV.idunit = unit.id AND PV.idsupplier = supplier.id AND PV.idvariant = $1', [req.params.idvariant])
                res.json(rows[0])
            } catch (e){
                console.log("Error at /product_variant", e)
                res.send(e)
            }
        });

    router.post('/additem',async function(req, res, next) {
        try{
            console.log(req.body.qty, req.body.idvariant)
            const detail = await db.query('INSERT INTO PURCHASE_DETAIL(no_invoice,id_purchase, idvariant, qty, supplier_name, storage_name) VALUES ($1, $2, $3, $4, $5, $6) returning *', [req.body.no_invoice,req.body.idpurchase, req.body.idvariant, req.body.qty, req.body.idsupplier, req.body.idstorage])
            const detail2 = await db.query('UPDATE PURCHASE_TRANSACTION SET no_invoice =$1, total_price=$2, idsupplier=$3 WHERE id =$4',[req.body.no_invoice, req.body.total_price, req.body.idsupplier, req.body.idpurchase])
            const inStock = await db.query('UPDATE PRODUCT_VARIANT SET instock =$1 WHERE idvariant =$2',[req.body.qty, req.body.idvariant])
           const { rows } = await db.query('SELECT * FROM PURCHASE_TRANSACTION WHERE no_invoice = $1', [req.body.no_invoice])
            res.json(rows[0])            
        } catch (e){
            console.log("Error at router /additem", e)
            res.send(e)
        }
    
    });
    router.get('/details/:idpurchase', async function(req, res, next) {
            try{
                console.log(req.params.idpurchase, '-----------test----------')
                const { rows }  = await db.query('SELECT SD.*, PV.name FROM PURCHASE_DETAIL as SD LEFT JOIN PRODUCT_VARIANT as PV ON SD.idvariant = PV.idvariant WHERE SD.id_purchase = $1 ORDER BY SD.id', [req.params.idpurchase]);
                res.json(rows)
                
            } catch (e){
                console.log("Error at router New Transaction", e)
                res.send(e)
            }
        
        });


return router;
}
