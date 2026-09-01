import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import API_BASE_URL from '../api/config';

export default function Contact() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  useEffect(() => {
    // GSAP load animation
    gsap.fromTo(leftRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' });
    gsap.fromTo(rightRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (formData.name && formData.phone) {
      try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || 'Xabar yuborilmadi.');
        }

        setFormSubmitted(true);
        setTimeout(() => {
          setFormSubmitted(false);
          setFormData({ name: '', phone: '', email: '', message: '' });
        }, 4000);
      } catch (err) {
        setSubmitError(err.message || 'Xabar yuborishda xatolik yuz berdi.');
      }
    }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Background Glows */}
      <div className="glow-bg glow-cyan" style={{ top: '-10%' }}></div>
      <div className="glow-bg glow-blue" style={{ bottom: '10%' }}></div>

      <div className="container" style={{ paddingTop: '9rem', paddingBottom: '6rem' }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '3.2rem', marginBottom: '1rem' }}>Biz bilan bog'laning</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Savollaringiz bormi? Biz sizga yordam berishga tayyormiz!
          </p>
        </div>

        {/* Form and info grid */}
        <div className="grid grid-cols-2" style={{ gap: '3rem', alignItems: 'stretch' }}>
          
          {/* Left Column: Contact details */}
          <div ref={leftRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Manzil / Address */}
              <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ color: 'var(--secondary)', display: 'flex', flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Manzil</h4>
                  <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-main)' }}>
                    Farg'ona viloyati, Quvasoy shahri, Alisher Navoiy ko'chasi 15-uy
                  </p>
                </div>
              </div>

              {/* Telefon / Phone */}
              <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ color: 'var(--secondary)', display: 'flex', flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Telefon</h4>
                  <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-main)' }}>
                    +998 90 123 45 67
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ color: 'var(--secondary)', display: 'flex', flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Email</h4>
                  <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-main)' }}>
                    info@itacademy.uz
                  </p>
                </div>
              </div>

              {/* Ish vaqti / Work Time */}
              <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ color: 'var(--secondary)', display: 'flex', flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Ish vaqti</h4>
                  <p style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-main)' }}>
                    Dushanba - Shanba: 09:00 - 18:00 <br />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Yakshanba: Dam olish kuni</span>
                  </p>
                </div>
              </div>

            </div>

            {/* Social media footer */}
            <div className="glass-panel" style={{ padding: '1.5rem 2rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Ijtimoiy tarmoqlar</h4>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {['telegram', 'instagram', 'facebook', 'youtube', 'linkedin'].map((social) => (
                  <a key={social} href={`#${social}`} className="btn-outline" style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                  }} onClick={(e) => e.preventDefault()}>
                    {social === 'telegram' && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    )}
                    {social === 'instagram' && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    )}
                    {social === 'facebook' && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    )}
                    {social === 'youtube' && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                      </svg>
                    )}
                    {social === 'linkedin' && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Feedback form & Map widget */}
          <div ref={rightRef} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Message form */}
            <div className="glass-card" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {formSubmitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Muvaffaqiyatli yuborildi!</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Xabaringiz qabul qilindi. Tez orada mutaxassislarimiz siz bilan bog'lanishadi.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {submitError && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      padding: '0.8rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.88rem'
                    }}>
                      {submitError}
                    </div>
                  )}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Ismingiz</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Ismingizni kiriting" 
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={{ marginBottom: 0 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Telefon raqamingiz</label>
                    <input 
                      type="tel" 
                      className="input-field" 
                      placeholder="Telefon raqamingizni kiriting" 
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      required
                      style={{ marginBottom: 0 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Email manzilingiz</label>
                    <input 
                      type="email" 
                      className="input-field" 
                      placeholder="Email manzilingizni kiriting" 
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      style={{ marginBottom: 0 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Xabar</label>
                    <textarea 
                      className="input-field" 
                      placeholder="Xabaringizni yozing..." 
                      rows="4" 
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      style={{ marginBottom: 0, resize: 'none' }}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem' }}>
                    Yuborish
                  </button>
                </form>
              )}
            </div>

            {/* Stylized Dark Map Widget */}
            <div className="glass-panel" style={{ 
              height: '240px', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              position: 'relative',
              background: '#040712',
              border: '1px solid rgba(255, 255, 255, 0.04)'
            }}>
              {/* Map grid lines in background */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'radial-gradient(rgba(37,99,235,0.06) 1.5px, transparent 1.5px), linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)',
                backgroundSize: '24px 24px, 48px 48px, 48px 48px',
                opacity: 0.8
              }}></div>

              {/* Fake Road Lines */}
              <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.15 }}>
                <path d="M-20 60 Q 150 70 500 120" stroke="#fff" strokeWidth="8" fill="none"></path>
                <path d="M120 -20 L 140 300" stroke="#fff" strokeWidth="12" fill="none"></path>
                <path d="M-20 180 Q 200 160 500 190" stroke="#fff" strokeWidth="6" fill="none"></path>
                <path d="M300 -20 L 260 300" stroke="#fff" strokeWidth="8" fill="none"></path>
              </svg>

              {/* Glowing Marker */}
              <div style={{
                position: 'absolute',
                left: '60%',
                top: '40%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                {/* Outer pulsing circle */}
                <div style={{
                  position: 'absolute',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--primary-glow)',
                  animation: 'pulse 1.8s infinite alternate',
                  zIndex: 1
                }}></div>
                
                {/* Pin Icon */}
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'var(--secondary)',
                  border: '3px solid #fff',
                  zIndex: 2,
                  boxShadow: '0 0 10px var(--secondary)'
                }}></div>

                {/* Popover */}
                <div className="glass-panel" style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  marginTop: '0.5rem',
                  zIndex: 3,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(6,182,212,0.3)'
                }}>
                  IT Academy
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
