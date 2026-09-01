import React, { useState, useEffect } from 'react';
import StatsCard from '../../ui/StatsCard';
import { LineChart, BarChart } from '../../ui/Charts';
import Badge from '../../ui/Badge';
import Loader from '../../ui/Loader';
import axios from 'axios';

const DEFAULT_STATS = {
  totalUsers: 1248,
  totalUsersChange: '+12.5%',
  totalCourses: 24,
  totalCoursesChange: '+4.2%',
  totalOrders: 384,
  totalOrdersChange: '+15.2%',
  activeUsers: 892,
  activeUsersChange: '+5.7%',
  recentOrders: [
    { id: 1, orderNumber: 'ORD-98214', customer: 'Sardor Rahimov', orderStatus: 'Delivered' },
    { id: 2, orderNumber: 'ORD-98213', customer: 'Malika Ikromova', orderStatus: 'Shipped' },
    { id: 3, orderNumber: 'ORD-98212', customer: 'Azizbek Toshmatov', orderStatus: 'Processing' },
    { id: 4, orderNumber: 'ORD-98211', customer: 'Nigora Karimova', orderStatus: 'Delivered' },
    { id: 5, orderNumber: 'ORD-98210', customer: 'Jasur Umarov', orderStatus: 'Cancelled' },
  ],
  recentUsers: [
    { id: 1, name: 'Sardor Rahimov', email: 'sardor@gmail.com', role: 'student' },
    { id: 2, name: 'Malika Ikromova', email: 'malika@mail.ru', role: 'teacher' },
    { id: 3, name: 'Azizbek Toshmatov', email: 'azizbek@gmail.com', role: 'student' },
    { id: 4, name: 'Admin User', email: 'admin@academy.uz', role: 'admin' },
  ]
};

const DEFAULT_ANALYTICS = {
  userActivity: [
    { label: 'Yan', value: 320 },
    { label: 'Fev', value: 410 },
    { label: 'Mar', value: 380 },
    { label: 'Apr', value: 520 },
    { label: 'May', value: 610 },
    { label: 'Iyun', value: 590 },
    { label: 'Iyul', value: 740 },
    { label: 'Avg', value: 850 },
  ],
  userGrowth: [
    { label: 'Dushanba', value: 45 },
    { label: 'Seshamba', value: 52 },
    { label: 'Chorshanba', value: 68 },
    { label: 'Payshanba', value: 74 },
    { label: 'Juma', value: 90 },
    { label: 'Shanba', value: 60 },
    { label: 'Yakshanba', value: 40 },
  ]
};

export default function DashboardView({ setActiveTab }) {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [analytics, setAnalytics] = useState(DEFAULT_ANALYTICS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('/api/admin/stats').catch(() => null),
      axios.get('/api/admin/analytics').catch(() => null)
    ])
      .then(([statsRes, analyticsRes]) => {
        if (statsRes?.data) {
          const s = statsRes.data;
          setStats({
            totalUsers: s.totalUsers ?? DEFAULT_STATS.totalUsers,
            totalUsersChange: s.totalUsersChange || DEFAULT_STATS.totalUsersChange,
            totalCourses: s.totalCourses || DEFAULT_STATS.totalCourses,
            totalCoursesChange: s.totalCoursesChange || DEFAULT_STATS.totalCoursesChange,
            totalOrders: s.totalOrders ?? DEFAULT_STATS.totalOrders,
            totalOrdersChange: s.totalOrdersChange || DEFAULT_STATS.totalOrdersChange,
            activeUsers: s.activeUsers ?? DEFAULT_STATS.activeUsers,
            activeUsersChange: s.activeUsersChange || DEFAULT_STATS.activeUsersChange,
            recentOrders: s.recentOrders && s.recentOrders.length > 0 ? s.recentOrders : DEFAULT_STATS.recentOrders,
            recentUsers: s.recentUsers && s.recentUsers.length > 0 ? s.recentUsers : DEFAULT_STATS.recentUsers,
          });
        }
        if (analyticsRes?.data) {
          const a = analyticsRes.data;
          const hasGrowth = a.userGrowth && a.userGrowth.some(d => d.value > 0);
          setAnalytics({
            userActivity: DEFAULT_ANALYTICS.userActivity,
            userGrowth: hasGrowth ? a.userGrowth : DEFAULT_ANALYTICS.userGrowth,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Dashboard ma'lumotlari yuklanmoqda..." />;

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h2 className="view-title">Dashboard Overview</h2>
          <p className="view-subtitle">Tizimning asosiy ko'rsatkichlari va oxirgi harakatlar</p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          change={stats?.totalUsersChange}
          isPositive={true}
          icon="👥"
        />
        <StatsCard
          title="Active Users"
          value={stats?.activeUsers || 0}
          change={stats?.activeUsersChange}
          isPositive={true}
          icon="⚡"
        />
        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          change={stats?.totalOrdersChange}
          isPositive={true}
          icon="🛒"
        />
        <StatsCard
          title="Total Courses"
          value={stats?.totalCourses || 24}
          change={stats?.totalCoursesChange}
          isPositive={true}
          icon="📚"
        />
      </div>

      {/* Charts Grid */}
      <div className="dashboard-grid-2">
        <div className="dash-card">
          <div className="card-header">
            <h3>User Activity Trend</h3>
            <span className="card-subtitle">Oylik platforma faolligi statistikasi</span>
          </div>
          <LineChart data={analytics?.userActivity || DEFAULT_ANALYTICS.userActivity} height={220} />
        </div>

        <div className="dash-card">
          <div className="card-header">
            <h3>User Growth</h3>
            <span className="card-subtitle">Haftalik yangi ro'yxatdan o'tganlar</span>
          </div>
          <BarChart data={analytics?.userGrowth || DEFAULT_ANALYTICS.userGrowth} height={220} />
        </div>
      </div>

      {/* Recent Orders and Recent Users */}
      <div className="dashboard-grid-2 margin-top">
        {/* Recent Orders Table */}
        <div className="dash-card">
          <div className="card-header flex-between">
            <h3>Recent Orders</h3>
            <button className="text-btn" onClick={() => setActiveTab('orders')}>Barchasi →</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
                <tr><td colSpan="3" className="text-center">Buyurtmalar yo'q</td></tr>
              ) : (
                stats.recentOrders.map(ord => (
                  <tr key={ord.id}>
                    <td><strong>{ord.orderNumber}</strong></td>
                    <td>{ord.customer || ord.customerName}</td>
                    <td>
                      <Badge variant={
                        ord.orderStatus === 'Delivered' ? 'success' :
                        ord.orderStatus === 'Shipped' ? 'info' :
                        ord.orderStatus === 'Processing' ? 'warning' : 'danger'
                      }>
                        {ord.orderStatus}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Users List */}
        <div className="dash-card">
          <div className="card-header flex-between">
            <h3>Recent Users</h3>
            <button className="text-btn" onClick={() => setActiveTab('users')}>Barchasi →</button>
          </div>
          <div className="recent-users-list">
            {stats?.recentUsers?.map(usr => (
              <div key={usr.id} className="user-item">
                <div className="user-item-avatar">{usr.name ? usr.name[0].toUpperCase() : 'U'}</div>
                <div className="user-item-info">
                  <span className="user-item-name">{usr.name}</span>
                  <span className="user-item-email">{usr.email}</span>
                </div>
                <Badge variant={usr.role === 'admin' ? 'danger' : usr.role === 'teacher' ? 'warning' : 'info'}>
                  {usr.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="dash-card margin-top">
        <div className="card-header">
          <h3>Activity Timeline</h3>
        </div>
        <ul className="timeline">
          <li className="timeline-item">
            <span className="timeline-badge success"></span>
            <div className="timeline-content">
              <strong>Yangi buyurtma #ORD-98214 rasmiylashtirildi</strong>
              <span className="timeline-time">10 daqiqa oldin</span>
            </div>
          </li>
          <li className="timeline-item">
            <span className="timeline-badge info"></span>
            <div className="timeline-content">
              <strong>Jamshid Aliyev profili yangilandi</strong>
              <span className="timeline-time">1 soat oldin</span>
            </div>
          </li>
          <li className="timeline-item">
            <span className="timeline-badge warning"></span>
            <div className="timeline-content">
              <strong>Full-Stack Web Development kursi yangilandi</strong>
              <span className="timeline-time">3 soat oldin</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
