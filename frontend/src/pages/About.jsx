import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function About() {
  const textRef = useRef(null);
  
  useEffect(() => {
    gsap.fromTo(textRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1 });
  }, []);

  return (
    <div className="section" style={{ paddingTop: '8rem', minHeight: '100vh' }}>
      <div className="container">
        <div className="grid grid-cols-2" style={{ alignItems: 'center' }}>
          <div ref={textRef}>
            <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>About Our Academy</h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Located in the heart of Quvasoy, our IT Academy is dedicated to producing world-class tech talent. We believe in practical, hands-on learning over traditional theory.
            </p>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Our curriculum is designed by industry experts with a focus on modern stacks like React, Django, and cutting-edge design principles like glassmorphism.
            </p>
            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h3 className="text-gradient" style={{ fontSize: '2.5rem', margin: 0 }}>500+</h3>
                <p>Graduates</p>
              </div>
              <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h3 className="text-gradient" style={{ fontSize: '2.5rem', margin: 0 }}>95%</h3>
                <p>Employment Rate</p>
              </div>
            </div>
          </div>
          <div className="glass-card" style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Premium Illustration Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
}
