/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardHome from './pages/admin/DashboardHome';
import ServicesManager from './pages/admin/ServicesManager';
import ProjectsManager from './pages/admin/ProjectsManager';
import TeamManager from './pages/admin/TeamManager';
import TestimonialsManager from './pages/admin/TestimonialsManager';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="team" element={<TeamManager />} />
          <Route path="testimonials" element={<TestimonialsManager />} />
        </Route>
      </Routes>
    </Router>
  );
}
