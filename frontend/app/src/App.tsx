import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useAuthStore } from '@/store';

// Layouts
import MainLayout from '@/components/layout/MainLayout';
import AuthLayout from '@/components/layout/AuthLayout';

// Pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Courses from '@/pages/Courses';
import CourseDetail from '@/pages/CourseDetail';
import Learning from '@/pages/Learning';
import Quiz from '@/pages/Quiz';
import Leaderboard from '@/pages/Leaderboard';
import Achievements from '@/pages/Achievements';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Notifications from '@/pages/Notifications';

// Teacher/Admin Pages
import CourseManager from '@/pages/teacher/CourseManager';
import ContentEditor from '@/pages/teacher/ContentEditor';
import StudentAnalytics from '@/pages/teacher/StudentAnalytics';
import UserManagement from '@/pages/teacher/UserManagement';

import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/courses" element={isAuthenticated ? <Courses /> : <Navigate to="/login" />} />
          <Route path="/courses/:id" element={isAuthenticated ? <CourseDetail /> : <Navigate to="/login" />} />
          <Route path="/learning/:courseId" element={isAuthenticated ? <Learning /> : <Navigate to="/login" />} />
          <Route path="/quiz/:quizId" element={isAuthenticated ? <Quiz /> : <Navigate to="/login" />} />
          <Route path="/leaderboard" element={isAuthenticated ? <Leaderboard /> : <Navigate to="/login" />} />
          <Route path="/achievements" element={isAuthenticated ? <Achievements /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/notifications" element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />} />
          
          {/* Teacher/Admin Routes */}
          <Route path="/teacher/courses" element={isAuthenticated ? <CourseManager /> : <Navigate to="/login" />} />
          <Route path="/teacher/courses/:id/edit" element={isAuthenticated ? <ContentEditor /> : <Navigate to="/login" />} />
          <Route path="/teacher/analytics" element={isAuthenticated ? <StudentAnalytics /> : <Navigate to="/login" />} />
          <Route path="/teacher/users" element={isAuthenticated ? <UserManagement /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
