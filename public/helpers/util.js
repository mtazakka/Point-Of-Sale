module.exports = {
    currencyFormatter : new Intl.NumberFormat('id', {
        style: 'currency',
        currency: 'IDR',
    }),
    isLoggedIn: function(req, res, next) {
        if(req.session.user){
            return next();
        }
        res.redirect('/login');
    }
}