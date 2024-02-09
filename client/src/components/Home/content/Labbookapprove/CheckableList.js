import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Typography,
} from "@mui/material";

function CheckableList({ items, checked, onToggle }) {
    // 無待簽核狀態
    if (items.length === 0) {
        return (
            <Typography
                variant="h5"
                fontWeight="bold"
                margin={2}
                textAlign={"center"}
            >
                目前無檔案待簽核
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="checkable table">
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell>Creater</TableCell>
                        <TableCell>Filename</TableCell>
                        <TableCell>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item) => (
                        <TableRow
                            key={item.googleId}
                            hover
                            role="checkbox"
                            aria-checked={checked.indexOf(item.googleId) !== -1}
                            tabIndex={-1}
                            selected={checked.indexOf(item.googleId) !== -1}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={
                                        checked.indexOf(item.googleId) !== -1
                                    }
                                    onChange={onToggle(item.googleId)}
                                />
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {item.creater}
                            </TableCell>
                            <TableCell>
                                <a
                                    href={`https://drive.google.com/file/d/${item.googleId}/view?usp=drive_link`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.filename}
                                </a>
                            </TableCell>
                            <TableCell>{item.date}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CheckableList;
