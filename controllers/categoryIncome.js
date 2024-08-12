const db = require('../config/dtbs');
const fs = require('fs');
const getCategory = (req, res) => {
    let sql = 'SELECT * FROM category_income';
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({ 'message': err.message });
        } else {
            return res.json(data);
        }
    });
};
const addTypeIncome = (req, res) => {
    const { category_name, stt_category } = req.body;

    if (!req.file) {
        return res.status(400).send('Không có tệp tin nào được tải lên.');
    }

    // Đường dẫn tới file đã tải lên
    const imagePath = req.file.path;

    const sql = 'INSERT INTO category_income (category_name, icon_income, stt_category) VALUES (?, ?, ?)';
    db.query(sql, [category_name, imagePath, stt_category], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error inserting data: ' + error.message });
        }
        res.status(201).json({ message: 'Category inserted successfully' });
    });
};

module.exports = {
    addTypeIncome,
    getCategory
};