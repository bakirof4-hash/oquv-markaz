import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import heroStudent from '../assets/hero_student.png';

export default function Home() {
  const containerRef = useRef(null);
  const heroLeftRef = useRef(null);
  const heroRightRef = useRef(null);
  const statsRef = useRef(null);
  const directionsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Left side animations
    tl.fromTo(heroLeftRef.current.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out', delay: 0.2 }
    );

    // Right side image & floats animation
    tl.fromTo(heroRightRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.2)' },
      '-=0.6'
    );

    // Stats animation
    gsap.fromTo(statsRef.current.children,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.15, 
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
        }
      }
    );

    // Directions cards animation
    gsap.fromTo(directionsRef.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: directionsRef.current,
          start: 'top 85%',
        }
      }
    );
  }, []);

  const directions = [
    {
      title: 'Python Dasturlash',
      desc: 'Boshlang\'ichdan yuqori darajagacha Python tilini o\'rganing.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2H2v10h10V2z"></path>
          <path d="M22 12H12v10h10V12z"></path>
          <path d="M12 12H2v10h10V12z"></path>
          <path d="M22 2H12v10h10V2z"></path>
        </svg>
      ),
      color: '#3b82f6',
      link: '/courses'
    },
    {
      title: 'Web Dasturlash',
      desc: 'HTML, CSS, JavaScript, React va Node.js bo\'yicha to\'liq kurs.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
      ),
      color: '#06b6d4',
      link: '/courses'
    },
    {
      title: 'Mobil Dasturlash',
      desc: 'Flutter yordamida Android va iOS ilovalarini ishlab chiqing.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
      ),
      color: '#10b981',
      link: '/courses'
    },
    {
      title: 'UI/UX Dizayn',
      desc: 'Figma va zamonaviy dizayn tamoyillarini o\'rganing.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          <path d="M2 12h20"></path>
        </svg>
      ),
      color: '#a855f7',
      link: '/courses'
    },
    {
      title: 'SMM Mutaxassis',
      desc: 'Ijtimoiy tarmoqlarda biznesni rivojlantirish va marketing strategiyalari.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13"></path>
          <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
        </svg>
      ),
      color: '#f59e0b',
      link: '/courses'
    },
    {
      title: 'Data Science',
      desc: 'Python, Machine Learning va Data Analysis asoslari.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
      color: '#ec4899',
      link: '/courses'
    }
  ];

  return (
    <div ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background glow effects */}
      <div className="glow-bg glow-blue"></div>
      <div className="glow-bg glow-cyan" style={{ top: '30%' }}></div>
      <div className="glow-bg glow-purple" style={{ top: '60%' }}></div>

      {/* Hero Section */}
      <section className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '9rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="grid grid-cols-2" style={{ alignItems: 'center', gap: '3rem' }}>
            {/* Hero Left Content */}
            <div ref={heroLeftRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'inline-flex' }}>
                <span className="badge-popular" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee', borderColor: 'rgba(6, 182, 212, 0.2)', fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
                  KELAJAGINGIZNI BIZ BILAN BOSHLANG
                </span>
              </div>
              <h1 style={{ fontSize: '3.8rem', lineHeight: '1.1', fontWeight: 800 }}>
                Zamonaviy ta'lim, <br />
                <span className="text-gradient">yorqin kelajak!</span>
              </h1>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '520px', lineHeight: '1.7' }}>
                IT Academy - sizga zamonaviy kasblarni o'rgatadi va muvaffaqiyatli karyera sari yetaklaydi.
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <Link to="/courses" className="btn btn-primary" style={{ padding: '1rem 2.2rem', fontSize: '1.05rem', borderRadius: '12px' }}>
                  Kurslarni ko'rish
                </Link>
                <Link to="/register" className="btn btn-outline" style={{ padding: '1rem 2.2rem', fontSize: '1.05rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Ro'yxatdan o'tish
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Hero Right Graphic */}
            <div ref={heroRightRef} style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '480px',
                aspectRatio: '1',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Visual Circle Rings */}
                <div style={{
                  position: 'absolute',
                  width: '90%',
                  height: '90%',
                  border: '1px dashed rgba(6, 182, 212, 0.2)',
                  borderRadius: '50%',
                  animation: 'spin 40s linear infinite'
                }}></div>
                <div style={{
                  position: 'absolute',
                  width: '78%',
                  height: '78%',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '50%'
                }}></div>

                {/* Floating CSS badges */}
                <div className="float-animation" style={{
                  position: 'absolute',
                  top: '12%',
                  left: '8%',
                  background: 'rgba(11, 17, 38, 0.8)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: '#60a5fa',
                  padding: '0.6rem 1rem',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontSize: '1.1rem' }}>&lt;/&gt;</span>
                  <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>Frontend</span>
                </div>

                <div className="float-animation" style={{
                  position: 'absolute',
                  bottom: '15%',
                  right: '4%',
                  background: 'rgba(11, 17, 38, 0.8)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  color: '#c084fc',
                  padding: '0.6rem 1.1rem',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  animationDelay: '1.5s'
                }}>
                  <span style={{ fontSize: '1.1rem' }}>&#123;&#125;</span>
                  <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>Backend</span>
                </div>

                <div className="float-animation" style={{
                  position: 'absolute',
                  top: '25%',
                  right: '5%',
                  background: 'rgba(11, 17, 38, 0.8)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  color: '#22d3ee',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  animationDelay: '3s'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>Cybersecurity</span>
                </div>

                {/* Main Hero Image */}
                <img 
                  src={heroStudent} 
                  alt="IT Academy Student" 
                  style={{
                    width: '94%',
                    height: '94%',
                    objectFit: 'contain',
                    zIndex: 1,
                    position: 'relative',
                    filter: 'drop-shadow(0 15px 30px rgba(37, 99, 235, 0.3))'
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div ref={statsRef} className="glass-panel" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
            padding: '2.5rem 3rem',
            marginTop: '6rem',
            textAlign: 'center',
            position: 'relative',
            zIndex: 10
          }}>
            <div>
              <h3 style={{ fontSize: '2.8rem', fontWeight: 800 }} className="text-gradient">150+</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem', fontWeight: 500 }}>Kurslar</p>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ fontSize: '2.8rem', fontWeight: 800 }} className="text-gradient">2500+</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem', fontWeight: 500 }}>O'quvchilar</p>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ fontSize: '2.8rem', fontWeight: 800 }} className="text-gradient">50+</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem', fontWeight: 500 }}>O'qituvchilar</p>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ fontSize: '2.8rem', fontWeight: 800 }} className="text-gradient">98%</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem', fontWeight: 500 }}>Mamnun o'quvchilar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Directions Grid Section */}
      <section className="section" id="nega-biz" style={{ borderTop: '1px solid rgba(255,255,255,0.03)', background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.6rem', marginBottom: '1rem' }}>
              Biz o'rgatadigan <span className="text-gradient">yo'nalishlar</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
              Zamonaviy texnologiyalar olamiga biz bilan qadam qo'ying. Har bir yo'nalish tajribali ustozlar tomonidan ishlab chiqilgan dasturlar asosida o'rgatiladi.
            </p>
          </div>

          <div ref={directionsRef} className="grid grid-cols-3">
            {directions.map((dir, index) => (
              <Link 
                key={index} 
                to={dir.link} 
                className="glass-card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.25rem',
                  padding: '2.25rem 2rem'
                }}
              >
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: `rgba(${dir.color === '#3b82f6' ? '59,130,246' : dir.color === '#06b6d4' ? '6,182,212' : dir.color === '#10b981' ? '16,185,129' : dir.color === '#a855f7' ? '168,85,247' : dir.color === '#f59e0b' ? '245,158,11' : '236,72,153'}, 0.1)`, 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: dir.color
                }}>
                  {dir.icon}
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)' }}>{dir.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{dir.desc}</p>
                <span className="text-gradient" style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Batafsil ma'lumot &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Review Section */}
      <section className="section" id="fikrlar" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.6rem', marginBottom: '1rem' }}>
              O'quvchilarimiz <span className="text-gradient">fikrlari</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
              Bizning bitiruvchilarimiz yirik mahalliy va xalqaro IT kompaniyalarda muvaffaqiyatli faoliyat yuritmoqdalar.
            </p>
          </div>

          <div className="grid grid-cols-3">
            {[
              { name: 'Sardorbek', course: 'Web Dasturlash', text: 'IT Academydagi darslar amaliyotga yo\'naltirilgani sababli juda tez o\'rgandim. 6 oydan keyin kompaniyaga ishga joylashdim.', img: '👨‍💻' },
              { name: 'Feruza', course: 'UI/UX Dizayn', text: 'Mentorlar har doim savollarimga javob berishdi. Portfolio yig\'ishimga ham katta ko\'mak berishdi.', img: '👩‍🎨' },
              { name: 'Jasur', course: 'Python Dasturlash', text: 'Noldan boshlagandim, hozir mustaqil loyihalar yozyapman. Kurs davomida olingan bilimlar bebaho.', img: '🚀' }
            ].map((review, idx) => (
              <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <span style={{ fontSize: '2.5rem' }}>{review.img}</span>
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>"{review.text}"</p>
                <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                  <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{review.name}</h4>
                  <span style={{ color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: 500 }}>{review.course} bitiruvchisi</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spin style inject */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 1024px) {
          section {
            padding-top: 7rem !important;
          }
          h1 {
            fontSize: 2.8rem !important;
          }
        }
        @media (max-width: 768px) {
          section {
            padding-top: 6rem !important;
          }
          h1 {
            font-size: 2.2rem !important;
          }
          .grid-cols-4 {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem !important;
          }
          .grid-cols-4 > div {
            padding: 1.5rem 1rem !important;
          }
          .grid-cols-4 h3 {
            font-size: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
