// context/AppContext.jsx
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';



export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUserName] = useState("");

  axios.defaults.withCredentials = true;

  const checkLogin = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/auth/verify`);
      if (res.data.success) {
        setIsLogin(true);
        console.log(res.data.user);
        setUserData(res.data.user);
        setUserName(res.data.user.name);
      } else {
        setIsLogin(false);
      }
    } catch {
      setIsLogin(false);
    } finally {
      setLoading(false);
    }
  };

  

const logout = async () => {
  try {
    await axios.get(`${backendURL}/api/auth/logout`);
    setIsLogin(false);
    setUserData(null);
    setUserName("");   // ✅ reset username
    toast.success('Logged out');
  } catch {
    toast.error('Logout failed');
  }
};
  useEffect(() => {
    checkLogin();
  }, []);
const value = {
  isLogin, userData, setIsLogin, setUserData,
  logout, checkLogin, backendURL, loading, username,setUserName
}

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
