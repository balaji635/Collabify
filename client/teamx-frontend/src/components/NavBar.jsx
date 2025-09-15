
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function NavBar() {
  const { isLogin, logout, unreadRequests, unreadMessages } =
    useContext(AppContext);

  const navLinkClasses = ({ isActive }) =>
    `relative transition duration-300 group ${
      isActive ? "text-cyan-400" : "text-gray-300 hover:text-cyan-400"
    }`;

  const underlineClasses = (isActive) =>
    `absolute left-0 -bottom-1 h-0.5 transition-all duration-300 bg-gradient-to-r from-cyan-400 to-indigo-400 ${
      isActive ? "w-full" : "w-0 group-hover:w-full"
    }`;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-b border-cyan-500/30 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
      
          <div className="flex items-center">
            <div className="relative mr-2">
              <div className="absolute inset-0 bg-cyan-400/30 rounded-md blur-sm"></div>
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 border border-indigo-400/30 flex items-center justify-center relative shadow-lg shadow-indigo-800/20">
                <div className="absolute inset-[3px] bg-gray-900 rounded-[4px] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20"></div>
                  <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                    Tx
                  </span>
                </div>
              </div>
            </div>
            <span className="text-xl font-medium bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Collabify
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {isLogin ? (
              <>
                <NavLink to="/" className={navLinkClasses}>
                  {({ isActive }) => (
                    <>
                      <span className="text-xl font-medium bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                        Home
                      </span>
                      <span className={underlineClasses(isActive)}></span>
                    </>
                  )}
                </NavLink>

                <NavLink to="/post" className={navLinkClasses}>
                  {({ isActive }) => (
                    <>
                      <span className="text-xl font-medium bg-gradient-to-r from-yellow-400 via-orange-300 to-red-400 bg-clip-text text-transparent">
                        Post Team
                      </span>
                      <span className={underlineClasses(isActive)}></span>
                    </>
                  )}
                </NavLink>

                <NavLink to="/your-posts" className={navLinkClasses}>
                  {({ isActive }) => (
                    <>
                      <span className="text-xl font-medium bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                        Your Posts
                      </span>
                      <span className={underlineClasses(isActive)}></span>
                    </>
                  )}
                </NavLink>

                <NavLink to="/chat" className={navLinkClasses}>
                  {({ isActive }) => (
                    <>
                      <span className="text-xl font-medium bg-gradient-to-r from-indigo-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                        Chat
                      </span>
                      {unreadMessages > 0 && (
                        <span className="absolute -top-2 -right-3 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadMessages}
                        </span>
                      )}
                      <span className={underlineClasses(isActive)}></span>
                    </>
                  )}
                </NavLink>

                <NavLink to="/requests" className={navLinkClasses}>
                  {({ isActive }) => (
                    <>
                      <span className="text-xl font-medium bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                        Requests
                      </span>
                      {unreadRequests > 0 && (
                        <span className="absolute -top-2 -right-3 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadRequests}
                        </span>
                      )}
                      <span className={underlineClasses(isActive)}></span>
                    </>
                  )}
                </NavLink>

                <NavLink to="/sent-requests" className={navLinkClasses}>
                  {({ isActive }) => (
                    <>
                      <span className="text-xl font-medium bg-gradient-to-r from-pink-300 via-rose-200 to-yellow-200 bg-clip-text text-transparent">
                        Sent Requests
                      </span>
                      <span className={underlineClasses(isActive)}></span>
                    </>
                  )}
                </NavLink>

           
                <div className="ml-4">
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-sm font-medium text-white shadow-lg shadow-blue-900/40 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <NavLink
                to="/login"
                className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-sm font-medium text-white shadow-lg shadow-blue-900/40 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </nav>

  
      <div className="h-16"></div>
    </>
  );
}
