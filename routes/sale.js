var express = require('express');
var router = express.Router();
const { currencyFormatter,isLoggedIn } = require('../public/helpers/util')
const moment = require ('moment')
const bcrypt = require('bcrypt');
const saltRounds = 10;


/* GET users listing. */
module.exports = function (db){
    //PRODUCT VARIANT
    router.get('/add', isLoggedIn, async function(req, res, next) {
        try{
            const {rows} = await db.query('INSERT INTO sale_transaction(total_price) VALUES (0) returning *')
            res.redirect(`/sale/show/${rows[0].no_invoice}`)
        } catch (e){
            console.log("Error at router /add", e)
            res.send(e)
        }
    });
    router.get('/manage', isLoggedIn, async function (req, res, next) {
    try{
        const {rows} = await db.query('SELECT * FROM SALE_TRANSACTION ORDER BY date DESC')
        const noInvoice = req.query.noInvoice ? req.query.noInvoice : rows.length > 0 ? rows[0].no_invoice : '';
        const details  = await db.query('SELECT SD.*, PV.name FROM SALE_DETAIL as SD LEFT JOIN PRODUCT_VARIANT as PV ON SD.idvariant = PV.idvariant WHERE SD.no_invoice = $1 ORDER BY SD.id', [noInvoice])
        res.render ('sale/managesale',{
            user:req.session.user,
            currentPage: 'sale/manage',
            rows,
            currencyFormatter,
            moment,
            details: details.rows,
            noInvoice
        })
    } catch (e){
        res.send(e)
    }
    })
    router.get('/show/:no_invoice', isLoggedIn, async function(req, res, next) {
        try{
            const dataProduct = await db.query('SELECT * FROM PRODUCT')
            const dataSupplier = await db.query('SELECT * FROM SUPPLIER')
            const dataStorage = await db.query('SELECT * FROM STORAGE')
            const dataCategory = await db.query('SELECT * FROM CATEGORY')
            const dataUnit = await db.query('SELECT * FROM UNIT')
            const dataProductVariant= await db.query('SELECT * FROM PRODUCT_VARIANT')
            const saleTransaction = await db.query('SELECT * FROM SALE_TRANSACTION WHERE no_invoice = $1', [req.params.no_invoice])
            const {rows} = await db.query('SELECT PD.idvariant, PD.name, product.name as product_name from PRODUCT_VARIANT as PD, PRODUCT WHERE PD.idproduct = product.id ORDER BY PD.reg_date asc')
            res.render('sale/newtransaction', {
                user:req.session.user,
                currencyFormatter,
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
            })
        } catch (e){
            console.log("Error at router /show", e)
            res.send(e)
        }
    
    });

    router.get('/product_variant/:idvariant', isLoggedIn, async function(req, res, next) {
            try{
                console.log(req.params.idvariant)
                const { rows } = await db.query('SELECT PV.idvariant, PV.qrcode, PV.image, product.name as product_name, storage.name as storage_name, PV.name, category.name as category_name, PV.price, PV.stock as stock, unit.name as unit_name, PV.remarks, supplier.name as supplier_name, PV.supplier_price FROM PRODUCT_VARIANT as PV, PRODUCT, SUPPLIER, CATEGORY, UNIT, STORAGE WHERE PV.idproduct = product.id AND PV.idstorage = storage.id AND PV.idcategory = category.id AND PV.idunit = unit.id AND PV.idsupplier = supplier.id AND PV.idvariant = $1', [req.params.idvariant])
                res.json(rows[0])
            } catch (e){
                console.log("Error at /product_variant", e)
                res.send(e)
            }
        
        });
    router.post('/additem', isLoggedIn, async function(req, res, next) {
        try{
            const detail = await db.query('INSERT INTO sale_detail(no_invoice, idvariant, qty) VALUES ($1, $2, $3) returning *', [req.body.no_invoice, req.body.idvariant, req.body.qty])
            const outStock = await db.query('UPDATE PRODUCT_VARIANT SET outstock =$1 WHERE idvariant =$2',[req.body.qty, req.body.idvariant])
           const { rows } = await db.query('SELECT * FROM SALE_TRANSACTION WHERE no_invoice = $1', [req.body.no_invoice])
            res.json(rows[0])            
        } catch (e){
            console.log("Error at router /additem", e)
            res.send(e)
        }
    
    });
      router.post('/payment', isLoggedIn, async function(req, res, next) {
        console.log(req.body.cashback, req.body.payment, req.body.no_invoice)
        try{
            const {rows} = await db.query('UPDATE SALE_TRANSACTION SET cashback=$1, payment=$2, processby=$3  WHERE no_invoice = $4', [req.body.cashback, req.body.payment, req.session.user.name, req.body.no_invoice])            
            // res.redirect('/manage'),
            res.json(rows[0])
        } catch (e){
            console.log("Error at router /payment", e)
            res.send(e)
        }
    
    });

    router.get('/details/:no_invoice', isLoggedIn, async function(req, res, next) {
            try{
                const { rows }  = await db.query('SELECT SD.*, PV.name FROM SALE_DETAIL as SD LEFT JOIN PRODUCT_VARIANT as PV ON SD.idvariant = PV.idvariant WHERE SD.no_invoice = $1 ORDER BY SD.id', [req.params.no_invoice]);
                res.json(rows)
                
            } catch (e){
                console.log("Error at router New Transaction", e)
                res.send(e)
            }
        
        });
    router.get('/invoice/:no_invoice', isLoggedIn, async function(req, res, next) {
        try{
            const saleTransaction = await db.query('SELECT * FROM SALE_TRANSACTION WHERE no_invoice = $1', [req.params.no_invoice])
            const saleDetail = await db.query('SELECT SD.*, PV.name as name FROM SALE_DETAIL as SD, PRODUCT_VARIANT as PV WHERE SD.idvariant = PV.idvariant AND no_invoice = $1', [req.params.no_invoice])
            res.render('sale/invoice', {
                user:req.session.user,
                currencyFormatter,
                saleTransaction: saleTransaction.rows[0],
                saleDetail: saleDetail.rows,
                moment,
            })
        } catch (e){
            console.log("Error at router /show", e)
            res.send(e)
        }
    
    });
router.get('/delete/:no_invoice', isLoggedIn, async function (req, res, next) {
        try{
            const deleteData = 'DELETE FROM SALE_TRANSACTION WHERE no_invoice = $1'
            await db.query(deleteData, [req.params.no_invoice], (err) => {
                if (err) {
                    console.log(err)
                    return res.send(err)
                }
            res.redirect('../manage')
            })
        } catch (err) {
            console.log(err)
            return res.send(err)
    }})
return router;
}
