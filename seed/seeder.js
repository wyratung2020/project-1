let Product = require('../models/product');
let Cate = require('../models/cate');
const mongoose = require('mongoose');

function bodauTV(str)
{
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/ /g, "-");
    str = str.replace(/\./g, "-");
    str = str.replace("/", "-");
    return str;
}

mongoose.connect('mongodb://localhost:27017/shopping', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, function (err, db)
{
    if (err)
    {
        console.log('MongoDB connection fail');
        throw err;
    } else
    {
        database = db;
        console.log('MongoDB connection successful');
    }
});

const catesList = [
    "Adidas",
    "Nike",
    "Vans",
    "Biti's",
    "Giày thể thao/ Sneakers",
    "Giày lười",
    "Giày tây",
    "Converse",
    "Puma",
    "Thượng Đình",
    "Lining",
    "No brand"
];

const productNameList = [
    "Giày Sneaker Nam Đẹp Màu Trắng Êm Chân Thoáng Khí S378",
    "Giày Thể Thao Nam Có Đệm Khí Trợ Lực Êm Chân, Thoáng Khí - GN92",
    "Giày nam sneaker thể thao - Giày tăng chiều cao mẫu mới hot trend hàn quốc QA364",
    "Giày sneaker nam phong cách thể thao 212",
    "Giày Sneaker Thể Thao Nam Thời Trang Năng Động Mẫu Mới GN97",
    "Giày thể thao sneaker nam phong cách trẻ trung 2020 - 015 trắng ",
    "Giày Sneaker thể thao nam - Nâng chiều cao",
    "Giày Thể Thao Nam Có Đệm Khí Trợ Lực Êm Chân, Thoáng Khí Cao Cấp",
    "Giày Thể Thao Nam  Full Đen Hot 2019 GN44",
    "Giày Snearker Thể Thao Nam Vải Dệt Thoáng Khí GTTN-64 [Màu Trắng]",
    "Giày bốt cao cổ nam cao cấp mẫu mới hot trend hàn quốc QA362",
    "Giày sneaker thể thao nam cao cấp Phản Quang cực chất Mẫu Mới",
    "Giày sneakers nam thời trang Thiết kế Đế Cao Su Đúc, Chống Trơn Trượt đi êm chân",
    "Giày sneaker nam cao cấp SP-295 (màu xám)",
    "Giày Sneaker Unisex Converse Chuck Taylor All Star 1970s Black/w 2018",
    "Giày Sneaker Unisex Converse Chuck Taylor All Star Classic Low - Black/White",
    "Giày Sneaker Unisex Converse Chuck Taylor All Star Classic Hi - Black/w",
    "Giày Sneaker Unisex Converse Chuck Taylor All Star Classic Low - White",
    "Giày Sneaker Unisex Converse Chuck Taylor All Star Classic All Hi - Black",
    "Giày Sneaker Unisex Converse Chuck Taylor All Star 1970s Hi 2018 162054C",
    "Giày Sneaker Unisex Converse Chuck Taylor All Star Classic Low - Navy",
    "Giày Sneaker Unisex Converse Chuck Taylor All Star 1970s Obsidian Navy - Hi",
    "Giày Converse Chuck Taylor All Star 1970s Rivals Hi Top 168623C",
    "Giày Converse Chuck Taylor All Star 1970S Signature Hi Top 167696C",
    "Giày Converse Chuck Taylor All Star 1970s Midnight Clover Low Top 168513V",
    "Giày Converse Chuck Taylor All Star SP OX 1U647V",
    "Giày Sneaker Unisex Converse Chuck Taylor All Star Classic Hi - Navy",
    "Giày Converse Chuck Taylor All Star Clean 'n Preme Low Top 167823C",
    "Giày Converse Chuck Taylor All Star 1970s Rivals Low Top 168628C",
    "Giày Sneaker Unisex Converse Chuck Taylor All Star 1970s Woven High - Black",
    "Giày Sneaker Unisex Converse Chuck Taylor All Star 1970s Sunflower Low Top 162063C",
    "Giày Converse Chuck Taylor All Star Renew Hi Top 168594V",
    "Giày Sneaker Unisex Converse Chuck Taylor All Star Classic All Low - Black",
    "Giày Sneaker Converse Chuck Taylor All Star 1970s Low Top 162062C",
    "Giày Converse Chuck Taylor All Star Seasonal Color Hi Top 166705V",
    "Giày Sneaker Kid Converse Chuck Taylor All Star Classic Hi - Black/White",
    "Giày Converse Chuck Taylor All Star Clean 'n Preme Low Top 167825C",
    "Giày Sneaker Unisex Converse Chuck Taylor All Star Logo Play - 166738C",
    "Giày Converse Chuck Taylor All Star 1970S Archival Flame Print 167813C",
    "Giày Converse Chuck 70 Twisted Classic Logo Play Hi",
    "Giày Converse Run Star Hike Twisted Classic Foundational 166800V",
    "Giày Converse Chuck Taylor All Star Seasonal Color Low Top 166710V",
    "Giày Converse Renew Chuck Taylor All Star Low Top 168603V",
    "Giày sneaker unisex Converse Chuck Taylor All Star Space Utility - 166070",
    "Giày Converse Chuck Taylor All Star 1970S Signature Low Top 167698C",
    "Giày Converse Chuck Taylor All Star Peace Low Top 167893V",
    "Giày Sneaker Unisex Converse Chuck Taylor Leather Hi - Black",
    "Giày sneaker unisex Converse Chuck Taylor All Star Space Utility - 166069",
    "Giày Converse Chuck Taylor All Star 1970s 'Renew Crater' 168615C",
    "Giày Converse Chuck Taylor All Star Twisted Classic Logo Play Low",
    "Giày Sneaker Convere Chuck Taylor All Star 1970s Hi Top 162053C",
    "Giày Sneaker Unisex Converse Chuck Taylor Leather Low - Black",
    "GIày Converse Chuck Taylor All Star Chuck Taylor Cheerful Hi Top 167070C",
    "Giày Converse Chuck Taylor All Star Mono Leather Low Top 136823C",
    "Giày Sneaker Unisex Converse Chuck Taylor All Star Classic Low - Red",
    "Giày Sneaker Nam Converse Jack Purcell Leather Low Top 164224C",
    "Giày Sneaker Unisex Old Skool Vans VN000D3HY28 - Black/White",
    "Giày Sneaker Unisex Authentic Vans VN000EE3BLK - Black",
    "Giày Slip On Unisex Vans VN000EYEBWW - Black/White",
    "Giày Sneaker Unisex Authentic Vans VN000EE3BKA - Black",
    "Giày Sneaker Unisex Vans Ola Skool 36 DX VN0A38G2PXC",
    "Giày Sneaker Unisex Old Skool Vans VN000D3HNVY - Navy",
    "Giày Vans Old Skool Style 36 Marshmallow VN0A3DZ3KE6",
    "Giày Vans Old Skool 36 DX Anaheim Factory - VN0A38G2MR4",
    "Giày Vans Sk8-Hi Flame Reissue VN0A2XSBPHN",
    "Giày Sneaker Unisex Vans Old Skool Black Checkerboard VN0A38G1P0S",
    "Giày Vans Logo Repeat Old Skool VN0A4U3BTEZ",
    "Giày Sneaker Unisex Sk8 Hi Vans VN000D5IW00 - True White",
    "Giày Vans Slip-On Tiger Patchwork VN0A4U381IO",
    "Giày Vans Sk8 Hi Mother Earth Style 238 VN0A3JFIWZ2",
    "Giày Sneaker Unisex Sk8 Hi Vans VN000D5IB8C - Black",
    "Giày Slip On Unisex Vans VN000EYEBLK - Black",
    "Giày Vans Old Skool Packing Tape VN0A4U3BWZ4",
    "Giày Sneaker Unisex Vans UA Bold NI Distort White VN0A3WLPWP3",
    "Giày Vans UA Era Ouroboros VN0A4U39WT8",
    "Giày Vans Old Skool Los Vans VN0A4U3BWN1",
    "Giày Sneakers Unisex Vans Authentic 44 Dx Classic - White",
    "Giày Vans DIY Sk8-Hi Tapered VN0A4U1624F",
    "Giày Vans UA Classic Slip-On Ouroboros VN0A4U38WT8 - 35",
    "Giày sneaker unisex Vans Slip-On Alien Ghosts - VN0A4BV3TB1",
    "Giày Slip On Unisex Vans VN000EYEBKA - Black",
    "Giày Vans Unisex Era VN000EWZBLK Black",
    "Giày Vans Slip On Disney Nightmare Before Christmas VN0A4BV3TA5",
    "Giày Sneaker Unisex Old Skool Vans VN000D3HW00 - White",
    "Giày Vans Slip-On Flame VN0A38F7PHN",
    "Giày Vans Unisex Old Skool Comfycush VN0A3WMAVNE",
    "Giày Vans Old Skool Tiger Floral VN0A38G119M",
    "Giày Slip On Unisex Vans VN000EYEW00 - True White",
    "Giày Vans Unisex Era VN000EWZW00 True White",
    "Giày Sneaker Unisex Authentic Vans VN000EE3W00 - White",
    "Giày Sneaker Unisex Vans UA Bold NI Distort Black VN0A3WLPVX6",
    "Giày Vans UA SK8-Low VN0A4UUK6BT",
    "Giày Vans DIY Authentic HC VN0A4UUCU7B",
    "Giày Unisex Vans Sk8 Hi Reissue VN0004OKJUL",
    "Giày Vans Old Skool Packing Tape VN0A4U3BWN4",
    "Giày Vans UA SK8-Hi Ouroboros VN0A4U3CWT8",
    "Giày Vans UA SK8-Low VN0A4UUK24K",
    "Giày Vans Checkerboard DIY Authentic HC VN0A4UUC1AA",
    "Giày Vans Old Skool Emboss VN0A4U3BX00",
    "Giày Vans Era Flame VN0A4BV4XEY",
    "Giày Slip On Unisex Vans VN000EYEBPJ - Black/Pewter Checkerboard",
    "Giày Vans DIY Authentic HC VN0A4UUC1AE",
    "Giày Unisex Vans Authentic 44 DX Anaheim Factory Checkerboard",
    "Giày Vans x MoMA Classic Slip-On VN0A4U381ID",
    "Giày Bitis Hunter X Festive Frosty White Season 3 2k20 DSWH03500TRG/ DSMH03500TRG",
    "Giày Biti's Hunter Core Black Line 2k20 DSMH02900TRG/DSWH02900TRG",
    "Giày Biti's Hunter Core Americano 2k20 DSWH03200DEN/DSMH03200DEN",
    "Giày Bitis Hunter X Festive Spice Pumpkin DSMH03500DEN/ DSWH03500DEN",
    "Giày Biti's Hunter X Americano 2k20 DSWH03400DEN/DSMH03400DEN",
    "Giày thể thao Bitis Hunter x Dentsu Redder DSMH03001TRG / DWH03001TRG",
    "Giày Biti’s Hunter X - Summer 2K19 ADVENTURE COLLECTION DSMH01100XDG",
    "Giày Nữ Biti's Hunter X 2k20 Multi Layer Desert Pink DSWH02800HOG",
    "Giày Bitis Hunter Low-Cut Frosty White DSWH04300TRG/ DSMH04300TRG",
    "Giày Bitis Hunter Street Mid-Top 2k20 DSWH03601TRG/DSMH03601TRG",
    "Giày Bitis Hunter Core Festive Washed-Pink Grey Seaso 3 DSWH03202XAL",
    "Giày Biti's Hunter Street Americano 2k20 DSWH03700DEN/DSMH03700DEN",
    "Giày Thể Thao Bitis Hunter X 2k19 Jet Navy DSMH02200XNH/DSWH02200XNH",
    "Giày Thể Thao Bitis Hunter X - Summer 2K19 DSWH01100CAM/DSMH01100CAM",
    "Giày Biti’s Hunter X - Summer 2K19 ADVENTURE COLLECTION DSMH01100XAM",
    "Giày Cao Cấp Nam Biti's Hunter X Retro Essential Pack DSUH00800TRG",
    "Giày Biti's Hunter Core Milky White 2k20 DSWH03201TRG/DSMH03201TRG",
    "Giày Biti's Hunter Core Season 3 Festive Spice Pumpkin DSMH03202DEN",
    "Giày Chạy Bộ Biti's Hunter Running Grey DSWH03900XAM/DSMH03900XAM",
    "Giày Bitis Hunter X Festive Frosty White Season 3 2k20 DSMH03500TRG",
    "Giày Biti's Hunter Street Latte 2k20 DSWH03700KEM/DSMH03700KEM (Kem)",
    "Giày Biti's Hunter BKL Black Line 2k20 DSMH02303TRG/ DSWH02303TRG",
    "Giày Thể Thao Nam Biti's Hunter X - Summer 2k19 BKL DSMH01000TRG",
    "Giày Biti's Hunter Core Charcoal DSWH03300DEN/DSMH03300DEN (Đen)",
    "Giày Bitis Hunter Low-Cut Slate Black DSWH04300DEN/ DSMH04300DEN",
    "Giày Biti's Hunter Street - Midnight Black Inverted DSMH01303DEN",
    "Giày thể thao Nam Biti's Hunter Core 2k20 DSMH03300XAM (Xám đậm)",
    "Giày Thể Thao Nike Nam Chạy Bộ CARRY OVER LUNAR APPARENT Brandoutlet 908987-001",
    "Giày Thể Thao Nike Nam Chạy Bộ Thời Trang Renew Rival AA7400-401",
    "Giày Thể Thao Nike Nam Chạy Bộ SP19 RENEW ARENA Brandoutletvn AJ5903-400",
    "Giày Thể Thao Nike Nam Thời Trang CARRY OVER DUALTONE Brandoutletvn 918227-002",
    "Giày Thể Thao Nike Nam Chạy Bộ SU19 RENEW ARENA SE Brandoutletvn BQ9259-100",
    "Giày Thể Thao Nike Nam Thời Trang SU19 VIALE PREMIUM Brandoutlettvn AO0628-004",
    "Giày thể thao thời trang Nike Nam NIKE VIALE SLP Brandoutletvn AV4075-001",
    "Giày Thể Thao Nike Nam Thời Trang CARRY OVER TANJUN Brandoutletvn 812654-010",
    "Giày Thể Thao Nike Nữ Chạy Bộ FA19 WMNS REVOLUTION 4 Brandoutletvn 908999-501",
    "Giày Thể Thao Nike Nữ Chạy Bộ SU19 W RENEW RIVAL Brandoutletvn AA7411-200",
    "Giày Thể Thao Nike Nam Chạy Bộ CARRY OVER FREE RN CMTR Brandoutletvn 880841-003",
    "Giày Thể Thao Nike Nam Thời Trang SP19 REACT ELEMENT 55 Brandoutletvn BQ6166-400",
    "Giày Thể Thao Thời Trang Nike Nữ WMNS NIKE SB CHECK SOLAR Brandoutlet 921464-612",
    "Giày thể thao thời trang Nike Nam NIKE VIALE PREMIUM Brandoutletvn AO0628-004",
    "Giày thể thao thời trang Nike Nam NIKE COURT ROYALE AC Brandoutletvn CD8337-002",
    "Giày Thể Thao Nike Nữ Thời Trang SP18 WMNS CK RACER Brandoutletvn 916792-402",
    "Giày Thể Thao Nike Nữ Chạy Bộ CARRY OVER WMNS LUNARSTELOS Brandoutlet 844736-001",
    "Giày Thể Thao Nike Nam Thời Trang SU19 AIR MAX 95 SE Brandoutletvn AJ2018-401",
    "Giày Thể Thao Nike Nam Thời Trang SP19 HUARACHE E.D.G.E. Brandoutlet AO1697-001",
    "Giày Thể Thao Nike Nam Chạy Bộ CARRY OVER FLEX 2018 RN Brandoutletvn AA7397-400",
    "Giày Thể Thao Nike Nam Thời Trang SU18 CK RACER Brandoutletvn 916780-010",
    "Giày Thể Thao Nike Thời Trang Nam ADU NIKE SB CHECK SOLAR Brandoutlet 843896-017",
    "Giày Thể Thao Nike Nam Tập Luyện SU19 METCON SPORT Brandoutletvn AQ7489-004",
    "Giày Thể Thao Nike Nam Chạy Bộ FA19 RENEW RIVAL 2 Brandoutletvn AT7909-003",
    "Giày Thể Thao Nike Nữ Chạy Bộ HO18 WMNS FLEX 2018 RN Brandoutletvn AA7408-008",
    "Giày Thể Thao Nike Nữ Chạy Bộ FA19 WMNS LEGEND REACT 2 Brandoutletvn AT1369-004",
    "Giày Thể Thao Nike Nữ Chạy Bộ FA19 WMNS RENEW RIVAL 2 AT7908-002",
    "Giày Thể Thao Nike Nữ Chạy Bộ CARRY OVER WMNS LUNAR Brandoutletvn 908998-001",
    "Giày Thể Thao Nike Nam Thời Trang FA18 HAKATA PREM Brandoutletvn AQ9335-002",
    "Giày Thể Thao Nike Nữ Chạy Bộ SU18 WMNS LUNARCONVERGE 2 Brandoutletvn 908997-010"
]

const descriptionsList = [
    "Mẫu giày thể thao mới nhất nhất năm 2020 Kiểu dáng giày cực ngầu, trẻ trung, mạnh mẽ, năng động, sang trọng và đẳng cấp Thích hợp mang đi chơi, đi chợ,đi đòi nợ, đi học, đi làm, đi picnic, đi dự",
    "Giày nam sneaker thể thao - Giày tăng chiều cao mẫu mới hot trend hàn quốc QA364 - Chiều cao đế: 5CM -Chất liệu đế: cao su -Chất liệu mặt giày: tổng hợp chất liệu cao cấp -Mầu sắc: trắng đỏ -Form:",
    "Giày sneaker nam phong cách thể thao 212 Size 39 phù hợp chiều dài Giày dép là 24.5 cm Size 40 phù hợp chiều dài Giày dép là 25.0 cm Size 41 phù hợp chiều dài Giày dép là 25.5 cm Size 42 phù hợp",
    "THÔNG TIN SẢN PHẨM  Tên sản phẩm: Giày thể thao nam mẫu mới GN97  Mã Sản phẩm: GN97  Màu sắc: Đen, trắng  Size: 39, 40, 41, 42, 43  Vật liệu trên: PU nhân tạo  Chất liệu đế: caosu  Phong cách: thể",
    "Chất liệu: DỆT Chất liệu đế: Cao su non đúc, tạo cảm giác thoải mái khi đi Size : 39-44 Mã sản phẩm: LIB015 Thông tin nổi bật : Thiết kế thời trang Chất liệu cao cấp Kiểu dáng phong cách Độ bền",
    " Kiểu dáng giày cực ngầu, trẻ trung, mạnh mẽ, năng động, sang trọng và đẳng cấp Thích hợp mang đi chơi, đi chợ,đi đòi nợ, đi học, đi làm, đi picnic, đi dự tiệc, chơi thể thao… đều được. Đế dày",
    "THÔNG TIN NỔI BẬT: Cam kết 100% giống hình. Đế cao su cao 3cm, kiểu dáng bằng có rãnh chống trơn trượt, rất dẻo, mềm và thoải mái. Được làm bằng vải mềm, mịn thoáng khí và cực kỳ dày dặn. Lớp lót",
    "Giày nam thể thao sneaker- Giày tăng chiều cao QA0364 -Chất liệu đế: cao su -Chất liệu mặt giày: tổng hợp chất liệu cao cấp -Mầu sắc: Phối màu tinh tế -Form: chuẩn ",
    "Giày thể thao nam Giày có thiết kế năng động, hiện đại, khỏe khoắn, hợp thời trang, dễ phối đồ. Đế giày làm từ chất liệu cao su đúc nguyên khối rất chắc chắn với độ đàn hồi cao. Thân giày là",
    "Sneaker nâng chiều cao - Giày thể thao nam - Giày nâng chiều cao thiết kế thời trang đậm chất nam tính dễ dàng phối hợp với các trang phục khác nhau. Kiểu dáng mạnh mẽ sang trọng giúp bạn toát nên",
    " TÍNH NĂNG – Chất liệu vải dệt 2 mặt cao cấp, thoáng khí – Đế cao su nguyên chất được sản xuất theo công nghệ Ý dẻo dai, giảm thiểu mòn đế – Keo dán nhiệt chắc chắn cẩn thận – Đường may tỉ mỉ, cẩn",
    " Giày thể thao nam, nữ trắng gót đen chất liệu tổng hợp bền chắcPhối màu trẻ trung, năng độngGiày độn đế 4p làm bằng chất liệu cao su tổng hợpSize: 36 đến 43Dễ đi, tôn dáng mà cực năng độngMang giày",
    " Giày nam, giày sneaker thể thao nam tăng chiều cao lót thông hơi cao cấp mẫu mới nhất SP-A344 Thiết kế trẻ trung, năng động Chất liệu cao cấp bền đẹp Kiểu dáng thời trang, dễ phối đồ Màu sắt tinh",
    "Giày bốt cao cổ nam cao cấp mẫu mới hot trend hàn quốc QA362 -Chất liệu đế: cao su -Chất liệu mặt giày: tổng hợp chất liệu cao cấp -Mầu sắc: Đen, Be -Form: chuẩn ",
    " Giày nam thể thao thoáng khí vải nhẹ casual quốc dân cao cấp GNC22. Được thiết kế theo phong cách Hàn Quốc với kiểu dáng năngđộng, tiện lợi nhưng không kém phần bắt mắt, là một trong những mẫu",
    "THÔNG TIN SẢN PHẨM Chất liệu mặt trong: Vải khử mùi Chất liệu mặt ngoài: Vải cao cấp thoáng khí Chất liệu đế: Cao su tự nhiên Size: 39, 40, 41, 42, 43, 44 ",
    "   I. THÔNG TIN SẢN PHẨM – Chất liệu: Vải – Chất liệu đế: Cao su nguyên chất – Màu sắc: Đen Xám – Đen Đỏ – Size: 39, 40, 41, 42, 43 – Form giày ôm chân, thiết kế trẻ trung, hiện đại II. TÍNH",
    "Giày sneaker thể thao nam thời trang buộc dây siêu nhẹ 266Size 39 phù hợp chiều dài Giày dép là 24.5 cmSize 40 phù hợp chiều dài Giày dép là 25.0 cmSize 41 phù hợp chiều dài Giày dép là 25.5 cmSize",
    "Sản Phẩm Được sản xuất bằng nhựa dẻo Eva chống trơn.Quai Dán Nhưng được dán bằng keo chuyên dụng Cao cấp, cực kỳ bền chắc.Đế dép cao xấp xỉ 3cmdép đi êm, đầm chân.Thương Hiệu Đến Từ Việt Nam.Chúng",
    " Chất liệu: DỆT Chất liệu đế: Cao su non đúc, tạo cảm giác thoải mái khi đi Size : 39-44 Thông tin nổi bật : Sản phẩm được đảm bảo chất lượng Giá tốt thị trường Thiết kế thời trang Chất liệu cao",
    "VÌ SAO PHẢI BẢO VỆ BÀN CHÂN???  Bàn chân vốn là nơi chịu toàn bộ áp lực của cơ thể mỗi ngày. Đặc biệt khi chơi thể thao bàn chân càng chịu nhiều tác động, dễ tổn thương, nguy hiểm nhất là thốn gót",
    "Mẫu Giày nam FASPO-007 là loại Sneaker buộc dây tạo sự năng động, khỏe khoắn, cá tính riêng biệt cho bạn - Đế giày được làm bằng cao su tổng hợp chống trơn, chịu mài mòn tốt, thoáng khí, nhanh khô,",
    "THÔNG TIN SẢN PHẨM - Size: 38, 39, 40, 41, 42, 43- Miếng lót giày tăng chiều cao cực êm chân- Công dụng: lót giày cao su có độ đàn hồi rất cao, giúp nâng đỡ gan bàn chân, đem lại cảm giác êm ái dù",
    "  Giày thể thao nam, giày sneaker nam lông vũ G026 •Chất liệu bên ngoài: da PU tổng hợp • Chất liệu bên trong: vải sợi khử mùi, thoáng khí. • Kích cỡ : 39-43  ",
    " - Chất liệu bề mặt: Da PU + Vải lưới- Chất liệu bên trong: Cotton- Chất liệu đế: Đế cao su non cao cấp- Lỗ sỏ giày: Vải canvas- Dây giày: Sợi canvas- Màu sắc: Trắng xám, Đen- Chiều cao: 3cm - Đế",
    "Điểm nổi bật: Mang trên mình tất cả những yếu tố tiện lợi của giày lười đem lại, hướng tới những aiyêu thích sự trẻ trung, năng động, với thiết kế chắc chắn, ôm gọn và không kém phần thoải mái khi",
    " Giày thể thao nam 2020 Kiểu dáng giày cực ngầu , trẻ trung, mạnh mẽ, năng động, sang trọng và đẳng cấpThích hợp mang đi chơi, đi chợ, đi đòi nợ, đi học, đi làm, đi picnic, đi dự tiệc, chơi thể thao…",
    " Đế cao su non đi rất êm Vải cao cấp thoáng khí không bị mùi hôi chân cao su có độ bám dính cao, chống trơn trượt Kiểu dáng phong cách - Thiết kế thời trang - Dễ phối đồ Kiểu dáng giày cực ngầu, trẻ",
    " GIÀY SNEAKER  NAM CAO CẤP SP-295 (màu xám) -Chất liệu đế: CAO SU -Chất liệu mặt giày: nhiều chất liệu cao cấp -Mầu sắc: xám -Form: chuẩn -SIZE: 39, 40, 41, 42, 43, 44                     ",
    "Mẫu Dép Thời ThượngĐế dép dày dặn, độn cao 3-3.5cmDép đi chơi,đi phố,đi trong nhà văn phòng đều phù hợp, làm dép đôi, dép nhóm du lịch cực chấtChất liệu cao cấp nhanh khô ráo nước, chống trơn cực",
    "Giày nam sneaker thể thao - Giày tăng chiều cao mẫu mới phong cách trẻ Hot trend hàn quốc SP364 -Chất liệu đế: cao su cao cấp - Chiều cao đế: 5Cm -Chất liệu mặt giày: tổng hợp chất liệu cao cấp -Mầu",
    "Giày nam thể thao sneaker, Giày tăng chiều cao mẫu mới nhất -Chất liệu đế: cao su - Chiều cao đế: 5cm -Chất liệu mặt giày: tổng hợp chất liệu cao cấp -Mầu sắc: phối màu tinh",
    "Chuỗi cửa hàng thời trang nam lớn nhất miền Bắc. Uy tín đã được đảm bảo qua hàng vạn đơn hàng trên khắp cả nước   THÔNG TIN SẢN PHẨM Giày thể thao nam, giày nam da lộn K99 ️ Chất liệu: Da lộn cao cấp",
    "- Chất liệu vải thoáng khí, đặc biệt phù hợp với việc vận động nhiều.- Mũi giày tròn.- Đế giày xẻ rãnh chống trơn trượt.- Kiểu dáng đa phong cách.- Đường may tinh tế sắc sảo. HƯỚNG DẪN SỬ DỤNG  ️",
    "Môt đôi giày luôn là sự lựa chọn tuyệt vời bởi sự phong phú trong việc phối đồ, phù hợp với nhiều phong cách khác nhau, đều rất thuận tiện cho vui chơi, đi học và đi làm, mang lại một vẻ đẹp đặc",
    "Giày thể thao nam SP-283 -Chất liệu đế: cao su -Chất liệu mặt giày: tổng hợp chất liệu cao cấp -Mầu sắc: Trắng Vàng Đen -Form: chuẩn Mẫu Mới Nhất Năm Giá Cực Mê Màu Được Ưa Chuộc Nhất Đơn",
    " Phái mạnh thường diện cho mình những bộ quần áo lịch lãm, đồng hồ đeo tay và không thể quên đôi giày phong cách. Nắm bắt được điều ấy, các hãng giày nam thể thaokhông chỉ tung ra các mẫu dành riêng",
    "Mẫu giày dép được chúng tôi cập nhật mẫu mới liên tục theo thị hiếu thời trang trong và ngoài nước sẽ giúp quý khách hàng tự tin hơn - đẹp hơn khi đi chơi - du lịch với bạn bè, người thân cũng như",
    " Giày Mọi Nam với chất liệu da bò bền đẹp kết hợp đế cao su êm nhẹ chống trơn trượt giúp bạn Nam luôn thoải mái, tự tin khi đi chơi, dạo phố, đi làm nơi công sở hay đi dự tiệc. Giày Mọi Nam được xử",
    "Giày Sneaker Thể Thao Nam Da Bò UDANY - GBD06 - Màu Trắng - Một đôi giày da thể thao nam là phụ kiện quan trọng giúp cho nam giới ngày nay trở nên năng động, cá tính hơn.Với mẫu Giày Sneaker Thể Thao",
    " Chất liệu da bò Thiết kế dạng xỏ tiện lợi, thoải mái  Đế xẻ rãnh cao 3.5 cm thêm nổi bật cho quý ông Họa tiết điểm nhấn độc đáo Dễ phối với nhiều loại trang phục khác nhau  1 phiên bản màu: Màu đen",
    "Là mẫu giày thể thao nam mới hiện nay Được Shop Mang Về, đang rất được ưa chuộng. - Thiết kế hiện đại hottrend của giới trẻ và toàn thế giới - Phối màu bắt mắt, tinh tế,",
    "Giày nam, giày sneaker thể thao nam cao cấp phong cách hoang dã SP-344 -Chất liệu đế: cao su cao cấp -Chất liệu mặt giày: tổng hợp chất liệu cao cấp -Mầu sắc: phối màu tinh tế -Form:",
    " Thông tin sản phẩm:Kiểu dáng: giày nữSize: 35-36-37-38-39Màu: đa dạngXuất xứ: QCKiểu dáng trẻ trung năng độngDễ dàng phối đồ, dễ dàng vệ sinh Thích hợp để đi trong nhiều hoàn cảnh như đi chơi, đi"
]

let cates = [];

catesList.forEach((currentCate) =>
{
    cates.push(
        {
            ten: currentCate,
            tenkhongdau: bodauTV(currentCate)
        }
    );
})

let products = [];

const numIMG = 63;
const numProName = productNameList.length;
const numDesc = descriptionsList.length;
const numCates = catesList.length;
const numSLMax = 1000;
const numStepPrice = 50;

Cate.insertMany(cates).then((result) =>
{
    productNameList.forEach((curProName) =>
    {
        let randIMG = Math.floor(Math.random() * numIMG) + 1;
        let randDesc = Math.floor(Math.random() * numDesc);
        let randCates = Math.floor(Math.random() * numCates);
        let randSL = Math.floor(Math.random() * numSLMax) + 1;
        let randPrice = Math.floor((Math.random() * numStepPrice) + 1) * 50000 - 1;

        products.push({
            imagePath: `/img/product/p${randIMG}.jpg`,
            title: curProName,
            description: descriptionsList[randDesc],
            price: randPrice,
            cateId: result[randCates]._id,
            sl: randSL
        });
    });
    return products;
}).then((products) => Product.insertMany(products)).then((result) => { exit() });


function exit()
{
    mongoose.disconnect();
}