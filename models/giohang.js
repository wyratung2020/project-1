var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Cart = new Schema({
    firstname: String,
    lastname: String,
    phone: Number,
    email: String,
    diachi: String,
    thanhpho: String,
    cart: Object,
    st: Number,
    danhan: Number,
    Tien: Number,
    nguoidat: { type: Schema.Types.ObjectId, ref: 'User' },
    ngaydat: Date,
    tongSoLuong: Number
});
module.exports = mongoose.model('Giohang', Cart);