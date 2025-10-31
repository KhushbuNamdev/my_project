// // src/pages/Statistics.jsx
// import React from 'react';
// import { Box, Typography } from '@mui/material';
// import MDDataGrid from '../../custom/MDdatagrid';

// const Wolesalerview = () => {
//   // Empty columns and rows for now
//   const columns = [];
//   const rows = [];

//   return (
//     <Box>
//       <Typography
//         variant="h5"
//         fontWeight="bold"
//         mb={3}
//         color="error.main"
//         textAlign="center"
//       >
//         Product View
//       </Typography>

//       {/* Empty MDDataGrid */}
//       <MDDataGrid rows={rows} columns={columns} height={300} />
//     </Box>
//   );
// };

// export default Wolesalerview;


import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, selectAllUsers, selectUserStatus } from '../../Slice/userSlice';

const WholesalerView = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const status = useSelector(selectUserStatus);

  // Filter users to only show wholesalers
  const wholesalers = users.filter(user => user.role === 'wholesaler');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div>Loading wholesalers...</div>;
  }

  if (status === 'failed') {
    return <div>Error loading wholesalers. Please try again later.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Wholesalers</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Company</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {wholesalers.length > 0 ? (
              wholesalers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{user.name || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.phone || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{user.company || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No wholesalers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WholesalerView;