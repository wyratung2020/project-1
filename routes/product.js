var express = require('express');
var router = express.Router();
var multer = require('multer');
const perPage = 20;

//cấu hình đường dẫn file upload và tên file upload 
var storage = multer.diskStorage({
    destination: function (req, file, cb)
    {
        cb(null, './public/upload'); //đg dẫn file
    },
    filename: function (req, file, cb)
    {
        cb(null, Date.now() + '_' + file.originalname); //tên file
    }
});
var upload = multer({ storage: storage });

var Product = require('../models/product.js');
var Cate = require('../models/cate.js');

/* GET home page. */
router.get('/', isLoggedIn, function (req, res)
{
    res.redirect('/admin/product/danh-sach', { layout: 'layout-admin' });
});

router.get('/danh-sach', isLoggedIn, function (req, res)
{
    res.redirect('/admin/product/danh-sach/trang-1');
});

router.get('/danh-sach/trang-:page', (req, res) => 
{
    Product.countDocuments((err, count) =>
    {
        let curPage = req.params.page || 1;
        let maxPage = Math.ceil(count / perPage);

        if (count === 0)
        {
            return res.render('admin/product/danh-sach', { layout: 'layout-admin', notFound: true });
        }
        if (curPage > maxPage)
        {
            res.redirect(`/admin/product/danh-sach/trang-${maxPage}`);
            return;
        }
        else if (curPage < 1)
        {
            res.redirect(`/admin/product/danh-sach/trang-1`);
            return;
        }

        let listPage = getListPage(curPage, maxPage);

        Product
            .find()
            .skip((perPage * curPage) - perPage)
            .limit(perPage)
            .exec((err, products) =>
            {
                res.render('admin/product/danh-sach', { layout: 'layout-admin', product: products, curPage: curPage, page: listPage, maxPage: maxPage, isSPPage: true });
            });
    });
})

//thêm sản phẩm
router.get('/them-product', isLoggedIn, function (req, res)
{
    Cate.find().then(function (cate)
    {
        res.render('admin/product/them', { errors: null, cate: cate, layout: 'layout-admin' });
    });
});
router.post('/them-product', isLoggedIn, upload.single('hinh'), function (req, res)
{
    req.checkBody('name', 'Tên không được trống').notEmpty();
    req.checkBody('gia', 'giá phải là số').isInt();
    req.checkBody('des', 'Chi tiết không được trống').notEmpty();
    var errors = req.validationErrors();
    if (errors)
    {
        var file = './public/upload/' + req.file.filename;
        var fs = require('fs');
        fs.unlink(file, function (e)
        {
            if (e) throw e;
        });
    } else
    {
        var pro = new Product({
            imagePath: req.file.filename,
            title: req.body.name,
            description: req.body.des,
            price: req.body.gia,
            cateId: req.body.cate,
            sl: req.body.sl,
        });
        pro.save().then(function ()
        {
            req.flash('succsess_msg', 'Đã Thêm Thành Công');
            res.redirect('/admin/product/them-product',);
        });
    }
});

//Sửa sản phẩm
router.get('/:id/sua-product', function (req, res)
{
    Product.findById(req.params.id).then(function (data)
    {
        Cate.find().then(function (cate)
        {
            console.log(data)
            res.render('admin/product/sua', { errors: null, product: data, cate: cate, layout: 'layout-admin' });
        });
    });
});

router.post('/:id/sua-product', upload.single('hinh'), function (req, res)
{
    req.checkBody('name', 'Tên không được trống').notEmpty();
    req.checkBody('gia', 'giá phải là số').isInt();
    req.checkBody('des', 'Chi tiết không được trống').notEmpty();

    var errors = req.validationErrors();
    if (errors)
    {
        var file = './public/upload/' + req.file.filename;
        var fs = require('fs');
        fs.unlink(file, function (e)
        {
            if (e) throw e;
        });
        Product.findById(req.params.id).then(function (data)
        {
            res.render('admin/product/sua', { errors: errors, product: data });
        });
    } else
    {
        Product.findOne({ _id: req.params.id }, function (err, data)
        {
            /*var file = './public/upload/' + data.imagePath;
            var fs = require('fs');
            fs.unlink(file, function (e)
            {
                if (e) throw e;
            });*/
            data.title = req.body.name,
                //data.imagePath = req.file.filename || data.imagePath,
                data.description = req.body.des,
                data.price = req.body.gia,
                data.cateId = req.body.cate,
                data.sl = req.body.sl

            data.save();
            req.flash('succsess_msg', 'Đã Sửa Thành Công');
            res.redirect('/admin/product/' + req.params.id + '/sua-product');
        });
    }
});

//xóa sản phẩm
router.get('/:id/xoa-product', isLoggedIn, function (req, res)
{
    Product.findById(req.params.id, function (err, data)
    {
        /**var file = './public' + data.imagePath;
        var fs = require('fs');
        fs.unlink(file, function (e)
        {
            if (e) throw e;
        });*/
        data.remove(function ()
        {
            req.flash('succsess_msg', 'Đã Xoá Thành Công');
            res.redirect('/admin/product/danh-sach');
        })
    });

});

router.post('/search', function (req, res)
{
    var find = req.body.find;
    res.redirect(`/admin/product/search=${find}/trang-1`);
});

router.get('/search=:input', (req, res) => 
{
    res.redirect(`/admin/product/search=${req.params.input}/trang-1`);
})

router.get('/search=:input/trang-:page', (req, res) =>
{
    let input = req.params.input;

    Product.findById(input, (err, result) =>
    {
        if (result == null)
        {
            Product.countDocuments({ title: { $regex: input, $options: 'i' } }, (err, titleCount) =>
            {
                if (titleCount === 0)
                    return res.render('admin/product/danh-sach', { layout: 'layout-admin', notFound: true });

                let curPage = req.params.page || 1;
                let maxPage = Math.ceil(titleCount / perPage);

                if (curPage > maxPage)
                {
                    return res.redirect(`/admin/product/search=${input}/trang-${maxPage}`);
                }
                else if (curPage < 1)
                {
                    return res.redirect(`/admin/product/search=${input}/trang-1`);
                }

                let listPage = getListPage(curPage, maxPage);

                Product
                    .find({ title: { $regex: input, $options: 'i' } })
                    .skip((perPage * curPage) - perPage)
                    .limit(perPage)
                    .exec((err, products) =>
                    {
                        res.render('admin/product/danh-sach', { layout: 'layout-admin', product: products, curPage: curPage, page: listPage, maxPage: maxPage, isSearchPage: true, url: { name: input } });
                    });
            });
        }
        else
        {
            let products = [result]
            res.render('admin/product/danh-sach', { layout: 'layout-admin', product: products });
        }
    })
})

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