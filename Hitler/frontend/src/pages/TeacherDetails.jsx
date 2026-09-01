import { useParams, Link } from 'react-router-dom';

export default function TeacherDetails() {
  const { id } = useParams();

  return (
    <div className="section" style={{ paddingTop: '8rem', minHeight: '100vh' }}>
      <div className="container">
        <div className="glass-card" style={{ padding: '4rem 2rem' }}>
          <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
            <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }}></div>
            <div>
              <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Instructor {id}</h1>
              <h3 style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Senior Frontend Engineer</h3>
              <p style={{ lineHeight: '1.8', marginBottom: '2rem' }}>
                With over 10 years of experience in the tech industry, I specialize in building highly interactive and performant web applications using React and GSAP. 
              </p>
              <h4>Courses Taught</h4>
              <div className="grid grid-cols-2" style={{ gap: '1rem', marginTop: '1rem' }}>
                <Link to="/courses/1" className="glass-panel" style={{ padding: '1rem' }}>
                  <h5>Advanced React & GSAP</h5>
                </Link>
                <Link to="/courses/2" className="glass-panel" style={{ padding: '1rem' }}>
                  <h5>Modern UI/UX Design</h5>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
