var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
const giohang = require('../models/giohang');

var csrfProtec = csrf();
router.use(csrfProtec);

// =====================================
// Thông tin user đăng ký =====================
// =====================================
router.get('/profile', isLoggedIn, function (req, res)
{
  res.render('user/profile');
});

router.get('/don-hang/cho-giao', isLoggedIn, (req, res) =>
{
  giohang.find({ st: 0, nguoidat: res.locals.user._id }).then((data) =>
  {
    res.render('user/don-hang/cho-giao', { data: data });
  });
});

router.get('/don-hang/da-nhan', isLoggedIn, (req, res) =>
{
  giohang.find({ st: 1, nguoidat: res.locals.user._id }).then((data) =>
  {
    res.render('user/don-hang/da-nhan', { data: data });
  });
});

router.get('/don-hang/chi-tiet/:id', isLoggedIn, (req, res) =>
{
  var id = req.params.id;
  giohang.findById(id).then((result) =>
  {
    res.render('user/don-hang/chi-tiet', { pro: result });
  })
})

// =====================================
// Đăng xuất ==============================
// =====================================
router.get('/logout', isLoggedIn, function (req, res, next)
{
  req.logout();
  req.session.user = null;
  req.flash('succsess_msg', 'Bạn đã đăng xuất');
  req.session.destroy();  //xóa
  res.redirect('/');


});

router.use('/', notisLoggedIn, function (req, res, next)
{
  next();
});


// =====================================
// Đăng ký ==============================
// =====================================
// hiển thị form đăng ký
router.get('/registration', function (req, res, next)
{
  var messages = req.flash('error');
  res.render('user/registration', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/registration', passport.authenticate('local.registration', {
  successRedirect: '/user/registration',
  failureRedirect: '/user/registration',
  failureFlash: true
}));


// =====================================
// Đăng nhập ===============================
// =====================================
// hiển thị form đăng nhập
router.get('/login', function (req, res, next)
{
  var messages = req.flash('error');
  res.render('user/login', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});
router.post('/login', passport.authenticate('local.login', {
  successRedirect: '/admin',
  failureRedirect: '/user/login',
  failureFlash: true
}));


module.exports = router;

// Hàm được sử dụng để kiểm tra đã login hay chưa
function isLoggedIn(req, res, next)
{
  if (req.isAuthenticated())
  {
    return next();
  }
  res.redirect('/');
}

function notisLoggedIn(req, res, next)
{
  if (!req.isAuthenticated())
  {
    return next();
  }
  res.redirect('/');
}