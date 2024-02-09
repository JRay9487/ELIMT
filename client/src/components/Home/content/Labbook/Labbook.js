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

function Labbook({ userInfo }) {
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
        <Box component="form" onSubmit={handleSubmit} className="labbook">
            <Typography variant="h5" fontWeight="bold" margin={2}>
                實驗記錄上傳
            </Typography>
            <Box sx={{ mx: 8 }}>
                <TextField
                    label="實驗簡述"
                    value={experimentDetail}
                    onChange={(e) => setExperimentDetail(e.target.value)}
                    margin="normal"
                    fullWidth
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
    );
}

export default Labbook;
