import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Avatar,
  Grid,
  IconButton,
  Link,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const lightColor = "rgba(255, 255, 255, 0.7)";

//tabs
const tabMap = {
  Profile: ["Welcome", "Account"],
  "LabBook": ["Assignment", "History"],
  "LabBook Approval": ["Approval", "History"],
  Links: ["Website"],
  Settings: ["Settings"],
  Users: ["Users"],
};

function Header(props) {
  const { onDrawerToggle, activeItem, onTabChange, tabIndex } = props;

  const currentTabs = tabMap[activeItem] || tabMap["Profile"];
  const [openDialog, setOpenDialog] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [rotation, setRotation] = React.useState(0); // 旋轉角度的初始值為0

  // click counter
  const handleIconClick = () => {
    setClickCount((prevCount) => prevCount + 1);
    if (clickCount >= 9) {
      setOpenDialog(true);
    }
    setRotation((prevRotation) => prevRotation + 12); // 每次點擊增加12度
  };

  // popup
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setClickCount(0);
    setRotation(0);
  };

  return (
    <React.Fragment>
      <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ zIndex: 0, bgcolor: "#171717" }}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1} marginTop={0.5}>
            <Grid sx={{ display: { sm: "none", xs: "block" } }} item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs>
              <Typography color="#ffffff" variant="h5" component="h1">
                {activeItem || "Profile"}
              </Typography>
            </Grid>
            <Grid item>
              <Link
                href="https://github.com/JRay9487/Electrical-laboratory-Notebook/blob/main/README.md"
                variant="body2"
                sx={{
                  textDecoration: "none",
                  color: lightColor,
                  "&:hover": {
                    color: "common.white",
                  },
                }}
                rel="noopener noreferrer"
                target="_blank"
              >
                Go to docs
              </Link>
            </Grid>

            <Grid item>
              <IconButton
                color="inherit"
                onClick={handleIconClick}
                sx={{ p: 0.5 }}
              >
                <Avatar
                  src="flask.webp"
                  alt="Web Avatar"
                  sx={{ transform: `rotate(${rotation}deg)` }}
                />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      {/* sec-nav */}
      <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ zIndex: 0, bgcolor: "#171717" }}
      >
        <Tabs value={tabIndex} textColor="inherit">
          {currentTabs.map((label, index) => (
            <Tab
              key={index}
              label={label}
              onClick={() => {
                onTabChange(index);
              }}
              sx={{
                color: "#ffffff",
                "&:hover": {
                  bgcolor: "transparent",
                  color: "#ffffff",
                },
              }}
            />
          ))}
        </Tabs>
      </AppBar>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{"恭喜你把實驗室炸了!"}</DialogTitle>
        <DialogContent>
          <DialogContentText>老師在你背後,現在很火</DialogContentText>
          <DialogContentText sx={{ fontSize: 14 }}>
            就說別亂玩化學品吧
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            好的
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
  activeItem: PropTypes.oneOfType([PropTypes.string]),
};

export default Header;
