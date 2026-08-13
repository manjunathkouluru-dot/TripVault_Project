import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PublicProfilePage from './pages/PublicProfilePage';
import TripDetail from './pages/TripDetail';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const storedUser = localStorage.getItem('user');
  let currentUser = null;
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      currentUser = parsed.user || parsed;
    } catch {
      currentUser = null;
    }
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar user={currentUser} />
        
        <div className="app-main-content">
          <Routes>
            {/* Redirect root URL to /login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Public Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/trips/:id" 
              element={
                <ProtectedRoute>
                  <TripDetail />
                </ProtectedRoute>
              } 
            />

            {/* Public Profile - No Auth Required */}
            <Route path="/profile/:username" element={<PublicProfilePage />} />
            <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
            
            {/* Fallback 404 Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>

        <Footer />

        {/* Global Toast Notifications */}
        <ToastContainer 
          position="top-right" 
          autoClose={3500} 
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;