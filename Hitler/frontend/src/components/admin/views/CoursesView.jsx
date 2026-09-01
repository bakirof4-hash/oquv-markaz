import React, { useState } from 'react';
import { useLms } from '../../../context/LmsContext';
import { 
  IconCourses, 
  IconPlus, 
  IconEdit, 
  IconDelete, 
  IconEye, 
  IconSearch, 
  IconFilter, 
  IconPublished, 
  IconDraft, 
  IconVideos, 
  IconX, 
  IconCheck, 
  IconPlay,
  IconClock
} from '../../common/SvgIcons';

export default function CoursesView() {
  const { 
    courses, 
    teachers, 
    addCourse, 
    updateCourse, 
    deleteCourse, 
    getTeacherById, 
    getVideosForCourse,
    addVideo 
  } = useLms();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [viewingCourse, setViewingCourse] = useState(null);
  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const [showAddVideoSubModal, setShowAddVideoSubModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    teacherId: teachers[0]?.id || '',
    category: 'Frontend',
    status: 'published'
  });

  // Video quick add state inside course detail modal
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    description: '',
    videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    thumbnail: '',
    duration: '15:00',
    status: 'published'
  });

  const categories = ['Frontend', 'Backend', 'AI & Data', 'Design', 'Mobile', 'DevOps'];

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      description: '',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      teacherId: teachers[0]?.id || '',
      category: 'Frontend',
      status: 'published'
    });
    setEditingCourse(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      teacherId: course.teacherId,
      category: course.category,
      status: course.status
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingCourse) {
      updateCourse(editingCourse.id, formData);
    } else {
      addCourse(formData);
    }
    setShowAddModal(false);
  };

  const handleConfirmDelete = () => {
    if (deletingCourseId) {
      deleteCourse(deletingCourseId);
      setDeletingCourseId(null);
    }
  };

  const handleAddVideoToCourseSubmit = (e) => {
    e.preventDefault();
    if (viewingCourse) {
      addVideo({
        ...videoFormData,
        courseId: viewingCourse.id,
        thumbnail: videoFormData.thumbnail || viewingCourse.thumbnail
      });
      setShowAddVideoSubModal(false);
      setVideoFormData({
        title: '',
        description: '',
        videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
        thumbnail: '',
        duration: '15:00',
        status: 'published'
      });
    }
  };

  return (
    <div className="courses-view-wrapper">
      {/* PAGE HEADER */}
      <div className="page-header-bar">
        <div className="page-header-title-group">
          <h1 className="page-title">
            <IconCourses size={28} className="text-indigo-400" />
            Kurslar Boshqaruvi
          </h1>
          <p className="page-description">
            Platformada yaratilgan barcha o'quv kurslarini ko'rish, tahrirlash va yangi kurs qo'shish
          </p>
        </div>

        <button className="ag-btn ag-btn-primary" onClick={handleOpenAddModal}>
          <IconPlus size={18} />
          Add Course
        </button>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="control-toolbar">
        <div className="topbar-search-wrap" style={{ width: 280 }}>
          <IconSearch size={18} className="topbar-search-icon" />
          <input 
            type="text" 
            className="topbar-search-input" 
            placeholder="Kurslarni qidirish..."
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
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Barcha Kategoriyalar</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            className="ag-select" 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Barcha Holatlar</option>
            <option value="published">Published (E'lon qilingan)</option>
            <option value="draft">Draft (Qoralama)</option>
          </select>
        </div>
      </div>

      {/* COURSES CARDS GRID */}
      {filteredCourses.length === 0 ? (
        <div className="ag-empty-card">
          <div className="empty-icon-wrap">
            <IconCourses size={32} />
          </div>
          <div className="empty-title">Birorta ham kurs topilmadi</div>
          <div className="empty-desc">Qidiruv yoki filter mezonlarini o'zgartirib ko'ring yoki yangi kurs qo'shing.</div>
          <button className="ag-btn ag-btn-primary" onClick={handleOpenAddModal}>
            <IconPlus size={18} />
            Add Course
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredCourses.map(course => {
            const teacher = getTeacherById(course.teacherId);
            const courseVideos = getVideosForCourse(course.id);
            const isPublished = course.status === 'published';

            return (
              <div key={course.id} className="course-card">
                {/* THUMBNAIL & BADGES */}
                <div className="card-media-header">
                  <img src={course.thumbnail} alt={course.title} className="card-thumbnail-img" />
                  <div className="card-badge-container">
                    <span className={`badge-status ${isPublished ? 'badge-status-published' : 'badge-status-draft'}`}>
                      {isPublished ? <IconPublished size={12} /> : <IconDraft size={12} />}
                      {course.status}
                    </span>
                    <span className="badge-category">{course.category}</span>
                  </div>
                </div>

                {/* CARD CONTENT */}
                <div className="card-body">
                  <h3 className="card-title">{course.title}</h3>
                  <p className="card-description">{course.description}</p>

                  <div className="card-meta-row">
                    <div className="teacher-info">
                      <img 
                        src={teacher?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'} 
                        alt={teacher?.name || 'Ustoz'} 
                        className="teacher-avatar-sm"
                      />
                      <span className="teacher-name-sm">{teacher ? teacher.name : 'Ustoz biriktirilmagan'}</span>
                    </div>

                    <div className="meta-item">
                      <IconVideos size={16} />
                      <span>{courseVideos.length} video</span>
                    </div>
                  </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="card-actions-footer">
                  <button 
                    className="ag-btn ag-btn-secondary ag-btn-icon-only"
                    title="Kurs tafsilotlari va videolarni ko'rish"
                    style={{ flex: 1 }}
                    onClick={() => setViewingCourse(course)}
                  >
                    <IconEye size={16} />
                    <span>View Videos</span>
                  </button>

                  <button 
                    className="ag-btn ag-btn-secondary ag-btn-icon-only"
                    title="Tahrirlash"
                    onClick={() => handleOpenEditModal(course)}
                  >
                    <IconEdit size={16} />
                  </button>

                  <button 
                    className="ag-btn ag-btn-danger ag-btn-icon-only"
                    title="O'chirish"
                    onClick={() => setDeletingCourseId(course.id)}
                  >
                    <IconDelete size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT COURSE MODAL */}
      {showAddModal && (
        <div className="ag-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="ag-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header">
              <h2 className="ag-modal-title">
                <IconCourses size={22} className="text-indigo-400" />
                {editingCourse ? 'Kursni Tahrirlash' : 'Yangi Kurs Yaratish'}
              </h2>
              <button className="ag-btn ag-btn-secondary ag-btn-icon-only" onClick={() => setShowAddModal(false)}>
                <IconX size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="ag-modal-body">
                <div className="form-group">
                  <label className="form-label">Course Title *</label>
                  <input 
                    type="text" 
                    className="ag-input" 
                    required 
                    placeholder="Masalan: Modern React 19 & Next.js Masterclass"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea 
                    className="ag-input form-textarea" 
                    required 
                    placeholder="Kurs haqida qisqacha ma'lumot va mavzular qamrovi..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Thumbnail URL (Rasm havolasi)</label>
                  <input 
                    type="url" 
                    className="ag-input" 
                    placeholder="https://images.unsplash.com/..."
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Teacher (Biriktirilgan ustoz) *</label>
                    <select 
                      className="ag-select"
                      required
                      value={formData.teacherId}
                      onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    >
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select 
                      className="ag-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Status *</label>
                  <select 
                    className="ag-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="published">Published (E'lon qilingan va hamma ko'ra oladi)</option>
                    <option value="draft">Draft (Qoralama holatda)</option>
                  </select>
                </div>
              </div>

              <div className="ag-modal-footer">
                <button type="button" className="ag-btn ag-btn-secondary" onClick={() => setShowAddModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="ag-btn ag-btn-primary">
                  <IconCheck size={18} />
                  {editingCourse ? 'Saqlash' : 'Kurs Yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW COURSE DETAILS DRAWER (SHOWING ATTACHED VIDEOS - COURSE -> VIDEO RELATIONSHIP) */}
      {viewingCourse && (
        <div className="ag-modal-backdrop" onClick={() => setViewingCourse(null)}>
          <div className="ag-modal-content course-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={viewingCourse.thumbnail} alt={viewingCourse.title} style={{ width: 44, height: 32, borderRadius: 6, objectFit: 'cover' }} />
                <div>
                  <h2 className="ag-modal-title" style={{ fontSize: '1.1rem' }}>{viewingCourse.title}</h2>
                  <div style={{ fontSize: '0.775rem', color: 'var(--ag-text-muted)' }}>
                    Category: {viewingCourse.category} • Status: {viewingCourse.status}
                  </div>
                </div>
              </div>
              <button className="ag-btn ag-btn-secondary ag-btn-icon-only" onClick={() => setViewingCourse(null)}>
                <IconX size={18} />
              </button>
            </div>

            <div className="ag-modal-body">
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--ag-radius-md)', border: '1px solid var(--ag-glass-border)' }}>
                <div style={{ fontWeight: 600, color: 'var(--ag-text-main)', marginBottom: 4 }}>Kurs haqida:</div>
                <p style={{ fontSize: '0.875rem', color: 'var(--ag-text-muted)', margin: 0 }}>{viewingCourse.description}</p>
              </div>

              {/* COURSE -> VIDEO RELATIONSHIP LIST */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconVideos size={18} className="text-cyan-400" />
                    Ushbu Kursga Biriktirilgan Videolar ({getVideosForCourse(viewingCourse.id).length})
                  </h3>
                  <button 
                    className="ag-btn ag-btn-primary" 
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                    onClick={() => setShowAddVideoSubModal(true)}
                  >
                    <IconPlus size={14} />
                    + Video Qo'shish
                  </button>
                </div>

                {getVideosForCourse(viewingCourse.id).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--ag-radius-lg)', color: 'var(--ag-text-muted)', fontSize: '0.875rem' }}>
                    Ushbu kursda hali birorta ham video darslik mavjud emas. Yuqoridagi tugma orqali dars qo'shing.
                  </div>
                ) : (
                  <div className="videos-list-in-course">
                    {getVideosForCourse(viewingCourse.id).map((video, idx) => (
                      <div key={video.id} className="video-item-row">
                        <div className="video-item-left">
                          <span style={{ fontWeight: 700, color: 'var(--ag-primary)', fontSize: '0.9rem', width: 20 }}>
                            {idx + 1}.
                          </span>
                          <img src={video.thumbnail} alt={video.title} className="video-item-thumb" />
                          <div>
                            <div className="video-item-title">{video.title}</div>
                            <div className="video-item-duration">
                              <IconClock size={12} /> {video.duration} • <span className={`badge-status ${video.status === 'published' ? 'badge-status-published' : 'badge-status-draft'}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>{video.status}</span>
                            </div>
                          </div>
                        </div>

                        <a 
                          href={video.videoUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="ag-btn ag-btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', gap: '0.35rem' }}
                        >
                          <IconPlay size={14} />
                          Ko'rish
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="ag-modal-footer">
              <button className="ag-btn ag-btn-secondary" onClick={() => setViewingCourse(null)}>
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ADD VIDEO TO SPECIFIC COURSE SUB-MODAL */}
      {showAddVideoSubModal && (
        <div className="ag-modal-backdrop" style={{ zIndex: 110 }} onClick={() => setShowAddVideoSubModal(false)}>
          <div className="ag-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header">
              <h2 className="ag-modal-title">
                <IconVideos size={20} className="text-cyan-400" />
                Video Qo'shish ({viewingCourse?.title})
              </h2>
              <button className="ag-btn ag-btn-secondary ag-btn-icon-only" onClick={() => setShowAddVideoSubModal(false)}>
                <IconX size={18} />
              </button>
            </div>

            <form onSubmit={handleAddVideoToCourseSubmit}>
              <div className="ag-modal-body">
                <div className="form-group">
                  <label className="form-label">Video Title *</label>
                  <input 
                    type="text" 
                    className="ag-input" 
                    required 
                    placeholder="Masalan: 1. Kirish va O'rnatish"
                    value={videoFormData.title}
                    onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Video URL *</label>
                  <input 
                    type="url" 
                    className="ag-input" 
                    required 
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoFormData.videoUrl}
                    onChange={(e) => setVideoFormData({ ...videoFormData, videoUrl: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Duration (Davomiyligi) *</label>
                    <input 
                      type="text" 
                      className="ag-input" 
                      placeholder="15:30"
                      value={videoFormData.duration}
                      onChange={(e) => setVideoFormData({ ...videoFormData, duration: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status *</label>
                    <select 
                      className="ag-select"
                      value={videoFormData.status}
                      onChange={(e) => setVideoFormData({ ...videoFormData, status: e.target.value })}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="ag-modal-footer">
                <button type="button" className="ag-btn ag-btn-secondary" onClick={() => setShowAddVideoSubModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="ag-btn ag-btn-primary">
                  <IconCheck size={18} />
                  Videoni Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingCourseId && (
        <div className="ag-modal-backdrop" onClick={() => setDeletingCourseId(null)}>
          <div className="ag-modal-content" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header">
              <h2 className="ag-modal-title" style={{ color: '#ef4444' }}>
                <IconDelete size={22} />
                Kursni o'chirishni tasdiqlang
              </h2>
              <button className="ag-btn ag-btn-secondary ag-btn-icon-only" onClick={() => setDeletingCourseId(null)}>
                <IconX size={18} />
              </button>
            </div>

            <div className="ag-modal-body">
              <p style={{ color: 'var(--ag-text-main)', margin: 0, fontSize: '0.95rem' }}>
                Haqiqatdan ham ushbu kursni va unga biriktirilgan <strong>barcha video darsliklarni</strong> o'chirib tashlamoqchimisiz?
              </p>
              <p style={{ color: 'var(--ag-text-muted)', fontSize: '0.825rem', marginTop: 8 }}>
                Ushbu amalni ortga qaytarib bo'lmaydi.
              </p>
            </div>

            <div className="ag-modal-footer">
              <button className="ag-btn ag-btn-secondary" onClick={() => setDeletingCourseId(null)}>
                Bekor qilish
              </button>
              <button className="ag-btn ag-btn-danger" onClick={handleConfirmDelete}>
                <IconDelete size={18} />
                Ha, O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
