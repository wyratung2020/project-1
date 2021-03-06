var express = require('express');
var router = express.Router();

var giohang = require('../models/giohang.js');
var Cart = require('../models/cart.js');


router.get('/', isLoggedIn, function (req, res, next)
{
    res.redirect('/admin/cart/danh-sach', { layout: 'layout-admin' });
});

router.get('/danh-sach-cho-giao', isLoggedIn, function (req, res, next)
{
    giohang.find({ st: 0 }).then(function (data)
    {
        res.render('admin/cart/danh-sach-cho-giao', { data: data, layout: 'layout-admin' });
    });

});

router.get('/danh-sach-da-giao', isLoggedIn, function (req, res, next)
{
    giohang.find({ st: 1 }).then(function (data)
    {
        res.render('admin/cart/danh-sach-da-giao', { data: data, layout: 'layout-admin' });
    });

});

router.get('/:id/xem-cart', isLoggedIn, function (req, res, next)
{
    var id = req.params.id;
    giohang.findById(id).then(function (dl)
    {
        res.render('admin/cart/view', { pro: dl, layout: 'layout-admin' });
    });
});

router.get('/:id/thanh-toan-cart', isLoggedIn, function (req, res, next)
{
    var id = req.params.id;
    giohang.findById(id, function (err, data)
    {
        data.st = 1;
        data.save();
        req.flash('succsess_msg', 'Đã Thanh Toán');
        res.redirect('/admin/cart/' + id + '/xem-cart');
    });
});


router.get('/:id/xoa-cart', isLoggedIn, function (req, res, next)
{
    var id = req.params.id;
    giohang.findOneAndRemove({ _id: id }, function (err, offer)
    {
        req.flash('succsess_msg', 'Đã Xoá Thành Công');
        res.redirect('/admin/cart/danh-sach');
    });
});

module.exports = router;

// Hàm được sử dụng để kiểm tra đã login hay chưa
function isLoggedIn(req, res, next)
{
    if (req.isAuthenticated() && req.user.roles === 'ADMIN')
    {
        return next();
    } else
        res.redirect('/admin/login');
};