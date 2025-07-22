// components/PrivateRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function PrivateRoute({ children }) {
  const { isLogin, loading } = useContext(AppContext);



 if (loading) return <p>Loading...</p>;
 console.log("PrivateRoute check: loading =", loading, "isLogin =", isLogin);
return isLogin ? children : <Navigate to="/login" />;



}
