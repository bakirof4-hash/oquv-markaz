import React, { useState, useEffect } from 'react';
import { useLms } from '../../context/LmsContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  IconSearch, 
  IconMenu, 
  IconSwitchRole, 
  IconTeachers, 
  IconUser, 
  IconShield,
  IconKey,
  IconSparkles,
  IconCheck,
  IconX,
  IconSun,
  IconMoon
} from '../common/SvgIcons';
import ChangePasswordModal from './modals/ChangePasswordModal';

export default function AdminTopbar({ toggleSidebar, globalSearch, setGlobalSearch }) {
  const { theme, toggleTheme } = useTheme();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking' | 'connected' | 'offline'
  const [lastCheckTime, setLastCheckTime] = useState('');

  const { 
    currentRole, 
    setCurrentRole, 
    activeTeacherId, 
    setActiveTeacherId, 
    teachers,
    getTeacherById 
  } = useLms();

  const currentTeacher = getTeacherById(activeTeacherId) || teachers[0];

  const checkBackendStatus = async () => {
    setBackendStatus('checking');
    try {
      const res = await fetch('/api/courses', { method: 'GET' });
      setLastCheckTime(new Date().toLocaleTimeString());
      if (res.ok) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('offline');
      }
    } catch (err) {
      setLastCheckTime(new Date().toLocaleTimeString());
      setBackendStatus('offline');
    }
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const handleRoleToggle = () => {
    if (currentRole === 'admin') {
      setCurrentRole('teacher');
    } else {
      setCurrentRole('admin');
    }
  };

  return (
    <>
      <header className="admin-topbar">
        <div className="topbar-left">
          {/* MOBILE SIDEBAR TOGGLE BUTTON */}
          <button className="sidebar-toggle-btn" onClick={toggleSidebar} aria-label="Toggle Navigation Menu">
            <IconMenu size={20} />
          </button>

          {/* GLOBAL SEARCH */}
          <div className="topbar-search-wrap">
            <IconSearch size={18} className="topbar-search-icon" />
            <input 
              type="text" 
              className="topbar-search-input" 
              placeholder="Global search across panel..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
          </div>

          {/* BACKEND CONNECTIVITY STATUS BADGE */}
          <button
            onClick={() => {
              checkBackendStatus();
              setIsBackendModalOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: backendStatus === 'connected' 
                ? 'rgba(16, 185, 129, 0.15)' 
                : (backendStatus === 'checking' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(245, 158, 11, 0.15)'),
              border: `1px solid ${backendStatus === 'connected' 
                ? 'rgba(16, 185, 129, 0.35)' 
                : (backendStatus === 'checking' ? 'rgba(99, 102, 241, 0.35)' : 'rgba(245, 158, 11, 0.35)')}`,
              color: backendStatus === 'connected' ? '#6ee7b7' : (backendStatus === 'checking' ? '#a5b4fc' : '#fcd34d'),
              padding: '0.4rem 0.75rem',
              borderRadius: '99px',
              fontSize: '0.775rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Backend Server ulanganligini tekshirish"
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: backendStatus === 'connected' ? '#10b981' : (backendStatus === 'checking' ? '#6366f1' : '#f59e0b'),
              boxShadow: backendStatus === 'connected' ? '0 0 8px #10b981' : 'none'
            }} />
            <span>
              {backendStatus === 'connected' ? 'Backend API Online' : (backendStatus === 'checking' ? 'Tekshirilmoqda...' : 'Local LMS Mode')}
            </span>
          </button>
        </div>

        <div className="topbar-right">
          {/* ACTIVE TEACHER PROFILE SELECTOR */}
          {currentRole === 'teacher' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.775rem', color: 'var(--ag-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <IconTeachers size={14} /> Ustoz:
              </span>
              <select 
                className="teacher-selector-select"
                value={activeTeacherId}
                onChange={(e) => setActiveTeacherId(e.target.value)}
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* THEME MODE TOGGLE BUTTON */}
          <button 
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: theme === 'light' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(99, 102, 241, 0.15)',
              border: `1px solid ${theme === 'light' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
              color: theme === 'light' ? '#d97706' : '#a5b4fc',
              padding: '0.5rem 0.85rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Yorqin va Tungi rejim o'rtasida almashish"
          >
            {theme === 'light' ? <IconSun size={16} /> : <IconMoon size={16} />}
            <span>{theme === 'light' ? 'Yorqin Mode' : 'Tungi Mode'}</span>
          </button>

          {/* ROLE MODE SWITCHER BUTTON */}
          <button 
            className="role-switcher-btn" 
            onClick={handleRoleToggle}
            title="Admin Mode va Teacher Mode o'rtasida almashish"
          >
            <IconSwitchRole size={16} />
            <span>{currentRole === 'admin' ? 'Switch to Teacher View' : 'Switch to Admin View'}</span>
          </button>

          {/* CHANGE ADMIN PASSWORD BUTTON */}
          {currentRole === 'admin' && (
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#a5b4fc',
                padding: '0.5rem 0.85rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Admin panel parolini o'zgartirish"
            >
              <IconKey size={16} />
              <span>Parol</span>
            </button>
          )}

          {/* USER PROFILE BADGE */}
          <div className="topbar-user-badge">
            <img 
              src={currentRole === 'teacher' ? (currentTeacher?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80') : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'} 
              alt="Profile Avatar" 
              className="user-avatar-img" 
            />
            <span className="user-name-text">
              {currentRole === 'admin' ? 'Super Admin' : (currentTeacher?.name || 'Ustoz')}
            </span>
          </div>
        </div>
      </header>


      {/* BACKEND DIAGNOSTIC MODAL */}
      {isBackendModalOpen && (
        <div className="ag-modal-backdrop" onClick={() => setIsBackendModalOpen(false)}>
          <div className="ag-modal-content" style={{ maxWidth: 480, background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.15)' }} onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header">
              <h2 className="ag-modal-title" style={{ fontSize: '1.15rem', color: '#fff' }}>
                <IconSparkles size={20} className="text-cyan-400" />
                Backend Tarmoq Diagnostikasi
              </h2>
              <button className="ag-btn ag-btn-secondary ag-btn-icon-only" onClick={() => setIsBackendModalOpen(false)}>
                <IconX size={18} />
              </button>
            </div>

            <div className="ag-modal-body">
              <div style={{
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#94a3b8' }}>API Base Proxy:</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>/api (127.0.0.1:8000)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#94a3b8' }}>Tekshirilgan Endpoint:</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>GET /api/courses</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#94a3b8' }}>Oxirgi tekshiruv:</span>
                  <span style={{ color: '#a5b4fc', fontWeight: 600 }}>{lastCheckTime || 'Hozir'}</span>
                </div>
              </div>

              {backendStatus === 'connected' ? (
                <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: '12px', color: '#6ee7b7', fontSize: '0.875rem' }}>
                  <strong>🟢 Backend Bilan Aloqa Muvaffaqiyatli!</strong>
                  <p style={{ margin: '0.4rem 0 0', fontSize: '0.825rem', color: '#a7f3d0' }}>
                    Django REST API (Waitress/WSGI) port 8000 da ishlamoqda. Barcha ma'lumotlar backend bilan sinxronlashadi.
                  </p>
                </div>
              ) : (
                <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1rem', borderRadius: '12px', color: '#fcd34d', fontSize: '0.875rem' }}>
                  <strong>🟡 Avtonom (Local LMS) Rejimida Ishlanmoqda</strong>
                  <p style={{ margin: '0.4rem 0 0', fontSize: '0.825rem', color: '#fde68a' }}>
                    Django backend server hozircha 8000-portda ishlamaganligi sababli, dastur uzluksiz ishlash uchun lokal LMS sinxronlash tizimiga o'tdi. 
                  </p>
                </div>
              )}
            </div>

            <div className="ag-modal-footer">
              <button className="ag-btn ag-btn-secondary" onClick={() => setIsBackendModalOpen(false)}>
                Yopish
              </button>
              <button className="ag-btn ag-btn-primary" onClick={checkBackendStatus}>
                <IconCheck size={18} />
                Qayta Tekshirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
}


