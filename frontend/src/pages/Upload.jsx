import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

function Upload() {
  const { taskId } = useParams();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const res = await API.post(`/upload/${taskId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(`✅ File uploaded: ${res.data.file.filename}`);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/tasks')}
        style={{ marginBottom: '20px', padding: '8px 16px' }}
      >
        ← Back to Task Board
      </button>

      <h2>📎 Upload File to Task</h2>
      <p style={{ color: '#888' }}>
        Allowed: JPEG, PNG, PDF, DOC, DOCX — Max 5MB
      </p>

      <div style={{
        padding: '30px',
        border: '2px dashed #ddd',
        borderRadius: '8px',
        textAlign: 'center',
        marginBottom: '20px',
        background: '#fafafa'
      }}>
        <p style={{ fontSize: '2rem', margin: 0 }}>📁</p>
        <p>Select a file to attach to this task</p>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          style={{ marginTop: '10px' }}
        />
        {file && (
          <p style={{ marginTop: '10px', color: '#1976d2' }}>
            Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          width: '100%', padding: '12px',
          background: uploading ? '#aaa' : '#1976d2',
          color: 'white', border: 'none',
          borderRadius: '6px', fontSize: '1rem',
          cursor: uploading ? 'not-allowed' : 'pointer'
        }}
      >
        {uploading ? 'Uploading...' : '⬆️ Upload File'}
      </button>

      {message && (
        <p style={{
          marginTop: '16px', padding: '12px',
          background: '#e8f5e9', borderRadius: '6px',
          color: 'green', fontWeight: 'bold'
        }}>
          {message}
        </p>
      )}
      {error && (
        <p style={{
          marginTop: '16px', padding: '12px',
          background: '#fce4ec', borderRadius: '6px',
          color: 'red'
        }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default Upload;