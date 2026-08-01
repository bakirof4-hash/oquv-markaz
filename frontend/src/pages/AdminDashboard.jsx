import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api/config';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'courses', 'instructors', 'messages'

  // Data states
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '', category: 'backend', desc: '', duration: '', price: '',
    isPopular: false, icon: 'code', badgeColor: '#3b82f6',
    mentorName: '', mentorRole: '', mentorExp: '5 yillik tajriba',
    mentorGrad: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', mentorInitials: 'A'
  });

  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [teacherForm, setTeacherForm] = useState({
    name: '', role: '', exp: '4 yillik tajriba',
    grad: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', initials: 'A'
  });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Check if user is logged in as admin
    if (!token || user.role !== 'admin') {
      // Allow demo access if token not available, but show info alert
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resC, resT, resM] = await Promise.all([
        fetch(`${API_BASE_URL}/courses`),
        fetch(`${API_BASE_URL}/instructors`),
        fetch(`${API_BASE_URL}/contact`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (resC.ok) setCourses(await resC.json());
      if (resT.ok) setInstructors(await resT.json());
      if (resM.ok) setMessages(await resM.json());
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Course handlers
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    const url = editingCourse 
      ? `${API_BASE_URL}/courses/${editingCourse._id}` 
      : `${API_BASE_URL}/courses`;
    const method = editingCourse ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(courseForm)
      });

      if (res.ok) {
        setShowCourseModal(false);
        setEditingCourse(null);
        fetchData();
      } else {
        alert('Xatolik yuz berdi.');
      }
    } catch (err) {
      alert('Server bilan ulanishda xatolik.');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Haqiqatdan ham ushbu kursni o\'chirmoqchimisiz?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Instructor handlers
  const handleSaveTeacher = async (e) => {
    e.preventDefault();
    const url = editingTeacher 
      ? `${API_BASE_URL}/instructors/${editingTeacher._id}` 
      : `${API_BASE_URL}/instructors`;
    const method = editingTeacher ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(teacherForm)
      });

      if (res.ok) {
        setShowTeacherModal(false);
        setEditingTeacher(null);
        fetchData();
      } else {
        alert('Xatolik yuz berdi.');
      }
    } catch (err) {
      alert('Server bilan ulanishda xatolik.');
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm('Haqiqatdan ham ushbu o\'qituvchini o\'chirmoqchimisiz?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/instructors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete message
  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Xabarni o\'chirmoqchimisiz?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', paddingTop: '8rem', paddingBottom: '6rem' }}>
      <div className="glow-bg glow-purple" style={{ top: '-10%' }}></div>
      <div className="glow-bg glow-blue" style={{ bottom: '10%' }}></div>

      <div className="container">
        {/* Page Title & Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2.8rem', marginBottom: '0.25rem' }}>Admin Boshqaruv Paneli</h1>
            <p style={{ color: 'var(--text-muted)' }}>Sayt kontentini va so'rovlarni real-vaqtda boshqaring</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-outline" onClick={fetchData}>
              🔄 Yangilash
            </button>
            <button className="btn btn-primary" onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}>
              Chiqish 🚪
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="glass-panel" style={{ display: 'flex', gap: '1rem', padding: '0.75rem', marginBottom: '2.5rem', overflowX: 'auto' }}>
          {[
            { id: 'overview', label: '📊 Umumiy statistika' },
            { id: 'courses', label: `📚 Kurslar (${courses.length})` },
            { id: 'instructors', label: `👨‍🏫 O'qituvchilar (${instructors.length})` },
            { id: 'messages', label: `📩 Xabarlar (${messages.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ border: activeTab === tab.id ? 'none' : '1px solid transparent' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW STATS */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-4" style={{ marginBottom: '3rem', gap: '1.5rem' }}>
              <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
                <h2 className="text-gradient" style={{ fontSize: '2.8rem' }}>1,250+</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Jami O'quvchilar</p>
              </div>
              <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
                <h2 className="text-gradient" style={{ fontSize: '2.8rem' }}>{courses.length}</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Aktiv Kurslar</p>
              </div>
              <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
                <h2 className="text-gradient" style={{ fontSize: '2.8rem' }}>{instructors.length}</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>O'qituvchilar</p>
              </div>
              <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
                <h2 className="text-gradient" style={{ fontSize: '2.8rem' }}>{messages.length}</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Kelgan Xabarlar</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COURSES MANAGEMENT */}
        {activeTab === 'courses' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.8rem' }}>Mavjud Kurslar</h2>
              <button className="btn btn-primary" onClick={() => {
                setEditingCourse(null);
                setCourseForm({
                  title: '', category: 'backend', desc: '', duration: '8 oylik kurs', price: '1 500 000 so\'m',
                  isPopular: false, icon: 'code', badgeColor: '#3b82f6',
                  mentorName: 'Asadbek', mentorRole: 'Python Mentor', mentorExp: '5 yillik tajriba',
                  mentorGrad: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', mentorInitials: 'A'
                });
                setShowCourseModal(true);
              }}>
                + Yangi Kurs Qo'shish
              </button>
            </div>

            <div className="glass-card" style={{ padding: '0.5rem' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '1.2rem' }}>Kurs nomi</th>
                    <th style={{ padding: '1.2rem' }}>Kategoriya</th>
                    <th style={{ padding: '1.2rem' }}>Narxi</th>
                    <th style={{ padding: '1.2rem' }}>Mentor</th>
                    <th style={{ padding: '1.2rem', textAlign: 'right' }}>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course._id || course.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 600 }}>{course.title}</td>
                      <td style={{ padding: '1.2rem', textTransform: 'capitalize' }}>{course.category}</td>
                      <td style={{ padding: '1.2rem', color: 'var(--secondary)' }}>{course.price}</td>
                      <td style={{ padding: '1.2rem' }}>{course.mentorName}</td>
                      <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                        <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', marginRight: '0.5rem' }} onClick={() => {
                          setEditingCourse(course);
                          setCourseForm({ ...course });
                          setShowCourseModal(true);
                        }}>✏️ Tahrirlash</button>
                        <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', color: '#ef4444' }} onClick={() => handleDeleteCourse(course._id)}>🗑️ O'chirish</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INSTRUCTORS MANAGEMENT */}
        {activeTab === 'instructors' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.8rem' }}>Mavjud O'qituvchilar</h2>
              <button className="btn btn-primary" onClick={() => {
                setEditingTeacher(null);
                setTeacherForm({
                  name: '', role: '', exp: '4 yillik tajriba',
                  grad: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', initials: 'A'
                });
                setShowTeacherModal(true);
              }}>
                + Yangi O'qituvchi Qo'shish
              </button>
            </div>

            <div className="glass-card" style={{ padding: '0.5rem' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '1.2rem' }}>Ism</th>
                    <th style={{ padding: '1.2rem' }}>Lavozim / Yo'nalish</th>
                    <th style={{ padding: '1.2rem' }}>Tajriba</th>
                    <th style={{ padding: '1.2rem', textAlign: 'right' }}>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {instructors.map(teacher => (
                    <tr key={teacher._id || teacher.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%', background: teacher.grad,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem'
                        }}>
                          {teacher.initials || teacher.name.charAt(0)}
                        </div>
                        {teacher.name}
                      </td>
                      <td style={{ padding: '1.2rem' }}>{teacher.role}</td>
                      <td style={{ padding: '1.2rem' }}>{teacher.exp}</td>
                      <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                        <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', marginRight: '0.5rem' }} onClick={() => {
                          setEditingTeacher(teacher);
                          setTeacherForm({ ...teacher });
                          setShowTeacherModal(true);
                        }}>✏️ Tahrirlash</button>
                        <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', color: '#ef4444' }} onClick={() => handleDeleteTeacher(teacher._id)}>🗑️ O'chirish</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CONTACT MESSAGES */}
        {activeTab === 'messages' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Foydalanuvchilardan kelgan xabarlar</h2>

            <div className="glass-card" style={{ padding: '0.5rem' }}>
              {messages.length > 0 ? (
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '1.2rem' }}>Ism</th>
                      <th style={{ padding: '1.2rem' }}>Telefon</th>
                      <th style={{ padding: '1.2rem' }}>Email</th>
                      <th style={{ padding: '1.2rem' }}>Xabar</th>
                      <th style={{ padding: '1.2rem', textAlign: 'right' }}>Amal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map(msg => (
                      <tr key={msg._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1.2rem', fontWeight: 600 }}>{msg.name}</td>
                        <td style={{ padding: '1.2rem' }}>{msg.phone}</td>
                        <td style={{ padding: '1.2rem' }}>{msg.email || '-'}</td>
                        <td style={{ padding: '1.2rem', maxWidth: '300px' }}>{msg.message}</td>
                        <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                          <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', color: '#ef4444' }} onClick={() => handleDeleteMessage(msg._id)}>🗑️ O'chirish</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  Hozircha yangi xabarlar yo'q.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* COURSE FORM MODAL */}
      {showCourseModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-card" style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingCourse ? 'Kursni Tahrirlash' : 'Yangi Kurs Qo\'shish'}</h2>
            <form onSubmit={handleSaveCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Kurs nomi</label>
                <input type="text" className="input-field" value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Kategoriya</label>
                  <select className="input-field" value={courseForm.category} onChange={e => setCourseForm({ ...courseForm, category: e.target.value })}>
                    <option value="backend">Backend</option>
                    <option value="frontend">Frontend</option>
                    <option value="mobile">Mobil</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="data">Data Science</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Narxi</label>
                  <input type="text" className="input-field" value={courseForm.price} onChange={e => setCourseForm({ ...courseForm, price: e.target.value })} required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Tavsifi</label>
                <textarea className="input-field" rows="3" value={courseForm.desc} onChange={e => setCourseForm({ ...courseForm, desc: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowCourseModal(false)}>Bekor qilish</button>
                <button type="submit" className="btn btn-primary">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEACHER FORM MODAL */}
      {showTeacherModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-card" style={{ width: '90%', maxWidth: '500px', padding: '2.5rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingTeacher ? 'O\'qituvchini Tahrirlash' : 'Yangi O\'qituvchi Qo\'shish'}</h2>
            <form onSubmit={handleSaveTeacher} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Ism va Familiya</label>
                <input type="text" className="input-field" value={teacherForm.name} onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value, initials: e.target.value.charAt(0) })} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Yo'nalishi / Role</label>
                <input type="text" className="input-field" placeholder="Masalan: Python Mentor" value={teacherForm.role} onChange={e => setTeacherForm({ ...teacherForm, role: e.target.value })} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Tajribasi</label>
                <input type="text" className="input-field" value={teacherForm.exp} onChange={e => setTeacherForm({ ...teacherForm, exp: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowTeacherModal(false)}>Bekor qilish</button>
                <button type="submit" className="btn btn-primary">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
