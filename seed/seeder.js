var Product = require('../models/product');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, function(err, db) {
    if (err) {
        console.log('MongoDB connection fail');
        throw err;
    } else {
        database = db;
        console.log('MongoDB connection successful');
    }
});
const products = [
    new Product({
        imagePath: "/img/product/p1.jpg",
        title: "Giày Addidas cho người chơi thể thao",
        description: "Thiết kế năng động trẻ trung",
        price: 150,
        sl: 10,
    }),
    new Product({
        imagePath: "/img/product/p2.jpg",
        title: "Giày Sneaker MUST Korea",
        description: "Chất liệu làm bằng da PU mềm mại tự nhiên, bền chắc, tạo sự thoải mái trong mỗi bước chân.",
        price: 210,
        sl: 10,
    }),
    new Product({
        imagePath: "/img/product/p3.jpg",
        title: "Giày Lười Phong Cách Hàn Quốc",
        description: "Giá cả cạnh tranh với giá các shop trên toàn quốc, chất liệu da vải bền đẹp chắc chắn.",
        price: 350,
        sl: 10,
    }),
    new Product({
        imagePath: "/img/product/p5.jpg",
        title: "Giày thể thao",
        description: "Giá cả cạnh tranh với giá các shop trên toàn quốc.",
        price: 250,
        sl: 10,
    }),
    new Product({
        imagePath: "/img/product/p6.jpg",
        title: "Giày Addidas cho người chơi thể thao",
        description: "Thiết kế năng động trẻ trung",
        price: 99,
        sl: 10,
    }),
    new Product({
        imagePath: "/img/product/p8.jpg",
        title: "Giày Sneaker MUST Korea",
        description: "Chất liệu làm bằng da PU mềm mại tự nhiên, bền chắc, tạo sự thoải mái trong mỗi bước chân.",
        sl: 10,
        price: 215
    }),
    new Product({
        imagePath: "/img/product/p4.jpg",
        title: "Giày Lười Phong Cách Hàn Quốc",
        description: "Giá cả cạnh tranh với giá các shop trên toàn quốc, chất liệu da vải bền đẹp chắc chắn.",
        price: 255,
        sl: 10,
    }),
    new Product({
        imagePath: "/img/product/p7.jpg",
        title: "Giày thể thao",
        description: "Giá cả cạnh tranh với giá các shop trên toàn quốc.",
        price: 250,
        sl: 10,
    })

];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });

}

function exit() {
    mongoose.disconnect();
}