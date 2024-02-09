import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Paper,
    AppBar,
    Toolbar,
    TextField,
    Grid,
    Button,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckableList from "./CheckableList";

export default function LBapprove() {
    const [fileList, setFileList] = useState([]);
    const [checked, setChecked] = useState([]);
    const [open, setOpen] = useState(false);

    // checkbox
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    // Dialog
    const handleApprove = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    // 取得待簽核資料
    const loadData = async () => {
        try {
            const response = await axios.get("/api/files/?check=false");
            setFileList(response.data.files);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // 簽核功能
    const handleSubmit = async () => {
        try {
            const response = await axios.post("/api/checked", {
                googleIds: checked, // 假設 checked 是一個包含選中文件 googleId 的陣列
            });
            console.log("res", response.data);
            alert("檔案簽核成功!");
            setChecked([]);
            loadData();
        } catch (error) {
            console.error("err", error);
            alert("檔案簽核失敗!");
        }
        setOpen(false);
    };

    return (
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden" }}>
            <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
                <Toolbar>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <SearchIcon
                                color="inherit"
                                sx={{ display: "block" }}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField
                                fullWidth
                                placeholder=""
                                InputProps={{
                                    disableUnderline: true,
                                    sx: { fontSize: "default" },
                                }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                onClick={handleApprove}
                                sx={{ mr: 1 }}
                            >
                                Approve
                            </Button>
                            <Tooltip title="Refresh">
                                <IconButton onClick={loadData}>
                                    <RefreshIcon
                                        color="inherit"
                                        sx={{ display: "block" }}
                                    />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <CheckableList
                items={fileList}
                checked={checked}
                onToggle={handleToggle}
            />
            <Dialog
                open={open}
                onClose={handleClose}
                sx={{
                    "& .MuiDialog-paper": { maxWidth: "none", width: "30%" },
                }}
            >
                <DialogTitle>確認簽核</DialogTitle>
                <DialogContent>
                    {checked.length > 0 ? (
                        checked.map((id) => {
                            const item = fileList.find(
                                (item) => item.googleId === id
                            );
                            return (
                                <div key={id}>
                                    {item ? item.filename : "未找到檔案"}
                                </div>
                            );
                        })
                    ) : (
                        <div>未選擇任何檔案</div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button onClick={handleSubmit}>確認</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
