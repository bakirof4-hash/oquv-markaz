import React, { useState } from 'react';
import { useLms } from '../../../context/LmsContext';
import { 
  IconVideos, 
  IconPlus, 
  IconEdit, 
  IconDelete, 
  IconSearch, 
  IconFilter, 
  IconPublished, 
  IconDraft, 
  IconPlay, 
  IconClock, 
  IconCourses, 
  IconX, 
  IconCheck,
  IconSparkles
} from '../../common/SvgIcons';

export default function VideosView() {
  const { 
    videos, 
    courses, 
    addVideo, 
    updateVideo, 
    deleteVideo, 
    getCourseById,
    resetDemoData 
  } = useLms();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [deletingVideoId, setDeletingVideoId] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: courses[0]?.id || '',
    videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    thumbnail: '',
    duration: '15:00',
    status: 'published'
  });

  // Filter videos
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          video.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourseFilter === 'all' || video.courseId === selectedCourseFilter;
    const matchesStatus = selectedStatus === 'all' || video.status === selectedStatus;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    }
    return url;
  };

  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      description: '',
      courseId: courses[0]?.id || '',
      videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      duration: '12:45',
      status: 'published'
    });
    setEditingVideo(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      courseId: video.courseId,
      videoUrl: video.videoUrl,
      thumbnail: video.thumbnail,
      duration: video.duration,
      status: video.status
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.courseId) {
      alert("Video tanlangan kursga biriktirilishi shart!");
      return;
    }

    if (editingVideo) {
      updateVideo(editingVideo.id, formData);
    } else {
      addVideo(formData);
    }
    setShowAddModal(false);
  };

  const handleConfirmDelete = () => {
    if (deletingVideoId) {
      deleteVideo(deletingVideoId);
      setDeletingVideoId(null);
    }
  };

  return (
    <div className="videos-view-wrapper">
      {/* PAGE HEADER */}
      <div className="page-header-bar">
        <div className="page-header-title-group">
          <h1 className="page-title">
            <IconVideos size={28} className="text-cyan-400" />
            Videolar Boshqaruvi
          </h1>
          <p className="page-description">
            Barcha video darsliklar ro'yxati ({videos.length} ta video mavjud)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {resetDemoData && (
            <button className="ag-btn ag-btn-secondary" onClick={resetDemoData} title="Videolarni tiklash">
              <IconSparkles size={16} />
              Demo videolarni tiklash
            </button>
          )}
          <button className="ag-btn ag-btn-primary" onClick={handleOpenAddModal}>
            <IconPlus size={18} />
            Add Video
          </button>
        </div>
      </div>

      {/* FILTER CONTROL TOOLBAR */}
      <div className="control-toolbar">
        <div className="topbar-search-wrap" style={{ width: 280 }}>
          <IconSearch size={18} className="topbar-search-icon" />
          <input 
            type="text" 
            className="topbar-search-input" 
            placeholder="Videolarni qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--ag-text-muted)', fontSize: '0.85rem' }}>
            <IconFilter size={16} />
            Filter:
          </div>

          {/* COURSE SELECTION FILTER */}
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
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Barcha Holatlar</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* VIDEOS CARDS GRID */}
      {filteredVideos.length === 0 ? (
        <div className="ag-empty-card">
          <div className="empty-icon-wrap" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--ag-secondary)' }}>
            <IconVideos size={32} />
          </div>
          <div className="empty-title">Birorta ham video topilmadi</div>
          <div className="empty-desc">Tanlangan kurs yoki qidiruv bo'yicha hech qanday video darslik mavjud emas.</div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1rem' }}>
            <button className="ag-btn ag-btn-secondary" onClick={resetDemoData}>
              <IconSparkles size={18} />
              Demo videolarni yuklash
            </button>
            <button className="ag-btn ag-btn-primary" onClick={handleOpenAddModal}>
              <IconPlus size={18} />
              Add Video
            </button>
          </div>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredVideos.map(video => {
            const course = getCourseById(video.courseId);
            const isPublished = video.status === 'published';

            return (
              <div key={video.id} className="video-card">
                {/* THUMBNAIL & PLAY OVERLAY */}
                <div className="card-media-header" onClick={() => setPreviewVideo(video)} style={{ cursor: 'pointer' }}>
                  <img src={video.thumbnail} alt={video.title} className="card-thumbnail-img" />
                  
                  <div className="card-badge-container">
                    <span className={`badge-status ${isPublished ? 'badge-status-published' : 'badge-status-draft'}`}>
                      {isPublished ? <IconPublished size={12} /> : <IconDraft size={12} />}
                      {video.status}
                    </span>
                  </div>

                  <div className="video-play-overlay">
                    <div className="play-icon-btn">
                      <IconPlay size={20} />
                    </div>
                  </div>

                  <div className="duration-tag">
                    <IconClock size={12} />
                    {video.duration}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="card-body">
                  <h3 className="card-title" style={{ fontSize: '1.05rem', cursor: 'pointer' }} onClick={() => setPreviewVideo(video)}>
                    {video.title}
                  </h3>

                  <div style={{ marginTop: 'auto', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconCourses size={14} className="text-indigo-400" />
                    <span style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {course ? course.title : 'Kurs tanlanmagan'}
                    </span>
                  </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="card-actions-footer">
                  <button 
                    onClick={() => setPreviewVideo(video)}
                    className="ag-btn ag-btn-secondary ag-btn-icon-only"
                    style={{ flex: 1 }}
                  >
                    <IconPlay size={14} />
                    <span>Tomosha qilish</span>
                  </button>

                  <button 
                    className="ag-btn ag-btn-secondary ag-btn-icon-only"
                    title="Tahrirlash"
                    onClick={() => handleOpenEditModal(video)}
                  >
                    <IconEdit size={16} />
                  </button>

                  <button 
                    className="ag-btn ag-btn-danger ag-btn-icon-only"
                    title="O'chirish"
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

      {/* VIDEO PLAYER PREVIEW MODAL */}
      {previewVideo && (
        <div className="ag-modal-backdrop" onClick={() => setPreviewVideo(null)}>
          <div className="ag-modal-content" style={{ maxWidth: 840, padding: '1.5rem', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '20px' }} onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header" style={{ marginBottom: '1.25rem' }}>
              <h2 className="ag-modal-title" style={{ fontSize: '1.2rem', color: '#fff' }}>
                <IconPlay size={22} className="text-cyan-400" />
                {previewVideo.title}
              </h2>
              <button className="ag-btn ag-btn-secondary ag-btn-icon-only" onClick={() => setPreviewVideo(null)}>
                <IconX size={18} />
              </button>
            </div>

            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: '14px', overflow: 'hidden', background: '#000', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)' }}>
              <iframe
                src={getEmbedUrl(previewVideo.videoUrl)}
                title={previewVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
              />
            </div>
            
            {previewVideo.description && (
              <p style={{ marginTop: '1.25rem', color: '#cbd5e1', fontSize: '0.925rem', lineHeight: 1.6, background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '12px' }}>
                {previewVideo.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ADD / EDIT VIDEO MODAL */}
      {showAddModal && (
        <div className="ag-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="ag-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header">
              <h2 className="ag-modal-title">
                <IconVideos size={22} className="text-cyan-400" />
                {editingVideo ? 'Videoni Tahrirlash' : 'Yangi Video Qo\'shish'}
              </h2>
              <button className="ag-btn ag-btn-secondary ag-btn-icon-only" onClick={() => setShowAddModal(false)}>
                <IconX size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="ag-modal-body">
                {/* MANDATORY COURSE SELECTION */}
                <div className="form-group">
                  <label className="form-label" style={{ color: '#a5b4fc', fontWeight: 700 }}>
                    Select Course (Majburiy) *
                  </label>
                  <select 
                    className="ag-select"
                    required
                    style={{ border: '1px solid rgba(99, 102, 241, 0.4)', background: 'rgba(99, 102, 241, 0.1)' }}
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  >
                    <option value="" disabled>-- Kursni Tanlang --</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Video Title *</label>
                  <input 
                    type="text" 
                    className="ag-input" 
                    required 
                    placeholder="Masalan: 1. React Server Components Asoslari"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Video URL (YouTube yoki HLS stream link) *</label>
                  <input 
                    type="url" 
                    className="ag-input" 
                    required 
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Thumbnail URL</label>
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
                    <label className="form-label">Duration (Davomiyligi) *</label>
                    <input 
                      type="text" 
                      className="ag-input" 
                      required 
                      placeholder="18:45"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status *</label>
                    <select 
                      className="ag-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Video Tavsifi</label>
                  <textarea 
                    className="ag-input form-textarea" 
                    style={{ minHeight: 70 }}
                    placeholder="Video bo'yicha qo'shimcha izoh yoki dars resurslari..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="ag-modal-footer">
                <button type="button" className="ag-btn ag-btn-secondary" onClick={() => setShowAddModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="ag-btn ag-btn-primary">
                  <IconCheck size={18} />
                  {editingVideo ? 'Saqlash' : 'Video Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingVideoId && (
        <div className="ag-modal-backdrop" onClick={() => setDeletingVideoId(null)}>
          <div className="ag-modal-content" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header">
              <h2 className="ag-modal-title" style={{ color: '#ef4444' }}>
                <IconDelete size={22} />
                Videoni o'chirishni tasdiqlang
              </h2>
              <button className="ag-btn ag-btn-secondary ag-btn-icon-only" onClick={() => setDeletingVideoId(null)}>
                <IconX size={18} />
              </button>
            </div>

            <div className="ag-modal-body">
              <p style={{ color: 'var(--ag-text-main)', margin: 0 }}>
                Haqiqatdan ham ushbu videoni platformadan o'chirib tashlamoqchimisiz?
              </p>
            </div>

            <div className="ag-modal-footer">
              <button className="ag-btn ag-btn-secondary" onClick={() => setDeletingVideoId(null)}>
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

