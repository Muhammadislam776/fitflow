import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { GymProvider } from './context/GymContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <GymProvider>
            <AppRoutes />
          </GymProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
