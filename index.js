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

app.use(
    session({
        secret: "my-secret-key",
        resave: false,
        saveUninitialized: true,
    })
);

// 登入介面
app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

// 處理登錄請求
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    // 在數據庫中查找用戶信息
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.sendStatus(500);
        }

        if (!row) {
            return res.send(
                '<script>alert("Username not found"); window.location.href = "/login";</script>'
            );
        }

        // 直接比較密碼
        if (password === row.password) {
            req.session.user = username;
            res.send("login success");
        } else {
            return res.send(
                '<script>alert("Uncorrect Password"); window.location.href = "/login";</script>'
            );
        }
    });
});

// 啟動服務器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/login`);
});
