// pages/Login.jsx
import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsLogin, setUserData, backendURL } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendURL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsLogin(true);
        setUserData(res.data.user);
        toast.success('Login successful');
        navigate('/');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login error');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email" value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email" required
      />
      <input
        type="password" value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password" required
      />
      <button type="submit">Login</button>
    </form>
  );
}
