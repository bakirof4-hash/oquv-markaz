import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';

const coursesData = {
  1: {
    title: 'Python Dasturlash',
    isPopular: true,
    desc: 'Python tilini 0 dan boshlab o\'rganing va professional dasturchiga aylaning. Amaliy loyihalar orqali bilimlaringizni mustahkamlang.',
    price: '1 500 000 so\'m',
    level: 'Boshlang\'ichdan Yuqori darajagacha',
    duration: '8 oy',
    lessons: '32 ta',
    lang: 'O\'zbek tilida',
    cert: 'Mavjud',
    mentorName: 'Asadbek',
    mentorRole: 'Python Mentor',
    mentorExp: '5 yillik tajriba',
    mentorGrad: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    mentorInitials: 'A',
    iconColor: '#3b82f6',
    modules: [
      { id: 1, title: 'Python asoslari', details: 'O\'zgaruvchilar, ma\'lumot turlari, kiritish-chiqarish operatorlari, arifmetik amallar va sodda dasturlar yozish.' },
      { id: 2, title: 'Shart operatorlari', details: 'if, elif, else shartli o\'tish operatorlari, mantiqiy amallar va murakkab shartli tuzilmalar.' },
      { id: 3, title: 'Tsikllar', details: 'while va for takrorlanuvchi operatorlari, nested loops va tsikllarni boshqarish (break, continue).' },
      { id: 4, title: 'Funksiyalar', details: 'def yordamida funksiyalar yaratish, argumentlar, qiymat qaytarish, lambda va rekursiv funksiyalar.' },
      { id: 5, title: 'Ro\'yxatlar va lug\'atlar', details: 'List, Tuple, Set va Dictionary ma\'lumotlar to\'plamlari bilan ishlash va ularning metodlari.' }
    ],
    svg: (
      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#3b82f6' }}>
        <path d="M12 2H2v10h10V2z"></path>
        <path d="M22 12H12v10h10V12z"></path>
        <path d="M12 12H2v10h10V12z"></path>
        <path d="M22 2H12v10h10V2z"></path>
      </svg>
    )
  },
  2: {
    title: 'Web Dasturlash',
    isPopular: true,
    desc: 'HTML, CSS, JavaScript, React va Node.js bo\'yicha to\'liq bilim oling. Zamonaviy saytlar va web-ilovalarni yaratishni o\'rganing.',
    price: '1 800 000 so\'m',
    level: 'Boshlang\'ichdan Professionalgacha',
    duration: '8 oy',
    lessons: '48 ta',
    lang: 'O\'zbek tilida',
    cert: 'Mavjud',
    mentorName: 'Shahzod',
    mentorRole: 'Web Developer',
    mentorExp: '6 yillik tajriba',
    mentorGrad: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    mentorInitials: 'S',
    iconColor: '#06b6d4',
    modules: [
      { id: 1, title: 'HTML & CSS asoslari', details: 'Semantic teglar, CSS selektorlar, box-model va responsive web-dizayn asoslari.' },
      { id: 2, title: 'Sass, Flexbox va Grid', details: 'Sass preprotsessori, zamonaviy Flexbox va CSS Grid maketlarini yaratish.' },
      { id: 3, title: 'JavaScript va DOM', details: 'O\'zgaruvchilar, massivlar, obyektlar, funksiyalar va Document Object Model bilan ishlash.' },
      { id: 4, title: 'React.js framework', details: 'React asoslari, Components, Props, State, Hooks va API lar bilan integratsiya.' },
      { id: 5, title: 'Node.js va Express backend', details: 'Node.js server muhiti, Express frameworki, REST API yaratish va MongoDB ma\'lumotlar bazasi.' }
    ],
    svg: (
      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#06b6d4' }}>
        <polygon points="12 2 2 7 12 12 22 7 12 2 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
      </svg>
    )
  },
  3: {
    title: 'Mobil Dasturlash',
    isPopular: false,
    desc: 'Flutter yordamida Android va iOS platformalari uchun cross-platform ilovalar yaratishni o\'rganing.',
    price: '1 700 000 so\'m',
    level: 'Boshlang\'ichdan O\'rta darajagacha',
    duration: '6 oy',
    lessons: '36 ta',
    lang: 'O\'zbek tilida',
    cert: 'Mavjud',
    mentorName: 'Diyorbek',
    mentorRole: 'Mobile Developer',
    mentorExp: '4 yillik tajriba',
    mentorGrad: 'linear-gradient(135deg, #10b981, #06b6d4)',
    mentorInitials: 'D',
    iconColor: '#10b981',
    modules: [
      { id: 1, title: 'Dart dasturlash tili', details: 'Sinflar, obyektlar, OOP tamoyillari va Dart tili sintaksisi.' },
      { id: 2, title: 'Flutter Widgetlari', details: 'Stateless va Stateful widgetlar, animatsiyalar, layoutlar va formalar.' },
      { id: 3, title: 'State Management', details: 'Provider, Bloc yoki Redux yordamida ilova holatini boshqarish.' },
      { id: 4, title: 'API va Database', details: 'JSON parsing, http so\'rovlar yuborish, SQLite va Firebase integratsiyasi.' }
    ],
    svg: (
      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10b981' }}>
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
        <line x1="12" y1="18" x2="12.01" y2="18"></line>
      </svg>
    )
  },
  4: {
    title: 'UI/UX Dizayn',
    isPopular: false,
    desc: 'Figma dasturi yordamida interfeyslarni loyihalash va UX qoidalari bo\'yicha amaliy mashg\'ulotlar.',
    price: '1 200 000 so\'m',
    level: 'Boshlang\'ichdan O\'rta darajagacha',
    duration: '4 oy',
    lessons: '24 ta',
    lang: 'O\'zbek tilida',
    cert: 'Mavjud',
    mentorName: 'Sanjar',
    mentorRole: 'UI/UX Designer',
    mentorExp: '4 yillik tajriba',
    mentorGrad: 'linear-gradient(135deg, #f59e0b, #ec4899)',
    mentorInitials: 'S',
    iconColor: '#a855f7',
    modules: [
      { id: 1, title: 'Dizayn nazariyasi', details: 'Ranglar nazariyasi, tipografiya, kompozitsiya va setkalar bilan ishlash.' },
      { id: 2, title: 'Figma asboblari', details: 'Figma interfeysi, Auto Layout, Components, Variants va Prototipleash.' },
      { id: 3, title: 'User Experience (UX)', details: 'Foydalanuvchi yo\'llari (User Flows), Persona yaratish va UX tadqiqotlar o\'tkazish.' },
      { id: 4, title: 'Real loyihalar va Portfolio', details: 'Web sayt va mobil ilovalar chizish hamda portfolioni Behanceda shakllantirish.' }
    ],
    svg: (
      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#a855f7' }}>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        <path d="M2 12h20"></path>
      </svg>
    )
  },
  5: {
    title: 'SMM Mutaxassis',
    isPopular: false,
    desc: 'Ijtimoiy tarmoqlar orqali mijozlarni jalb qilish, target reklamalarni sozlash va brendni ommalashtirish.',
    price: '900 000 so\'m',
    level: 'Boshlang\'ichdan O\'rta darajagacha',
    duration: '3 oy',
    lessons: '18 ta',
    lang: 'O\'zbek tilida',
    cert: 'Mavjud',
    mentorName: 'Javohir',
    mentorRole: 'SMM Expert',
    mentorExp: '4 yillik tajriba',
    mentorGrad: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    mentorInitials: 'J',
    iconColor: '#f59e0b',
    modules: [
      { id: 1, title: 'SMM va Strategiya', details: 'Bozorni o\'rganish, auditoriya tahlili va SMM strategiya yozish.' },
      { id: 2, title: 'Copywriting va Kontent yaratish', details: 'Sarlavhalar ustida ishlash, matn yozish va postlarni rejalashtirish.' },
      { id: 3, title: 'Targeting va Reklama', details: 'Facebook Ads manager orqali reklamalarni to\'g\'ri sozlash va byudjetlashtirish.' }
    ],
    svg: (
      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f59e0b' }}>
        <path d="M22 2L11 13"></path>
        <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
      </svg>
    )
  },
  6: {
    title: 'Data Science',
    isPopular: false,
    desc: 'Python, Pandas, NumPy va Machine Learning yordamida katta hajmdagi ma\'lumotlar tahlilini amalga oshirish.',
    price: '2 000 000 so\'m',
    level: 'O\'rta darajadan Yuqori darajagacha',
    duration: '6 oy',
    lessons: '40 ta',
    lang: 'O\'zbek tilida',
    cert: 'Mavjud',
    mentorName: 'Islom',
    mentorRole: 'Data Scientist',
    mentorExp: '5 yillik tajriba',
    mentorGrad: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    mentorInitials: 'I',
    iconColor: '#ec4899',
    modules: [
      { id: 1, title: 'Python for Data Science', details: 'NumPy, Pandas kutubxonalari bilan ma\'lumotlar jadvalini qayta ishlash.' },
      { id: 2, title: 'Statistika va Ehtimollar nazariyasi', details: 'Ma\'lumotlarni vizuallashtirish, ehtimollik qonunlari va tahlillar.' },
      { id: 3, title: 'Machine Learning', details: 'Klassifikatsiya, regressiya algoritmlari va ML modellarini qurish.' }
    ],
    svg: (
      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ec4899' }}>
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    )
  }
};

export default function CourseDetails() {
  const { id } = useParams();
  const course = coursesData[id] || coursesData[1]; // Fallback to Python if not found
  const [activeModule, setActiveModule] = useState(1);

  const toggleModule = (moduleId) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Background Glows */}
      <div className="glow-bg glow-blue" style={{ top: '-10%' }}></div>
      <div className="glow-bg glow-purple" style={{ bottom: '10%' }}></div>

      <div className="container" style={{ paddingTop: '9rem', paddingBottom: '6rem' }}>
        {/* Breadcrumbs trail */}
        <div className="breadcrumbs">
          <Link to="/">Bosh sahifa</Link>
          <span className="separator">&gt;</span>
          <Link to="/courses">Kurslar</Link>
          <span className="separator">&gt;</span>
          <span className="current">{course.title}</span>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-3" style={{ gap: '3rem', gridTemplateColumns: '1fr 2fr' }}>
          
          {/* Left Column: Media & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-card" style={{ 
              textAlign: 'center', 
              padding: '3rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              background: 'rgba(11, 17, 38, 0.5)'
            }}>
              {/* Giant SVG icon */}
              <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: 'inset 0 0 20px rgba(255,255,255,0.02)'
              }}>
                {course.svg}
              </div>

              {/* Price card */}
              <div style={{ marginTop: '1rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Kurs narxi</span>
                <span style={{ fontSize: '2.2rem', color: 'var(--text-main)', fontWeight: 800 }}>{course.price}</span>
              </div>

              {/* Actions */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <Link to="/register" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                  Ro'yxatdan o'tish
                </Link>
                <Link to="/contact" className="btn btn-outline" style={{ width: '100%', padding: '1rem' }}>
                  Bepul konsultatsiya
                </Link>
              </div>

              {/* Features list */}
              <div style={{ width: '100%', textAlign: 'left', marginTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1.5rem' }}>
                <ul className="checkmark-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <li>{course.lessons} video-darslik</li>
                  <li>Amaliy loyihalar va topshiriqlar</li>
                  <li>Tajribali mentor yordami</li>
                  <li>Kurs yakunida sertifikat</li>
                  <li>Doimiy qo'llab-quvvatlash</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Header / Title block */}
            <div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '3.2rem', margin: 0 }}>{course.title}</h1>
                {course.isPopular && <span className="badge-popular" style={{ padding: '0.4rem 1rem' }}>POPULAR</span>}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                {course.desc}
              </p>

              {/* Specs Grid */}
              <div className="glass-panel" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(5, 1fr)', 
                gap: '1.5rem', 
                padding: '1.5rem 2rem',
                textAlign: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Daraja</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{course.level.split('dan')[0] || 'Boshlang\'ich'}</span>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Davomiyligi</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{course.duration}</span>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Darslar soni</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{course.lessons}</span>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Til</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{course.lang}</span>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Sertifikat</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{course.cert}</span>
                </div>
              </div>
            </div>

            {/* Accordion Modules section */}
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Kurs dasturi</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {course.modules.map((mod) => (
                  <div 
                    key={mod.id} 
                    className="glass-panel" 
                    style={{ 
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: activeModule === mod.id ? '1px solid rgba(6,182,212,0.2)' : '1px solid var(--glass-border)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {/* Header */}
                    <button 
                      onClick={() => toggleModule(mod.id)}
                      style={{
                        width: '100%',
                        background: activeModule === mod.id ? 'rgba(255,255,255,0.02)' : 'transparent',
                        border: 'none',
                        color: 'inherit',
                        padding: '1.25rem 2rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                        {mod.id}. {mod.title}
                      </h4>
                      <svg 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5"
                        style={{
                          transform: activeModule === mod.id ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease',
                          color: 'var(--text-muted)'
                        }}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>

                    {/* Details Panel */}
                    {activeModule === mod.id && (
                      <div style={{ 
                        padding: '1.25rem 2rem 1.75rem', 
                        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                        color: 'var(--text-muted)',
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        background: 'rgba(11, 17, 38, 0.2)'
                      }}>
                        {mod.details}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mentor Section */}
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Kurs o'qituvchisi</h2>
              <div className="glass-card" style={{ 
                display: 'flex', 
                gap: '2rem', 
                alignItems: 'center',
                padding: '2rem',
                background: 'rgba(11, 17, 38, 0.3)'
              }}>
                {/* Initial Badge Avatar */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: course.mentorGrad,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                  border: '2px solid rgba(255,255,255,0.08)'
                }}>
                  {course.mentorInitials}
                </div>

                {/* Mentor details info */}
                <div style={{ flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{course.mentorName}</h3>
                  <span style={{ color: 'var(--secondary)', fontSize: '0.95rem', fontWeight: 500 }}>{course.mentorRole}</span>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    Sohada {course.mentorExp}ga ega tajribali mutaxassis.
                  </p>
                </div>

                {/* Social icons */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <a href="#linkedin" className="btn-outline" style={{ padding: '8px', borderRadius: '50%' }} onClick={e => e.preventDefault()}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a href="#telegram" className="btn-outline" style={{ padding: '8px', borderRadius: '50%' }} onClick={e => e.preventDefault()}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .grid-cols-3 {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
