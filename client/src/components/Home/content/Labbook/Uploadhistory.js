import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Link,
} from "@mui/material";

export default function Filelist({ items }) {
  if (items.length === 0) {
    return (
      <Typography variant="h5" fontWeight="bold" margin={2} textAlign="center">
        無上傳歷史紀錄
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="upload history">
        <TableHead>
          <TableRow>
            <TableCell>Filename</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Checked</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.googleId}>
              <TableCell>
                <Link
                  href={`https://drive.google.com/file/d/${item.googleId}/view?usp=drive_link`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.filename}
                </Link>
              </TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.check} </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
