import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api/config';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Kirishda xatolik yuz berdi.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      {/* Background Glows */}
      <div className="glow-bg glow-blue" style={{ top: '-10%' }}></div>
      <div className="glow-bg glow-cyan" style={{ bottom: '-10%' }}></div>

      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '3rem 2.5rem' }}>
            <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2.4rem' }}>Xush kelibsiz</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '2.5rem' }}>
              Platformaga kirish uchun ma'lumotlaringizni kiriting
            </p>

            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.88rem',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Email pochta</label>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="example@itacademy.uz" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ marginBottom: 0 }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Parol</label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ marginBottom: 0 }} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--primary)' }} /> Eslab qolish
                </label>
                <a href="#forgot" className="text-gradient" style={{ fontWeight: 500 }} onClick={e => e.preventDefault()}>Parolni unutdingizmi?</a>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', marginTop: '1rem' }}>
                {loading ? 'Kirilmoqda...' : 'Tizimga kirish'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Akkauntingiz yo'qmi? <Link to="/register" className="text-gradient" style={{ fontWeight: 600 }}>Ro'yxatdan o'tish</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
