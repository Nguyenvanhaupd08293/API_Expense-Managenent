const path = require("path");
const express = require('express');
const session = require('express-session');

const configViewEngine = (app) => {
    app.use(session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Điều chỉnh theo môi trường triển khai của bạn
    }));

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, 'views')); // Sử dụng __dirname để tạo đường dẫn tuyệt đối
    app.use(express.static("public"));
    app.use("/css", express.static(path.join(__dirname, "/node_modules/bootstrap/dist/css")));
    app.use("/js", express.static(path.join(__dirname, "/node_modules/bootstrap/dist/js")));
}

module.exports = configViewEngine;