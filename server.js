const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const multer = require("multer");
const session = require("express-session");
const settings = require("./settings.json");

//GoogleDrive 組件
const { authorize } = require("./functions/auth_modules");
const { uploadFile } = require("./functions/upload");
const { listFiles } = require("./functions/list");
const { checkedFile } = require("./functions/checked");

//設定
const app = express();
const db = new sqlite3.Database("mydb.sqlite"); //database connect
const port = settings.server_port; //port
const upload = multer({ dest: "uploads/" }); // 暫存檔位置

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

        // 登入驗證、回傳
        if (password === row.password) {
            req.session.user = username;

            const userJson = {
                username: row.username,
                fullname: row.fullname,
                privilege: row.privilege,
                email: row.email,
                picture: row.picture,
            };

            res.json({
                success: true,
                authenticated: true,
                message: "Login success",
                user: userJson,
            });
        } else {
            res.status(401).json({ error: "Incorrect password" });
        }
    });
});

// 登入認證
app.get("/checkAuth", (req, res) => {
    if (req.session.user) {
        res.status(200).send("Authenticated");
    } else {
        res.status(401).send("Unauthorized");
    }
});

// 檔案上傳雲端
app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const folderId = settings.GDrive_folderID;
    const fileName = req.body.uploadname;
    const filePath = req.file.path;

    authorize()
        .then((auth) => {
            uploadFile(auth, folderId, fileName, filePath)
                .then((fileId) => {
                    // 在這裡調用 listFiles 函數以更新資料庫
                    listFiles(auth, folderId)
                        .then(() => {
                            res.send({
                                success: true,
                                fileId: fileId,
                                message:
                                    "File uploaded and database updated successfully.",
                            });
                        })
                        .catch((error) => {
                            console.error("Failed to update database:", error);
                            // 即使更新資料庫失敗，也返回上傳成功的訊息
                            res.send({
                                success: true,
                                fileId: fileId,
                                message:
                                    "File uploaded but failed to update database.",
                            });
                        });
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send(
                        "Failed to upload file to Google Drive."
                    );
                });
        })
        .catch((error) => {
            console.error("Authorization failed:", error);
            res.status(500).send("Failed to authorize.");
        });
});

// 獲得雲端檔案列表
app.get("/api/list", (req, res) => {
    const folderId = settings.GDrive_folderID;

    authorize().then((auth) => {
        listFiles(auth, folderId)
            .then((files) => {
                res.send({ success: true, files: files });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Failed to list files from Google Drive.");
            });
    });
});

// SQLite API接口
app.get("/api/files", (req, res) => {
    const { creater, check } = req.query;

    // 構建 SQL 查詢的基本部分
    let query = 'SELECT "googleId", "filename", "creater", "date" FROM files';
    const params = [];

    // 構建 SQL 查詢的條件部分
    if (creater || check) {
        let conditions = [];

        if (creater) {
            conditions.push('"creater" = ?');
            params.push(creater);
        }

        if (check) {
            conditions.push('"check" = ?');
            params.push(check === "true" ? "true" : "false"); // 確保只將 'true' 或 'false' 作為參數
        }

        query += " WHERE " + conditions.join(" AND ");
    }

    // 執行查詢
    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, files: rows });
    });
});

// 檔案簽核
app.post("/api/checked", async (req, res) => {
    const { googleIds } = req.body;

    authorize()
        .then((auth) => {
            Promise.all(googleIds.map((fileId) => checkedFile(auth, fileId)))
                .then(() => listFiles(auth, settings.GDrive_folderID)) // 更新本地列表
                .then(() => {
                    const query =
                        'SELECT "googleId", "filename", "creater", "date" FROM files WHERE "check" = "false"';
                    db.all(query, [], (err, rows) => {
                        if (err) {
                            console.error("從數據庫獲取文件時出錯：", err);
                            return res.status(500).json({
                                success: false,
                                message: "從數據庫獲取文件時出錯",
                            });
                        }
                        // 返回更新後的文件列表
                        res.json({
                            success: true,
                            files: rows,
                        });
                    });
                })
                .catch((error) => {
                    console.error("處理文件或更新列表時出錯：", error);
                    res.status(500).json({
                        success: false,
                        message: "處理文件或更新列表時出錯",
                    });
                });
        })
        .catch((authError) => {
            console.error("授權失敗：", authError);
            res.status(500).json({ success: false, message: "授權失敗" });
        });
});

// 啟動服務器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
