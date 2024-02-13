import React from "react";
import { Typography } from "@mui/material";

export default function Profile({ userInfo, tabIndex }) {
  const fullname = userInfo ? userInfo.fullname : "Unknown";

  return (
    <>
      {tabIndex === 0 && (
        <Typography variant="h5" fontWeight="bold" sx={{mx:6, my:4}}>
          你好, {fullname}
        </Typography>
      )}
      {tabIndex === 1 && (
        <Typography variant="h5" fontWeight="bold" margin={2}>
          account
        </Typography>
      )}
    </>
  );
};
