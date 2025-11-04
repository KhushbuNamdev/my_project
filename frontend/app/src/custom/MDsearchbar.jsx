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
                        background: 'linear-gradient(45deg, #fecaca 0%, #fbcfe8 100%)',
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
          disableUnderline: true, // ✅ Removes underline
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#f472b6' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          width,
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '10px',
          '& .MuiInputBase-root': {
            border: 'none',
          },
          '& .MuiInput-underline:before': {
            borderBottom: 'none !important', // ✅ Remove black underline (before focus)
          },
          '& .MuiInput-underline:after': {
            borderBottom: 'none !important', // ✅ Remove black underline (after focus)
          },
          '& .MuiInputBase-input': {
            padding: '8px 10px',
            fontSize: '15px',
          },
        }}
      />
    </Box>
  );
};

export default MDSearchBar;
