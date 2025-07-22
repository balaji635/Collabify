<<<<<<< HEAD
// pages/Login.jsx
=======
>>>>>>> 6675f71 (Add team posting logic and update backend problem controller)
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
<<<<<<< HEAD
      const res = await axios.post(`${backendURL}/api/auth/login`,
=======
      const res = await axios.post(
        `${backendURL}/api/auth/login`,
>>>>>>> 6675f71 (Add team posting logic and update backend problem controller)
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
<<<<<<< HEAD
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
=======
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
>>>>>>> 6675f71 (Add team posting logic and update backend problem controller)
  );
}
