const { authorize } = require("./functions/auth_modules");
const uploadFile = require("./functions/upload_module");

const folderId = "14PxX8_Y2mzr9jOd06_ltdXwjObhH5K-L"; // Google Drive 資料夾ID
const fileName = "test2.pdf"; // pdf檔案名稱(上傳後，在Google Drive 中的名稱)
const filePath = "./files/test.pdf"; // pdf檔案位置(localfile)

authorize()
    .then(auth => uploadFile(auth, folderId, fileName, filePath))
    .catch(console.error);
