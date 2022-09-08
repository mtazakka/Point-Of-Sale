var express = require('express');
var router = express.Router();
const fileUpload = require('express-fileupload');
var path = require('path');
var app = express();
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
            res.render('user/userlist')
        } catch (e){
            res.send(e)
        }
    
    });
    router.get('/submiterror', async function(req, res, next) {
        try{
           res.render('user/submiterror')
        } catch (e){
            res.send(e)
        }
    
    });

return router;
}
        // const addData = 'INSERT INTO storage(name) values ($1)'
        // await db.query(addData, [req.body.storageName], (err, data) => {
