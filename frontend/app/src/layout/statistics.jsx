import React from 'react';
import { Box, Typography, Grid, Card, CardContent, LinearProgress, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ShoppingCart, AttachMoney, People, TrendingUp, LocalShipping, Category } from '@mui/icons-material';

// Glassmorphism card style
const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 4px 30px rgba(254, 202, 202, 0.2)',
  padding: theme.spacing(2),
  color: '#4B5563',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(254, 202, 202, 0.3)',
  },
}));

const StatCard = ({ title, value, icon: Icon, color, progress }) => (
  <GlassCard>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            background: `linear-gradient(135deg, ${color}30, ${color}60)`,
            borderRadius: '50%',
            width: 60,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon sx={{ fontSize: 30, color: color }} />
        </Box>
      </Box>
      {progress && (
        <Box mt={2}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 5,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${color}, ${color}90)`,
              },
            }}
          />
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="caption">Progress</Typography>
            <Typography variant="caption" fontWeight="bold">
              {progress}%
            </Typography>
          </Box>
        </Box>
      )}
    </CardContent>
  </GlassCard>
);

const Statistics = () => {
  // Sample data - replace with your actual data
  const stats = [
    { title: 'Total Sales', value: '$24,780', icon: ShoppingCart, color: '#4CAF50', progress: 75 },
    { title: 'Total Revenue', value: '$48,965', icon: AttachMoney, color: '#2196F3', progress: 60 },
    { title: 'New Customers', value: '1,245', icon: People, color: '#9C27B0', progress: 45 },
    { title: 'Growth', value: '+12.5%', icon: TrendingUp, color: '#FF9800', progress: 80 },
  ];

  const recentOrders = [
    { id: 1, product: 'Wireless Earbuds', customer: 'John Doe', amount: '$129.99', status: 'Delivered' },
    { id: 2, product: 'Smart Watch', customer: 'Jane Smith', amount: '$249.99', status: 'Shipped' },
    { id: 3, product: 'Bluetooth Speaker', customer: 'Mike Johnson', amount: '$89.99', status: 'Processing' },
  ];

  return (
    <Box sx={{ 
      p: 3, 
      background: 'linear-gradient(180deg, #fecaca 0%, #fee2e2 50%, #ffffff 100%)',
      minHeight: '100vh',
      backgroundAttachment: 'fixed'
    }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
        color="#4B5563"
        sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
      >
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Recent Orders */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <GlassCard>
            <Typography variant="h6" mb={2} color="#4B5563">Recent Orders</Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '12px', color: '#4B5563', fontWeight: 600 }}>Product</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: '#4B5563', fontWeight: 600 }}>Customer</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#4B5563', fontWeight: 600 }}>Amount</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#4B5563', fontWeight: 600 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <td style={{ padding: '12px', color: '#1F2937' }}>{order.product}</td>
                      <td style={{ padding: '12px', color: '#4B5563' }}>{order.customer}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#1F2937', fontWeight: 500 }}>{order.amount}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <span style={{
                          background: order.status === 'Delivered' ? 'rgba(76, 175, 80, 0.2)' : 
                                    order.status === 'Shipped' ? 'rgba(33, 150, 243, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                          color: order.status === 'Delivered' ? '#4CAF50' : 
                                 order.status === 'Shipped' ? '#2196F3' : '#FF9800',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                        }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </GlassCard>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <GlassCard sx={{ height: '100%' }}>
            <Typography variant="h6" mb={3} color="#4B5563">Quick Stats</Typography>
            <Box>
              <Box display="flex" alignItems="center" mb={3}>
                <Box
                  sx={{
                    background: 'rgba(0, 123, 255, 0.1)',
                    borderRadius: '10px',
                    p: 1.5,
                    mr: 2,
                  }}
                >
                  <LocalShipping sx={{ color: '#2196F3' }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="#6B7280">Orders in Transit</Typography>
                  <Typography variant="h6" color="#1F2937">24</Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" mb={3}>
                <Box
                  sx={{
                    background: 'rgba(40, 167, 69, 0.1)',
                    borderRadius: '10px',
                    p: 1.5,
                    mr: 2,
                  }}
                >
                  <Category sx={{ color: '#28A745' }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="#6B7280">Active Products</Typography>
                  <Typography variant="h6" color="#1F2937">156</Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    background: 'rgba(255, 193, 7, 0.1)',
                    borderRadius: '10px',
                    p: 1.5,
                    mr: 2,
                  }}
                >
                  <People sx={{ color: '#FFC107' }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="#6B7280">New Customers (7d)</Typography>
                  <Typography variant="h6" color="#1F2937">42</Typography>
                </Box>
              </Box>
            </Box>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Statistics;
