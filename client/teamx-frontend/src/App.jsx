// App.jsx
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import PostTeam from './pages/PostTeam';

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/post" element={<PrivateRoute><PostTeam /></PrivateRoute>} />
      </Routes>
    </>
  );
}
