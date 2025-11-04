import React from 'react';
import { Button } from '@mui/material';

// ✅ Reusable MDButton Component
const MDButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'contained',
  disabled = false,
  sx = {},
  ...props
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      disabled={disabled}
      onClick={onClick}
      sx={{
                  background: 'linear-gradient(45deg, #fda4af 0%, #f9a8d4 100%)',
       // background: 'linear-gradient(45deg, #fecaca 0%, #fbcfe8 100%)',
             // background: 'rgba(255, 255, 255, 0.9)',
        color: '#111',
        fontWeight: 'bold',
        textTransform: 'none',
        borderRadius: '12px',
        boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
        px: 3,
        py: 1,
        '&:hover': {
          background: 'linear-gradient(45deg, #fda4af 0%, #f9a8d4 100%)',
          boxShadow: '0px 4px 8px rgba(0,0,0,0.25)',
        },
        ...sx, // ✅ allows custom styling from outside
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default MDButton;
