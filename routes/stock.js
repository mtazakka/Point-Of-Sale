var express = require('express');
var router = express.Router();
const { currencyFormatter } = require('../helpers/util')


/* GET users listing. */
module.exports = function (db){
    router.get('/', async function(req, res, next) {
        try{ 
            const dataVariant = await db.query('SELECT PV.idvariant, PV.qrcode, PV.image, product.name as product_name, storage.name as storage_name, PV.name, category.name as category_name, PV.price, PV.stock, PV.instock, PV.outstock, unit.name as unit_name, PV.remarks, supplier.name as supplier_name, PV.supplier_price FROM PRODUCT_VARIANT as PV, PRODUCT, SUPPLIER, CATEGORY, UNIT, STORAGE WHERE PV.idproduct = product.id AND PV.idstorage = storage.id AND PV.idcategory = category.id AND PV.idunit = unit.id AND PV.idsupplier = supplier.id')
            res.render('stock/stockreport',{
                dataVariant: dataVariant.rows,
                currencyFormatter
            })
        } catch (e){
            console.log(e)
            return res.send(e)
        }
    
    });

return router;
}
