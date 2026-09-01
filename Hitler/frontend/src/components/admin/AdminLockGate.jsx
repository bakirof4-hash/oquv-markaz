import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IconLock, IconKey, IconEye, IconSparkles } from '../common/SvgIcons';

export default function AdminLockGate({ onUnlock }) {
  const navigate = useNavigate();
  const { verifyAdminPassword, login, adminPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleUnlockSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (verifyAdminPassword(password)) {
      // Authenticate admin session
      login('token_admin_' + Date.now(), {
        name: 'Super Admin',
        email: 'admin@itacademy.uz',
        role: 'admin'
      });
      if (onUnlock) onUnlock();
    } else {
      setError("Admin paroli noto'g'ri! Iltimos, qaytadan urinib ko'ring.");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#090d16',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#f8fafc'
    }}>
      {/* Background ambient glow effects */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '30%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '30%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '440px',
        width: '90%',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 2
      }}>
        {/* ICON BADGE */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#818cf8',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
          }}>
            <IconLock size={32} />
          </div>
        </div>

        {/* HEADINGS */}
        <h2 style={{
          textAlign: 'center',
          fontSize: '1.6rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          Admin Panel Qulflangan
        </h2>
        <p style={{
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: '0.9rem',
          marginBottom: '1.75rem',
          lineHeight: '1.5'
        }}>
          Admin paneli ma'lumotlarini ko'rish uchun maxfiy parolni kiriting.
        </p>

        {/* DEMO HINT BADGE */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.825rem',
          color: '#c7d2fe'
        }}>
          <IconSparkles size={18} style={{ color: '#818cf8', flexShrink: 0 }} />
          <span>Standart Admin Paroli: <strong>{adminPassword}</strong></span>
        </div>

        {/* ERROR MSG */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            color: '#fca5a5',
            fontSize: '0.85rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleUnlockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.5rem', fontWeight: 500 }}>
              Admin Paroli
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Parolni kiriting..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 2.8rem 0.85rem 1rem',
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <IconEye size={18} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.9rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <IconKey size={18} /> Qulfdan chiqarish
          </button>
        </form>

        {/* FOOTER LINK */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '0.85rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            ← Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    </div>
  );
}
