import React, { useState } from "react";
import axios from "axios";
import PdfViewer from "./pdfviewer/Pdfviewer";

import "./labbook.css";
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Filelist from "./Uploadhistory";


function Labbook({ userInfo, tabIndex }) {
  const fullname = userInfo ? userInfo.fullname : "Unknown";
  const [experimentDetail, setExperimentDetail] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [openPop, setOpenPop] = useState(false);
  const [uploadname, setUploadname] = useState("");

  const handleFileSelect = (file) => {
    setUploadFile(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const today = new Date();
    const formattedDate = `${today.getFullYear()}${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}`;
    const uploadname = `${formattedDate}-${fullname}-${experimentDetail}.pdf`;
    setUploadname(uploadname);
    setOpenPop(true);
  };

  // 彈出視窗確認
  const handleConfirm = () => {
    if (!uploadFile || !uploadname) {
      alert("File or upload name is missing!");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("uploadname", uploadname);

    axios
      .post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Upload successful:", response.data);
        alert("File uploaded successfully!");
      })
      .catch((error) => {
        console.error("Upload error:", error);
        alert("Failed to upload file.");
      });
    setOpenPop(false); // 上傳後關閉彈出視窗
  };
  const handleClose = () => {
    setOpenPop(false); // 用戶取消時關閉彈出視窗
  };

  return (
    <>
      {tabIndex === 0 && (
        <Box component="form" onSubmit={handleSubmit} className="labbook">
          <Box sx={{ mx: 6, mt: 4 }}>
            <Grid
              container
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Grid item >
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ fontWeight: "bold", margin: 0, display: "flex" }}
                >
                  <UploadFileIcon fontSize="large" sx={{ mr: 1 }} />{" "}
                  實驗記錄上傳
                </Typography>
              </Grid>
              <Grid item>
                <Button variant="contained">
                  下載範本
                </Button>
              </Grid>
            </Grid>
            <TextField
            variant="outlined"
              label="實驗簡述"
              value={experimentDetail}
              onChange={(e) => setExperimentDetail(e.target.value)}
              InputLabelProps={{
                style: { color: '#C0C0C0' },
              }}
              fullWidth
              sx={{ mt: 2 , borderColor:"primary"}}
              
            />

            <Grid sx={{ mb: 6, mt: 3 }}>
              <PdfViewer onFileSelect={handleFileSelect} />
            </Grid>
          </Box>

          <Button
            className="submit-btn"
            type="submit"
            variant="contained"
            color="primary"
            sx={{ my: 2 }}
          >
            提交
          </Button>

          <Dialog open={openPop} onClose={handleClose}>
            <DialogTitle>{"確認提交"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                請確認您要提交的信息和檔案，檔案將以:
              </DialogContentText>
              <DialogContentText>
                {uploadname} 儲存於Google Drive資料庫。
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                取消
              </Button>
              <Button onClick={handleConfirm} color="primary" autoFocus>
                確認
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
      {tabIndex === 1 && (
        <Box>
          <Typography>History</Typography>
          <Filelist />
        </Box>
      )}
    </>
  );
}

export default Labbook;
