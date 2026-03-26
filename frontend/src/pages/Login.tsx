// pages/Login.tsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleLogin = async () => {
        setError("");
        try {
            const res = await axiosInstance.post("/auth/login", {
                username, 
                password,
            });

            login(res.data.access_token);
            navigate("/room");
        } catch (err: any) {
            if (err.response && err.response.status === 401) {
                setError("Identifiants incorrects");
            } else {
                setError("Erreur serveur");
            }
        }
    };

    return (
        <div>
            <h1>Connexion</h1>
            <input 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Se connecter</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Login;