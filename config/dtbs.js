const mysql = require('mysql');
// tạo kết nối tới cơ sở dữ liệu
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: '3306',
    database: 'expense_management'
});
// Mở kết nối
db.connect(error => {
    if (error) throw error;
    console.log('Successfully connected to the database.');
});

module.exports = db;