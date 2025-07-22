// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppContextProvider } from './context/AppContext';
import { BrowserRouter } from 'react-router-dom';
<<<<<<< HEAD
=======
import './index.css'; 
>>>>>>> 6675f71 (Add team posting logic and update backend problem controller)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
