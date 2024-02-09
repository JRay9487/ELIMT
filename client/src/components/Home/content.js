import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";

// Contents
import Profile from "./content/Profile";
import Labbook from "./content/Labbook/Labbook";
import LBapprove from "./content/Labbookapprove/LBapprove";
import Links from "./content/Links";
import Users from "./content/Users";
import Settings from "./content/Settings";

export default function Content(props) {
    const { activeItem } = props;

    //get userInfo from local storage
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const userInfoString = localStorage.getItem("user");
        if (userInfoString) {
            const userInfo = JSON.parse(userInfoString);
            setUserInfo(userInfo);
        }
    }, []);

    const renderContentComponent = () => {
        switch (activeItem) {
            case "Profile":
                return <Profile userInfo={userInfo} />;
            case "Lab Book":
                return <Labbook userInfo={userInfo} />;
            case "Lab Book Approval":
                return <LBapprove />;
            case "Links":
                return <Links />;
            case "Settings":
                return <Settings />;
            case "Users":
                return <Users />;
            default:
                return <Profile userInfo={userInfo} />;
        }
    };

    return (
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden" }}>
            {renderContentComponent()}
        </Paper>
    );
}
