import React, { useState, useEffect } from 'react';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import EmptyState from '../../ui/EmptyState';
import Loader from '../../ui/Loader';
import { useToast } from '../../../context/ToastContext';
import axios from 'axios';

export default function NotificationsView() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread'
  const { addToast } = useToast();

  const fetchNotifications = () => {
    setLoading(true);
    axios.get('/api/admin/notifications')
      .then(res => setNotifications(res.data))
      .catch(() => addToast("Xabarnomalarni yuklashda xatolik", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = (id) => {
    axios.put(`/api/admin/notifications/${id}`, { isRead: true })
      .then(() => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        addToast("O'qildi deb belgilandi", "info");
      })
      .catch(() => {});
  };

  const handleMarkAllRead = () => {
    axios.post('/api/admin/notifications', { action: 'mark_all_read' })
      .then(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        addToast("Barcha xabarnomalar o'qildi deb belgilandi", "success");
      })
      .catch(() => {});
  };

  const handleDelete = (id) => {
    axios.delete(`/api/admin/notifications/${id}`)
      .then(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        addToast("Xabarnoma o'chirildi", "info");
      })
      .catch(() => {});
  };

  const filtered = notifications.filter(n => filter === 'all' || !n.isRead);

  return (
    <div className="view-container">
      <div className="view-header flex-between">
        <div>
          <h2 className="view-title">Notification Center</h2>
          <p className="view-subtitle">Tizimdagi muhim bildirishnomalar va ogohlantirishlar</p>
        </div>
        <div className="flex-gap">
          <Button variant="secondary" onClick={() => setFilter(prev => prev === 'all' ? 'unread' : 'all')}>
            {filter === 'all' ? "Faqat o'qilmaganlar" : "Barchasi"}
          </Button>
          <Button variant="primary" onClick={handleMarkAllRead}>
            Barchasini O'qildi Qilish
          </Button>
        </div>
      </div>

      {loading ? (
        <Loader text="Xabarnomalar yuklanmoqda..." />
      ) : filtered.length === 0 ? (
        <EmptyState title="Xabarnomalar yo'q" description="Sizda hech qanday bildirishnoma mavjud emas." icon="🔔" />
      ) : (
        <div className="notifications-list-card">
          {filtered.map(n => (
            <div key={n.id} className={`notification-row ${!n.isRead ? 'unread' : ''}`}>
              <div className="notification-row-icon">
                {n.type === 'success' ? '✅' : n.type === 'warning' ? '⚠️' : n.type === 'error' ? '❌' : 'ℹ️'}
              </div>
              <div className="notification-row-content">
                <div className="flex-between">
                  <h4 className="notification-title">{n.title}</h4>
                  <span className="notification-time">{n.createdAt}</span>
                </div>
                <p className="notification-msg">{n.message}</p>
              </div>
              <div className="notification-row-actions">
                {!n.isRead && (
                  <button className="icon-action-btn" title="O'qildi qilish" onClick={() => handleMarkRead(n.id)}>✓</button>
                )}
                <button className="icon-action-btn danger" title="O'chirish" onClick={() => handleDelete(n.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
