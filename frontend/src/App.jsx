import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Comments from './pages/Comments';
import ActivityLog from './pages/ActivityLog';
import Upload from './pages/Upload';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import CreateTeam from './pages/CreateTeam';
import Teams from './pages/Teams';
import CreateTask from './pages/CreateTask';
import Users from './pages/Users';
function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute><Tasks /></ProtectedRoute>
        } />
        <Route path="/comments/:taskId" element={
          <ProtectedRoute><Comments /></ProtectedRoute>
        } />
        <Route path="/activity" element={
          <ProtectedRoute><ActivityLog /></ProtectedRoute>
        } />
        <Route path="/upload/:taskId" element={
          <ProtectedRoute><Upload /></ProtectedRoute>
        } />
        <Route path="/teams/create" element={
          <ProtectedRoute><CreateTeam /></ProtectedRoute>
        } />
        <Route path="/teams" element={
          <ProtectedRoute><Teams /></ProtectedRoute>
        } />
        <Route path="/tasks/create" element={
          <ProtectedRoute><CreateTask /></ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute><Users /></ProtectedRoute>
        } />
      </Routes>
      </div>
      <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;