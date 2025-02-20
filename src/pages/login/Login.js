import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { apiRequest } from "../../config/service.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";  

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();  

  const handleLogin = async () => {
    const response = await apiRequest("POST", "login", {}, { email, password });
    if (response?.result?.token) {
      login(response.result, response.result.token); 
      navigate("/dashboard");
    } else {
      alert(response?.error || "Login failed");
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5} width="300px" mx="auto">
      <Typography variant="h4">Login</Typography>
      <TextField label="Email" variant="outlined" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" color="primary" fullWidth onClick={handleLogin} sx={{ mt: 2 }}>
        Login
      </Button>
      <Button variant="outlined" color="secondary" fullWidth onClick={() => navigate("/register")} sx={{ mt: 2 }}>
        Register
      </Button>
    </Box>
  );
};

export default Login;
