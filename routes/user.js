var express = require('express');
var router = express.Router();
const fileUpload = require('express-fileupload');
var path = require('path');
var app = express();
const { currencyFormatter } = require('../helpers/util')
const moment = require ('moment')
app.use(fileUpload());



/* GET users listing. */
module.exports = function (db){
    router.get('/add', async function(req, res, next) {
        try{
           res.render('user/adduser')
        } catch (e){
            res.send(e)
        }
    
    });
    router.post('/add', async function (req, res, next) {
        try{
            let userPicture;
            let uploadPath;
            if (!req.files || Object.keys(req.files).length === 0) {
                console.log(err)
                return res.status(400).send('No files were uploaded.');
            }            
            userPicture = req.files.user_picture;
            const filename = `EMP${Date.now()}-${userPicture.name}}`
            uploadPath = path.join(__dirname, "../", "public", "uploads", "userpicture", filename);
            await userPicture.mv(uploadPath, function(err) {
                if (err){
                    console.log(err)    
                    return res.status(500).send(err);
                }
                const addData = `INSERT INTO EMPLOYEE(name, phone, idcard, email, password, address, status, picture) values ($1,$2,$3,$4,$5,$6,$7,$8)`
                db.query(addData, [req.body.user_name, req.body.user_phone, req.body.user_idcard, req.body.user_email, req.body.user_password, req.body.user_address, req.body.user_status, filename], (err, data) => {
                    if (err) {
                        console.log(err);
                        return res.send(err)}
                    res.redirect('../user/list')
                    })
            });
        } catch (err) {
            res.send(err)
    }});


    router.get('/list', async function(req, res, next) {
        try{
            const dataEmployee = await db.query('SELECT * FROM EMPLOYEE')
            res.render('user/userlist',{
                dataEmployee: dataEmployee.rows,
                currencyFormatter
            })
        } catch (e){
            res.send(e)
        }
    
    });
    router.get('/edituser/:id', async function (req, res, next)  {
        try{
            const selectData = 'SELECT * FROM EMPLOYEE WHERE id = $1'
            await db.query(selectData,[req.params.id], (err, data) => {
                if (err) {
                console.log('Failed to read')
                throw err;
                }
                res.render('user/edituser', { item:data.rows[0], moment})   
            })
        } catch (err) {
            res.send(err)}
    })
    router.post('/edituser/:id',async function (req, res, next) {
        try{
            const editData = 'UPDATE EMPLOYEE set name=$1, phone=$2, idcard=$3, email=$4, address=$5, status=$6, remarks=$7 where id = $8'
            await db.query(editData, [req.body.user_name, req.body.user_phone, req.body.user_idcard, req.body.user_email, req.body.user_address, req.body.user_status, req.body.user_remarks, req.params.id], (err) => {
                if (err) {
                console.log('Failed to edit')
                throw err;
                }
                res.redirect('../list')
                })
            } catch (e){
                res.send(e)
    }})
    router.get('/deleteuser/:id', async function (req, res, next) {
        try{
            const deleteData = 'DELETE FROM EMPLOYEE WHERE id = $1'
            await db.query(deleteData, [req.params.id], (err) => {
                if (err) {
                {
                    console.log('Failed to delete')
                    throw err
                }
                }
            })
            res.redirect('../list')
        } catch (err) {
            res.send(err)
    }})

return router;
}
