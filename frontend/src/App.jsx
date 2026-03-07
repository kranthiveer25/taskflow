import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Comments from './pages/Comments';
import ActivityLog from './pages/ActivityLog';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/comments/:taskId" element={<Comments />} />
        <Route path="/activity" element={<ActivityLog />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;