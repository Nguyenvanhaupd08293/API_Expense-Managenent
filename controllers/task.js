const db = require('../config/dtbs')
const getAllTasks = (req, res) => {
    let sql = 'SELECT id, name_task, project_id, nhan_vien_id, mo_ta, status, priority FROM task';
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({ 'message': err.message });
        } else {
            return res.json(data);
        }
    });
};
const getTaskById = (req, res) => {
    let id = req.params.id;
    if (isNaN(id)) {
        return res.json({ 'message': 'Task không tồn tại' });
    }

    let sql = 'SELECT id, name_task,project_id, nhan_vien_id, mo_ta, status, priority FROM task WHERE id = ?';
    db.query(sql, [id], (err, data) => {
        if (err) {
            return res.json({ 'message': err.message });
        } else if (data.length === 0) {
            return res.json({ 'message': 'Task không có' });
        } else {
            return res.json(data[0]);
        }
    });
};
const addTask = (req, res) => {
    let { name_task, project_id, nhan_vien_id, mo_ta, status, priority } = req.body;
    let sql = "INSERT INTO task SET name_task=?,project_id=?, nhan_vien_id=?, mo_ta=?, status=?, priority=?";
    db.query(sql, [name_task, project_id, nhan_vien_id, mo_ta, status, priority], (err, d) => {
        if (err) res.json({ 'thongbao': 'Lỗi khi chèn Task: ' + err });
        else res.json({ "thongbao": "Đã chèn xong Task" });
    });
};
// Update a Task
const updateTask = (req, res) => {
    let id = req.params.id;
    let { name_task, project_id, nhan_vien_id, mo_ta, status, priority } = req.body;
    let sql = 'UPDATE task SET name_task=?,project_id=?, nhan_vien_id=?, mo_ta=?, status=?, priority=? WHERE id = ?';
    db.query(sql, [name_task, project_id, nhan_vien_id, mo_ta, status, priority, id], (err, data) => {
        if (err) {
            return res.status(500).json({ 'thongbao': 'Lỗi khi cập nhật dự án: ' + err.message });
        }
        res.json({ 'thongbao': 'Đã cập nhật dự án' });
    });
};

// Delete a Task
const deleteTask = (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM task WHERE id = ?';
    db.query(sql, [id], (err, data) => {
        if (err) {
            return res.status(500).json({ 'thongbao': 'Lỗi khi xóa dự án: ' + err.message });
        }
        res.json({ 'thongbao': 'Đã xóa dự án' });
    });
};
module.exports = {
    getAllTasks,
    getTaskById,
    addTask,
    updateTask,
    deleteTask
};