const db = require('../config/dtbs');
const getIncome = (req, res) => {
    let sql = 'SELECT id, amount,date,payment_method, category_income FROM income';
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({ 'message': err.message });
        } else {
            return res.json(data);
        }
    });
};
module.exports = {
    getIncome
}