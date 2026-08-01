import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      {/* Background Glows */}
      <div className="glow-bg glow-purple" style={{ top: '-10%' }}></div>
      <div className="glow-bg glow-cyan" style={{ bottom: '-10%' }}></div>

      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '3rem 2.5rem' }}>
            <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2.4rem' }}>Ro'yxatdan o'tish</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '2.5rem' }}>
              IT Akademiyaga a'zo bo'lish uchun ariza qoldiring
            </p>
            
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>F.I.Sh. (To'liq ismingiz)</label>
                <input type="text" className="input-field" placeholder="Ism va familiyangizni kiriting" style={{ marginBottom: 0 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Telefon raqam</label>
                <input type="tel" className="input-field" placeholder="+998 90 123 45 67" style={{ marginBottom: 0 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Email pochta</label>
                <input type="email" className="input-field" placeholder="example@itacademy.uz" style={{ marginBottom: 0 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Parol</label>
                <input type="password" className="input-field" placeholder="Kamida 8 ta belgi" style={{ marginBottom: 0 }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                <input type="checkbox" style={{ accentColor: 'var(--primary)' }} required />
                <span>
                  Men <a href="#terms" className="text-gradient" style={{ fontWeight: 500 }} onClick={e => e.preventDefault()}>shartlar va qoidalarga</a> roziman
                </span>
              </div>

              <button type="button" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', marginTop: '1rem' }}>
                Ro'yxatdan o'tish
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Akkauntingiz bormi? <Link to="/login" className="text-gradient" style={{ fontWeight: 600 }}>Tizimga kirish</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
