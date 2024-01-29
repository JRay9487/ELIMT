const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const port = 8000;

// 連接數據庫
const db = new sqlite3.Database("mydb.sqlite");

// 解析POST請求
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // 添加 JSON 解析

app.use(
    session({
        secret: "my-secret-key",
        resave: false,
        saveUninitialized: true,
    })
);

// 處理登錄請求
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    // 在數據庫中查找用戶信息
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: "Internal server error" });
            return;
        }

        if (!row) {
            res.status(401).json({ error: "Username not found" });
            return;
        }

        // 直接比較密碼
        if (password === row.password) {
            req.session.user = username;
            res.json({
                success: true,
                message: "Login success",
                authenticated: true,
            });
        } else {
            res.status(401).json({ error: "Incorrect password" });
        }
    });
});

// Login checker
app.get("/checkAuth", (req, res) => {
    if (req.session.user) {
        res.status(200).send("Authenticated");
    } else {
        res.status(401).send("Unauthorized");
    }
});

// 啟動服務器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/login`);
});
