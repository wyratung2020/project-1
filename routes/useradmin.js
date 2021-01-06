var express = require('express');
var router = express.Router();

var User = require('../models/user.js');
const perPage = 20;


router.get('/', isLoggedIn, function (req, res, next)
{
  res.redirect('/admin/user/danh-sach', { layout: 'layout-admin' });
});

router.get('/danh-sach', isLoggedIn, function (req, res)
{
  res.redirect('/admin/user/danh-sach/trang-1');
});

router.get('/danh-sach/trang-:page', (req, res) => 
{
  User.countDocuments((err, count) =>
  {
    let curPage = req.params.page || 1;
    let maxPage = Math.ceil(count / perPage);

    if (count === 0)
    {
      return res.render('admin/user/danh-sach', { layout: 'layout-admin', notFound: true });
    }
    if (curPage > maxPage)
    {
      res.redirect(`/admin/user/danh-sach/trang-${maxPage}`);
      return;
    }
    else if (curPage < 1)
    {
      res.redirect(`/admin/user/danh-sach/trang-1`);
      return;
    }

    let listPage = getListPage(curPage, maxPage);

    User
      .find()
      .skip((perPage * curPage) - perPage)
      .limit(perPage)
      .exec((err, users) =>
      {
        res.render('admin/user/danh-sach', { layout: 'layout-admin', us: users, curPage: curPage, page: listPage, maxPage: maxPage, isSPPage: true });
      });
  });
})

router.get('/:id/sua-user', isLoggedIn, function (req, res, next)
{
  var id = req.params.id;
  User.findById(id).then(function (data)
  {
    res.render('admin/user/sua-user', { dataa: data, layout: 'layout-admin' });
  });
});

router.post('/:id/sua-user', isLoggedIn, function (req, res, next)
{
  User.findById(req.params.id, function (err, data)
  {
    data.roles = req.body.roles;
    data.save();
    req.flash('succsess_msg', 'Đã Sửa Thành Công');
    res.redirect('/admin/user/' + req.params.id + '/sua-user');
  });
});

router.get('/:id/xoa-user', isLoggedIn, function (req, res, next)
{
  var id = req.params.id;
  User.findOneAndRemove({ _id: id }, function (err, offer)
  {
    req.flash('succsess_msg', 'Đã Xoá Thành Công');
    res.redirect('/admin/user/danh-sach');
  });
});

router.post('/search', function (req, res)
{
  var find = req.body.find;
  res.redirect(`/admin/user/search=${find}/trang-1`);
});

router.get('/search=:input', (req, res) => 
{
  res.redirect(`/admin/user/search=${req.params.input}/trang-1`);
})

router.get('/search=:input/trang-:page', (req, res) =>
{
  let input = req.params.input;

  User.findById(input, (err, result) =>
  {
    if (result == null)
    {
      User.countDocuments({ email: input }, (err, titleCount) =>
      {
        if (titleCount === 0)
          return res.render('admin/user/danh-sach', { layout: 'layout-admin', notFound: true });

        let curPage = req.params.page || 1;
        let maxPage = Math.ceil(titleCount / perPage);

        if (curPage > maxPage)
        {
          return res.redirect(`/admin/user/search=${input}/trang-${maxPage}`);
        }
        else if (curPage < 1)
        {
          return res.redirect(`/admin/user/search=${input}/trang-1`);
        }

        let listPage = getListPage(curPage, maxPage);

        User
          .find({ email: input })
          .skip((perPage * curPage) - perPage)
          .limit(perPage)
          .exec((err, users) =>
          {

            res.render('admin/user/danh-sach', { layout: 'layout-admin', us: users, curPage: curPage, page: listPage, maxPage: maxPage, isSearchPage: true, url: { name: input } });
          });
      });
    }
    else
    {
      let users = [result]
      res.render('admin/user/danh-sach', { layout: 'layout-admin', us: users });
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