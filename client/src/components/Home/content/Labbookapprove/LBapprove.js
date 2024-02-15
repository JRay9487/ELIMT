import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Box,
  AppBar,
  Toolbar,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  DialogContentText,
} from "@mui/material";
import ChecklistIcon from '@mui/icons-material/Checklist';
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckableList from "./CheckableList";

export default function LBapprove({ tabIndex }) {
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
    const intervalId = setInterval(() => loadData(), 100); // 每100ms 刷新一次
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // 刷新功能
  const handleRefresh = async () => {
    try {
      const response = await axios.get("/api/refresh");
      setFileList(response.data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  // 簽核功能
  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/checked", {
        googleIds: checked,
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
    <>
      {tabIndex === 0 && (
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden" }}>
          <Box>
            <AppBar
              position="static"
              color="transparent"
              elevation={0}
              sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
              <Toolbar>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <ChecklistIcon color="secondary" fontSize="large" sx={{ mt: 1}} />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h5">簽核系統</Typography>
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
                      <IconButton onClick={handleRefresh}>
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
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>確認簽核</DialogTitle>
              <DialogContent>
                <DialogContentText>以下文件將被簽核通過：</DialogContentText>
                <DialogContentText>
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
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    handleClose();
                  }}
                >
                  取消
                </Button>

                <Button
                  onClick={() => {
                    handleSubmit();
                    setOpen(false);
                  }}
                >
                  確認
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Paper>
      )}

      {tabIndex === 1 && (
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden" }}>
          <Typography>History</Typography>
        </Paper>
      )}
    </>
  );
}
