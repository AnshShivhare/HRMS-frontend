import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Login from "./pages/login/Login.js";
import Register from "./pages/register/Register.js";
import Dashboard from "./pages/dashboard/Dashboard.js";
import Attendance from "./pages/attendance/Attendance.js";
import LeaveManagement from "./pages/leave/LeaveManagement.js";
import Payroll from "./pages/payroll/Payroll.js";
import { AuthProvider, useAuth } from "./context/AuthContext";
import EmployeeManagement from "./pages/Employee/EmployeeManagement.js";

const theme = createTheme();

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Ensure loading state is managed

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner
  }

  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Container maxWidth="lg">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
              <Route path="/leave-management" element={<PrivateRoute><LeaveManagement /></PrivateRoute>} />
              <Route path="/employee-management" element={<PrivateRoute><EmployeeManagement /></PrivateRoute>} />
              <Route path="/payroll" element={<PrivateRoute><Payroll /></PrivateRoute>} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </Container>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
