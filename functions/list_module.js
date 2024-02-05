const { google } = require("googleapis");

/**
 * @param {google.auth.OAuth2} auth OAuth2 客戶端授權
 * @param {string} folderId 要上傳的文件資料夾 ID
 */

async function listFiles(auth, folderId) {
    const drive = google.drive({ version: "v3", auth });
    const res = await drive.files.list({
        pageSize: 128,
        fields: "nextPageToken, files(id, name)",
        q: `'${folderId}' in parents`,
    });
    const files = res.data.files;
    if (files.length === 0) {
        console.log("No files found.");
        return;
    }

    console.log("Files:");
    files.map((file) => {
        console.log(`${file.name} (${file.id})`);
    });
}

module.exports = listFiles;
