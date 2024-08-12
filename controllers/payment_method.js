const db = require('../config/dtbs')
const getPaymentMethod = (req, res) => {
    let sql = 'SELECT * FROM payment';
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({ 'message': err.message });
        } else {
            return res.json(data);
        }
    });
}
module.exports = {
    getPaymentMethod
}