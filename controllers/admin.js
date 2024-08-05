const db = require('../config/dtbs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const { generateAccessToken, generateRefreshToken } = require('../service/jwtService');

const getUser = async(req, res) => {
    try {
        db.query('SELECT * FROM admin', (error, data) => {
            if (error) {
                return res.status(500).json({ message: error.message });
            }
            res.status(200).json(data);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const hashUserPass = async(password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};
const getAccount = async(req, res) => {
    const userId = req.params.id; // Giả sử ID người dùng được truyền dưới dạng tham số route

    try {
        db.query('SELECT * FROM admin WHERE id = ?', [userId], (error, results) => {
            if (error) {
                return res.status(500).json({ message: error.message });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(results[0]); // Giả sử chỉ có một người dùng với ID này tồn tại
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const createNewUser = async(req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await hashUserPass(password);
        const sql = "INSERT INTO admin SET username = ?, email = ?, password = ?";
        db.query(sql, [username, email, hashedPassword], (err, data) => {
            if (err) {
                return res.status(500).json({ message: 'Lỗi khi chèn nhan_vien: ' + err });
            }
            res.status(201).json({ message: "Đã chèn xong nhan_vien" });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Delete a account
const deleteAccount = (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM admin WHERE id = ?';
    db.query(sql, [id], (err, data) => {
        if (err) {
            return res.status(500).json({ 'thongbao': 'Lỗi khi xóa dự án: ' + err.message });
        }
        res.json({ 'thongbao': 'Đã xóa account' });
    });
};

const loginAccount = (req, res) => {
    // Lấy email và password từ yêu cầu (request)
    const { email, password } = req.body;

    // Tìm người dùng theo email trong cơ sở dữ liệu
    Account.findByEmail(email, async(err, user) => {
        // Nếu có lỗi khi tìm người dùng, trả về lỗi 500 (Internal Server Error)
        if (err) {
            return res.status(500).send({ message: 'Error finding user' });
        }

        // Nếu không tìm thấy người dùng, trả về lỗi 401 (Unauthorized)
        if (!user) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        // So sánh mật khẩu người dùng nhập với mật khẩu đã lưu trong cơ sở dữ liệu
        const match = await bcrypt.compare(password, user.password);

        // Nếu mật khẩu không khớp, trả về lỗi 401 (Unauthorized)
        if (!match) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        // Nếu mật khẩu khớp, tạo accessToken và refreshToken
        const accessToken = generateAccessToken({ id: user.id });
        const refreshToken = generateRefreshToken({ id: user.id });

        // Lưu refreshToken trong cookie với thuộc tính httpOnly để bảo mật
        res.cookie('refreshToken', refreshToken, { httpOnly: true });

        // Trả về accessToken, refreshToken và thông tin người dùng
        res.send({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    });
}

const requestRefreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Bạn chưa xác thực!' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: 'Refresh token không hợp lệ!' });
        }

        const newAccessToken = generateAccessToken(user);
        res.status(200).json({ accessToken: newAccessToken });
    });
};
const updateAccount = async(req, res) => {
    const userId = req.params.id; // Assuming the user ID is passed as a route parameter
    const { username, email, password } = req.body; // Assuming these are the fields you want to update

    try {
        const hashedPassword = await hashUserPass(password);
        const sql = 'UPDATE admin SET username = ?, email = ?,password = ? WHERE id = ?';
        db.query(sql, [username, email, hashedPassword, userId], (error, result) => {
            if (error) {
                return res.status(500).json({ message: error.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ message: 'User updated successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const profileAccount = async(req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Bạn chưa xác thực!');
    }

    const accessToken = token.split(' ')[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, async(err, decoded) => {
        if (err) {
            return res.status(401).send('Token không hợp lệ!');
        }

        try {
            db.query('SELECT id, username, email FROM admin WHERE id = ?', [decoded.id], (error, results) => {
                if (error) {
                    return res.status(500).json({ message: error.message });
                }

                if (results.length === 0) {
                    return res.status(404).send('Không tìm thấy người dùng!');
                }

                res.status(200).json(results[0]);
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};

const userLogout = (req, res) => {
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Đăng xuất thành công!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUser,
    createNewUser,
    loginAccount,
    requestRefreshToken,
    profileAccount,
    userLogout,
    updateAccount,
    getAccount,
    deleteAccount
};