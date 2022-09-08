var express = require('express');
var router = express.Router();
const { currencyFormatter } = require('../helpers/util')


/* GET users listing. */
module.exports = function (db){
    router.get('/', async function(req, res, next) {
        try{
            const dataEmployee = await db.query('SELECT COUNT (*) as total FROM EMPLOYEE')
            const dataVariant = await db.query('SELECT COUNT (*) as total FROM PRODUCT_VARIANT')
            const dataPurchase = await db.query('SELECT SUM(total_price) as total FROM PURCHASE_TRANSACTION')
            const dataSale = await db.query('SELECT SUM(total_price) as total FROM SALE_TRANSACTION')
            res.render('dashboard/list',{
                currencyFormatter,
                dataEmployee: dataEmployee.rows[0],
                dataVariant: dataVariant.rows[0],
                dataPurchase: dataPurchase.rows[0],
                dataSale: dataSale.rows[0]
            })
        } catch (e){
            res.send(e)
        }
    
    });

return router;
}
