import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paperclip, ArrowLeft, FileText, Image, File } from 'lucide-react';
import API from '../api/axios';

function Upload() {
  const { taskId } = useParams();
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await API.get(`/upload/${taskId}`);
      setFiles(res.data.files);
    } catch (err) {
      console.error('Failed to fetch files');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) { setError('Please select a file first!'); return; }
    const formData = new FormData();
    formData.append('file', file);
    try {
      setUploading(true);
      await API.post(`/upload/${taskId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('File uploaded successfully!');
      setFile(null);
      fetchFiles();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(ext)) return <Image size={18} color="#1976d2" />;
    if (ext === 'pdf') return <FileText size={18} color="#e53935" />;
    return <File size={18} color="#555" />;
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="page">
      <button
        onClick={() => navigate('/tasks')}
        className="btn-secondary"
        style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
      >
        <ArrowLeft size={16} /> Back to Task Board
      </button>

      {/* Upload Box */}
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto 24px' }}>
        <h2 style={{ color: '#2e7d32', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Paperclip size={22} /> Upload File
        </h2>
        <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '20px' }}>
          Allowed: JPEG, PNG, PDF, DOC, DOCX — Max 5MB
        </p>

        <div style={{
          padding: '30px', border: '2px dashed #a5d6a7',
          borderRadius: '10px', textAlign: 'center',
          background: '#f9fffe', marginBottom: '16px'
        }}>
          <Paperclip size={32} color="#a5d6a7" style={{ marginBottom: '10px' }} />
          <p style={{ color: '#666', marginBottom: '10px' }}>Select a file to attach to this task</p>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          />
          {file && (
            <p style={{ marginTop: '10px', color: '#2e7d32', fontWeight: '500' }}>
              Selected: <strong>{file.name}</strong> ({formatSize(file.size)})
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="btn-primary"
          style={{ width: '100%', padding: '12px', fontSize: '1rem', opacity: uploading ? 0.7 : 1 }}
        >
          {uploading ? 'Uploading...' : '⬆️ Upload File'}
        </button>

        {message && (
          <p style={{ marginTop: '12px', padding: '10px', background: '#e8f5e9', borderRadius: '6px', color: '#2e7d32', fontWeight: '600' }}>
            ✓ {message}
          </p>
        )}
        {error && (
          <p style={{ marginTop: '12px', padding: '10px', background: '#ffebee', borderRadius: '6px', color: '#c62828' }}>
            {error}
          </p>
        )}
      </div>

      {/* Attachments List */}
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ color: '#2e7d32', marginBottom: '16px' }}>
          Attachments ({files.length})
        </h3>
        {files.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', padding: '20px 0' }}>No files uploaded yet</p>
        ) : (
          files.map((f) => (
            <div key={f._id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px', background: '#f9fffe', borderRadius: '8px',
              marginBottom: '8px', border: '1px solid #e8f5e9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {getFileIcon(f.filename)}
                <div>
                  <p style={{ margin: 0, fontWeight: '500', fontSize: '0.9rem' }}>{f.originalname}</p>
                  <p style={{ margin: 0, color: '#888', fontSize: '0.78rem' }}>
                    {formatSize(f.size)} · Uploaded by {f.uploadedBy?.name} · {new Date(f.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
                <a
                href={`http://localhost:8000/uploads/${f.filename}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#e8f5e9', color: '#2e7d32', padding: '5px 12px',
                  borderRadius: '6px', fontSize: '0.82rem', textDecoration: 'none',
                  fontWeight: '500', border: '1px solid #a5d6a7'
                }}
              >
                View
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Upload;