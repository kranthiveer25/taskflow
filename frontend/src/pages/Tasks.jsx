import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) { navigate('/'); return; }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data.tasks);
    } catch (err) {
      setError('Failed to load tasks');
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks(); // refresh
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const columns = ['pending', 'inprogress', 'completed'];
  const columnLabels = {
    pending: '🕐 Pending',
    inprogress: '⚡ In Progress',
    completed: '✅ Completed'
  };
  const columnColors = {
    pending: '#fff9c4',
    inprogress: '#e3f2fd',
    completed: '#e8f5e9'
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📋 Task Board</h2>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px' }}>
          ← Dashboard
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {columns.map((col) => (
          <div key={col} style={{
            flex: 1,
            background: columnColors[col],
            borderRadius: '8px',
            padding: '16px',
            minHeight: '400px'
          }}>
            <h3 style={{ marginTop: 0 }}>{columnLabels[col]}</h3>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>
              {tasks.filter(t => t.status === col).length} tasks
            </p>

            {tasks.filter(t => t.status === col).map((task) => (
              <div key={task._id} style={{
                background: 'white',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '10px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <strong>{task.title}</strong>
                <p style={{ fontSize: '0.85rem', color: '#555', margin: '4px 0' }}>
                  {task.description}
                </p>
                <p style={{ fontSize: '0.8rem', margin: '4px 0' }}>
                  👤 {task.assignedTo?.name}
                </p>
                <p style={{ fontSize: '0.8rem', margin: '4px 0' }}>
                  🎯 Priority: <strong>{task.priority}</strong>
                </p>

                {/* Status buttons */}
                <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {columns.filter(c => c !== col).map((c) => (
                    <button
                      key={c}
                      onClick={() => updateStatus(task._id, c)}
                      style={{ fontSize: '0.75rem', padding: '4px 8px', cursor: 'pointer' }}
                    >
                      Move to {c}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {tasks.filter(t => t.status === col).length === 0 && (
              <p style={{ color: '#aaa', textAlign: 'center' }}>No tasks</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;