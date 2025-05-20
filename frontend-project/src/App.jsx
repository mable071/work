import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CarPage from './pages/Car';
import ServicePage from './pages/Service';
import ServiceRecordPage from './pages/ServiceRecord';
import PaymentPage from './pages/Payment';
import ReportPage from './pages/Report';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);


  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    window.location.href = '/dashboard';
  };

  const handleRegister = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    window.location.href = '/dashboard';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const checkAuth = () => {
    return localStorage.getItem('token') !== null;
  };

  const PrivateRoute = ({ children }) => {
    return checkAuth() ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleRegister} />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path="/cars"
              element={
                <PrivateRoute>
                  <CarPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/services"
              element={
                <PrivateRoute>
                  <ServicePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/service-records"
              element={
                <PrivateRoute>
                  <ServiceRecordPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <PrivateRoute>
                  <PaymentPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <ReportPage />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 