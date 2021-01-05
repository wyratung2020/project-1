var express = require('express');
var router = express.Router();

var Giohang = require('../models/giohang');
var Cart = require('../models/cart');
var Product = require('../models/product');
var Cate = require('../models/cate');
const { route } = require('./product');
const perPage = 9;


/* GET home page. */
router.get('/', function (req, res, next)
{
    // var login  = req.session.user ? true : false
    Product.find().limit(6).then(function (product)
    {
        res.render('shop/index', { products: product });
    });

});

// tìm sản phẩm index
router.post('/', function (req, res)
{
    var find = req.body.find;
    Cate.find().then(function (cate)
    {
        Product.find({ title: { $regex: find } }, function (err, result)
        {
            console.log(result)
            res.render('shop/san-pham', { product: result, cate: cate });
        });
    })
});

//category
router.get('/cate/:name.:id', function (req, res)
{
    let name = req.params.name;
    let id = req.params.id;
    res.redirect(`/cate/${name}.${id}/trang-1`);
});

router.get('/cate/:name.:id/trang-:page', function (req, res)
{
    let name = req.params.name;
    let id = req.params.id;

    Product.countDocuments({ cateId: req.params.id }, (err, count) =>
    {
        let curPage = req.params.page || 1;
        let maxPage = Math.ceil(count / perPage);

        if (curPage > maxPage)
        {
            res.redirect(`/cate/${name}.${id}/trang-${maxPage}`);
            return;
        }
        else if (curPage < 1)
        {
            res.redirect(`/cate/${name}.${id}/trang-1`);
            return;
        }

        let listPage = getListPage(curPage, maxPage);

        Product
            .find({ cateId: req.params.id })
            .skip((perPage * curPage) - perPage)
            .limit(perPage)
            .exec((err, products) =>
            {
                Cate.find().then((cate) =>
                {
                    res.render('shop/san-pham', { product: products, cate: cate, page: listPage, maxPage: maxPage, isCatePage: true, url: { name: name, id: id } });
                })
            });
    });
});

// tìm sản phẩm category
router.post('/cate/:name.:id', function (req, res)
{
    var find = req.body.find;
    Cate.find().then(function (cate)
    {
        Product.find({ title: { $regex: find } }, function (err, result)
        {
            res.render('shop/san-pham', { product: result, cate: cate });

        });
    });
});

//trang category
router.get('/san-pham', function (req, res)
{
    res.redirect('/san-pham/trang-1');
});

router.get('/san-pham/trang-:page', (req, res) => 
{
    Product.countDocuments((err, count) =>
    {
        let curPage = req.params.page || 1;
        let maxPage = Math.ceil(count / perPage);

        if (curPage > maxPage)
        {
            res.redirect(`/san-pham/trang-${maxPage}`);
            return;
        }
        else if (curPage < 1)
        {
            res.redirect(`/san-pham/trang-1`);
            return;
        }

        let listPage = getListPage(curPage, maxPage);

        Product
            .find()
            .skip((perPage * curPage) - perPage)
            .limit(perPage)
            .exec((err, products) =>
            {
                Cate.find().then((cate) =>
                {
                    res.render('shop/san-pham', { product: products, cate: cate, page: listPage, maxPage: maxPage, isSPPage: true });
                })
            });
    });

})

// tìm sản phẩm category
router.post('/san-pham', function (req, res)
{
    var find = req.body.find;
    Cate.find().then(function (cate)
    {
        Product.find({ title: { $regex: find } }, function (err, result)
        {
            res.render('shop/san-pham', { product: result, cate: cate });
        });
    });
});

//trang chi tiết sp
router.get('/chi-tiet/:id', function (req, res)
{
    Product.findById(req.params.id).then(function (data)
    {
        console.log(data);
        res.render('shop/chi-tiet', { products: data });
    });
});

// tìm sản phẩm chi tiết
router.post('/chi-tiet/:id', function (req, res)
{
    var find = req.body.find;
    Cate.find().then(function (cate)
    {
        Product.find({ title: { $regex: find } }, function (err, result)
        {
            res.render('shop/san-pham', { product: result, cate: cate });
        });
    });
});

//tiến hành thanh toán
router.post('/thanh-toan', function (req, res)
{
    var giohang = new Cart(req.session.cart);
    var data = giohang.convertArray();
    var Tong = giohang.Tien;

    var cart = new Giohang({
        firstname: req.body.ho,
        lastname: req.body.ten,
        email: req.body.email,
        phone: req.body.number,
        diachi: req.body.add,
        thanhpho: req.body.city,
        cart: data,
        st: 0,
        Tien: Tong,
        nguoidat: req.session.passport.user
    });

    for (const [id, value] of Object.entries(giohang.items))
    {
        Product.findById(id, async (err, result) =>
        {
            result.sl -= value.sl;
            await result.save();
        });
    }

    cart.save().then(function ()
    {
        req.session.cart = { items: {} };
        res.render('shop/done', { products: data, Tong: Tong });
    });

});

router.get('/thanh-toan', function (req, res, next)
{
    if (!req.session.cart)
    {
        return res.render('shop/gio-hang', { products: null });
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/thanh-toan', { products: cart.convertArray(), Tien: cart.Tien });

});

/*// tìm sản phẩm thanh toán
router.post('/thanh-toan', function (req, res)
{
    var find = req.body.find;
    Cate.find().then(function (cate)
    {
        Product.find({ title: { $regex: find } }, function (err, result)
        {
            res.render('shop/san-pham', { product: result, cate: cate });
        });
    });
});*/

//thêm vào giỏ hàng
router.get('/them-vao-gio-hang/:id', function (req, res, next)
{
    var productId = req.params.id;
    var cart = new Cart((req.session.cart) ? req.session.cart : {});

    Product.findById(productId, function (err, product)
    {
        if (err)
        {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/gio-hang');
    });
});

router.get('/gio-hang', function (req, res, next)
{
    if (!req.session.cart)
    {
        return res.render('shop/gio-hang', { products: null });
    }
    var cart = new Cart(req.session.cart);
    console.log(cart.convertArray())
    res.render('shop/gio-hang', { products: cart.convertArray(), Tien: cart.Tien });

});

// tìm sản phẩm giỏ hàng
router.post('/gio-hang', function (req, res)
{
    var find = req.body.find;
    Cate.find().then(function (cate)
    {
        Product.find({ title: { $regex: find } }, function (err, result)
        {
            res.render('shop/san-pham', { product: result, cate: cate });
        });
    });
});

//del 1 product
router.get('/remove/:id', function (req, res)
{
    var productId = req.params.id;
    var giohang = new Cart((req.session.cart) ? req.session.cart : {});

    giohang.delCart(productId);
    req.session.cart = giohang;
    res.redirect('/gio-hang');
});

//del product
router.get('/delcart/:id', function (req, res)
{
    var productId = req.params.id;
    var giohang = new Cart((req.session.cart) ? req.session.cart : {});

    giohang.remove(productId);
    req.session.cart = giohang;
    res.redirect('/gio-hang');
});

//update sp
router.post('/update/:id', function (req, res)
{
    var productId = req.params.id;
    var sl = req.body.sl;
    var giohang = new Cart((req.session.cart) ? req.session.cart : {});

    giohang.updateCart(productId, sl);
    req.session.cart = giohang;
    var data = giohang.convertArray();
    res.render('shop/gio-hang', { products: data, Tien: giohang.Tien });
});


module.exports = router;

function isLoggedIn(req, res, next)
{
    if (req.isAuthenticated())
    {
        return next();
    }
    res.redirect('/');
}

router.get('/nike', function (req, res, next)
{
    Cate.findOne({ tenkhongdau: 'nike' }).then((cate) => 
    {
        console.log(cate);
        Product.find({ cateId: cate._id }).then((product) =>
        {
            res.render('shop/nike', { product: product });
        })
    });
})

router.get('/vans', function (req, res, next)
{
    Cate.findOne({ tenkhongdau: 'vans' }).then((cate) => 
    {
        console.log(cate);
        Product.find({ cateId: cate._id }).then((product) =>
        {
            res.render('shop/vans', { product: product });
        })
    });
})

router.get('/converse', function (req, res, next)
{
    Cate.findOne({ tenkhongdau: 'converse' }).then((cate) => 
    {
        console.log(cate);
        Product.find({ cateId: cate._id }).then((product) =>
        {
            res.render('shop/converse', { product: product });
        })
    });
})

router.get('/adidas', function (req, res, next)
{
    Cate.findOne({ tenkhongdau: 'adidas' }).then((cate) => 
    {
        console.log(cate);
        Product.find({ cateId: cate._id }).then((product) =>
        {
            res.render('shop/adidas', { product: product });
        })
    });
})

function getListPage(curPage, maxPage)
{
    let listPage = [];
    if (maxPage <= 5)
    {
        for (let i = 1; i <= maxPage; i++)
            listPage.push(i);
    }
    else 
    {
        if (curPage <= 3)
        {
            listPage = [1, 2, 3, 4, 5];
        }
        else if (curPage > Number(maxPage) - 3)
        {
            listPage = [Number(maxPage) - 4, Number(maxPage) - 3, Number(maxPage) - 2, Number(maxPage) - 1, Number(maxPage)];
        }
        else 
        {
            listPage = [Number(curPage) - 2, Number(curPage) - 1, Number(curPage), Number(curPage) + 1, Number(curPage) + 2];
        }
    }

    return listPage;
}