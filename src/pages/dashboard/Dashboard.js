import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, Card, CardContent, Button, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../config/service";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalEmployees: 0, pendingLeaves: 0, monthlyPayroll: 0, attendance: [] });
  const [salary, setSalary] = useState(0);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesRes = await apiRequest("GET","getEmployeeCount");
        // const leavesRes = await apiRequest("/api/leaves/pending");
        // const payrollRes = await axios.get("/api/payroll/monthly");
        // const attendanceRes = await axios.get(`/api/attendance/${user.id}`);
        // const salaryRes = await axios.get(`/api/payroll/salary/${user.id}`);

        setStats({
          totalEmployees: employeesRes.result.totalEmployees,
        //   pendingLeaves: leavesRes.data.count,
        //   monthlyPayroll: payrollRes.data.total,
        //   attendance: attendanceRes.data,
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
      }
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
        <List>
          {user.role === "HR" && (
            <>
              <ListItem button onClick={() => navigate("/employee-management")}>
                <ListItemText primary="Manage Employees" />
              </ListItem>
              <ListItem button onClick={() => navigate("/payroll")}>
                <ListItemText primary="Payroll Processing" />
              </ListItem>
            </>
          )}
          
           <>
  <ListItem button onClick={() => navigate("/leave-management")}>
    <ListItemText primary="Leave Management" />
  </ListItem>
  
  {user.role === "Employee" && (
    <>
      <ListItem button onClick={handleCheckIn} disabled={checkedIn}>
        <ListItemText primary="Check In" />
      </ListItem>
      {checkInTime && (
        <Typography variant="body2" sx={{ ml: 2, color: "green" }}>
          Checked in at: {checkInTime}
        </Typography>
      )}
      <ListItem button onClick={handleCheckOut} disabled={!checkedIn || checkedOut}>
        <ListItemText primary="Check Out" />
      </ListItem>
      {checkOutTime && (
        <Typography variant="body2" sx={{ ml: 2, color: "red" }}>
          Checked out at: {checkOutTime}
        </Typography>
      )}
    </>
  )}
    </>
        </List>
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        <Grid container spacing={3}>
          {user.role === "HR" && (
            <>
              <Grid item xs={12} md={4}>
                <Card sx={{ backgroundColor: "#E3F2FD" }}>
                  <CardContent>
                    <Typography variant="h6">Total Employees</Typography>
                    <Typography variant="h4">{stats.totalEmployees}</Typography>
                  </CardContent>
                </Card>
              </Grid>
             
            </>
          )}
          {user.role === "Employee" && (
            <>
              {/* <Grid item xs={12} md={6}>
                <Card sx={{ backgroundColor: "#FFECB3" }}>
                  <CardContent>
                    <Typography variant="h6">Your Attendance</Typography>
                    <Typography variant="h4">{stats.attendance.length} Days</Typography>
                  </CardContent>
                </Card>
              </Grid> */}
              {/* <Grid item xs={12} md={6}>
                <Card sx={{ backgroundColor: "#D1C4E9" }}>
                  <CardContent>
                    <Typography variant="h6">Salary This Month</Typography>
                    <Typography variant="h4">${salary}</Typography>
                  </CardContent>
                </Card>
              </Grid> */}
            </>
          )}
          {/* <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Weekly Attendance Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.attendance}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="present" fill="#4CAF50" />
                  <Bar dataKey="absent" fill="#F44336" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid> */}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
