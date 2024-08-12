const db = require('../config/dtbs')
const getIncome = (req, res) => {
    const sql = `
            SELECT 
                s.id,
                s.amount,
                s.date,
                p.type_payment_method AS payment_method_name,
                cs.category_name AS category_spend_name,
                cs.icon_spend
            FROM 
                income s
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

const getIncomebyId = (req, res) => {
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
            income s
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


const addIncome = (req, res) => {
    const { selected, amount, date, paymentMethod } = req.body;

    // Kiểm tra xem các trường có đầy đủ hay không
    if (!amount || !date || !paymentMethod || !selected) {
        return res.status(400).json({ 'thongbao': 'Tất cả các trường đều bắt buộc.' });
    }

    // Kiểm tra sự tồn tại của category_spend
    const findCategoryIdQuery = "SELECT id_categorySpend FROM category_spend WHERE id_categorySpend = ?";
    db.query(findCategoryIdQuery, [selected], (err, categoryResult) => {
        if (err) {
            return res.status(500).json({ 'thongbao': 'Lỗi khi tìm ID loại chi tiêu: ' + err });
        }

        if (categoryResult.length === 0) {
            return res.status(400).json({ 'thongbao': 'ID loại chi tiêu không hợp lệ.' });
        }

        // Kiểm tra sự tồn tại của payment_method
        const findPaymentMethodQuery = "SELECT id FROM payment WHERE id = ?";
        db.query(findPaymentMethodQuery, [paymentMethod], (err, paymentResult) => {
            if (err) {
                return res.status(500).json({ 'thongbao': 'Lỗi khi tìm ID phương thức thanh toán: ' + err });
            }
            if (paymentResult.length === 0) {
                return res.status(400).json({ 'thongbao': 'ID phương thức thanh toán không hợp lệ.' });
            }

            // Chèn dữ liệu vào bảng spending
            const insertSpendQuery = "INSERT INTO income (amount, date, payment_method, category_spend) VALUES (?, ?, ?, ?)";
            db.query(insertSpendQuery, [amount, date, paymentMethod, selected], (err, result) => {
                if (err) {
                    return res.status(500).json({ 'thongbao': 'Lỗi khi chèn dữ liệu: ' + err });
                } else {
                    res.json({ "thongbao": "Dữ liệu đã được chèn thành công." });
                }
            });
        });
    });
};
//update spending
const updateSpending = (req, res) => {
    let id = req.params.id;
    const { selected, amount, date, paymentMethod } = req.body;

    // Kiểm tra xem có đầy đủ dữ liệu hay không
    if (!amount || !date || !paymentMethod || !selected) {
        return res.status(400).json({ 'thongbao': 'Tất cả các trường đều bắt buộc.' });
    }

    // Kiểm tra sự tồn tại của category_spend
    const findCategoryIdQuery = "SELECT id_categorySpend FROM category_spend WHERE id_categorySpend = ?";
    db.query(findCategoryIdQuery, [selected], (err, categoryResult) => {
        if (err) {
            return res.status(500).json({ 'thongbao': 'Lỗi khi tìm ID loại chi tiêu: ' + err });
        }
        if (categoryResult.length === 0) {
            return res.status(400).json({ 'thongbao': 'ID loại chi tiêu không hợp lệ.' });
        }

        // Kiểm tra sự tồn tại của payment_method
        const findPaymentMethodQuery = "SELECT id FROM payment WHERE id = ?";
        db.query(findPaymentMethodQuery, [paymentMethod], (err, paymentResult) => {
            if (err) {
                return res.status(500).json({ 'thongbao': 'Lỗi khi tìm ID phương thức thanh toán: ' + err });
            }

            if (paymentResult.length === 0) {
                return res.status(400).json({ 'thongbao': 'ID phương thức thanh toán không hợp lệ.' });
            }

            // Cập nhật dữ liệu trong bảng spending
            const updateSpendQuery = "UPDATE spending SET amount=?, date=?, payment_method=?, category_spend=? WHERE id = ?";
            db.query(updateSpendQuery, [amount, date, paymentMethod, selected, id], (err, result) => {
                if (err) {
                    return res.status(500).json({ 'thongbao': 'Lỗi khi cập nhật dữ liệu: ' + err.message });
                } else {
                    res.json({ "thongbao": "Dữ liệu đã được cập nhật thành công." });
                }
            });
        });
    });
};

// Delete a Spending
const deleteIncome = (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM income WHERE id = ?';
    db.query(sql, [id], (err, data) => {
        if (err) {
            return res.status(500).json({ 'thongbao': 'Lỗi khi xóa dự án: ' + err.message });
        }
        res.json({ 'thongbao': 'Đã xóa nhan vien' });
    });
};

module.exports = {
    getIncome,
    getIncomebyId,
    addIncome,
    updateSpending,
    deleteIncome
};