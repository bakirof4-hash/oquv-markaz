import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLms } from '../../context/LmsContext';
import { useAuth } from '../../context/AuthContext';
import { 
  IconDashboard, 
  IconCourses, 
  IconVideos, 
  IconTeachers,
  IconUser, 
  IconPlus, 
  IconLogOut, 
  IconX, 
  IconShield, 
  IconSparkles 
} from '../common/SvgIcons';

export default function AdminSidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const { currentRole, activeTeacherId, teachers, getTeacherById } = useLms();
  const { logout } = useAuth();

  const currentTeacher = getTeacherById(activeTeacherId) || teachers[0];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role-aware menu items (100% SVG, 0 Emojis!)
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: IconDashboard },
    { id: 'courses', label: 'Courses', icon: IconCourses },
    { id: 'videos', label: 'Videos', icon: IconVideos },
    { id: 'students', label: 'O\'quvchilar', icon: IconUser },
    { id: 'teachers', label: 'Teachers', icon: IconTeachers },
  ];

  const teacherMenuItems = [
    { id: 'teacher-my-courses', label: 'My Courses', icon: IconCourses },
    { id: 'teacher-add-course', label: 'Add Course', icon: IconPlus },
    { id: 'teacher-my-videos', label: 'My Videos', icon: IconVideos },
    { id: 'teacher-add-video', label: 'Add Video', icon: IconPlus },
  ];

  const menuItems = currentRole === 'admin' ? adminMenuItems : teacherMenuItems;

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (window.innerWidth <= 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={() => setIsOpen(false)}></div>}
      
      <aside className={`admin-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* LOGO HEADER */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon-wrap">
              <IconSparkles size={20} />
            </div>
            <div className="logo-text-group">
              <span className="logo-title">IT Academy</span>
              <span className="logo-subtitle">SaaS Admin</span>
            </div>
          </div>

          <button className="sidebar-close-mobile" onClick={() => setIsOpen(false)}>
            <IconX size={20} />
          </button>
        </div>

        {/* CURRENT ACTIVE ROLE BADGE */}
        <div className="sidebar-role-card">
          <div className="role-badge-info">
            <IconShield size={16} />
            <span>{currentRole === 'admin' ? 'Admin Panel' : 'Ustoz Panel'}</span>
          </div>
          <span className="role-badge-tag">
            {currentRole === 'admin' ? 'ALL ACCESS' : 'TEACHER'}
          </span>
        </div>

        {currentRole === 'teacher' && (
          <div style={{ padding: '0 1.25rem 0.5rem', fontSize: '0.775rem', color: '#a5b4fc' }}>
            Aktiv Ustoz: <strong>{currentTeacher?.name}</strong>
          </div>
        )}

        {/* NAVIGATION LINKS */}
        <nav className="sidebar-menu">
          <div className="sidebar-section-label">
            {currentRole === 'admin' ? 'Asosiy Menyu' : 'Ustoz Ish Stoli'}
          </div>

          {menuItems.map(item => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="sidebar-link-icon">
                  <IconComponent size={20} />
                </span>
                <span className="sidebar-link-text">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="sidebar-footer">
          <button className="sidebar-link logout-link" style={{ color: '#fca5a5' }} onClick={handleLogout}>
            <span className="sidebar-link-icon" style={{ color: '#ef4444' }}>
              <IconLogOut size={20} />
            </span>
            <span className="sidebar-link-text">Chiqish (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
}

