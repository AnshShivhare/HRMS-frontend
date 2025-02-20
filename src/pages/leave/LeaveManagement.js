import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
} from "@mui/material";
import { apiRequest } from "../../config/service";
import { useAuth } from "../../context/AuthContext";

const LeaveManagement = () => {
    const { user } = useAuth();
    
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newLeave, setNewLeave] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await apiRequest("GET", "leaves", {}, user.role);
  
      // Set leave requests based on user role
      const filteredLeaves =
        user.role === "HR"
          ? response?.result?.leaves // Set full leave data for HR
          : response?.result?.leaves?.filter((leave) => leave.employeeId === user._id); // Filter for employees
  
      setLeaveRequests(filteredLeaves);
    } catch (error) {
      console.error("Error fetching leave requests", error);
    }
  };
  

  const handleApplyLeave = async () => {
    try {
      await apiRequest("POST", "apply",{}, newLeave);
      fetchLeaveRequests();
      setNewLeave({ startDate: "", endDate: "" });
    } catch (error) {
      console.error("Error applying for leave", error);
    }
  };

  const handleUpdateLeaveStatus = async (id, status) => {
    try {
      await apiRequest("PATCH", "update",{id} ,{ status });
      fetchLeaveRequests();
    } catch (error) {
      console.error(`Error updating leave status to ${status}`, error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Leave Management
      </Typography>

      {/* Show leave form only for Employees */}
      {user.role === "Employee" && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6">Apply for Leave</Typography>
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
            value={newLeave.startDate}
            onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
            value={newLeave.endDate}
            onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
          />
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleApplyLeave}
          disabled={!newLeave.startDate || !newLeave.endDate}>
            Apply Leave
          </Button>
        </Paper>
      )}

      {/* Leave Requests Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              {user.role === "HR" && <TableCell>Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveRequests?.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{leave.employeeName}</TableCell>
                <TableCell>{leave.startDate}</TableCell>
                <TableCell>{leave.endDate}</TableCell>
                <TableCell>{leave.status}</TableCell>
                {/* Show action buttons only for HR */}
                {user.role === "HR" && (
                  <TableCell>
                    {leave.status === "Pending" && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          sx={{ mr: 1 }}
                          onClick={() => handleUpdateLeaveStatus(leave._id, "Approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleUpdateLeaveStatus(leave._id, "Rejected")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LeaveManagement;
