import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api/config';

const initialInstructors = [
  { _id: '1', id: 1, name: 'Asadbek', role: 'Python Mentor', exp: '5 yillik tajriba', grad: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', initials: 'A' },
  { _id: '2', id: 2, name: 'Shahzod', role: 'Web Developer', exp: '6 yillik tajriba', grad: 'linear-gradient(135deg, #06b6d4, #3b82f6)', initials: 'S' },
  { _id: '3', id: 3, name: 'Diyorbek', role: 'Mobile Developer', exp: '4 yillik tajriba', grad: 'linear-gradient(135deg, #10b981, #06b6d4)', initials: 'D' },
  { _id: '4', id: 4, name: 'Islom', role: 'Data Scientist', exp: '5 yillik tajriba', grad: 'linear-gradient(135deg, #ec4899, #8b5cf6)', initials: 'I' },
  { _id: '5', id: 5, name: 'Sanjar', role: 'UI/UX Designer', exp: '4 yillik tajriba', grad: 'linear-gradient(135deg, #f59e0b, #ec4899)', initials: 'S' },
  { _id: '6', id: 6, name: 'Muqaddas', role: 'Graphic Designer', exp: '3 yillik tajriba', grad: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', initials: 'M' },
  { _id: '7', id: 7, name: 'Javohir', role: 'SMM Expert', exp: '4 yillik tajriba', grad: 'linear-gradient(135deg, #3b82f6, #06b6d4)', initials: 'J' },
  { _id: '8', id: 8, name: 'Bekzod', role: 'DevOps Engineer', exp: '4 yillik tajriba', grad: 'linear-gradient(135deg, #10b981, #8b5cf6)', initials: 'B' }
];

export default function Teachers() {
  const [instructors, setInstructors] = useState(initialInstructors);
  const listRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/instructors`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setInstructors(data);
        }
      })
      .catch(() => {
        // fallback to initial
      });
  }, []);

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(listRef.current.children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [instructors]);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Background Glows */}
      <div className="glow-bg glow-purple" style={{ top: '-10%' }}></div>
      <div className="glow-bg glow-cyan" style={{ bottom: '10%' }}></div>

      <div className="container" style={{ paddingTop: '9rem', paddingBottom: '6rem' }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '3.2rem', marginBottom: '1rem' }}>O'qituvchilarimiz</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Sizni tajribali va sertifikatlangan o'qituvchilarimiz kutmoqda
          </p>
        </div>

        {/* Teachers Grid */}
        <div ref={listRef} className="grid grid-cols-4" style={{ gap: '2rem' }}>
          {instructors.map((teacher) => (
            <div 
              key={teacher._id || teacher.id} 
              className="glass-card" 
              style={{ 
                textAlign: 'center',
                padding: '2.5rem 1.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.2rem'
              }}
            >
              {/* Dynamic glowing initials avatar */}
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: teacher.grad || 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '2.2rem',
                fontWeight: 'bold',
                fontFamily: 'Outfit, sans-serif',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(255,255,255,0.1)',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {teacher.initials || teacher.name.charAt(0)}
              </div>

              {/* Teacher Info */}
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{teacher.name}</h3>
                <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.25rem' }}>{teacher.role}</p>
                <span className="badge-popular" style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>
                  {teacher.exp}
                </span>
              </div>

              {/* Social icons */}
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'center', 
                marginTop: '0.5rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                width: '100%',
                paddingTop: '1.2rem'
              }}>
                <a href={teacher.socials?.linkedin || "#linkedin"} className="btn-outline" style={{
                  padding: '6px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)'
                }} onClick={(e) => !teacher.socials?.linkedin && e.preventDefault()}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                
                <a href={teacher.socials?.telegram || "#telegram"} className="btn-outline" style={{
                  padding: '6px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)'
                }} onClick={(e) => !teacher.socials?.telegram && e.preventDefault()}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </a>

                <a href={teacher.socials?.youtube || "#youtube"} className="btn-outline" style={{
                  padding: '6px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)'
                }} onClick={(e) => !teacher.socials?.youtube && e.preventDefault()}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                </a>
              </div>

              <Link to={`/teachers/${teacher._id || teacher.id}`} className="btn btn-outline" style={{ 
                width: '100%', 
                padding: '0.6rem', 
                fontSize: '0.85rem',
                borderRadius: '8px',
                marginTop: '0.5rem'
              }}>
                Profilni ko'rish
              </Link>
            </div>
          ))}
        </div>

        {/* Center button */}
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button className="btn btn-primary" style={{ padding: '0.9rem 2.5rem' }}>
            Barcha o'qituvchilarni ko'rish
          </button>
        </div>
      </div>
    </div>
  );
}
