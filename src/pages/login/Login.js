import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { apiRequest } from "../../config/service.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";  // Import the auth context

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();  // Destructure the login function from context

  const handleLogin = async () => {
    const response = await apiRequest("POST", "login", {}, { email, password });
    if (response?.result?.token) {
        login(response.result,response.result.token); 
        navigate("/dashboard");
    } else {
      alert(response?.error || "Login failed");
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
      <Typography variant="h4">Login</Typography>
      <TextField label="Email" variant="outlined" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>Login</Button>
    </Box>
  );
};
export default Login;