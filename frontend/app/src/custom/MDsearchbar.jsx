

import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const MDSearchBar = ({
  value,
  onChange,
  placeholder = 'Search...',
  width = '300px',
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        background: '#000000ff',
        borderRadius: '12px',
        p: 0.8,
        boxShadow: '0px 2px 6px rgba(0,0,0,0.15)',
        ...sx,
      }}
    >
      <TextField
        fullWidth
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant="standard"
        InputProps={{
          disableUnderline: true, // ✅ removes underline
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#ffffffff' }} /> {/* ✅ icon color */}
            </InputAdornment>
          ),
        }}
        sx={{
          width,
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '10px',
          '& .MuiInputBase-input': {
            padding: '8px 10px',
            fontSize: '15px',
            color: '#ffffffff', // ✅ text color
            '&::placeholder': {
              color: '#ffffffff', // ✅ placeholder color
              opacity: 0.8,
            },
          },
          '& .MuiInputBase-root': {
            border: 'none',
          },
        }}
      />
    </Box>
  );
};

export default MDSearchBar;
