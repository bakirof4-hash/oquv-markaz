export default function StudentDashboard() {
  return (
    <div className="section" style={{ paddingTop: '8rem', minHeight: '100vh' }}>
      <div className="container">
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Student Dashboard</h1>
        <div className="grid grid-cols-3">
          <div className="glass-card" style={{ gridColumn: 'span 2' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>My Enrolled Courses</h3>
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4>Advanced React & GSAP</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Progress: 45%</p>
              </div>
              <button className="btn btn-outline">Continue Learning</button>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4>Python & Django Mastery</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Progress: 10%</p>
              </div>
              <button className="btn btn-outline">Continue Learning</button>
            </div>
          </div>
          <div>
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Profile Summary</h3>
              <p style={{ color: 'var(--text-muted)' }}>Name: John Doe</p>
              <p style={{ color: 'var(--text-muted)' }}>Email: student@example.com</p>
              <button className="btn btn-outline" style={{ marginTop: '1rem', width: '100%' }}>Edit Profile</button>
            </div>
            <div className="glass-card">
              <h3 style={{ marginBottom: '1rem' }}>Achievements</h3>
              <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                React Basics Completed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
