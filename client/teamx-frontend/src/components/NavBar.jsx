// components/NavBar.jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function NavBar() {
  const { isLogin, logout } = useContext(AppContext);
  return (
    <nav>
      {isLogin ? (
        <>
          <Link to="/">Home</Link> | <Link to="/post">Post Team</Link> | 
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
