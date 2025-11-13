import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const MDDataGrid = ({
  rows,
  columns,
  pageSize = 5,
  minHeight =500,
  loading = false,
  disableTopRadius = false, // 👈 new prop added
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: disableTopRadius ? "0 0 20px 20px" : "20px", // 👈 remove top radius if needed
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow: `
          0 10px 40px -10px rgba(0, 0, 0, 0.2),
          inset 1px 1px 0 0 rgba(255, 255, 255, 0.5)
        `,
        overflow: "hidden",
        "& .MuiDataGrid-root": {
          backgroundColor: "transparent",
          border: "none",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        disableSelectionOnClick
        loading={loading}
        sx={{
          height: `${minHeight}px`,

          // === HEADER STYLE ===
          "& .MuiDataGrid-columnHeaders": {
           // background:
           //   "linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
           background:"transparent",
            color: "#000",
            fontWeight: 600,
            fontSize: "0.95rem",
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(10px)",
          },

          // === ROW STYLE ===
          "& .MuiDataGrid-row": {
            transition: "all 0.25s ease-in-out",
            backgroundColor: "rgba(255,255,255,0.7)",
            "&:nth-of-type(even)": {
              backgroundColor: "rgba(245,245,245,0.7)",
            },
            "&:hover": {
              background:
                "linear-gradient(to right, rgba(255,255,255,0.9), rgba(240,240,240,0.8))",
              transform: "scale(1.01)",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            },
          },

          // === CELL STYLE ===
          "& .MuiDataGrid-cell": {
            color: "#000",
            fontSize: "0.9rem",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          },

          // === PAGINATION & FOOTER ===
          "& .MuiDataGrid-footerContainer": {
            background: "rgba(255,255,255,0.7)",
            color: "#000",
            borderTop: "1px solid rgba(0,0,0,0.1)",
          },

          // === SCROLLBAR STYLE ===
          "& .MuiDataGrid-virtualScroller": {
            "&::-webkit-scrollbar": { width: "8px", height: "8px" },
            "&::-webkit-scrollbar-track": {
              background: "rgba(0,0,0,0.05)",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(0,0,0,0.2)",
              borderRadius: "4px",
              "&:hover": { background: "rgba(0,0,0,0.4)" },
            },
          },

          // === SELECTED ROW EFFECT ===
          "& .MuiDataGrid-row.Mui-selected": {
            background:
              "linear-gradient(to right, rgba(230,230,230,0.9), rgba(255,255,255,0.8)) !important",
          },
        }}
      />
    </Box>
  );
};

export default MDDataGrid;
