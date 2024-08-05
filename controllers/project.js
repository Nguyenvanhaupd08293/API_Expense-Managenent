const db = require('../config/dtbs');

// Get all projects
const getProject = (req, res) => {
    db.query('SELECT id, name_project, date_start, price, leader, member FROM project ORDER BY date_start', (error, data, fields) => {
        if (error) return res.status(500).json({ 'message': error.message });
        res.json(data);
    });
};

// Get a project by ID
const getProjectById = (req, res) => {
    let id = req.params.id;
    if (isNaN(id)) {
        return res.status(400).json({ 'message': 'Dự án không tồn tại' });
    }

    let sql = 'SELECT id, name_project, date_start, price, leader, member FROM project WHERE id = ?';
    db.query(sql, [id], (err, data) => {
        if (err) {
            return res.status(500).json({ 'message': err.message });
        } else if (data.length === 0) {
            return res.status(404).json({ 'message': 'Dự án không có' });
        } else {
            // Chuyển đổi member từ chuỗi JSON thành mảng
            if (data[0].member) {
                data[0].member = JSON.parse(data[0].member);
            }
            return res.json(data[0]);
        }
    });
};

// Add a project
const addProject = (req, res) => {
    let { name_project, date_start, price, leader, member } = req.body;

    // Chuyển đổi mảng member thành chuỗi JSON
    let memberJson = JSON.stringify(member);

    let sql = "INSERT INTO project SET name_project = ?, date_start = ?, price = ?, leader = ?, member = ?";
    db.query(sql, [name_project, date_start, price, leader, memberJson], (err, result) => {
        if (err) {
            res.status(500).json({ 'thongbao': 'Lỗi khi chèn project: ' + err.message });
        } else {
            res.json({ 'thongbao': 'Đã chèn xong project' });
        }
    });
};

// Update a project
const updateProject = (req, res) => {
    let id = req.params.id;
    let { name_project, date_start, price, leader, member } = req.body;

    // Chuyển đổi mảng member thành chuỗi JSON nếu cần
    if (Array.isArray(member)) {
        member = JSON.stringify(member);
    }

    let sql = 'UPDATE project SET name_project = ?, date_start = ?, price = ?, leader = ?, member = ? WHERE id = ?';
    db.query(sql, [name_project, date_start, price, leader, member, id], (err, data) => {
        if (err) {
            return res.status(500).json({ 'thongbao': 'Lỗi khi cập nhật dự án: ' + err.message });
        }
        res.json({ 'thongbao': 'Đã cập nhật dự án' });
    });
};
// Delete a project
const deleteProject = (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM project WHERE id = ?';
    db.query(sql, [id], (err, data) => {
        if (err) {
            return res.status(500).json({ 'thongbao': 'Lỗi khi xóa dự án: ' + err.message });
        }
        res.json({ 'thongbao': 'Đã xóa dự án' });
    });
};

module.exports = {
    getProject,
    getProjectById,
    addProject,
    updateProject,
    deleteProject
};