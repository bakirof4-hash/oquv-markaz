import React, { useState, useEffect } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useToast } from '../../../context/ToastContext';
import axios from 'axios';

export default function SettingsView() {
  const { user, setUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState('profile');

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Zura Admin',
    email: user?.email || 'admin@itacademy.uz',
    phone: user?.phone || '+998 90 123 45 67',
  });

  // Password Form State
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passErrors, setPassErrors] = useState({});
  const [submittingPass, setSubmittingPass] = useState(false);

  // System Settings State
  const [sysSettings, setSysSettings] = useState({
    siteName: 'IT Academy Admin',
    supportEmail: 'support@itacademy.uz',
    emailNotifications: true,
    pushNotifications: true,
  });

  useEffect(() => {
    axios.get('/api/admin/settings')
      .then(res => setSysSettings(res.data))
      .catch(() => {});
  }, []);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setUser(prev => ({ ...prev, name: profileData.name, email: profileData.email, phone: profileData.phone }));
    addToast("Profil ma'lumotlari saqlandi", "success");
  };

  const handlePassSave = (e) => {
    e.preventDefault();
    const errors = {};
    if (!passData.currentPassword) errors.currentPassword = "Joriy parol majburiy";
    if (!passData.newPassword || passData.newPassword.length < 6) {
      errors.newPassword = "Yangi parol kamida 6 belgidan iborat bo'lishi kerak";
    }
    if (passData.newPassword !== passData.confirmPassword) {
      errors.confirmPassword = "Parollar mos kelmadi";
    }
    setPassErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setSubmittingPass(true);
    axios.post('/api/auth/change-password', passData)
      .then(res => {
        addToast(res.data.message, "success");
        setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      })
      .catch(err => {
        addToast(err.response?.data?.message || "Xatolik yuz berdi", "error");
      })
      .finally(() => setSubmittingPass(false));
  };

  const handleSysSettingsSave = () => {
    axios.post('/api/admin/settings', sysSettings)
      .then(() => addToast("Tizim sozlamalari saqlandi", "success"))
      .catch(() => addToast("Xatolik yuz berdi", "error"));
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">Admin Settings</h2>
        <p className="view-subtitle">Profil, xavfsizlik va tizim parametrlarini boshqarish</p>
      </div>

      <div className="tabs-bar">
        <button className={`tab-btn ${activeSubTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveSubTab('profile')}>
          👤 Profile
        </button>
        <button className={`tab-btn ${activeSubTab === 'security' ? 'active' : ''}`} onClick={() => setActiveSubTab('security')}>
          🔒 Security
        </button>
        <button className={`tab-btn ${activeSubTab === 'appearance' ? 'active' : ''}`} onClick={() => setActiveSubTab('appearance')}>
          🎨 Appearance
        </button>
        <button className={`tab-btn ${activeSubTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveSubTab('notifications')}>
          🔔 Notifications
        </button>
      </div>

      <div className="settings-card margin-top">
        {/* Profile Section */}
        {activeSubTab === 'profile' && (
          <form onSubmit={handleProfileSave} className="settings-form">
            <h3>Profil Ma'lumotlari</h3>
            <div className="form-grid-2">
              <Input label="To'liq Ismi" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} />
              <Input label="Email Manzili" type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} />
            </div>
            <Input label="Telefon Raqami" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} />
            <Button variant="primary" type="submit">Saqlash</Button>
          </form>
        )}

        {/* Security Section */}
        {activeSubTab === 'security' && (
          <form onSubmit={handlePassSave} className="settings-form">
            <h3>Xavfsizlik Sozlamalari (Parolni O'zgartirish)</h3>
            <Input
              label="Joriy Parol"
              type="password"
              value={passData.currentPassword}
              onChange={e => setPassData({ ...passData, currentPassword: e.target.value })}
              error={passErrors.currentPassword}
            />
            <Input
              label="Yangi Parol"
              type="password"
              value={passData.newPassword}
              onChange={e => setPassData({ ...passData, newPassword: e.target.value })}
              error={passErrors.newPassword}
            />
            <Input
              label="Yangi Parolni Tasdiqlang"
              type="password"
              value={passData.confirmPassword}
              onChange={e => setPassData({ ...passData, confirmPassword: e.target.value })}
              error={passErrors.confirmPassword}
            />
            <Button variant="primary" loading={submittingPass} type="submit">Parolni Yangilash</Button>
          </form>
        )}

        {/* Appearance Section */}
        {activeSubTab === 'appearance' && (
          <div className="settings-form">
            <h3>Tashqi Ko'rinish (Mavzu)</h3>
            <div className="theme-options-grid">
              <div className={`theme-card ${theme === 'dark' ? 'selected' : ''}`} onClick={() => setTheme('dark')}>
                <div className="theme-preview dark-preview">🌙</div>
                <span>Dark Mode</span>
              </div>
              <div className={`theme-card ${theme === 'light' ? 'selected' : ''}`} onClick={() => setTheme('light')}>
                <div className="theme-preview light-preview">☀️</div>
                <span>Light Mode</span>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {activeSubTab === 'notifications' && (
          <div className="settings-form">
            <h3>Bildirishnomalar Sozlamalari</h3>
            <div className="toggle-row flex-between">
              <div>
                <strong>Email Bildirishnomalar</strong>
                <p className="text-muted">Yangi buyurtmalar haqida email xabari olish</p>
              </div>
              <input
                type="checkbox"
                checked={sysSettings.emailNotifications}
                onChange={e => {
                  const updated = { ...sysSettings, emailNotifications: e.target.checked };
                  setSysSettings(updated);
                  handleSysSettingsSave();
                }}
              />
            </div>
            <hr />
            <div className="toggle-row flex-between">
              <div>
                <strong>Push Bildirishnomalar</strong>
                <p className="text-muted">Brauzer va tizim push xabarlarini yoqish</p>
              </div>
              <input
                type="checkbox"
                checked={sysSettings.pushNotifications}
                onChange={e => {
                  const updated = { ...sysSettings, pushNotifications: e.target.checked };
                  setSysSettings(updated);
                  handleSysSettingsSave();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
