const express = require('express');
const router = express.Router();
const {
    addTypeIncome,
    getCategory
} = require('../controllers/categoryIncome');
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
router.get('/getcategoryincome', getCategory)
router.post('/addcategoryincome', upload.single('imgProduct'), addTypeIncome);
// router.post('/updateProduct/:id_product', upload.single('imgProduct'), updateProduct);

module.exports = router;