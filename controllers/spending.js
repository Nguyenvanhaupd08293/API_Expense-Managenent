const db = require('../config/dtbs')
const getSpending = (req, res) => {
    const sql = `
        SELECT 
            s.id,
            s.amount,
            s.date,
            p.type_payment_method AS payment_method_name,
            cs.category_name AS category_spend_name,
            cs.icon_spend
        FROM 
            spending s
        INNER JOIN 
            category_spend cs ON s.category_spend = cs.id_categorySpend
        INNER JOIN 
            Payment p ON s.payment_method = p.id
    `;
    db.query(sql, (error, data, fields) => {
        if (error) {
            return res.status(500).json({ message: error.message });
        } else {
            return res.status(200).json(data);
        }
    });
};

const getSpendbyId = (req, res) => {
    let id = req.params.id;

    // Kiểm tra xem id có phải là một số không
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Nhân viên không tồn tại' });
    }

    let sql = ` SELECT 
            s.id,
            s.amount,
            s.date,
             p.type_payment_method AS payment_method_name,
            cs.category_name AS category_spend_name
        FROM 
            spending s
        INNER JOIN 
            category_spend cs ON s.category_spend = cs.id_categorySpend
        INNER JOIN 
             Payment p ON s.payment_method = p.id
        WHERE s.id=?`;
    db.query(sql, [id], function(err, data) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ message: err.message });
        } else if (data.length === 0) {
            console.log('No data found for ID:', id);
            return res.status(404).json({ message: 'Nhân viên không có' });
        } else {
            console.log('Data found:', data);
            return res.status(200).json(data[0]);
        }
    });
};

const addSpend = (req, res) => {
    let { amount, date, payment_method, category_spend } = req.body;
    let sql = "INSERT INTO spending SET amount=?, date=?, payment_method=?, category_spend=?";
    db.query(sql, [amount, date, payment_method, category_spend], (err, d) => {
        if (err) res.json({ 'thongbao': 'Lỗi khi chèn nhan_vien: ' + err });
        else res.json({ "thongbao": "Đã chèn xong nhan_vien" });
    });
};
//update spending
const updateSpending = (req, res) => {
    let id = req.params.id;
    let { amount, date, payment_method, category_spend } = req.body;
    let sql = 'UPDATE spending SET amount=?, date=?, payment_method=?, category_spend=? WHERE id = ?';
    db.query(sql, [amount, date, payment_method, category_spend, id], (err, data) => {
        if (err) {
            return res.status(500).json({ 'thongbao': 'Lỗi khi cập nhật nhan vieen: ' + err.message });
        }
        res.json({ 'thongbao': 'Đã cập nhật dự án' });
    });
};

// Delete a Spending
const deleteSpending = (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM spending WHERE id = ?';
    db.query(sql, [id], (err, data) => {
        if (err) {
            return res.status(500).json({ 'thongbao': 'Lỗi khi xóa dự án: ' + err.message });
        }
        res.json({ 'thongbao': 'Đã xóa nhan vien' });
    });
};

module.exports = {
    getSpending,
    getSpendbyId,
    addSpend,
    updateSpending,
    deleteSpending
};