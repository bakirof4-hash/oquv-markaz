import React, { useState } from 'react';
import { useLms } from '../../../context/LmsContext';
import { 
  IconCourses, 
  IconVideos, 
  IconPlus, 
  IconEdit, 
  IconDelete, 
  IconEye, 
  IconPublished, 
  IconDraft, 
  IconPlay, 
  IconClock, 
  IconCheck, 
  IconX,
  IconShield
} from '../../common/SvgIcons';

export default function TeacherPanel({ activeSubTab = 'my-courses' }) {
  const { 
    courses, 
    videos, 
    teachers, 
    activeTeacherId, 
    addCourse, 
    updateCourse, 
    deleteCourse, 
    addVideo, 
    updateVideo, 
    deleteVideo,
    getVideosForCourse,
    getTeacherById
  } = useLms();

  const currentTeacher = getTeacherById(activeTeacherId) || teachers[0];

  // STRICT PERMISSION FILTER: Teacher can ONLY see their OWN courses & videos!
  const myCourses = courses.filter(c => c.teacherId === activeTeacherId);
  const myVideos = videos.filter(v => {
    const course = courses.find(c => c.id === v.courseId);
    return course && course.teacherId === activeTeacherId;
  });

  // Modal States
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourseId, setDeletingCourseId] = useState(null);

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [deletingVideoId, setDeletingVideoId] = useState(null);
  const [viewingCourse, setViewingCourse] = useState(null);

  // Form Data Course
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    thumbnail: '',
    category: 'Frontend',
    status: 'published'
  });

  // Form Data Video
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    courseId: myCourses[0]?.id || '',
    videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    thumbnail: '',
    duration: '15:00',
    status: 'published'
  });

  const categories = ['Frontend', 'Backend', 'AI & Data', 'Design', 'Mobile', 'DevOps'];

  // Handlers for Course
  const handleOpenCourseModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        category: course.category,
        status: course.status
      });
    } else {
      setEditingCourse(null);
      setCourseForm({
        title: '',
        description: '',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
        category: 'Frontend',
        status: 'published'
      });
    }
    setShowCourseModal(true);
  };

  const handleCourseSubmit = (e) => {
    e.preventDefault();
    if (editingCourse) {
      updateCourse(editingCourse.id, {
        ...courseForm,
        teacherId: activeTeacherId
      });
    } else {
      addCourse({
        ...courseForm,
        teacherId: activeTeacherId
      });
    }
    setShowCourseModal(false);
  };

  // Handlers for Video
  const handleOpenVideoModal = (video = null) => {
    if (video) {
      setEditingVideo(video);
      setVideoForm({
        title: video.title,
        description: video.description || '',
        courseId: video.courseId,
        videoUrl: video.videoUrl,
        thumbnail: video.thumbnail,
        duration: video.duration,
        status: video.status
      });
    } else {
      setEditingVideo(null);
      setVideoForm({
        title: '',
        description: '',
        courseId: myCourses[0]?.id || '',
        videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
        duration: '15:00',
        status: 'published'
      });
    }
    setShowVideoModal(true);
  };

  const handleVideoSubmit = (e) => {
    e.preventDefault();
    if (!videoForm.courseId) {
      alert("Faqat o'zingizning kursingizni tanlang!");
      return;
    }
    if (editingVideo) {
      updateVideo(editingVideo.id, videoForm);
    } else {
      addVideo(videoForm);
    }
    setShowVideoModal(false);
  };

  // Toggle status directly
  const handleToggleCourseStatus = (course) => {
    const newStatus = course.status === 'published' ? 'draft' : 'published';
    updateCourse(course.id, { status: newStatus });
  };

  const handleToggleVideoStatus = (video) => {
    const newStatus = video.status === 'published' ? 'draft' : 'published';
    updateVideo(video.id, { status: newStatus });
  };

  return (
    <div className="teacher-panel-wrapper">
      {/* TEACHER BANNER HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 'var(--ag-radius-xl)',
        padding: '1.5rem 2rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img 
            src={currentTeacher?.avatar} 
            alt={currentTeacher?.name} 
            style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid var(--ag-primary)', objectFit: 'cover' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                {currentTeacher?.name}
              </h2>
              <span className="badge-category" style={{ background: 'var(--ag-primary)', color: '#fff' }}>
                <IconShield size={12} /> Teacher Panel
              </span>
            </div>
            <p style={{ color: '#a5b4fc', fontSize: '0.875rem', margin: '4px 0 0' }}>
              {currentTeacher?.subject} • Faqat o'zingizga tegishli kurs va videolarni boshqarish Paneli
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="ag-btn ag-btn-primary" onClick={() => handleOpenCourseModal()}>
            <IconPlus size={16} /> Add Course
          </button>
          <button className="ag-btn ag-btn-secondary" onClick={() => handleOpenVideoModal()}>
            <IconPlus size={16} /> Add Video
          </button>
        </div>
      </div>

      {/* MY COURSES SECTION */}
      {(activeSubTab === 'my-courses' || activeSubTab === 'all') && (
        <div style={{ marginBottom: '3rem' }}>
          <div className="page-header-bar" style={{ marginBottom: '1.25rem' }}>
            <h2 className="page-title" style={{ fontSize: '1.35rem' }}>
              <IconCourses size={22} className="text-indigo-400" />
              Mening Kurslarim ({myCourses.length})
            </h2>
            <button className="ag-btn ag-btn-primary" onClick={() => handleOpenCourseModal()}>
              <IconPlus size={16} /> Add Course
            </button>
          </div>

          {myCourses.length === 0 ? (
            <div className="ag-empty-card">
              <div className="empty-icon-wrap">
                <IconCourses size={32} />
              </div>
              <div className="empty-title">Sizda hali birorta ham kurs mavjud emas</div>
              <div className="empty-desc">Yangi kurs yaratish uchun tugmani bosing.</div>
              <button className="ag-btn ag-btn-primary" onClick={() => handleOpenCourseModal()}>
                <IconPlus size={18} /> Add Course
              </button>
            </div>
          ) : (
            <div className="cards-grid">
              {myCourses.map(course => {
                const cVideos = getVideosForCourse(course.id);
                const isPublished = course.status === 'published';

                return (
                  <div key={course.id} className="course-card">
                    <div className="card-media-header">
                      <img src={course.thumbnail} alt={course.title} className="card-thumbnail-img" />
                      <div className="card-badge-container">
                        <span 
                          className={`badge-status ${isPublished ? 'badge-status-published' : 'badge-status-draft'}`}
                          style={{ cursor: 'pointer' }}
                          title="Holatni o'zgartirish uchun bosing"
                          onClick={() => handleToggleCourseStatus(course)}
                        >
                          {isPublished ? <IconPublished size={12} /> : <IconDraft size={12} />}
                          {course.status} (Toggle)
                        </span>
                        <span className="badge-category">{course.category}</span>
                      </div>
                    </div>

                    <div className="card-body">
                      <h3 className="card-title">{course.title}</h3>
                      <p className="card-description">{course.description}</p>

                      <div className="card-meta-row">
                        <div className="meta-item">
                          <IconVideos size={16} />
                          <span>{cVideos.length} ta video dars</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-actions-footer">
                      <button 
                        className="ag-btn ag-btn-secondary ag-btn-icon-only"
                        style={{ flex: 1 }}
                        onClick={() => setViewingCourse(course)}
                      >
                        <IconEye size={16} />
                        <span>Videolar</span>
                      </button>

                      <button 
                        className="ag-btn ag-btn-secondary ag-btn-icon-only"
                        onClick={() => handleOpenCourseModal(course)}
                      >
                        <IconEdit size={16} />
                      </button>

                      <button 
                        className="ag-btn ag-btn-danger ag-btn-icon-only"
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
        </div>
      )}

      {/* MY VIDEOS SECTION */}
      {(activeSubTab === 'my-videos' || activeSubTab === 'all') && (
        <div>
          <div className="page-header-bar" style={{ marginBottom: '1.25rem' }}>
            <h2 className="page-title" style={{ fontSize: '1.35rem' }}>
              <IconVideos size={22} className="text-cyan-400" />
              Mening Videolarim ({myVideos.length})
            </h2>
            <button className="ag-btn ag-btn-primary" onClick={() => handleOpenVideoModal()}>
              <IconPlus size={16} /> Add Video
            </button>
          </div>

          {myVideos.length === 0 ? (
            <div className="ag-empty-card">
              <div className="empty-icon-wrap" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--ag-secondary)' }}>
                <IconVideos size={32} />
              </div>
              <div className="empty-title">Sizda hali birorta ham video dars mavjud emas</div>
              <div className="empty-desc">Kurslaringizga yangi video qo'shish uchun Add Video tugmasini bosing.</div>
              <button className="ag-btn ag-btn-primary" onClick={() => handleOpenVideoModal()}>
                <IconPlus size={18} /> Add Video
              </button>
            </div>
          ) : (
            <div className="cards-grid">
              {myVideos.map(video => {
                const parentCourse = myCourses.find(c => c.id === video.courseId);
                const isPublished = video.status === 'published';

                return (
                  <div key={video.id} className="video-card">
                    <div className="card-media-header">
                      <img src={video.thumbnail} alt={video.title} className="card-thumbnail-img" />
                      <div className="card-badge-container">
                        <span 
                          className={`badge-status ${isPublished ? 'badge-status-published' : 'badge-status-draft'}`}
                          style={{ cursor: 'pointer' }}
                          title="Holatni o'zgartirish uchun bosing"
                          onClick={() => handleToggleVideoStatus(video)}
                        >
                          {isPublished ? <IconPublished size={12} /> : <IconDraft size={12} />}
                          {video.status} (Toggle)
                        </span>
                      </div>
                      <div className="duration-tag">
                        <IconClock size={12} />
                        {video.duration}
                      </div>
                    </div>

                    <div className="card-body">
                      <h3 className="card-title" style={{ fontSize: '1.05rem' }}>{video.title}</h3>
                      <div style={{ marginTop: 'auto', paddingTop: '0.5rem', fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600 }}>
                        Kurs: {parentCourse ? parentCourse.title : 'Noma\'lum Kurs'}
                      </div>
                    </div>

                    <div className="card-actions-footer">
                      <a 
                        href={video.videoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="ag-btn ag-btn-secondary ag-btn-icon-only"
                        style={{ flex: 1 }}
                      >
                        <IconPlay size={14} />
                        <span>Ko'rish</span>
                      </a>

                      <button 
                        className="ag-btn ag-btn-secondary ag-btn-icon-only"
                        onClick={() => handleOpenVideoModal(video)}
                      >
                        <IconEdit size={16} />
                      </button>

                      <button 
                        className="ag-btn ag-btn-danger ag-btn-icon-only"
                        onClick={() => setDeletingVideoId(video.id)}
                      >
                        <IconDelete size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TEACHER ADD / EDIT COURSE MODAL */}
      {showCourseModal && (
        <div className="ag-modal-backdrop" onClick={() => setShowCourseModal(false)}>
          <div className="ag-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header">
              <h2 className="ag-modal-title">
                <IconCourses size={22} className="text-indigo-400" />
                {editingCourse ? 'Mening Kursimni Tahrirlash' : 'Yangi Kurs Yaratish'}
              </h2>
              <button className="ag-btn ag-btn-secondary ag-btn-icon-only" onClick={() => setShowCourseModal(false)}>
                <IconX size={18} />
              </button>
            </div>

            <form onSubmit={handleCourseSubmit}>
              <div className="ag-modal-body">
                <div className="form-group">
                  <label className="form-label">Course Title *</label>
                  <input 
                    type="text" 
                    className="ag-input" 
                    required 
                    placeholder="Masalan: Professional Frontend Ingeneriya"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea 
                    className="ag-input form-textarea" 
                    required 
                    placeholder="Kurs haqida ma'lumot..."
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Thumbnail URL</label>
                  <input 
                    type="url" 
                    className="ag-input" 
                    value={courseForm.thumbnail}
                    onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select 
                      className="ag-select"
                      value={courseForm.category}
                      onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status *</label>
                    <select 
                      className="ag-select"
                      value={courseForm.status}
                      onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value })}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="ag-modal-footer">
                <button type="button" className="ag-btn ag-btn-secondary" onClick={() => setShowCourseModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="ag-btn ag-btn-primary">
                  <IconCheck size={18} /> Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEACHER ADD / EDIT VIDEO MODAL */}
      {showVideoModal && (
        <div className="ag-modal-backdrop" onClick={() => setShowVideoModal(false)}>
          <div className="ag-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header">
              <h2 className="ag-modal-title">
                <IconVideos size={22} className="text-cyan-400" />
                {editingVideo ? 'Videoni Tahrirlash' : 'Kursga Video Qo\'shish'}
              </h2>
              <button className="ag-btn ag-btn-secondary ag-btn-icon-only" onClick={() => setShowVideoModal(false)}>
                <IconX size={18} />
              </button>
            </div>

            <form onSubmit={handleVideoSubmit}>
              <div className="ag-modal-body">
                <div className="form-group">
                  <label className="form-label" style={{ color: '#a5b4fc', fontWeight: 700 }}>
                    Mening Kurslarimdan Tanlang *
                  </label>
                  <select 
                    className="ag-select"
                    required
                    style={{ border: '1px solid rgba(99, 102, 241, 0.4)', background: 'rgba(99, 102, 241, 0.1)' }}
                    value={videoForm.courseId}
                    onChange={(e) => setVideoForm({ ...videoForm, courseId: e.target.value })}
                  >
                    {myCourses.length === 0 ? (
                      <option value="">(Avval kurs yaratishingiz kerak)</option>
                    ) : (
                      myCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Video Title *</label>
                  <input 
                    type="text" 
                    className="ag-input" 
                    required 
                    placeholder="Mavzu nomi..."
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Video URL *</label>
                  <input 
                    type="url" 
                    className="ag-input" 
                    required 
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoForm.videoUrl}
                    onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Duration *</label>
                    <input 
                      type="text" 
                      className="ag-input" 
                      placeholder="15:00"
                      value={videoForm.duration}
                      onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status *</label>
                    <select 
                      className="ag-select"
                      value={videoForm.status}
                      onChange={(e) => setVideoForm({ ...videoForm, status: e.target.value })}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="ag-modal-footer">
                <button type="button" className="ag-btn ag-btn-secondary" onClick={() => setShowVideoModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="ag-btn ag-btn-primary" disabled={myCourses.length === 0}>
                  <IconCheck size={18} /> Video Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW COURSE DETAILS MODAL FOR TEACHER */}
      {viewingCourse && (
        <div className="ag-modal-backdrop" onClick={() => setViewingCourse(null)}>
          <div className="ag-modal-content course-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header">
              <h2 className="ag-modal-title">{viewingCourse.title} (Darsliklar)</h2>
              <button className="ag-btn ag-btn-secondary ag-btn-icon-only" onClick={() => setViewingCourse(null)}>
                <IconX size={18} />
              </button>
            </div>

            <div className="ag-modal-body">
              <div className="videos-list-in-course">
                {getVideosForCourse(viewingCourse.id).map((video, idx) => (
                  <div key={video.id} className="video-item-row">
                    <div className="video-item-left">
                      <span style={{ fontWeight: 700, color: 'var(--ag-primary)' }}>{idx + 1}.</span>
                      <img src={video.thumbnail} alt={video.title} className="video-item-thumb" />
                      <div>
                        <div className="video-item-title">{video.title}</div>
                        <div className="video-item-duration"><IconClock size={12} /> {video.duration}</div>
                      </div>
                    </div>
                    <a href={video.videoUrl} target="_blank" rel="noreferrer" className="ag-btn ag-btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                      <IconPlay size={14} /> Ko'rish
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="ag-modal-footer">
              <button className="ag-btn ag-btn-secondary" onClick={() => setViewingCourse(null)}>Yopish</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATIONS */}
      {deletingCourseId && (
        <div className="ag-modal-backdrop" onClick={() => setDeletingCourseId(null)}>
          <div className="ag-modal-content" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header">
              <h2 className="ag-modal-title" style={{ color: '#ef4444' }}>O'chirishni tasdiqlang</h2>
              <button className="ag-btn ag-btn-secondary ag-btn-icon-only" onClick={() => setDeletingCourseId(null)}><IconX size={18} /></button>
            </div>
            <div className="ag-modal-body">
              <p style={{ color: '#fff', margin: 0 }}>Ushbu kursingizni va tegishli videolarni o'chirmoqchimisiz?</p>
            </div>
            <div className="ag-modal-footer">
              <button className="ag-btn ag-btn-secondary" onClick={() => setDeletingCourseId(null)}>Bekor qilish</button>
              <button className="ag-btn ag-btn-danger" onClick={() => { deleteCourse(deletingCourseId); setDeletingCourseId(null); }}>O'chirish</button>
            </div>
          </div>
        </div>
      )}

      {deletingVideoId && (
        <div className="ag-modal-backdrop" onClick={() => setDeletingVideoId(null)}>
          <div className="ag-modal-content" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header">
              <h2 className="ag-modal-title" style={{ color: '#ef4444' }}>Videoni o'chirish</h2>
              <button className="ag-btn ag-btn-secondary ag-btn-icon-only" onClick={() => setDeletingVideoId(null)}><IconX size={18} /></button>
            </div>
            <div className="ag-modal-body">
              <p style={{ color: '#fff', margin: 0 }}>Videoni o'chirishni tasdiqlaysizmi?</p>
            </div>
            <div className="ag-modal-footer">
              <button className="ag-btn ag-btn-secondary" onClick={() => setDeletingVideoId(null)}>Bekor qilish</button>
              <button className="ag-btn ag-btn-danger" onClick={() => { deleteVideo(deletingVideoId); setDeletingVideoId(null); }}>O'chirish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
