import React, { useState, useEffect } from 'react';
import { useLms } from '../../../context/LmsContext';
import { useToast } from '../../../context/ToastContext';
import { 
  IconUser, 
  IconPlus, 
  IconEdit, 
  IconDelete, 
  IconSearch, 
  IconFilter, 
  IconCheck, 
  IconX, 
  IconCourses,
  IconSparkles,
  IconEye
} from '../../common/SvgIcons';
import axios from 'axios';

const REAL_DATABASE_STUDENTS = [
  {
    id: 'db_1',
    name: 'Umidjon Bakirov',
    email: 'bakirof4@gmail.com',
    phone: '+998 90 123 45 67',
    courseId: 'c1',
    progress: 75,
    status: 'active',
    joinedDate: '2025-01-10'
  },
  {
    id: 'db_2',
    name: 'Abdulazim Bakirov',
    email: 'bakirof@gmail.com',
    phone: '+998 91 987 65 43',
    courseId: 'c2',
    progress: 40,
    status: 'active',
    joinedDate: '2025-01-18'
  },
  {
    id: 'db_3',
    name: 'Student User',
    email: 'st110cff85@ex.com',
    phone: '+998 93 555 44 33',
    courseId: 'c3',
    progress: 15,
    status: 'active',
    joinedDate: '2025-02-02'
  },
  {
    id: 'db_4',
    name: 'Test User',
    email: 'testa26d2bfd@ex.com',
    phone: '+998 94 111 22 33',
    courseId: 'c1',
    progress: 50,
    status: 'active',
    joinedDate: '2025-02-10'
  }
];

export default function StudentsView() {
  const { courses, getCourseById } = useLms();
  const { addToast } = useToast();

  const loadMergedStudents = () => {
    let registeredList = [];
    const savedReg = localStorage.getItem('registered_students');
    if (savedReg) {
      try {
        const parsedReg = JSON.parse(savedReg);
        if (Array.isArray(parsedReg)) registeredList = parsedReg;
      } catch (e) {}
    }

    const merged = [...registeredList];
    REAL_DATABASE_STUDENTS.forEach(s => {
      if (!merged.some(m => m.email.toLowerCase() === s.email.toLowerCase())) {
        merged.push(s);
      }
    });
    return merged;
  };

  const [students, setStudents] = useState(loadMergedStudents);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [deletingStudentId, setDeletingStudentId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    courseId: courses[0]?.id || 'c1',
    progress: 0,
    status: 'active'
  });

  useEffect(() => {
    localStorage.setItem('registered_students', JSON.stringify(students));
  }, [students]);

  // Try fetching real users from backend API if available
  useEffect(() => {
    axios.get('/api/admin/users?role=student')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const apiStudents = res.data.map(u => ({
            id: 's_' + u.id,
            name: u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : (u.name || u.username || u.email),
            email: u.email || u.username,
            phone: u.phone || '+998 90 000 00 00',
            courseId: 'c1',
            progress: 50,
            status: u.status || 'active',
            joinedDate: u.created_at || new Date().toISOString().split('T')[0]
          }));
          
          setStudents(prev => {
            const merged = [...apiStudents];
            prev.forEach(p => {
              if (!merged.some(m => m.email.toLowerCase() === p.email.toLowerCase())) merged.push(p);
            });
            return merged;
          });
        }
      })
      .catch(() => {
        // Local fallback intact
      });
  }, []);



  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.phone.includes(searchTerm);
    const matchesCourse = selectedCourseFilter === 'all' || student.courseId === selectedCourseFilter;
    const matchesStatus = selectedStatusFilter === 'all' || student.status === selectedStatusFilter;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      courseId: courses[0]?.id || 'c1',
      progress: 0,
      status: 'active'
    });
    setEditingStudent(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      courseId: student.courseId,
      progress: student.progress,
      status: student.status
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...s, ...formData } : s));
      if (addToast) addToast("O'quvchi ma'lumotlari yangilandi", 'success');
    } else {
      const newStudent = {
        id: 's_' + Date.now(),
        ...formData,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      setStudents(prev => [newStudent, ...prev]);
      if (addToast) addToast("Yangi o'quvchi muvaffaqiyatli qo'shildi", 'success');
    }
    setShowAddModal(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingStudentId) {
      setStudents(prev => prev.filter(s => s.id !== deletingStudentId));
      if (addToast) addToast("O'quvchi tizimdan o'chirildi", 'info');
      setDeletingStudentId(null);
    }
  };

  const resetDemoStudents = () => {
    setStudents(REAL_DATABASE_STUDENTS);
    localStorage.setItem('registered_students', JSON.stringify(REAL_DATABASE_STUDENTS));
    if (addToast) addToast("Haqiqiy o'quvchilar ro'yxati qayta tiklandi!", 'info');
  };


  return (
    <div className="students-view-wrapper">
      {/* HEADER */}
      <div className="page-header-bar">
        <div className="page-header-title-group">
          <h1 className="page-title">
            <IconUser size={28} className="text-cyan-400" />
            O'quvchilar Boshqaruvi
          </h1>
          <p className="page-description">
            Platformadagi barcha talabalar va o'quvchilar ro'yxati ({students.length} ta o'quvchi)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="ag-btn ag-btn-secondary" onClick={resetDemoStudents} title="Demo o'quvchilarni tiklash">
            <IconSparkles size={16} />
            Demo Tiklash
          </button>
          <button className="ag-btn ag-btn-primary" onClick={handleOpenAddModal}>
            <IconPlus size={18} />
            Yangi O'quvchi Qo'shish
          </button>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="control-toolbar">
        <div className="topbar-search-wrap" style={{ width: 300 }}>
          <IconSearch size={18} className="topbar-search-icon" />
          <input 
            type="text" 
            className="topbar-search-input" 
            placeholder="Ism, email yoki telefon bo'yicha qidiruv..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--ag-text-muted)', fontSize: '0.85rem' }}>
            <IconFilter size={16} />
            Filter:
          </div>

          <select 
            className="ag-select"
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
          >
            <option value="all">Barcha Kurslar</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>

          <select 
            className="ag-select" 
            value={selectedStatusFilter} 
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
          >
            <option value="all">Barcha Holatlar</option>
            <option value="active">Aktiv</option>
            <option value="inactive">Muzlatilgan</option>
          </select>
        </div>
      </div>

      {/* TABLE CARD */}
      {filteredStudents.length === 0 ? (
        <div className="ag-empty-card">
          <div className="empty-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--ag-primary)' }}>
            <IconUser size={32} />
          </div>
          <div className="empty-title">Birorta ham o'quvchi topilmadi</div>
          <div className="empty-desc">Qidiruv yoki filtrlarni o'zgartirib qayta urinib ko'ring.</div>
          <button className="ag-btn ag-btn-primary" style={{ marginTop: '1rem' }} onClick={handleOpenAddModal}>
            <IconPlus size={18} /> Yangi O'quvchi Qo'shish
          </button>
        </div>
      ) : (
        <div className="table-card" style={{
          background: 'var(--ag-card-bg)',
          borderRadius: 'var(--ag-radius-lg)',
          border: '1px solid var(--ag-glass-border)',
          overflow: 'hidden',
          boxShadow: 'var(--ag-shadow-glass)'
        }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--ag-glass-border)' }}>
                <th style={{ padding: '1rem 1.25rem', color: 'var(--ag-text-muted)', fontSize: '0.85rem' }}>O'quvchi</th>
                <th style={{ padding: '1rem 1.25rem', color: 'var(--ag-text-muted)', fontSize: '0.85rem' }}>Aloqa Ma'lumoti</th>
                <th style={{ padding: '1rem 1.25rem', color: 'var(--ag-text-muted)', fontSize: '0.85rem' }}>Azo Bo'lgan Kurs</th>
                <th style={{ padding: '1rem 1.25rem', color: 'var(--ag-text-muted)', fontSize: '0.85rem' }}>O'zlashtirish Progressi</th>
                <th style={{ padding: '1rem 1.25rem', color: 'var(--ag-text-muted)', fontSize: '0.85rem' }}>Holat</th>
                <th style={{ padding: '1rem 1.25rem', color: 'var(--ag-text-muted)', fontSize: '0.85rem', textAlign: 'right' }}>Harakatlar</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => {
                const course = getCourseById(student.courseId);
                const isActive = student.status === 'active';

                return (
                  <tr key={student.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', transition: 'background 0.2s ease' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '1rem',
                          boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
                        }}>
                          {student.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--ag-text-main)', fontSize: '0.95rem' }}>{student.name}</div>
                          <div style={{ fontSize: '0.775rem', color: 'var(--ag-text-dim)' }}>Qo'shilgan: {student.joinedDate}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--ag-text-main)' }}>{student.email}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--ag-text-muted)' }}>{student.phone}</div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', fontSize: '0.875rem', fontWeight: 500 }}>
                        <IconCourses size={14} />
                        <span>{course ? course.title : 'Kurs tanlanmagan'}</span>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', width: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: 600 }}>
                        <span style={{ color: 'var(--ag-text-muted)' }}>Progress:</span>
                        <span style={{ color: '#818cf8' }}>{student.progress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${student.progress}%`,
                          background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)',
                          borderRadius: '99px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        padding: '0.3rem 0.75rem',
                        borderRadius: '99px',
                        fontSize: '0.775rem',
                        fontWeight: 600,
                        background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: isActive ? '#6ee7b7' : '#fca5a5',
                        border: `1px solid ${isActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                      }}>
                        {isActive ? 'Aktiv' : 'Muzlatilgan'}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          className="ag-btn ag-btn-secondary ag-btn-icon-only" 
                          title="Ko'rish" 
                          onClick={() => setViewingStudent(student)}
                        >
                          <IconEye size={16} />
                        </button>
                        <button 
                          className="ag-btn ag-btn-secondary ag-btn-icon-only" 
                          title="Tahrirlash" 
                          onClick={() => handleOpenEditModal(student)}
                        >
                          <IconEdit size={16} />
                        </button>
                        <button 
                          className="ag-btn ag-btn-danger ag-btn-icon-only" 
                          title="O'chirish" 
                          onClick={() => setDeletingStudentId(student.id)}
                        >
                          <IconDelete size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW STUDENT DETAILS MODAL */}
      {viewingStudent && (
        <div className="ag-modal-backdrop" onClick={() => setViewingStudent(null)}>
          <div className="ag-modal-content" style={{ maxWidth: 480, background: '#0f172a' }} onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header">
              <h2 className="ag-modal-title" style={{ color: '#fff' }}>
                <IconUser size={22} className="text-cyan-400" />
                O'quvchi Profil Ma'lumotlari
              </h2>
              <button className="ag-btn ag-btn-secondary ag-btn-icon-only" onClick={() => setViewingStudent(null)}>
                <IconX size={18} />
              </button>
            </div>

            <div className="ag-modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '1.5rem',
                  fontWeight: 700
                }}>
                  {viewingStudent.name[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>{viewingStudent.name}</h3>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{viewingStudent.email}</span>
                </div>
              </div>

              <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Telefon:</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{viewingStudent.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Azo Bo'lgan Kurs:</span>
                  <span style={{ color: '#818cf8', fontWeight: 600 }}>
                    {getCourseById(viewingStudent.courseId)?.title || 'General'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>O'zlashtirish Darajasi:</span>
                  <span style={{ color: '#6ee7b7', fontWeight: 600 }}>{viewingStudent.progress}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Holati:</span>
                  <span style={{ color: viewingStudent.status === 'active' ? '#6ee7b7' : '#fca5a5', fontWeight: 600 }}>
                    {viewingStudent.status === 'active' ? 'Aktiv' : 'Muzlatilgan'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Ro'yxatdan o'tgan sana:</span>
                  <span style={{ color: '#cbd5e1' }}>{viewingStudent.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="ag-modal-footer">
              <button className="ag-btn ag-btn-secondary" onClick={() => setViewingStudent(null)}>
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT STUDENT MODAL */}
      {showAddModal && (
        <div className="ag-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="ag-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header">
              <h2 className="ag-modal-title">
                <IconUser size={22} className="text-cyan-400" />
                {editingStudent ? 'O\'quvchini Tahrirlash' : 'Yangi O\'quvchi Qo\'shish'}
              </h2>
              <button className="ag-btn ag-btn-secondary ag-btn-icon-only" onClick={() => setShowAddModal(false)}>
                <IconX size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="ag-modal-body">
                <div className="form-group">
                  <label className="form-label">To'liq Ismi *</label>
                  <input 
                    type="text" 
                    className="ag-input" 
                    required 
                    placeholder="Masalan: Sardor Usmonov"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Pochta *</label>
                  <input 
                    type="email" 
                    className="ag-input" 
                    required 
                    placeholder="student@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Telefon Raqami *</label>
                  <input 
                    type="text" 
                    className="ag-input" 
                    required 
                    placeholder="+998 90 123 45 67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Azo Bo'ladigan Kurs *</label>
                  <select 
                    className="ag-select"
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Progress (%)</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      className="ag-input" 
                      value={formData.progress}
                      onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Holat *</label>
                    <select 
                      className="ag-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Aktiv</option>
                      <option value="inactive">Muzlatilgan</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="ag-modal-footer">
                <button type="button" className="ag-btn ag-btn-secondary" onClick={() => setShowAddModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="ag-btn ag-btn-primary">
                  <IconCheck size={18} />
                  {editingStudent ? 'Saqlash' : 'O\'quvchi Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingStudentId && (
        <div className="ag-modal-backdrop" onClick={() => setDeletingStudentId(null)}>
          <div className="ag-modal-content" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header">
              <h2 className="ag-modal-title" style={{ color: '#ef4444' }}>
                <IconDelete size={22} />
                O'quvchini o'chirishni tasdiqlang
              </h2>
              <button className="ag-btn ag-btn-secondary ag-btn-icon-only" onClick={() => setDeletingStudentId(null)}>
                <IconX size={18} />
              </button>
            </div>

            <div className="ag-modal-body">
              <p style={{ color: 'var(--ag-text-main)', margin: 0 }}>
                Haqiqatdan ham ushbu o'quvchini platformadan o'chirib tashlamoqchimisiz?
              </p>
            </div>

            <div className="ag-modal-footer">
              <button className="ag-btn ag-btn-secondary" onClick={() => setDeletingStudentId(null)}>
                Bekor qilish
              </button>
              <button className="ag-btn ag-btn-danger" onClick={handleDeleteConfirm}>
                <IconDelete size={18} />
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
