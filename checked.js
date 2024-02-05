const { authorize } = require("./functions/auth_modules");
const renameFile = require("./functions/checked_module");

const fileID = '1DXOxro6U6C9D3I2HavENsx5rZ-I_bDUT'; //Google Drive 檔案ID

authorize().then(auth => renameFile(auth, fileID)).catch(console.error);