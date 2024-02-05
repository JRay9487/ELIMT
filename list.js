const { authorize } = require("./functions/auth_modules");
const listFiles = require("./functions/list_module");

const folderId = "14PxX8_Y2mzr9jOd06_ltdXwjObhH5K-L"; // Google Drive 資料夾ID

authorize()
    .then(auth => listFiles(auth, folderId))
    .catch(console.error);
