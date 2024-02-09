const { google } = require("googleapis");
const sqlite3 = require("sqlite3").verbose();

async function listFiles(auth, folderId) {
    const drive = google.drive({ version: "v3", auth });
    const res = await drive.files.list({
        pageSize: 200,
        fields: "nextPageToken, files(id, name)",
        orderBy: "createdTime desc",
        q: `'${folderId}' in parents`,
    });
    const files = res.data.files;
    if (files.length === 0) {
        console.log("No files found.");
        return;
    }

    let db = new sqlite3.Database("./mydb.sqlite", (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log("Connected to the mydb sqlite database.");
    });

    db.serialize(() => {
        // reset files table
        db.run(`DELETE FROM files`, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log("Table has been reset");
        });

        // reset Autoincrement
        db.run(`DELETE FROM sqlite_sequence WHERE name='files'`, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log("Autoincrement reset");
        });

        // Insert new data
        files.forEach((file) => {
            const fileInfo = file.name.split("-");
            if (fileInfo.length < 3) {
                console.log(`File name format is incorrect: ${file.name}`);
                return;
            }

            const date = `${fileInfo[0].substring(
                0,
                4
            )}-${fileInfo[0].substring(4, 6)}-${fileInfo[0].substring(6)}`;
            const creater = fileInfo[1];
            const filename = fileInfo.slice(2).join("-");
            const check = file.name.startsWith("checked") ? "true" : "false";

            db.run(
                `INSERT INTO files ("googleId", "googleName", "creater", "filename", "date", "check") VALUES (?, ?, ?, ?, ?, ?)`,
                [file.id, file.name, creater, filename, date, check],
                function (err) {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log(
                        `Successfully added data with rowid ${this.lastID}`
                    );
                }
            );
        });
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log("Close the database connection.");
    });
}

module.exports = {
    listFiles,
};
