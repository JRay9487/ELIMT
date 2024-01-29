import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';

function Labbook() {
  const [experimentName, setExperimentName] = useState('');
  const [experimentDetail, setExperimentDetail] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 在這裡處理表單提交的邏輯
    console.log(experimentName, experimentDetail, selectedFile);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6">實驗表單</Typography>
      <TextField
        label="實驗名稱"
        value={experimentName}
        onChange={(e) => setExperimentName(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        label="實驗內容"
        value={experimentDetail}
        onChange={(e) => setExperimentDetail(e.target.value)}
        margin="normal"
        fullWidth
        multiline
      />
      <input
        type="file"
        onChange={handleFileChange}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ marginTop: 20 }}
      >
        提交
      </Button>
    </Box>
  );
};

export default Labbook;