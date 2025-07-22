// components/NavBar.jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function NavBar() {
  const { isLogin, logout } = useContext(AppContext);
<<<<<<< HEAD
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
=======

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/" className="hover:text-blue-400 transition">TeamX</Link>
        </div>

        <div className="space-x-4">
          {isLogin ? (
            <>
              <Link to="/" className="hover:text-blue-400 transition">Home</Link>
              <Link to="/post" className="hover:text-blue-400 transition">Post Team</Link>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
>>>>>>> 6675f71 (Add team posting logic and update backend problem controller)
    </nav>
  );
}
