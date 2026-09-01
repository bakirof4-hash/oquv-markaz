import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { IconX, IconKey, IconLock, IconCheck } from '../../common/SvgIcons';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const { updateAdminPassword } = useAuth();
  const { addToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError("Yangi parollar bir-biriga mos kelmadi!");
      return;
    }

    const res = updateAdminPassword(currentPassword, newPassword);
    if (!res.success) {
      setError(res.message);
    } else {
      if (addToast) addToast(res.message, 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '440px',
        width: '100%',
        background: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        position: 'relative'
      }}>
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            color: '#94a3b8',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <IconX size={18} />
        </button>

        {/* TITLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#818cf8'
          }}>
            <IconKey size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>Admin Parolini O'zgartirish</h3>
            <p style={{ margin: 0, fontSize: '0.825rem', color: '#94a3b8' }}>Xavfsizlik uchun yangi parol o'rnating</p>
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '0.75rem',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
              Hozirgi Parol
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Eski parolni kiriting"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                color: '#fff',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
              Yangi Parol
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Kamida 4 ta belgi"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                color: '#fff',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
              Yangi Parolni Tasdiqlash
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Yangi parolni qayta kiriting"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                color: '#fff',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '10px',
                color: '#cbd5e1',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Bekor qilish
            </button>

            <button
              type="submit"
              style={{
                flex: 1.5,
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <IconCheck size={18} /> Parolni Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
