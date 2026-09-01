import React, { useState, useEffect } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Modal from '../../ui/Modal';
import Badge from '../../ui/Badge';
import Pagination from '../../ui/Pagination';
import EmptyState from '../../ui/EmptyState';
import Loader from '../../ui/Loader';
import { useToast } from '../../../context/ToastContext';
import axios from 'axios';

export default function UsersView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  // Form State & Validation
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'student', status: 'active', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();
  const itemsPerPage = 6;

  const fetchUsers = () => {
    setLoading(true);
    axios.get(`/api/admin/users?search=${encodeURIComponent(search)}&role=${roleFilter}&status=${statusFilter}`)
      .then(res => setUsers(res.data))
      .catch(() => addToast("Foydalanuvchilarni yuklashda xatolik", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter]);

  const validateForm = (isEdit = false) => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Ism majburiy";
    if (!formData.email.trim()) {
      errors.email = "Email majburiy";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Yaroqsiz email formati";
    }
    if (!isEdit && (!formData.password || formData.password.length < 6)) {
      errors.password = "Parol kamida 6 belgidan iborat bo'lishi kerak";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    setSubmitting(true);
    axios.post('/api/admin/users', formData)
      .then(res => {
        addToast("Foydalanuvchi muvaffaqiyatli qo'shildi", "success");
        setShowAddModal(false);
        setFormData({ name: '', email: '', phone: '', role: 'student', status: 'active', password: '' });
        fetchUsers();
      })
      .catch(err => {
        addToast(err.response?.data?.message || "Xatolik yuz berdi", "error");
      })
      .finally(() => setSubmitting(false));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    setSubmitting(true);
    axios.put(`/api/admin/users/${activeUser.id}`, formData)
      .then(() => {
        addToast("Foydalanuvchi ma'lumotlari yangilandi", "success");
        setShowEditModal(false);
        fetchUsers();
      })
      .catch(err => {
        addToast(err.response?.data?.message || "Xatolik yuz berdi", "error");
      })
      .finally(() => setSubmitting(false));
  };

  const handleDeleteConfirm = () => {
    setSubmitting(true);
    axios.delete(`/api/admin/users/${activeUser.id}`)
      .then(() => {
        addToast("Foydalanuvchi o'chirildi", "success");
        setShowDeleteModal(false);
        fetchUsers();
      })
      .catch(() => addToast("O'chirishda xatolik yuz berdi", "error"))
      .finally(() => setSubmitting(false));
  };

  const handleBulkAction = (action) => {
    if (selectedIds.length === 0) return;
    axios.post('/api/admin/users/bulk-action', { ids: selectedIds, action })
      .then(res => {
        addToast(res.data.message, "success");
        setSelectedIds([]);
        fetchUsers();
      })
      .catch(() => addToast("Amalni bajarishda xatolik", "error"));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(users.map(u => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Pagination Math
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="view-container">
      <div className="view-header flex-between">
        <div>
          <h2 className="view-title">Users Management</h2>
          <p className="view-subtitle">Foydalanuvchilar ro'yxati, rollar va kirish huquqlari</p>
        </div>
        <Button variant="primary" icon="➕" onClick={() => {
          setFormData({ name: '', email: '', phone: '', role: 'student', status: 'active', password: '' });
          setFormErrors({});
          setShowAddModal(true);
        }}>
          Yangi Foydalanuvchi
        </Button>
      </div>

      {/* Filter and Control Bar */}
      <div className="filter-card">
        <div className="filter-grid">
          <Input
            placeholder="Ism yoki email bo'yicha qidiruv..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon="🔍"
          />
          <Select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            options={[
              { label: "Barcha Rollar", value: "" },
              { label: "Admin", value: "admin" },
              { label: "Teacher", value: "teacher" },
              { label: "Student", value: "student" },
            ]}
          />
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            options={[
              { label: "Barcha Holatlar", value: "" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
        </div>

        {selectedIds.length > 0 && (
          <div className="bulk-actions-bar">
            <span>{selectedIds.length} ta tanlandi:</span>
            <Button size="sm" variant="success" onClick={() => handleBulkAction('active')}>Faollashtirish</Button>
            <Button size="sm" variant="warning" onClick={() => handleBulkAction('inactive')}>Deaktiv qilish</Button>
            <Button size="sm" variant="danger" onClick={() => handleBulkAction('delete')}>O'chirish</Button>
          </div>
        )}
      </div>

      {/* Users Table */}
      {loading ? (
        <Loader text="Foydalanuvchilar ro'yxati yuklanmoqda..." />
      ) : paginatedUsers.length === 0 ? (
        <EmptyState title="Foydalanuvchilar topilmadi" description="Qidiruv yoki filtrlarni o'zgartiring" />
      ) : (
        <div className="table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === users.length && users.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Foydalanuvchi</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Holat</th>
                <th>Yaratilgan</th>
                <th>Harakatlar</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(u => (
                <tr key={u.id} className={selectedIds.includes(u.id) ? 'selected-row' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(u.id)}
                      onChange={() => handleSelectOne(u.id)}
                    />
                  </td>
                  <td>
                    <div className="table-user-cell">
                      <div className="avatar-circle">{u.name[0]?.toUpperCase()}</div>
                      <span className="user-name">{u.name}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <Badge variant={u.role === 'admin' ? 'danger' : u.role === 'teacher' ? 'warning' : 'info'}>
                      {u.role}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant={u.status === 'active' ? 'success' : 'secondary'}>
                      {u.status}
                    </Badge>
                  </td>
                  <td>{u.created_at}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-action-btn" title="Ko'rish" onClick={() => { setActiveUser(u); setShowViewModal(true); }}>👁️</button>
                      <button className="icon-action-btn" title="Tahrirlash" onClick={() => {
                        setActiveUser(u);
                        setFormData({ name: u.name, email: u.email, phone: u.phone, role: u.role, status: u.status });
                        setFormErrors({});
                        setShowEditModal(true);
                      }}>✏️</button>
                      <button className="icon-action-btn danger" title="O'chirish" onClick={() => { setActiveUser(u); setShowDeleteModal(true); }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Yangi Foydalanuvchi Qo'shish"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Bekor qilish</Button>
            <Button variant="primary" loading={submitting} onClick={handleAddSubmit}>Saqlash</Button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit}>
          <Input label="To'liq Ismi" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} error={formErrors.name} placeholder="Masalan: Jamshid Aliyev" />
          <Input label="Email Manzili" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} error={formErrors.email} placeholder="jamshid@gmail.com" />
          <Input label="Telefon" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+998 90 123 45 67" />
          <Input label="Parol" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} error={formErrors.password} placeholder="••••••••" />
          <div className="form-grid-2">
            <Select label="Roli" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} options={[{ label: "Student", value: "student" }, { label: "Teacher", value: "teacher" }, { label: "Admin", value: "admin" }]} />
            <Select label="Holati" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} options={[{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }]} />
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Foydalanuvchini Tahrirlash"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Bekor qilish</Button>
            <Button variant="primary" loading={submitting} onClick={handleEditSubmit}>Saqlash</Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit}>
          <Input label="To'liq Ismi" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} error={formErrors.name} />
          <Input label="Email Manzili" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} error={formErrors.email} />
          <Input label="Telefon" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          <div className="form-grid-2">
            <Select label="Roli" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} options={[{ label: "Student", value: "student" }, { label: "Teacher", value: "teacher" }, { label: "Admin", value: "admin" }]} />
            <Select label="Holati" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} options={[{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }]} />
          </div>
        </form>
      </Modal>

      {/* View User Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Foydalanuvchi Ma'lumotlari"
        footer={<Button variant="secondary" onClick={() => setShowViewModal(false)}>Yopish</Button>}
      >
        {activeUser && (
          <div className="user-details-card">
            <div className="user-details-header">
              <div className="avatar-circle large">{activeUser.name[0]?.toUpperCase()}</div>
              <div>
                <h4>{activeUser.name}</h4>
                <span className="text-muted">{activeUser.email}</span>
              </div>
            </div>
            <hr />
            <div className="details-row"><strong>ID:</strong> #{activeUser.id}</div>
            <div className="details-row"><strong>Telefon:</strong> {activeUser.phone || 'Kiritilmagan'}</div>
            <div className="details-row"><strong>Rol:</strong> <Badge>{activeUser.role}</Badge></div>
            <div className="details-row"><strong>Holat:</strong> <Badge variant={activeUser.status === 'active' ? 'success' : 'secondary'}>{activeUser.status}</Badge></div>
            <div className="details-row"><strong>Ro'yxatdan o'tgan:</strong> {activeUser.created_at}</div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Foydalanuvchini O'chirish"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Bekor qilish</Button>
            <Button variant="danger" loading={submitting} onClick={handleDeleteConfirm}>O'chirish</Button>
          </>
        }
      >
        <p>Haqiqatan ham <strong>{activeUser?.name}</strong> foydalanuvchisini o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.</p>
      </Modal>
    </div>
  );
}
