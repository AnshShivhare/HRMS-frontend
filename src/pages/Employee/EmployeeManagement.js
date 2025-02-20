import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import {apiRequest} from "../../config/service";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesRes = await apiRequest("GET", "employees");
        console.log(employeesRes?.result)
        setEmployees(employeesRes?.result);
      } catch (error) {
        console.error("Error fetching employees", error);
      }
    };
    fetchData();
  }, []);

  const handleRemoveEmployee = async (id) => {
    try {
      await apiRequest("DELETE", "removeEmployee",{id});
      setEmployees(employees.filter(emp => emp._id !== id));
    } catch (error) {
      console.error("Error removing employee", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employee Management
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees?.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  <Button variant="contained" color="error" onClick={() => handleRemoveEmployee(employee._id)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EmployeeManagement;
