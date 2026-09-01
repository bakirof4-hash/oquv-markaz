import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeframe, setTimeframe] = useState('1M');

  // Data states
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('course');
  const [editingItem, setEditingItem] = useState(null);

  const [courseForm, setCourseForm] = useState({
    title: '', category: 'Backend', price: '$250', mentorName: 'Asadbek Mentor', mentorRole: 'Python Lead'
  });

  const [instructorForm, setInstructorForm] = useState({
    name: '', role: 'Senior Mentor', exp: '4+ yillik tajriba', initials: 'A'
  });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [resC, resT, resU, resM] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/courses`),
        fetch(`${API_BASE_URL}/instructors`),
        fetch(`${API_BASE_URL}/users`, { headers }),
        fetch(`${API_BASE_URL}/messages`, { headers })
      ]);

      if (resC.status === 'fulfilled' && resC.value.ok) setCourses(await resC.value.json());
      if (resT.status === 'fulfilled' && resT.value.ok) setInstructors(await resT.value.json());
      if (resU.status === 'fulfilled' && resU.value.ok) setUsers(await resU.value.json());
      if (resM.status === 'fulfilled' && resM.value.ok) setMessages(await resM.value.json());
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Handlers
  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Kursni o\'chirmoqchimisiz?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInstructor = async (id) => {
    if (!window.confirm('O\'qituvchini o\'chirmoqchimisiz?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/instructors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Xabarni o\'chirmoqchimisiz?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Save Handlers
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    const url = editingItem
      ? `${API_BASE_URL}/courses/${editingItem._id || editingItem.id}`
      : `${API_BASE_URL}/courses`;
    const method = editingItem ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(courseForm)
      });
      if (res.ok) {
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      alert('Xatolik yuz berdi');
    }
  };

  const handleSaveInstructor = async (e) => {
    e.preventDefault();
    const url = editingItem
      ? `${API_BASE_URL}/instructors/${editingItem._id || editingItem.id}`
      : `${API_BASE_URL}/instructors`;
    const method = editingItem ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(instructorForm)
      });
      if (res.ok) {
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      alert('Xatolik yuz berdi');
    }
  };

  // Mock table fallback data if empty
  const defaultOrders = [
    { id: '12386', customer: 'Charly dues', from: 'Russia', price: '$2052', status: 'Process' },
    { id: '12385', customer: 'Charly dues', from: 'Russia', price: '$2052', status: 'Open' },
    { id: '12384', customer: 'Alex Johnson', from: 'Uzbekistan', price: '$1450', status: 'Process' },
    { id: '12383', customer: 'Martin Garrix', from: 'USA', price: '$3200', status: 'Completed' },
  ];

  return (
    <div className="admin-layout">
      <div className="admin-container">
        
        {/* LEFT SIDEBAR */}
        <aside className="admin-sidebar">
          <div className="brand-header">
            <div className="brand-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div className="brand-title">Finance</div>
          </div>

          <div className="sidebar-menu-title">Menu</div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </span>
              <span>Dashboard</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <span className="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              </span>
              <span>Kurslar ({courses.length})</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'instructors' ? 'active' : ''}`}
              onClick={() => setActiveTab('instructors')}
            >
              <span className="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </span>
              <span>O'qituvchilar ({instructors.length})</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              </span>
              <span>Foydalanuvchilar ({users.length})</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <span className="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </span>
              <span>Xabarlar ({messages.length})</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </span>
              <span>Setting</span>
            </button>

            <button
              className="nav-item logout-btn"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }}
            >
              <span className="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </span>
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* MAIN DASHBOARD CONTENT */}
        <main className="admin-main">
          
          {/* HEADER */}
          <header className="main-header">
            <div className="welcome-text">
              Welcome {user.name || 'Martin'}!
            </div>

            <div className="header-right">
              <div className="header-search">
                <span className="search-icon-inside">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </span>
                <input
                  type="text"
                  placeholder="Search your items"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="notification-bell" title="Notifications">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              </div>

              <div className="user-profile-avatar" onClick={() => navigate('/admin')}>
                {(user.name || 'M').charAt(0)}
              </div>
            </div>
          </header>

          {/* 4 STAT CARDS GRID */}
          <section className="stat-cards-grid">
            
            {/* CARD 1: PURPLE */}
            <div className="stat-card purple">
              <div className="stat-card-header">
                <span className="stat-card-title">Total Accounts</span>
                <span className="stat-card-badge">+12%</span>
              </div>
              <div className="stat-card-body">
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Current value</div>
                  <div className="stat-card-value">$4200.00</div>
                </div>
                <svg className="stat-sparkline" viewBox="0 0 100 30">
                  <path d="M0 25 Q25 5 50 15 T100 5" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
                </svg>
              </div>
            </div>

            {/* CARD 2: PINK */}
            <div className="stat-card pink">
              <div className="stat-card-header">
                <span className="stat-card-title">Equity Ratio</span>
                <span className="stat-card-badge">+2.5%</span>
              </div>
              <div className="stat-card-body">
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Current value</div>
                  <div className="stat-card-value">$12500.55</div>
                </div>
                <svg className="stat-sparkline" viewBox="0 0 100 30">
                  <path d="M0 20 Q25 25 50 10 T100 15" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
                </svg>
              </div>
            </div>

            {/* CARD 3: BLUE */}
            <div className="stat-card blue">
              <div className="stat-card-header">
                <span className="stat-card-title">Credit Equity</span>
                <span className="stat-card-badge">+4.2%</span>
              </div>
              <div className="stat-card-body">
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Current value</div>
                  <div className="stat-card-value">$2300.99</div>
                </div>
                <svg className="stat-sparkline" viewBox="0 0 100 30">
                  <path d="M0 15 Q30 5 60 20 T100 10" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
                </svg>
              </div>
            </div>

            {/* CARD 4: ORANGE */}
            <div className="stat-card orange">
              <div className="stat-card-header">
                <span className="stat-card-title">Debt Equity</span>
                <span className="stat-card-badge">+1.8%</span>
              </div>
              <div className="stat-card-body">
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Current value</div>
                  <div className="stat-card-value">$8500.00</div>
                </div>
                <svg className="stat-sparkline" viewBox="0 0 100 30">
                  <path d="M0 28 Q20 10 50 18 T100 5" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
                </svg>
              </div>
            </div>

          </section>

          {/* MIDDLE SECTION: WALLET ANALYTICS & TRAFFIC */}
          <section className="dashboard-middle-grid">
            
            {/* WALLET ANALYTICS CHART */}
            <div className="dashboard-card">
              <div className="card-header-flex">
                <h3 className="card-title">Wallet Analytics</h3>
                <div className="timeframe-tabs">
                  {['1D', '1W', '1M', '1Y', '3Y', '5Y', 'Max'].map(t => (
                    <button
                      key={t}
                      className={`time-tab ${timeframe === t ? 'active' : ''}`}
                      onClick={() => setTimeframe(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="chart-container">
                <div className="tooltip-badge">$11500</div>
                <svg width="100%" height="160" viewBox="0 0 500 160" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area fill */}
                  <path
                    d="M 0 130 Q 70 140 140 100 T 250 40 T 360 80 T 500 100 L 500 160 L 0 160 Z"
                    fill="url(#chartGradient)"
                  />

                  {/* Neon Green Chart Line */}
                  <path
                    d="M 0 130 Q 70 140 140 100 T 250 40 T 360 80 T 500 100"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3.5"
                  />

                  {/* Active Data Point Marker */}
                  <circle cx="225" cy="40" r="5" fill="#22c55e" stroke="#ffffff" strokeWidth="2.5" />
                </svg>

                <div className="chart-x-axis">
                  <span>10 am</span>
                  <span>11 am</span>
                  <span>12 pm</span>
                  <span>1 pm</span>
                  <span>2 pm</span>
                  <span>3 pm</span>
                  <span>4 pm</span>
                </div>
              </div>
            </div>

            {/* TRAFFIC DONUT CHART */}
            <div className="dashboard-card">
              <div className="card-header-flex">
                <h3 className="card-title">Traffic</h3>
              </div>

              <div className="donut-wrapper">
                <svg width="150" height="150" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#2563eb" strokeWidth="16" strokeDasharray="65 100" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#f97316" strokeWidth="16" strokeDasharray="110 100" strokeDashoffset="-65" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#38bdf8" strokeWidth="16" strokeDasharray="25 100" strokeDashoffset="-175" />
                </svg>

                <div className="donut-legend">
                  <div className="legend-item">
                    <span className="legend-dot" style={{ background: '#2563eb' }}></span>
                    <span>33% Send</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ background: '#f97316' }}></span>
                    <span>55% Cash Out</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ background: '#38bdf8' }}></span>
                    <span>12% Withdraw</span>
                  </div>
                </div>
              </div>
            </div>

          </section>

          {/* BOTTOM SECTION: RECENT ACTIVITIES & DATA TABLE */}
          <section className="dashboard-bottom-grid">
            
            {/* RECENT ACTIVITIES */}
            <div className="dashboard-card">
              <div className="card-header-flex">
                <h3 className="card-title">Recent Activities</h3>
              </div>

              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-time">40 Mins Ago</div>
                  <div className="activity-icon pink">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div className="activity-details">
                    <span className="activity-title">Task Updated</span>
                    <span className="activity-sub">Mentor updated a Task</span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-time">1 day ago</div>
                  <div className="activity-icon purple">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
                  </div>
                  <div className="activity-details">
                    <span className="activity-title">Deal Added</span>
                    <span className="activity-sub">Panals updated a Task</span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-time">40 Mins Ago</div>
                  <div className="activity-icon blue">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line></svg>
                  </div>
                  <div className="activity-details">
                    <span className="activity-title">Published Article</span>
                    <span className="activity-sub">Somchi updated a Article</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ORDER STATUS & DATA MANAGEMENT TABLE */}
            <div className="dashboard-card">
              <div className="card-header-flex">
                <div>
                  <h3 className="card-title">
                    {activeTab === 'courses' ? 'Kurslar Boshqaruvi' : 
                     activeTab === 'instructors' ? 'O\'qituvchilar Boshqaruvi' :
                     activeTab === 'users' ? 'Foydalanuvchilar Ro\'yxati' :
                     activeTab === 'messages' ? 'Xabarlar Ro\'yxati' : 'Order Status'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Overview of latest month</div>
                </div>

                <div className="table-toolbar">
                  <button className="toolbar-btn active-red" onClick={() => {
                    if (activeTab === 'courses') {
                      setEditingItem(null);
                      setCourseForm({ title: '', category: 'Backend', price: '$250', mentorName: 'Asadbek', mentorRole: 'Python' });
                      setModalType('course');
                      setShowModal(true);
                    } else if (activeTab === 'instructors') {
                      setEditingItem(null);
                      setInstructorForm({ name: '', role: 'Senior Mentor', exp: '4+ yil', initials: 'A' });
                      setModalType('instructor');
                      setShowModal(true);
                    }
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                  </button>

                  <button className="toolbar-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                  <button className="toolbar-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  </button>
                  <button className="toolbar-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  </button>

                  <div className="table-search">
                    <input type="text" placeholder="Search..." />
                  </div>
                </div>
              </div>

              {/* DYNAMIC DATA TABLE */}
              <div style={{ overflowX: 'auto' }}>
                <table className="custom-table">
                  <thead>
                    {activeTab === 'courses' ? (
                      <tr>
                        <th>NOMI</th>
                        <th>KATEGORIYA</th>
                        <th>MENTOR</th>
                        <th>NARXI</th>
                        <th>HOLAT</th>
                        <th>AMALLAR</th>
                      </tr>
                    ) : activeTab === 'instructors' ? (
                      <tr>
                        <th>ISM</th>
                        <th>LAVOZIM</th>
                        <th>TAJRIBA</th>
                        <th>HOLAT</th>
                        <th>AMALLAR</th>
                      </tr>
                    ) : activeTab === 'messages' ? (
                      <tr>
                        <th>ISM</th>
                        <th>TELEFON</th>
                        <th>XABAR</th>
                        <th>HOLAT</th>
                        <th>AMALLAR</th>
                      </tr>
                    ) : (
                      <tr>
                        <th>INVOICE</th>
                        <th>CUSTOMERS</th>
                        <th>FROM</th>
                        <th>PRICE</th>
                        <th>STATUS</th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {activeTab === 'courses' ? (
                      courses.length > 0 ? courses.map(c => (
                        <tr key={c._id || c.id}>
                          <td><strong>{c.title}</strong></td>
                          <td>{c.category}</td>
                          <td>{c.mentorName}</td>
                          <td>{c.price}</td>
                          <td><span className="status-badge process">Process</span></td>
                          <td>
                            <button className="btn-danger-dark" onClick={() => handleDeleteCourse(c._id || c.id)}>O'chirish</button>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="6" style={{ textAlign: 'center', color: '#64748b' }}>Kurslar topilmadi. Yuqoridagi tugma orqali yangi kurs qo'shing.</td></tr>
                      )
                    ) : activeTab === 'instructors' ? (
                      instructors.length > 0 ? instructors.map(i => (
                        <tr key={i._id || i.id}>
                          <td><strong>{i.name}</strong></td>
                          <td>{i.role}</td>
                          <td>{i.exp}</td>
                          <td><span className="status-badge open">Open</span></td>
                          <td>
                            <button className="btn-danger-dark" onClick={() => handleDeleteInstructor(i._id || i.id)}>O'chirish</button>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="5" style={{ textAlign: 'center', color: '#64748b' }}>O'qituvchilar topilmadi. Yuqoridagi tugma orqali yangi o'qituvchi qo'shing.</td></tr>
                      )
                    ) : activeTab === 'messages' ? (
                      messages.length > 0 ? messages.map(m => (
                        <tr key={m.id || m._id}>
                          <td><strong>{m.name}</strong></td>
                          <td>{m.phone}</td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.message}</td>
                          <td><span className="status-badge success">Success</span></td>
                          <td>
                            <button className="btn-danger-dark" onClick={() => handleDeleteMessage(m.id || m._id)}>O'chirish</button>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="5" style={{ textAlign: 'center', color: '#64748b' }}>Yangi xabarlar yo'q.</td></tr>
                      )
                    ) : (
                      defaultOrders.map(row => (
                        <tr key={row.id}>
                          <td>{row.id}</td>
                          <td>{row.customer}</td>
                          <td>{row.from}</td>
                          <td>{row.price}</td>
                          <td>
                            <span className={`status-badge ${row.status.toLowerCase()}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="table-pagination">
                <div>Showing 1 to 20 entries</div>
                <div className="pagination-pages">
                  <span>&lt;</span>
                  <span className="page-num active">1</span>
                  <span className="page-num">2</span>
                  <span className="page-num">3</span>
                  <span className="page-num">4</span>
                  <span className="page-num">5</span>
                  <span>&gt;</span>
                </div>
              </div>
            </div>

          </section>

        </main>
      </div>

      {/* MODAL FOR ADDING/EDITING */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '1.2rem' }}>
              {modalType === 'course' ? 'Yangi Kurs Qo\'shish' : 'Yangi O\'qituvchi Qo\'shish'}
            </h3>

            {modalType === 'course' ? (
              <form onSubmit={handleSaveCourse}>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Kurs nomi</label>
                  <input
                    type="text"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    required
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Kategoriya</label>
                  <input
                    type="text"
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    required
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Narxi</label>
                  <input
                    type="text"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="button" className="btn-secondary-dark" onClick={() => setShowModal(false)}>Bekor qilish</button>
                  <button type="submit" className="btn-primary-dark">Saqlash</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSaveInstructor}>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Ismi</label>
                  <input
                    type="text"
                    value={instructorForm.name}
                    onChange={(e) => setInstructorForm({ ...instructorForm, name: e.target.value, initials: e.target.value.charAt(0) })}
                    required
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Lavozimi</label>
                  <input
                    type="text"
                    value={instructorForm.role}
                    onChange={(e) => setInstructorForm({ ...instructorForm, role: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="button" className="btn-secondary-dark" onClick={() => setShowModal(false)}>Bekor qilish</button>
                  <button type="submit" className="btn-primary-dark">Saqlash</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
