// routes/secureRoute.js

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authenticate');

router.get('/secureData', verifyToken, (req, res) => {
    // Nếu xác thực thành công, req.user sẽ chứa thông tin đã giải mã từ JWT
    res.json({ message: 'This is secure data', user: req.user });
});

module.exports = router;