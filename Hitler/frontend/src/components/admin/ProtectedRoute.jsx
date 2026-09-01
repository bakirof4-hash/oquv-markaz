import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../ui/Loader';
import { IconShield } from '../common/SvgIcons';

export default function ProtectedRoute({ children, allowedRoles = ['admin'] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader text="Tizimga kirish tekshirilmoqda..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="access-denied-container">
        <h2>
          <IconShield size={24} className="text-red-500" />
          Ruxsat cheklangan
        </h2>
        <p>Ushbu sahifaga kirish uchun admin huquqiga ega bo'lishingiz kerak.</p>
      </div>
    );
  }

  return children;
}
