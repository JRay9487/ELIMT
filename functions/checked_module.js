const { google } = require('googleapis');

/**
 * @param {google.auth.OAuth2} auth OAuth2 客戶端授權
 * @param {string} fileId 要重命名的文件的 ID
 */

async function renameFile(auth, fileId) {
    const drive = google.drive({ version: 'v3', auth });
    try {
        // 獲取當前文件名
        const file = await drive.files.get({ fileId, fields: 'name' });
        const newName = file.data.name + '-checked';

        // 更新文件名
        const updatedFile = await drive.files.update({
            fileId,
            resource: { name: newName },
        });

        console.log(`File renamed to: ${updatedFile.data.name}`);
    } catch (error) {
        console.log('The API returned an error: ' + error);
    }
}

module.exports = renameFile;
