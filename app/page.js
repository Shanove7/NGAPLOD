// credits : kasan
'use client';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setResult(null);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Server Error (${res.status})`);
      }

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Upload gagal');
      if (!data.url) throw new Error('URL tidak ditemukan');

      setResult(data.url);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#000', 
      color: '#fff', 
      fontFamily: 'sans-serif',
      padding: '20px'
    }}>
      <div style={{
        border: '1px solid #333', 
        padding: '2rem', 
        borderRadius: '12px', 
        textAlign: 'center',
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#0a0a0a'
      }}>
        <h2 style={{marginBottom: '1rem', color: '#fff'}}>Secure Upload</h2>
        
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])}
          style={{marginBottom: '1rem', color: '#ccc', width: '100%'}}
        />

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          style={{
            padding: '12px 20px',
            backgroundColor: loading ? '#333' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          {loading ? 'Sedang Upload...' : 'Upload File'}
        </button>

        {errorMsg && (
          <div style={{
            marginTop: '1.5rem', 
            padding: '10px', 
            backgroundColor: 'rgba(255, 0, 0, 0.1)', 
            border: '1px solid red', 
            borderRadius: '6px',
            color: '#ff6b6b',
            fontSize: '14px',
            wordBreak: 'break-word'
          }}>
            <strong>Error:</strong> {errorMsg}
          </div>
        )}

        {result && (
          <div style={{marginTop: '1.5rem', textAlign: 'left'}}>
            <p style={{fontSize: '12px', color: '#888', marginBottom: '5px'}}>LINK KAMU:</p>
            <div style={{
              display: 'flex', 
              gap: '10px',
              background: '#111',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #333'
            }}>
              <input 
                readOnly 
                value={result} 
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  width: '100%',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
              <button 
                onClick={() => {
                   navigator.clipboard.writeText(result);
                   alert('Link disalin!');
                }}
                style={{
                  background: '#333',
                  border: 'none',
                  color: '#fff',
                  padding: '5px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Copy
              </button>
            </div>
            <a 
              href={result} 
              target="_blank" 
              style={{
                display: 'block', 
                marginTop: '12px', 
                color: '#0070f3', 
                textAlign: 'center', 
                fontSize: '14px',
                textDecoration: 'none'
              }}
            >
              Buka Link &rarr;
            </a>
          </div>
        )}
      </div>
    </div>
  );
}


