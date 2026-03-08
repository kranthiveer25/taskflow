import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, RotateCcw, MessageSquare, Paperclip, ChevronLeft, ChevronRight, AlertTriangle, Calendar, Plus } from 'lucide-react';
import API from '../api/axios';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) { navigate('/'); return; }
    fetchTasks(1);
  }, []);

  const fetchTasks = async (pageNum = 1) => {
    try {
      const res = await API.get(`/tasks?page=${pageNum}&limit=5`);
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to load tasks');
    }
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (priority) params.append('priority', priority);
      const res = await API.get(`/tasks/search?${params.toString()}`);
      setTasks(res.data.tasks);
      setTotalPages(1);
      setPage(1);
    } catch (err) {
      setError('Search failed');
    }
  };

  const handleReset = () => {
    setKeyword('');
    setPriority('');
    fetchTasks(1);
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks(page);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const columns = ['pending', 'inprogress', 'completed'];
  const columnConfig = {
    pending: { label: 'Pending', color: '#fff8e1', headerColor: '#ff9800', border: '#ffe082' },
    inprogress: { label: 'In Progress', color: '#e3f2fd', headerColor: '#1976d2', border: '#90caf9' },
    completed: { label: 'Completed', color: '#e8f5e9', headerColor: '#2e7d32', border: '#a5d6a7' }
  };

  const priorityColors = {
    high: { bg: '#ffebee', color: '#c62828' },
    medium: { bg: '#fff8e1', color: '#f57f17' },
    low: { bg: '#e8f5e9', color: '#2e7d32' }
  };

  return (
    <div className="page">

      {/* Header */}
      <div style={{
        background: 'white', borderRadius: '12px', padding: '20px 24px',
        marginBottom: '24px', boxShadow: '0 4px 12px rgba(46,125,50,0.08)',
        borderLeft: '5px solid #43a047',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <h2 style={{ color: '#2e7d32' }}>Task Board</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#888', fontSize: '0.9rem' }}>
            {tasks.length} tasks loaded
          </span>
          {(user?.role === 'teamleader' || user?.role === 'admin') && (
            <button
              onClick={() => navigate('/tasks/create')}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} /> Create Task
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        background: 'white', borderRadius: '12px', padding: '16px 20px',
        marginBottom: '24px', boxShadow: '0 4px 12px rgba(46,125,50,0.08)',
        display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: '100%', paddingLeft: '36px' }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <Filter size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ paddingLeft: '36px', minWidth: '160px' }}
          >
            <option value="">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
        <button
          onClick={handleSearch}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px' }}
        >
          <Search size={15} /> Search
        </button>
        <button
          onClick={handleReset}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px' }}
        >
          <RotateCcw size={15} /> Reset
        </button>
      </div>

      {error && (
        <p style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '16px' }}>
          {error}
        </p>
      )}

      {/* Kanban Columns */}
      <div className="kanban" style={{ display: 'flex', gap: '20px' }}>
        {columns.map((col) => (
          <div key={col} style={{
            flex: 1, background: columnConfig[col].color,
            borderRadius: '12px', overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            border: `1px solid ${columnConfig[col].border}`
          }}>
            {/* Column Header */}
            <div style={{
              background: columnConfig[col].headerColor,
              padding: '14px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <h3 style={{ color: 'white', margin: 0, fontSize: '1rem' }}>
                {columnConfig[col].label}
              </h3>
              <span style={{
                background: 'rgba(255,255,255,0.25)', color: 'white',
                borderRadius: '12px', padding: '2px 10px', fontSize: '0.85rem', fontWeight: 'bold'
              }}>
                {tasks.filter(t => t.status === col).length}
              </span>
            </div>

            {/* Task Cards */}
            <div style={{ padding: '12px' }}>
              {tasks.filter(t => t.status === col).map((task) => {
                const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed';
                return (
                  <div key={task._id} style={{
                    background: 'white', borderRadius: '10px', padding: '14px',
                    marginBottom: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    borderLeft: isOverdue ? '4px solid #e53935' : `4px solid ${columnConfig[col].headerColor}`,
                    transition: 'transform 0.15s',
                  }}>
                    <strong style={{ color: '#222', fontSize: '0.95rem' }}>{task.title}</strong>
                    <p style={{ fontSize: '0.82rem', color: '#666', margin: '6px 0' }}>
                      {task.description}
                    </p>

                    {/* Priority Badge */}
                    <span style={{
                      display: 'inline-block', fontSize: '0.75rem', fontWeight: '600',
                      padding: '2px 10px', borderRadius: '20px', marginBottom: '6px',
                      background: priorityColors[task.priority]?.bg,
                      color: priorityColors[task.priority]?.color
                    }}>
                      {task.priority?.toUpperCase()}
                    </span>

                    <p style={{ fontSize: '0.8rem', color: '#555', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>👤</span> {task.assignedTo?.name || 'Unassigned'}
                    </p>

                    {task.deadline && (
                      <p style={{
                        fontSize: '0.8rem', margin: '4px 0',
                        color: isOverdue ? '#e53935' : '#555',
                        fontWeight: isOverdue ? 'bold' : 'normal',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        <Calendar size={13} />
                        {new Date(task.deadline).toLocaleDateString()}
                        {isOverdue && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#e53935' }}>
                            <AlertTriangle size={13} /> OVERDUE
                          </span>
                        )}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => navigate(`/comments/${task._id}`)}
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        <MessageSquare size={13} /> Comments
                      </button>
                      <button
                        onClick={() => navigate(`/upload/${task._id}`)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          fontSize: '0.75rem', padding: '4px 10px',
                          background: '#e8f5e9', color: '#2e7d32',
                          border: '1px solid #a5d6a7', borderRadius: '6px', cursor: 'pointer'
                        }}
                      >
                        <Paperclip size={13} /> Upload
                      </button>
                    </div>

                    {/* Move Buttons */}
                    <div style={{ marginTop: '6px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {columns.filter(c => c !== col).map((c) => (
                        <button
                          key={c}
                          onClick={() => updateStatus(task._id, c)}
                          style={{
                            fontSize: '0.72rem', padding: '3px 8px', cursor: 'pointer',
                            background: '#f5f5f5', border: '1px solid #ddd',
                            borderRadius: '4px', color: '#555'
                          }}
                        >
                          → {columnConfig[c].label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {tasks.filter(t => t.status === col).length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#aaa', fontSize: '0.9rem' }}>
                  No tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', gap: '12px', marginTop: '28px'
      }}>
        <button
          onClick={() => fetchTasks(page - 1)}
          disabled={page === 1}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: page === 1 ? 0.4 : 1 }}
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <span style={{ color: '#2e7d32', fontWeight: '600' }}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => fetchTasks(page + 1)}
          disabled={page === totalPages}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: page === totalPages ? 0.4 : 1 }}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}

export default Tasks;