import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api/config';

const initialCourses = [
  {
    _id: '1',
    id: 1,
    title: 'Python Dasturlash',
    category: 'backend',
    desc: 'Python tilini 0 dan boshlab o\'rganing va professional dasturchiga aylaning. Amaliy loyihalar orqali bilimlarni mustahkamlang.',
    duration: '8 oylik kurs',
    price: '1 500 000 so\'m',
    isPopular: true,
    icon: 'code',
    badgeColor: '#3b82f6'
  },
  {
    _id: '2',
    id: 2,
    title: 'Web Dasturlash',
    category: 'frontend',
    desc: 'HTML, CSS, JavaScript, React va Node.js bo\'yicha mukammal bilimga ega bo\'ling. Portfolio yaratish va ishlash imkoniyati.',
    duration: '8 oylik kurs',
    price: '1 800 000 so\'m',
    isPopular: false,
    icon: 'layout',
    badgeColor: '#06b6d4'
  },
  {
    _id: '3',
    id: 3,
    title: 'Mobil Dasturlash',
    category: 'mobile',
    desc: 'Flutter yordamida Android va iOS operatsion tizimlari uchun bir vaqtning o\'zida ilovalar ishlab chiqishni o\'rganing.',
    duration: '6 oylik kurs',
    price: '1 700 000 so\'m',
    isPopular: false,
    icon: 'smartphone',
    badgeColor: '#10b981'
  },
  {
    _id: '4',
    id: 4,
    title: 'UI/UX Dizayn',
    category: 'design',
    desc: 'Figma va zamonaviy UI/UX qoidalarini o\'rganib, chiroyli va qulay interfeyslar chizing hamda foydalanuvchi tajribasini loyihang.',
    duration: '4 oylik kurs',
    price: '1 200 000 so\'m',
    isPopular: false,
    icon: 'feather',
    badgeColor: '#a855f7'
  },
  {
    _id: '5',
    id: 5,
    title: 'SMM Mutaxassis',
    category: 'marketing',
    desc: 'Ijtimoiy tarmoqlar (Telegram, Instagram, Facebook) bilan ishlash, target va kontent rejalashtirish strategiyalarini egallang.',
    duration: '3 oylik kurs',
    price: '900 000 so\'m',
    isPopular: false,
    icon: 'send',
    badgeColor: '#f59e0b'
  },
  {
    _id: '6',
    id: 6,
    title: 'Data Science',
    category: 'data',
    desc: 'Python, Big Data, Machine Learning va Data Analysis usullarini o\'rganib, murakkab ma\'lumotlar tahlilini amalga oshiring.',
    duration: '6 oylik kurs',
    price: '2 000 000 so\'m',
    isPopular: false,
    icon: 'database',
    badgeColor: '#ec4899'
  }
];

export const renderCourseIcon = (iconName, color = '#3b82f6') => {
  switch (iconName) {
    case 'code':
      return (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color }}>
          <path d="M12 2H2v10h10V2z"></path>
          <path d="M22 12H12v10h10V12z"></path>
          <path d="M12 12H2v10h10V12z"></path>
          <path d="M22 2H12v10h10V2z"></path>
        </svg>
      );
    case 'layout':
      return (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color }}>
          <polygon points="12 2 2 7 12 12 22 7 12 2 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
      );
    case 'smartphone':
      return (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color }}>
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
      );
    case 'feather':
      return (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color }}>
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          <path d="M2 12h20"></path>
        </svg>
      );
    case 'send':
      return (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color }}>
          <path d="M22 2L11 13"></path>
          <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
        </svg>
      );
    case 'database':
    default:
      return (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color }}>
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      );
  }
};

export default function Courses() {
  const [allCourses, setAllCourses] = useState(initialCourses);
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const gridRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/courses`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAllCourses(data);
          setCourses(data);
        }
      })
      .catch(() => {
        // keep initial fallback
      });
  }, []);

  useEffect(() => {
    const filtered = allCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                            course.desc.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || course.category === category;
      return matchesSearch && matchesCategory;
    });
    setCourses(filtered);
  }, [search, category, allCourses]);

  useEffect(() => {
    if (gridRef.current && gridRef.current.children.length > 0) {
      gsap.fromTo(gridRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [courses]);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Background Glows */}
      <div className="glow-bg glow-blue" style={{ top: '-10%' }}></div>
      <div className="glow-bg glow-cyan" style={{ bottom: '10%' }}></div>

      <div className="container" style={{ paddingTop: '9rem', paddingBottom: '6rem' }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '3.2rem', marginBottom: '1rem' }}>Kurslarimiz</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Kelajakka qadam qo'yish uchun eng yaxshi kurslarni tanlang!
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-panel" style={{
          display: 'flex',
          gap: '1.5rem',
          padding: '1.25rem 2rem',
          marginBottom: '3rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Kurs qidirish..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '3rem', marginBottom: 0 }}
            />
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{
                position: 'absolute',
                left: '1.2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          {/* Category Dropdown */}
          <div style={{ minWidth: '220px', position: 'relative' }}>
            <select 
              className="input-field" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ 
                marginBottom: 0,
                appearance: 'none',
                cursor: 'pointer',
                paddingRight: '2.5rem'
              }}
            >
              <option value="all">Barcha yo'nalishlar</option>
              <option value="frontend">Frontend Dasturlash</option>
              <option value="backend">Backend Dasturlash</option>
              <option value="mobile">Mobil Dasturlash</option>
              <option value="design">UI/UX Dizayn</option>
              <option value="marketing">SMM & Marketing</option>
              <option value="data">Data Science</option>
            </select>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{
                position: 'absolute',
                right: '1.2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'var(--text-muted)'
              }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

        {/* Courses Cards Grid */}
        {courses.length > 0 ? (
          <div ref={gridRef} className="grid grid-cols-3">
            {courses.map((course) => (
              <div 
                key={course._id || course.id} 
                className="glass-card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1rem',
                  padding: '2rem 1.75rem',
                }}
              >
                {/* Visual Icon Box */}
                <div style={{ 
                  height: '140px', 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  position: 'relative'
                }}>
                  {renderCourseIcon(course.icon, course.badgeColor || '#3b82f6')}
                  {course.isPopular && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                      <span className="badge-popular">POPULAR</span>
                    </div>
                  )}
                </div>

                {/* Course Metadata */}
                <h3 style={{ fontSize: '1.45rem', fontWeight: 600 }}>{course.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', flexGrow: 1 }}>
                  {course.desc}
                </p>

                {/* Stats Container (Duration and Price) */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Davomiyligi</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>{course.duration}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Narxi</span>
                    <span style={{ fontSize: '1rem', color: 'var(--secondary)', fontWeight: 700 }}>{course.price}</span>
                  </div>
                </div>

                {/* Link to detail page */}
                <div style={{ marginTop: '0.75rem' }}>
                  <Link to={`/courses/${course._id || course.id}`} className="btn btn-outline" style={{ width: '100%', padding: '0.7rem' }}>
                    Batafsil ma'lumot
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem' }}>🔍</span>
            <h3 style={{ marginTop: '1rem', fontSize: '1.5rem' }}>Kurslar topilmadi</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Qidiruv so'rovingizga mos keladigan kurslar mavjud emas. Iltimos, boshqa kalit so'z kiritib ko'ring.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
