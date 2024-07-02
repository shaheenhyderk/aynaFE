import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import LoginPage from './pages/Login/Login.jsx';
import ChatPage from './pages/Chat/Chat.jsx';
import RegisterPage from './pages/Register/Register.jsx';
import theme from './theme';
import {Toaster} from "react-hot-toast"; // Import the custom dark theme

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <ChatPage />,
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

       <Toaster position="bottom-center" />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
