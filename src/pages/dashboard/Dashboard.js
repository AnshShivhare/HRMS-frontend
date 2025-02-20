import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, Card, CardContent, Button, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../config/service";

const Dashboard = () => {
  const { user, logout } = useAuth(); // Added logout function from AuthContext
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalEmployees: 0, pendingLeaves: 0, monthlyPayroll: 0, attendance: [] });
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesRes = await apiRequest("GET", "getEmployeeCount");
        setStats({
          totalEmployees: employeesRes.result.totalEmployees,
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchData();
  }, []);

  const handleCheckIn = async () => {
    if (!checkedIn) {
      const response = await apiRequest("POST", "checkIn");
      if (response?.result) {
        const time = new Date().toLocaleTimeString();
        setCheckedIn(true);
        setCheckInTime(time);
        alert("Checked in successfully at " + time);
      }else{
        alert(response.error)
      }
    }
  };

  const handleCheckOut = async () => {
    if (checkedIn && !checkedOut) {
      const response = await apiRequest("POST", "checkOut");
      if (response?.result) {
        const time = new Date().toLocaleTimeString();
        setCheckedOut(true);
        setCheckOutTime(time);
        alert("Checked out successfully at " + time);
      }else{
        alert(response.error)
      }
    }
  };

  const handleLogout = () => {
    logout(); // Clear authentication
    navigate("/login"); // Redirect to login page
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
        <List>
          {user.role === "HR" && (
            <>
              <ListItem style={{cursor:"pointer"}} button onClick={() => navigate("/employee-management")}>
                <ListItemText primary="Manage Employees" />
              </ListItem>
              <ListItem style={{cursor:"pointer"}} button onClick={() => navigate("/payroll")}>
                <ListItemText primary="Payroll Processing" />
              </ListItem>
            </>
          )}
          <ListItem style={{cursor:"pointer"}} button onClick={() => navigate("/leave-management")}>
            <ListItemText primary="Leave Management" />
          </ListItem>

          {user.role === "Employee" && (
            <>
              <ListItem style={{cursor:"pointer"}} button onClick={handleCheckIn} disabled={checkedIn}>
                <ListItemText primary="Check In" />
              </ListItem>
              {checkInTime && (
                <Typography variant="body2" sx={{ ml: 2, color: "green" }}>
                  Checked in at: {checkInTime}
                </Typography>
              )}
              <ListItem style={{cursor:"pointer"}} button onClick={handleCheckOut} disabled={!checkedIn || checkedOut}>
                <ListItemText primary="Check Out" />
              </ListItem>
              {checkOutTime && (
                <Typography variant="body2" sx={{ ml: 2, color: "red" }}>
                  Checked out at: {checkOutTime}
                </Typography>
              )}
            </>
          )}
          {/* Logout Button */}
          <ListItem style={{cursor:"pointer",background:"red", color:"white"}} button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        <Grid container spacing={3}>
          {user.role === "HR" && (
            <Grid item xs={12} md={4}>
              <Card sx={{ backgroundColor: "#E3F2FD" }}>
                <CardContent>
                  <Typography variant="h6">Total Employees</Typography>
                  <Typography variant="h4">{stats.totalEmployees}</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
