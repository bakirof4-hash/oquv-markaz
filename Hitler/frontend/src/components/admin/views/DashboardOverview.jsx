import React from 'react';
import { useLms } from '../../../context/LmsContext';
import { 
  IconCourses, 
  IconVideos, 
  IconPublished, 
  IconDraft, 
  IconTeachers, 
  IconPlus,
  IconEye,
  IconClock,
  IconSparkles
} from '../../common/SvgIcons';

export default function DashboardOverview({ setActiveTab }) {
  const { stats, courses, videos, teachers, getTeacherById } = useLms();

  const recentCourses = courses.slice(0, 3);
  const recentVideos = videos.slice(0, 4);

  return (
    <div className="dashboard-view-wrapper">
      {/* PAGE HEADER */}
      <div className="page-header-bar">
        <div className="page-header-title-group">
          <h1 className="page-title">
            <IconSparkles className="text-indigo-400" size={28} />
            Dashboard Overview
          </h1>
          <p className="page-description">
            SaaS Education platformasining asosiy statistikasi va oxirgi faoliyat natijalari
          </p>
        </div>

        <div className="filter-group">
          <button 
            className="ag-btn ag-btn-primary" 
            onClick={() => setActiveTab('courses')}
          >
            <IconPlus size={18} />
            Yangi Kurs
          </button>
          <button 
            className="ag-btn ag-btn-secondary" 
            onClick={() => setActiveTab('videos')}
          >
            <IconPlus size={18} />
            Video Qo'shish
          </button>
        </div>
      </div>

      {/* 5 REQUIRED STATS CARDS WITH PROFESSIONAL SVG ICONS */}
      <div className="stats-grid">
        {/* 1. TOTAL COURSES */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Total Courses</span>
            <div className="stat-icon-wrapper stat-icon-primary">
              <IconCourses size={24} />
            </div>
          </div>
          <div className="stat-value">{stats.totalCourses}</div>
          <div className="stat-subtext">
            <span className="stat-trend">Platformadagi barcha kurslar</span>
          </div>
        </div>

        {/* 2. TOTAL VIDEOS */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Total Videos</span>
            <div className="stat-icon-wrapper stat-icon-cyan">
              <IconVideos size={24} />
            </div>
          </div>
          <div className="stat-value">{stats.totalVideos}</div>
          <div className="stat-subtext">
            <span className="stat-trend">Barcha dars videolari</span>
          </div>
        </div>

        {/* 3. PUBLISHED COURSES */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Published Courses</span>
            <div className="stat-icon-wrapper stat-icon-emerald">
              <IconPublished size={24} />
            </div>
          </div>
          <div className="stat-value">{stats.publishedCourses}</div>
          <div className="stat-subtext">
            <span className="stat-trend">Faol va ochiq kurslar</span>
          </div>
        </div>

        {/* 4. DRAFT COURSES */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Draft Courses</span>
            <div className="stat-icon-wrapper stat-icon-warning">
              <IconDraft size={24} />
            </div>
          </div>
          <div className="stat-value">{stats.draftCourses}</div>
          <div className="stat-subtext">
            <span className="stat-trend" style={{ color: 'var(--ag-warning)' }}>Tayyorlanayotgan kurslar</span>
          </div>
        </div>

        {/* 5. TOTAL TEACHERS */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Total Teachers</span>
            <div className="stat-icon-wrapper stat-icon-violet">
              <IconTeachers size={24} />
            </div>
          </div>
          <div className="stat-value">{stats.totalTeachers}</div>
          <div className="stat-subtext">
            <span className="stat-trend">Professional instruktorlar</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD CONTENT GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
        {/* RECENT COURSES */}
        <div style={{
          background: 'var(--ag-card-bg)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--ag-glass-border)',
          borderRadius: 'var(--ag-radius-xl)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ag-text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IconCourses size={20} className="text-indigo-400" />
              So'nggi Kurslar
            </h3>
            <button className="ag-btn ag-btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setActiveTab('courses')}>
              Barchasini ko'rish
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recentCourses.map(course => {
              const teacher = getTeacherById(course.teacherId);
              return (
                <div key={course.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--ag-radius-md)',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--ag-glass-border)'
                }}>
                  <img src={course.thumbnail} alt={course.title} style={{ width: 60, height: 42, borderRadius: 8, objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {course.title}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--ag-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 2 }}>
                      <span>{teacher ? teacher.name : 'Ustoz'}</span>
                      <span>•</span>
                      <span className={`badge-status ${course.status === 'published' ? 'badge-status-published' : 'badge-status-draft'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem' }}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RECENT VIDEOS */}
        <div style={{
          background: 'var(--ag-card-bg)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--ag-glass-border)',
          borderRadius: 'var(--ag-radius-xl)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ag-text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IconVideos size={20} className="text-cyan-400" />
              So'nggi Yuklangan Videolar
            </h3>
            <button className="ag-btn ag-btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setActiveTab('videos')}>
              Barchasini ko'rish
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recentVideos.map(video => (
              <div key={video.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem',
                borderRadius: 'var(--ag-radius-md)',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--ag-glass-border)'
              }}>
                <img src={video.thumbnail} alt={video.title} style={{ width: 60, height: 42, borderRadius: 8, objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {video.title}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--ag-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 2 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <IconClock size={12} /> {video.duration}
                    </span>
                    <span>•</span>
                    <span className={`badge-status ${video.status === 'published' ? 'badge-status-published' : 'badge-status-draft'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem' }}>
                      {video.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
