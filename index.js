// Requirement
require("dotenv").config();
const fs = require("fs");
const express = require("express");
const session = require("express-session");
const multer = require("multer");
const sqlite3 = require("sqlite3");
const path = require("path");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const readline = require("readline");

const uploadsFolder = "./uploads/";
const settings = require("./data/settings.json");

// readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Google Drive components
const { authorize } = require("./functions/auth_modules");
const { uploadFile } = require("./functions/upload");
const { listFiles } = require("./functions/list");
const { checkedFile } = require("./functions/checked");

// Settings
const app = express();
const db = new sqlite3.Database("data/system.sqlite"); //database connect
const upload = multer({
    dest: "uploads/",
    limits: { fileSize: settings.maximum_uploadSize * 1024 * 1024 }, // MB
});

// POST parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // add JSON parser

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// Login
app.post("/login", (req, res) => {
    const { username, password } = req.body;
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
            const linkPath = path.join("./data/link.json");
            const settingsPath = path.join("./data/settings.json");

            const userJson = {
                username: row.username,
                fullname: row.fullname,
                privilege: row.privilege,
                email: row.email,
            };

            fs.readFile(linkPath, (err, data) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({
                        error: "Failed to load settings",
                    });
                }
                userJson.link = JSON.parse(data);

                fs.readFile(settingsPath, (err, data) => {
                    if (err) {
                        console.error(err.message);
                        res.status(500).json({
                            error: "Failed to load settings",
                        });
                        return;
                    }

                    const settings = JSON.parse(data);
                    userJson.settings = settings;

                    if (row.privilege === "3") {
                        res.json({
                            success: true,
                            authenticated: true,
                            message: "Login success",
                            user: userJson,
                        });
                    } else {
                        const limitedSettings = {
                            report_template: settings.report_template,
                        };
                        userJson.settings = limitedSettings;

                        res.json({
                            success: true,
                            authenticated: true,
                            message: "Login success",
                            user: userJson,
                        });
                    }
                });
            });
        } else {
            res.status(401).json({ error: "Incorrect password" });
        }
    });
});

// 登出
app.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
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

// Oauth
app.get("/oauth", (req, res) => {
    authorize()
        .then((auth) => {
            res.redirect("/");
        })
        .catch((error) => {
            console.error("Authorization failed:", error);
            res.status(500).send("Failed to authorize.");
        });
});

// 更新帳號
app.post("/api/account/", (req, res) => {
    const { username, fullname, email, password, privilege } = req.body;
    const { modify } = req.query;

    switch (modify) {
        case "insert":
            if (!username || !privilege) {
                res.status(400).json({
                    error: "Missing required fields for insert operation.",
                });
                return;
            }

            let sqlInsert =
                "INSERT INTO users (username, privilege, password ) VALUES (?, ?, ? )";
            let paramsInsert = [username.trim(), privilege.trim(), "lab12345"];

            db.run(sqlInsert, paramsInsert, (err) => {
                if (err) {
                    console.error(err.message);
                    if (err.code === "SQLITE_CONSTRAINT") {
                        res.status(409).json({
                            error: "Username already exists",
                        });
                    } else {
                        res.status(500).json({
                            error: "Internal server error",
                        });
                    }
                    return;
                }
                res.json({
                    success: true,
                    message: "Account inserted successfully",
                });
            });
            break;

        case "delete":
            if (!username) {
                res.status(400).json({
                    error: "Missing username field for delete operation.",
                });
                return;
            }

            let sqlDelete = "DELETE FROM users WHERE username = ?";
            let paramsDelete = [username.trim()];

            db.run(sqlDelete, paramsDelete, (err) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: "Internal server error" });
                    return;
                }
                res.json({
                    success: true,
                    message: "Account deleted successfully",
                });
            });
            break;

        case "update":
            if (!username) {
                res.status(400).json({
                    error: "Missing username field for update operation.",
                });
                return;
            }

            let sqlUpdate = "UPDATE users SET";
            let paramsUpdate = [];
            let toUpdate = [];

            if (fullname && fullname.trim() !== "") {
                toUpdate.push(" fullname = ?");
                paramsUpdate.push(fullname.trim());
            }

            if (email && email.trim() !== "") {
                toUpdate.push(" email = ?");
                paramsUpdate.push(email.trim());
            }

            if (password && password.trim() !== "") {
                toUpdate.push(" password = ?");
                paramsUpdate.push(password.trim());
            }

            if (privilege && privilege.trim() !== "") {
                toUpdate.push(" privilege = ?");
                paramsUpdate.push(privilege.trim());
            }

            if (toUpdate.length === 0) {
                res.json({
                    warning: "No update performed due to empty fields.",
                });
                return;
            }

            sqlUpdate += toUpdate.join(", ");
            sqlUpdate += " WHERE username = ?";
            paramsUpdate.push(username.trim());

            db.run(sqlUpdate, paramsUpdate, (err) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: "Internal server error" });
                    return;
                }
                res.json({
                    success: true,
                    message: "Account updated successfully",
                });
            });
            break;

        default:
            res.status(400).json({ error: "Invalid modify parameter." });
            break;
    }
});

// 帳號列表
app.get("/api/account/list", (req, res) => {
    const query =
        'SELECT "username", "privilege", "fullname", "email" FROM USERS';

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows,
        });
    });
});

// Files API
app.get("/api/files", (req, res) => {
    const { username, status } = req.query;

    let query =
        'SELECT "googleId", "filename", "username", "fullname", "date", "status" FROM files';
    const params = [];

    if (username || status) {
        let conditions = [];

        if (username) {
            conditions.push('"username" = ?');
            params.push(username);
            query += " WHERE " + conditions.join(" AND ");
        }

        if (status) {
            // 檢查是否已經有WHERE條件
            const conditionStart = params.length === 0 ? " WHERE" : " AND";
            // 解析可能的多個狀態值
            const statuses = status.split(",").map((s) => s.trim());
            const statusConditions = statuses
                .map(() => '"status" = ?')
                .join(" OR ");
            query += `${conditionStart} (${statusConditions})`;
            params.push(...statuses);
        }
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

// 檔案上傳雲端
app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const folder = settings.folder; // google drive master folder ID
    const fileName = req.body.uploadname;
    const filePath = req.file.path; // uploads folder
    const username = req.body.username;

    authorize()
        .then((auth) => {
            uploadFile(auth, fileName, filePath, username)
                .then(() => {
                    listFiles(auth, folder); // 列出文件以獲取最新上傳的文件ID
                })
                .then((fileId) => {
                    sendMail(fileId, "upload");
                    res.send({
                        success: true,
                        fileId: fileId,
                        message: "File uploaded and email sent successfully.",
                    });
                })
                .catch((error) => {
                    console.error("Failed to list files or send email:", error);
                    res.send({
                        success: false,
                        message:
                            "File uploaded but failed to list files or send email.",
                    });
                });
        })
        .catch((error) => {
            console.error("Authorization failed or file upload failed:", error);
            res.status(500).send("Failed to authorize or upload file.");
        });
});

// 獲得雲端檔案列表
app.get("/api/list", (req, res) => {
    const folder = settings.folder;

    authorize().then((auth) => {
        listFiles(auth, folder)
            .then((files) => {
                res.send({ success: true, files: files });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Failed to list files from Google Drive.");
            });
    });
});

// 檔案簽核
app.post("/api/checked", async (req, res) => {
    const { googleIds, decision } = req.body;

    try {
        const auth = await authorize();
        await Promise.all(
            googleIds.map((fileId) => checkedFile(auth, fileId, decision))
        );
        await listFiles(auth, settings.folder); // 更新本地列表

        const query =
            'SELECT "googleId", "filename", "creater", "date" FROM files WHERE "status" = "pending"';
        db.all(query, [], (err, rows) => {
            if (err) {
                console.error("從數據庫獲取文件時出錯：", err);
                return res.status(500).json({
                    success: false,
                    message: "從數據庫獲取文件時出錯",
                });
            }
            // 發送郵件通知
            googleIds.forEach((fileId) => {
                sendMail(fileId, decision);
            });
            // 返回更新後的文件列表
            res.json({
                success: true,
                files: rows,
            });
        });
    } catch (error) {
        console.error("處理文件或授權失敗：", error);
        res.status(500).json({ success: false, message: "處理文件或授權失敗" });
    }
});

// 自動雲端檔案刷新
setInterval(() => {
    const folder = settings.folder;

    authorize().then((auth) => {
        listFiles(auth, folder)
            .then((files) => console.log("Files listed"))
            .catch((error) => console.error("Failed to list files", error));
    });
}, 600000); // 10min

// Mailer
function sendMail(fileId, status) {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAILER,
            pass: process.env.MAILER_PASSWORD,
        },
    });

    if (status === "upload") {
        const query = 'SELECT "email" FROM users WHERE "privilege" = 2';
        db.all(query, [], (err, rows) => {
            if (err) {
                throw err;
            }

            const receivers = rows.map((row) => row.email).join(", ");

            if (receivers) {
                var mailOptions = {
                    from: process.env.MAILER,
                    to: receivers,
                    subject: "ELIMT System",
                    html: settings.mailer.upload,
                };

                transporter.sendMail(mailOptions);
            } else {
                console.log("No users with privilege = 2 found.");
            }
        });
    } else if (status === "approve" || status === "reject") {
        const query = `
      SELECT users.email
      FROM files
      JOIN users ON files.username = users.username
      WHERE files.googleId = ?
    `;

        db.get(query, [fileId], (err, row) => {
            if (err) {
                console.error("Database error:", err);
                return;
            }

            if (row) {
                var subject = "ELIMT System";
                var htmlMessage =
                    status === "approve"
                        ? settings.mailer.approve
                        : settings.mailer.reject;

                var mailOptions = {
                    from: process.env.MAILER,
                    to: row.email,
                    subject: subject,
                    html: htmlMessage,
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.error("Failed to send email:", error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });
            } else {
                console.log("No user found for the specified file ID.");
            }
        });
    } else {
        console.error("Unsupported status:", status);
    }
}

// 暫存檔案清除器
setInterval(() => {
    fs.readdir(uploadsFolder, (err, files) => {
        if (err) {
            console.error("Failed to read uploads folder:", err);
            return;
        }

        if (files.length > 5) {
            let oldestFile = files[0];
            let oldestFileDate = fs.statSync(uploadsFolder + oldestFile).ctime;
            for (let i = 1; i < files.length; i++) {
                const fileDate = fs.statSync(uploadsFolder + files[i]).ctime;
                if (fileDate < oldestFileDate) {
                    oldestFile = files[i];
                    oldestFileDate = fileDate;
                }
            }

            fs.unlink(uploadsFolder + oldestFile, (err) => {
                if (err) {
                    console.error("Failed to delete file:", err);
                    return;
                }
                console.log("File deleted successfully:", oldestFile);
            });
        }
    });
}, 6000000); // 100min

// Static
const port = settings.port;

app.use(express.static(path.join(__dirname, "client", "build")));
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Launch
app.listen(port, () => {
    console.log(`ELIMT is running on http://localhost:${port}`);
});
