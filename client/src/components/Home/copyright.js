import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="https://github.com/JRay9487">
                CHUN-JUI, LIN
            </Link>{" "}
            {new Date().getFullYear()}.
        </Typography>
    );
}

export default Copyright;
