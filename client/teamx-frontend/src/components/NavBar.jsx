// components/NavBar.jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function NavBar() {
  const { isLogin, logout, username, unreadRequests, unreadMessages } = useContext(AppContext);

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">
          {isLogin ? (
            <Link to="/" className="hover:text-blue-400 transition">
              Hi {username}, from TeamX
            </Link>
          ) : (
            "TeamX"
          )}
        </div>

        <div className="space-x-6 flex items-center">
          {isLogin ? (
            <>
              <Link to="/" className="hover:text-blue-400 transition">Home</Link>
              <Link to="/post" className="hover:text-blue-400 transition">Post Team</Link>
              <Link to="/your-posts" className="hover:text-blue-400 transition">Your Posts</Link>

              <Link to="/chat" className="relative hover:text-blue-400 transition">
                Chat
                {unreadMessages > 0 && (
                  <span className="absolute -top-2 -right-3 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </Link>

              <Link to="/requests" className="relative hover:text-blue-400 transition">
                Requests
                {unreadRequests > 0 && (
                  <span className="absolute -top-2 -right-3 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadRequests}
                  </span>
                )}
              </Link>

              {/* ✅ New Sent Requests Page link */}
              <Link to="/sent-requests" className="hover:text-blue-400 transition">
                Sent Requests
              </Link>

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
    </nav>
  );
}
