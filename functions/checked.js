const { google } = require("googleapis");

async function checkedFile(auth, fileId) {
    const drive = google.drive({ version: "v3", auth });
    try {
        // 獲取當前文件名
        const file = await drive.files.get({ fileId, fields: "name" });
        const newName = "checked-" + file.data.name;

        // 更新文件名
        const updatedFile = await drive.files.update({
            fileId,
            resource: { name: newName },
        });

        console.log(`File renamed to: ${updatedFile.data.name}`);
    } catch (error) {
        console.log("The API returned an error: " + error);
    }
}

module.exports = {
    checkedFile,
};
