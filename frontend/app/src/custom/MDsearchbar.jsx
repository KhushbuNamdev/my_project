import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const MDSearchBar = ({
  value,
  onChange,
  placeholder = 'Search...',
  width = '400px',
  height = '40px', // ✅ added height prop
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        border: '2px solid #6e6e6eff',
        borderRadius: '12px',
        boxShadow: '0px 2px 6px rgba(0,0,0,0.15)',
        ...sx,
      }}
    >
      <TextField
        fullWidth
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant="outlined"
        slotProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          style: {
            height: height, // ✅ applied height here
            padding: '0 10px',
          },
        }}
        sx={{
          width,
          backgroundColor: 'transparent',
          border: 'none',
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiInputBase-input': {
            fontSize: '15px',
            color: '#000000ff',
            '&::placeholder': {
              color: '#000000ff',
              opacity: 0.8,
            },
          },
        }}
      />
    </Box>
  );
};

export default MDSearchBar;
