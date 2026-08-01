import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Navbar() {
  const navRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // GSAP Fade in navbar on mount
    gsap.fromTo(navRef.current, 
      { y: -100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }
    );
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.style.setProperty('--bg-color', '#f8fafc');
      document.documentElement.style.setProperty('--bg-card', '#ffffff');
      document.documentElement.style.setProperty('--bg-panel', 'rgba(241, 245, 249, 0.8)');
      document.documentElement.style.setProperty('--text-main', '#0f172a');
      document.documentElement.style.setProperty('--text-muted', '#64748b');
      document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
      document.documentElement.style.setProperty('--glass-border', 'rgba(15, 23, 42, 0.08)');
    } else {
      document.documentElement.style.setProperty('--bg-color', '#050814');
      document.documentElement.style.setProperty('--bg-card', '#0b1126');
      document.documentElement.style.setProperty('--bg-panel', 'rgba(11, 17, 38, 0.6)');
      document.documentElement.style.setProperty('--text-main', '#f8fafc');
      document.documentElement.style.setProperty('--text-muted', '#94a3b8');
      document.documentElement.style.setProperty('--glass-bg', 'rgba(11, 17, 38, 0.45)');
      document.documentElement.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.05)');
    }
  };

  return (
    <nav ref={navRef} style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0,
      width: '100%', 
      zIndex: 100, 
      padding: '1.25rem 2rem',
      boxSizing: 'border-box'
    }}>
      <div className="glass-panel" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0.75rem 2rem',
        maxWidth: '1280px',
        margin: '0 auto',
        height: '64px',
        boxSizing: 'border-box'
      }}>
        {/* Logo */}
        <Link to="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontSize: '1.5rem', 
          fontWeight: 800,
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          <span style={{ 
            width: '32px', 
            height: '32px', 
            background: 'var(--gradient-btn)', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}>IT</span>
          <span style={{ color: 'var(--text-main)' }}>Academy</span>
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: location.pathname === '/' ? 'var(--secondary)' : 'var(--text-muted)', fontWeight: 500 }}>Bosh sahifa</Link>
          <Link to="/courses" style={{ color: location.pathname.startsWith('/courses') ? 'var(--secondary)' : 'var(--text-muted)', fontWeight: 500 }}>Kurslar</Link>
          <Link to="/teachers" style={{ color: location.pathname.startsWith('/teachers') ? 'var(--secondary)' : 'var(--text-muted)', fontWeight: 500 }}>O'qituvchilar</Link>
          <a href="/#nega-biz" style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Nega biz?</a>
          <a href="/#fikrlar" style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Fikrlar</a>
          <Link to="/contact" style={{ color: location.pathname === '/contact' ? 'var(--secondary)' : 'var(--text-muted)', fontWeight: 500 }}>Aloqa</Link>
        </div>

        {/* Action Controls */}
        <div className="desktop-menu" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          {/* Theme Toggle */}
          <button onClick={toggleTheme} style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.3s',
          }} className="btn-outline">
            {isDark ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', borderRadius: '8px' }}>
            Ro'yxatdan o'tish
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '8px',
            display: 'none'
          }}
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="glass-panel float-animation" style={{
          position: 'absolute',
          top: '80px',
          left: '2rem',
          right: '2rem',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          zIndex: 99
        }}>
          <Link to="/">Bosh sahifa</Link>
          <Link to="/courses">Kurslar</Link>
          <Link to="/teachers">O'qituvchilar</Link>
          <a href="/#nega-biz">Nega biz?</a>
          <a href="/#fikrlar">Fikrlar</a>
          <Link to="/contact">Aloqa</Link>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button onClick={toggleTheme} className="btn btn-outline" style={{ justifyContent: 'center' }}>
              Temani o'zgartirish
            </button>
            <Link to="/register" className="btn btn-primary" style={{ textAlign: 'center' }}>
              Ro'yxatdan o'tish
            </Link>
          </div>
        </div>
      )}

      {/* Responsive stylesheet inject (scoped to keep clean) */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
