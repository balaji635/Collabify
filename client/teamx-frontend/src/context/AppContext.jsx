
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUserName] = useState("");
  const [socket, setSocket] = useState(null);

 
  const [unreadRequests, setUnreadRequests] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  axios.defaults.withCredentials = true;

  const checkLogin = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/auth/verify`);
      if (res.data.success) {
        setIsLogin(true);
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
      setUserName("");
      toast.success('Logged out');
    } catch {
      toast.error('Logout failed');
    }
  };

  // Socket.io setup
  useEffect(() => {
    if (userData?._id) {
      const s = io(backendURL);
      s.emit('join', userData._id);

      s.on('newRequest', () => setUnreadRequests(prev => prev + 1));
      s.on('newMessage', () => setUnreadMessages(prev => prev + 1));

      setSocket(s);

      return () => s.disconnect();
    }
  }, [userData]);

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLogin,
        userData,
        setIsLogin,
        setUserData,
        logout,
        checkLogin,
        backendURL,
        loading,
        username,
        setUserName,
        socket,
        unreadRequests,
        setUnreadRequests,
        unreadMessages,
        setUnreadMessages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
