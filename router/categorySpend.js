const express = require('express');
const router = express.Router();
const {
    addTypeSpend,
    getCategory
} = require('../controllers/categorySpend');
const multer = require('multer');

// Cấu hình lưu trữ của Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images'); // Lưu trữ tập tin vào thư mục 'uploads'
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname); // Đổi tên tập tin thành một tên duy nhất
    },
});

// Tạo middleware multer
const upload = multer({ storage: storage });
router.get('/getcategoryspend', getCategory)
router.post('/addcategoryspend', upload.single('imgProduct'), addTypeSpend);
// router.post('/updateProduct/:id_product', upload.single('imgProduct'), updateProduct);

module.exports = router;