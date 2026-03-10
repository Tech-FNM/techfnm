import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminLayout from './pages/admin/AdminLayout';
import Login from './pages/admin/Login';
import DashboardHome from './pages/admin/DashboardHome';
import ServicesManager from './pages/admin/ServicesManager';
import ProjectsManager from './pages/admin/ProjectsManager';
import TeamManager from './pages/admin/TeamManager';
import TestimonialsManager from './pages/admin/TestimonialsManager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Admin Routes */}
        <Route path="/admindash/login" element={<Login />} />
        
        <Route path="/admindash" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admindash/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="team" element={<TeamManager />} />
          <Route path="testimonials" element={<TestimonialsManager />} />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
