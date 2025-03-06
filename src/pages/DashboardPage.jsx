import React from "react";
import { Box, Grid, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

function DashboardPage() {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Metric Cards Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#e3f2fd" }}>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">1,250</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#e8f5e9" }}>
            <CardContent>
              <Typography variant="h6">New Sign-ups</Typography>
              <Typography variant="h4">75</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#fff3e0" }}>
            <CardContent>
              <Typography variant="h6">Active Users</Typography>
              <Typography variant="h4">980</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#ffebee" }}>
            <CardContent>
              <Typography variant="h6">Monthly Revenue</Typography>
              <Typography variant="h4">$15,300</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart Section Placeholder */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Monthly Performance
        </Typography>
        <Box 
          sx={{ 
            height: 250, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            bgcolor: "#f5f5f5", 
            borderRadius: 2 
          }}
        >
          <Typography variant="subtitle1">[Chart Placeholder]</Typography>
        </Box>
      </Box>

      {/* Recent Transactions Table */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recent Transactions
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Transaction</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>10/21/2024</TableCell>
                <TableCell>John Doe</TableCell>
                <TableCell>Subscription Renewal</TableCell>
                <TableCell>$20.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>10/20/2024</TableCell>
                <TableCell>Jane Smith</TableCell>
                <TableCell>Product Purchase</TableCell>
                <TableCell>$45.00</TableCell>
              </TableRow>
              {/* Additional rows can be mapped here */}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default DashboardPage;
