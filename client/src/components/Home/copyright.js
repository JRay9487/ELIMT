import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function Copyright() {

    return (
        <Typography variant="body2" align="center">
            {"Copyright © "}
            <Link color="inherit" href="https://github.com/JRay9487">
                CHUN-JUI, LIN
            </Link>{" "}
            {new Date().getFullYear()}. All Rights Reserved.
        </Typography>
    );
}