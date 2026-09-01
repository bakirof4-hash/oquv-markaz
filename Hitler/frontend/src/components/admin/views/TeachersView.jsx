import React, { useState } from 'react';
import { useLms } from '../../../context/LmsContext';
import { 
  IconTeachers, 
  IconPlus, 
  IconEdit, 
  IconDelete, 
  IconSearch, 
  IconCourses, 
  IconVideos, 
  IconX, 
  IconCheck,
  IconShield,
  IconSparkles
} from '../../common/SvgIcons';

export default function TeachersView() {
  const { 
    teachers, 
    courses, 
    videos, 
    addTeacher, 
    updateTeacher, 
    deleteTeacher,
    setCurrentRole,
    setActiveTeacherId
  } = useLms();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [deletingTeacherId, setDeletingTeacherId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    password: 'teacher123',
    bio: '',
    avatar: ''
  });

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      subject: 'Frontend & React',
      password: 'teacher123',
      bio: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
    });
    setEditingTeacher(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
      password: teacher.password || 'teacher123',
      bio: teacher.bio || '',
      avatar: teacher.avatar
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingTeacher) {
      updateTeacher(editingTeacher.id, formData);
    } else {
      addTeacher(formData);
    }
    setShowAddModal(false);
  };

  const handleConfirmDelete = () => {
    if (deletingTeacherId) {
      deleteTeacher(deletingTeacherId);
      setDeletingTeacherId(null);
    }
  };

  // Direct switch to this specific teacher's Ustoz Panel
  const handleOpenTeacherWorkspace = (teacherId) => {
    setActiveTeacherId(teacherId);
    setCurrentRole('teacher');
  };

  return (
    <div className="teachers-view-wrapper">
      {/* PAGE HEADER */}
      <div className="page-header-bar">
        <div className="page-header-title-group">
          <h1 className="page-title">
            <IconTeachers size={28} className="text-violet-400" />
            Ustozlar va Ustoz Panellari Boshqaruvi
          </h1>
          <p className="page-description">
            Admin panel orqali yangi ustozlar va ularga tegishli **Ustoz Paneli** yaratish hamda ularning ish stoliga o'tish
          </p>
        </div>

        <button className="ag-btn ag-btn-primary" onClick={handleOpenAddModal}>
          <IconPlus size={18} />
          Yangi Ustoz & Panel Yaratish
        </button>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="control-toolbar">
        <div className="topbar-search-wrap" style={{ width: 320 }}>
          <IconSearch size={18} className="topbar-search-icon" />
          <input 
            type="text" 
            className="topbar-search-input" 
            placeholder="Ustozlarni qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TEACHERS GRID */}
      {filteredTeachers.length === 0 ? (
        <div className="ag-empty-card">
          <div className="empty-icon-wrap" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--ag-accent)' }}>
            <IconTeachers size={32} />
          </div>
          <div className="empty-title">Ustozlar topilmadi</div>
          <div className="empty-desc">Yangi instruktor va ustoz paneli yaratish uchun quyidagi tugmani bosing.</div>
          <button className="ag-btn ag-btn-primary" onClick={handleOpenAddModal}>
            <IconPlus size={18} />
            Yangi Ustoz Yaratish
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredTeachers.map(teacher => {
            const teacherCourses = courses.filter(c => c.teacherId === teacher.id);
            const teacherVideos = videos.filter(v => {
              const c = courses.find(course => course.id === v.courseId);
              return c && c.teacherId === teacher.id;
            });

            return (
              <div key={teacher.id} className="course-card">
                <div className="card-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <img 
                      src={teacher.avatar} 
                      alt={teacher.name} 
                      style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--ag-accent)' }} 
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: 0 }}>{teacher.name}</h3>
                      <div style={{ fontSize: '0.8rem', color: '#a78bfa', fontWeight: 600, marginTop: 2 }}>{teacher.subject}</div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--ag-text-muted)', marginTop: 2 }}>{teacher.email}</div>
                    </div>
                  </div>

                  <p className="card-description" style={{ marginBottom: '1rem' }}>
                    {teacher.bio || "O'qituvchi haqida qo'shimcha ma'lumot kiritilmagan."}
                  </p>

                  <div style={{
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: 'var(--ag-radius-md)',
                    padding: '0.65rem 0.85rem',
                    marginBottom: '1rem',
                    fontSize: '0.775rem',
                    color: '#a5b4fc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>Panel Paroli: <strong>{teacher.password || 'teacher123'}</strong></span>
                    <span className="badge-category" style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }}>
                      Panel Faol
                    </span>
                  </div>

                  <div className="card-meta-row">
                    <div className="meta-item">
                      <IconCourses size={15} />
                      <span>{teacherCourses.length} Kurslar</span>
                    </div>

                    <div className="meta-item" style={{ color: '#22d3ee' }}>
                      <IconVideos size={15} />
                      <span>{teacherVideos.length} Videolar</span>
                    </div>
                  </div>
                </div>

                <div className="card-actions-footer" style={{ flexDirection: 'column', gap: '0.5rem' }}>
                  {/* DIRECT SWITCH TO THIS TEACHER'S PANEL */}
                  <button 
                    className="ag-btn ag-btn-primary"
                    style={{ width: '100%', padding: '0.5rem 0.85rem', fontSize: '0.825rem' }}
                    onClick={() => handleOpenTeacherWorkspace(teacher.id)}
                  >
                    <IconShield size={16} />
                    <span>Ustoz Panelini Ochish</span>
                  </button>

                  <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                    <button 
                      className="ag-btn ag-btn-secondary ag-btn-icon-only"
                      style={{ flex: 1 }}
                      onClick={() => handleOpenEditModal(teacher)}
                    >
                      <IconEdit size={16} />
                      <span>Edit Profile</span>
                    </button>

                    <button 
                      className="ag-btn ag-btn-danger ag-btn-icon-only"
                      onClick={() => setDeletingTeacherId(teacher.id)}
                    >
                      <IconDelete size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT TEACHER & PANEL CREATION MODAL */}
      {showAddModal && (
        <div className="ag-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="ag-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header">
              <h2 className="ag-modal-title">
                <IconTeachers size={22} className="text-violet-400" />
                {editingTeacher ? 'Ustoz profilini tahrirlash' : 'Yangi Ustoz & Ustoz Paneli Yaratish'}
              </h2>
              <button className="ag-btn ag-btn-secondary ag-btn-icon-only" onClick={() => setShowAddModal(false)}>
                <IconX size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="ag-modal-body">
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '0.85rem', borderRadius: 'var(--ag-radius-md)', fontSize: '0.825rem', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <IconSparkles size={18} />
                  <span>Ushbu forma orqali yaratilgan ustoz uchun avtomatik shaxsiy **Ustoz Paneli** va kirish paroli shakllantiriladi.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Ustoz Ismi sharifi *</label>
                  <input 
                    type="text" 
                    className="ag-input" 
                    required 
                    placeholder="Masalan: Sardorbek Ikromov"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email Pochta (Login) *</label>
                    <input 
                      type="email" 
                      className="ag-input" 
                      required 
                      placeholder="s.ikromov@academy.uz"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Panel Paroli *</label>
                    <input 
                      type="text" 
                      className="ag-input" 
                      required 
                      placeholder="teacher123"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mutaxassisligi (Subject) *</label>
                  <input 
                    type="text" 
                    className="ag-input" 
                    required 
                    placeholder="Frontend & React, Python & AI, UI/UX..."
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Avatar Rasm URL</label>
                  <input 
                    type="url" 
                    className="ag-input" 
                    placeholder="https://images.unsplash.com/..."
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Biografiya (Tajriba va Ma'lumot)</label>
                  <textarea 
                    className="ag-input form-textarea" 
                    placeholder="Ustozning sohasi va tajribasi haqida..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
              </div>

              <div className="ag-modal-footer">
                <button type="button" className="ag-btn ag-btn-secondary" onClick={() => setShowAddModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="ag-btn ag-btn-primary">
                  <IconCheck size={18} />
                  {editingTeacher ? 'Saqlash' : 'Ustoz & Panel Yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingTeacherId && (
        <div className="ag-modal-backdrop" onClick={() => setDeletingTeacherId(null)}>
          <div className="ag-modal-content" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header">
              <h2 className="ag-modal-title" style={{ color: '#ef4444' }}>
                <IconDelete size={22} />
                Ustozni o'chirishni tasdiqlang
              </h2>
              <button className="ag-btn ag-btn-secondary ag-btn-icon-only" onClick={() => setDeletingTeacherId(null)}>
                <IconX size={18} />
              </button>
            </div>

            <div className="ag-modal-body">
              <p style={{ color: 'var(--ag-text-main)', margin: 0 }}>
                Ushbu ustozni va unga tegishli Ustoz Panelini o'chirib tashlamoqchimisiz?
              </p>
            </div>

            <div className="ag-modal-footer">
              <button className="ag-btn ag-btn-secondary" onClick={() => setDeletingTeacherId(null)}>
                Bekor qilish
              </button>
              <button className="ag-btn ag-btn-danger" onClick={handleConfirmDelete}>
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
