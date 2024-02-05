const fs = require("fs");
const { google } = require("googleapis");

/**
 * 上傳文件到 Google Drive 的指定資料夾
 * @param {google.auth.OAuth2} auth OAuth2 客戶端授權
 * @param {string} folderId Google Drive 資料夾ID
 * @param {string} fileName 要上傳的文件名稱
 * @param {string} filePath 要上傳的文件路徑
 */

async function uploadFile(auth, folderId, fileName, filePath) {
    const drive = google.drive({ version: "v3", auth });

    // 上傳檔案資訊
    const fileMetadata = {
        name: fileName, // 替換為您要上傳的文件名稱
        parents: [folderId],
    };
    const media = {
        mimeType: "application/pdf", 
        body: fs.createReadStream(filePath), // 替換為您要上傳的文件的路徑
    };

    // 建立檔案
    try {
        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: "id",
        });

        console.log("File ID:", file.data.id);
    } catch (error) {
        console.log("The API returned an error: " + error);
    }
}

module.exports = uploadFile;
