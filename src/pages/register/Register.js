import React, { useState } from "react";
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { apiRequest } from "../../config/service";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee"); // Default role is Employee
  const navigate = useNavigate();

  const handleRegister = async () => {
    const response = await apiRequest("POST", "register", {}, { name, email, password, role });
    if (response?.result) {
      alert("Registration successful!");
      navigate("/login");
    } else {
      alert(response?.error || "Registration failed");
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
      <Typography variant="h4">Register</Typography>
      <TextField label="Name" variant="outlined" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Email" variant="outlined" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Role</InputLabel>
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          <MenuItem value="Employee">Employee</MenuItem>
          <MenuItem value="HR">HR</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>Register</Button>
    </Box>
  );
};

export default Register;
