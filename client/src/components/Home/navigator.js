import * as React from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PeopleIcon from "@mui/icons-material/People";
import PublicIcon from "@mui/icons-material/Public";
import SettingsIcon from "@mui/icons-material/Settings";

//側邊欄項目
const categories = [
    {
        id: "Functions",
        children: [
            {
                id: "Profile",
                icon: <PeopleIcon />,
            },
            {
                id: "Lab Book",
                icon: <PeopleIcon />,
            },
            {
                id: "Lab Book Approval",
                icon: <PeopleIcon />,
            },
            { id: "Links", icon: <PublicIcon /> },
        ],
    },
    {
        id: "System",
        children: [{ id: "Account", icon: <SettingsIcon /> }],
    },
];

//側邊欄項目大小
const item = {
    py: "2px",
    px: 3,
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover, &:focus": {
        bgcolor: "rgba(255, 255, 255, 0.08)",
    },
};

//側邊欄項目分類大小
const itemCategory = {
    boxShadow: "0 -1px 0 rgb(255,255,255,0.1) inset",
    py: 1.5,
    px: 3,
};

//畫面輸出
export default function Navigator(props) {
    const { ...other } = props;

    //側邊欄點擊
    const [activeItem, setActiveItem] = React.useState("null");

    const handleItemClick = (id) => {
        setActiveItem(id);
    };

    return (
        <Drawer variant="permanent" {...other}>
            <List disablePadding>
                <ListItem
                    sx={{
                        ...item,
                        ...itemCategory,
                        fontSize: 22,
                        color: "#fff",
                    }}
                >
                    YLK LAB
                </ListItem>
                {categories.map(({ id, children }) => (
                    <Box key={id} sx={{ bgcolor: "#101F34" }}>
                        <ListItem sx={{ py: 2, px: 3 }}>
                            <ListItemText sx={{ color: "#fff" }}>
                                {id}
                            </ListItemText>
                        </ListItem>
                        {children.map(({ id: childId, icon, active }) => (
                            <ListItem disablePadding key={childId}>
                                <ListItemButton
                                    selected={activeItem === childId}
                                    onClick={() => handleItemClick(childId)}
                                    sx={item}
                                >
                                    <ListItemIcon>{icon}</ListItemIcon>
                                    <ListItemText>{childId}</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <Divider sx={{ mt: 2 }} />
                    </Box>
                ))}
            </List>
        </Drawer>
    );
}
