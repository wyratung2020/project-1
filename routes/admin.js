var express = require('express');
var router = express.Router();
var passport = require('passport');
const dayjs = require('dayjs');
const isoWeek = require('dayjs/plugin/isoWeek');
dayjs.extend(isoWeek)

const Product = require('../models/product');
const User = require('../models/user');
const Giohang = require('../models/giohang');
const Cate = require('../models/cate');


router.get('/', isLoggedIn, async function (req, res, next)
{
    let productInfo = await Product.aggregate().facet(
        {
            totalValue: [{ $group: { _id: null, value: { $sum: { $multiply: ['$price', '$sl'] } } } }],
            totalProductType: [{ $group: { _id: null, value: { $sum: 1 } } }],
            totalProduct: [{ $group: { _id: null, value: { $sum: "$sl" } } }]
        }
    )

    let giohangInfo = await Giohang.aggregate([{ $match: { 'st': 1 } }]).facet(
        {
            totalOrderSuccess: [{ $group: { _id: null, value: { $sum: 1 } } }],
            totalProductSold: [{ $group: { _id: null, value: { $sum: '$tongSoLuong' } } }],
            totalIncome: [{ $group: { _id: null, value: { $sum: '$Tien' } } }]
        }
    )

    let giohangInfoMonth = await Giohang.aggregate([{
        $match: {
            'ngaydat': {
                $lte: new Date(),
                $gte: new Date('2021-1-1')
            },
            'st': 1
        }
    }
    ]
    ).facet(
        {
            totalOrderSuccessMonth: [{ $group: { _id: null, value: { $sum: 1 } } }],
            totalProductSoldMonth: [{ $group: { _id: null, value: { $sum: '$tongSoLuong' } } }],
            totalIncomeMonth: [{ $group: { _id: null, value: { $sum: '$Tien' } } }]
        }
    )

    let userInfoMonth = await User.aggregate(
        [{
            $match: {
                'joindate': {
                    $lte: new Date(),
                    $gte: new Date('2021-1-1')
                },
            }
        }
        ]
    ).facet(
        {
            totalUserMonth: [{ $group: { _id: null, value: { $sum: 1 } } }]
        }
    )

    let totalCate = await Cate.countDocuments();
    let totalUser = await User.countDocuments();
    let totalOrder = await Giohang.countDocuments();
    let totalOrderWaiting = totalOrder - giohangInfo[0].totalOrderSuccess[0].value;

    res.render('admin/main/index',
        {
            layout: 'layout-admin',
            productInfo: {
                totalProductType: productInfo[0].totalProductType[0].value,
                totalProduct: productInfo[0].totalProduct[0].value,
                totalValue: productInfo[0].totalValue[0].value,
            },

            giohangInfo: {
                totalOrder: totalOrder,
                totalOrderSuccess: giohangInfo[0].totalOrderSuccess[0].value,
                totalOrderWaiting: totalOrderWaiting,
                totalOrderCancel: 0,
                totalProductSold: giohangInfo[0].totalProductSold[0].value,
                totalIncome: giohangInfo[0].totalIncome[0].value
            },

            giohangInfoMonth: {
                totalOrderSuccessMonth: giohangInfoMonth[0].totalOrderSuccessMonth[0].value,
                totalProductSoldMonth: giohangInfoMonth[0].totalProductSoldMonth[0].value,
                totalIncomeMonth: giohangInfoMonth[0].totalIncomeMonth[0].value
            },

            cateInfo: {
                totalCate: totalCate,
            },

            dateInfo: {
                firstDayOfMonth: dayjs().date(1).format('DD/MM/YYYY'),
                now: dayjs().format('DD/MM/YYYY')
            },

            userInfoMonth: {
                totalUserMonth: userInfoMonth[0].totalUserMonth[0].value
            },
            totalUser: totalUser,

        });
});

router.get('/logout', isLoggedIn, function (req, res, next)
{
    req.logout();
    res.redirect('/admin/login');
});



router.get('/login', notisLoggedIn, function (req, res, next)
{
    var messages = req.flash('error');
    res.render('admin/login/login_ad', {
        messages: messages, hasErrors: messages.length > 0,
        layout: false
    });
});

router.post('/login', passport.authenticate('local.login_ad', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true
}));


module.exports = router;

// Hàm được sử dụng để kiểm tra đã login hay chưa
function isLoggedIn(req, res, next)
{
    if (req.isAuthenticated() && req.user.roles === 'ADMIN')
    {
        return next();
    } else
        res.redirect('/');
};

function notisLoggedIn(req, res, next)
{
    if (!req.isAuthenticated())
    {
        return next();
    } else
    {
        if (req.isAuthenticated() && req.user.roles !== 'ADMIN')
        {
            return next();
        } else
        {
            res.redirect('/admin');
        }
    }
};


