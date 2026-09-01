import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from './ToastContext';

const LmsContext = createContext();

const INITIAL_TEACHERS = [
  {
    id: 't1',
    name: 'Javohir Toshmatov',
    email: 'j.toshmatov@academy.uz',
    subject: 'Frontend & React',
    bio: '7 yillik Tajribali Senior Frontend Ingener, React va Next.js bo\'yicha mutaxassis.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    createdAt: '2025-01-10'
  },
  {
    id: 't2',
    name: 'Anvar Alimov',
    email: 'a.alimov@academy.uz',
    subject: 'Python & AI Engineering',
    bio: 'Data Science va Machine Learning bo\'yicha Senior Lead Architect.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    createdAt: '2025-01-15'
  },
  {
    id: 't3',
    name: 'Dilnoza Rahimova',
    email: 'd.rahimova@academy.uz',
    subject: 'UI/UX & Product Design',
    bio: 'Xalqaro SaaS mahsulotlar uchun UI/UX dizayner, Figma & Design System expert.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    createdAt: '2025-02-01'
  },
  {
    id: 't4',
    name: 'Rustam Qodirov',
    email: 'r.qodirov@academy.uz',
    subject: 'Backend & Cloud DevOps',
    bio: 'Node.js, Go, Docker va Microservices bo\'yicha Lead Cloud Specialist.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    createdAt: '2025-02-12'
  }
];

const INITIAL_COURSES = [
  {
    id: 'c1',
    title: 'Modern React 19 & Next.js Masterclass',
    description: 'React 19 Server Components, App Router va Zamonaviy State Management noldan professional darajagacha.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80',
    teacherId: 't1',
    category: 'Frontend',
    status: 'published',
    createdAt: '2025-02-10'
  },
  {
    id: 'c2',
    title: 'Python & Generative AI Ingestion Pipelines',
    description: 'Python, BigQuery, LangChain va Vector DB yordamida AI dasturlar yaratish.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    teacherId: 't2',
    category: 'AI & Data',
    status: 'published',
    createdAt: '2025-02-14'
  },
  {
    id: 'c3',
    title: 'Advanced UI/UX & Antigravity Design Systems',
    description: 'Figma va Web UI texnologiyalari uchun zamonaviy premium interfeyslar dizayn tizimi.',
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80',
    teacherId: 't3',
    category: 'Design',
    status: 'published',
    createdAt: '2025-02-18'
  },
  {
    id: 'c4',
    title: 'Node.js Microservices & Cloud Infrastructure',
    description: 'Kubernetes, Docker, RabbitMQ va Node.js bilan yuqori yuklamali tizimlar qurish.',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    teacherId: 't4',
    category: 'Backend',
    status: 'draft',
    createdAt: '2025-02-20'
  }
];

const INITIAL_VIDEOS = [
  {
    id: 'v1',
    courseId: 'c1',
    title: '1. React 19 Concurrent Engine va Yangi Hooklar',
    description: 'useActionState, useOptimistic va Form Actions chuqur tahlili.',
    videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400&q=80',
    duration: '18:45',
    status: 'published',
    createdAt: '2025-02-11'
  },
  {
    id: 'v2',
    courseId: 'c1',
    title: '2. Next.js App Router Architecture & Caching',
    description: 'Server Components va Client Components o\'rtasidagi to\'g\'ri muvozanat.',
    videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
    duration: '24:10',
    status: 'published',
    createdAt: '2025-02-12'
  },
  {
    id: 'v3',
    courseId: 'c1',
    title: '3. Zustand & TanStack Query State Management',
    description: 'Zamonaviy React dasturlarida asinxron ma\'lumotlar bilan ishlash.',
    videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
    duration: '20:15',
    status: 'published',
    createdAt: '2025-02-13'
  },
  {
    id: 'v4',
    courseId: 'c2',
    title: '1. Python AsyncIO va Fast API Boshlang\'ich Tushunchalar',
    description: 'Asinxron Python dasturlash va tezkor REST API interfeysi.',
    videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
    duration: '22:30',
    status: 'published',
    createdAt: '2025-02-15'
  },
  {
    id: 'v5',
    courseId: 'c2',
    title: '2. LangChain & LLM Integration',
    description: 'Sun\'iy intellekt modellarini backendga bog\'lash.',
    videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=400&q=80',
    duration: '31:15',
    status: 'published',
    createdAt: '2025-02-16'
  },
  {
    id: 'v6',
    courseId: 'c3',
    title: '1. Antigravity Dark Design System Prinsiplari',
    description: 'Ranglar nazariyasi, gradientlar va zamonaviy glassmorphism muvozanati.',
    videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=400&q=80',
    duration: '15:20',
    status: 'published',
    createdAt: '2025-02-19'
  },
  {
    id: 'v7',
    courseId: 'c3',
    title: '2. Figma Auto Layout & Variable Systems',
    description: 'Dizaynda komponentlar o\'zgaruvchanligi va moslashuvchan interfeyslar.',
    videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80',
    duration: '19:40',
    status: 'published',
    createdAt: '2025-02-21'
  },
  {
    id: 'v8',
    courseId: 'c4',
    title: '1. Node.js Microservices & Docker Containers',
    description: 'Mikroxizmatlar arxitekturasi va konteynerizatsiya.',
    videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
    duration: '27:50',
    status: 'draft',
    createdAt: '2025-02-22'
  }
];

const loadSavedData = (key, defaultData) => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  return defaultData;
};

export const LmsProvider = ({ children }) => {
  const { addToast } = useToast();

  const [teachers, setTeachers] = useState(() => loadSavedData('lms_teachers', INITIAL_TEACHERS));
  const [courses, setCourses] = useState(() => loadSavedData('lms_courses', INITIAL_COURSES));
  const [videos, setVideos] = useState(() => loadSavedData('lms_videos', INITIAL_VIDEOS));

  const [currentRole, setCurrentRole] = useState('admin'); // 'admin' | 'teacher'
  const [activeTeacherId, setActiveTeacherId] = useState('t1');

  useEffect(() => {
    localStorage.setItem('lms_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('lms_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('lms_videos', JSON.stringify(videos));
  }, [videos]);

  const resetDemoData = () => {
    setTeachers(INITIAL_TEACHERS);
    setCourses(INITIAL_COURSES);
    setVideos(INITIAL_VIDEOS);
    localStorage.setItem('lms_teachers', JSON.stringify(INITIAL_TEACHERS));
    localStorage.setItem('lms_courses', JSON.stringify(INITIAL_COURSES));
    localStorage.setItem('lms_videos', JSON.stringify(INITIAL_VIDEOS));
    if (addToast) addToast("Demo ma'lumotlar qayta tiklandi!", "info");
  };


  // Statistics calculation
  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const totalVideos = videos.length;
    const publishedCourses = courses.filter(c => c.status === 'published').length;
    const draftCourses = courses.filter(c => c.status === 'draft').length;
    const totalTeachers = teachers.length;

    return {
      totalCourses,
      totalVideos,
      publishedCourses,
      draftCourses,
      totalTeachers
    };
  }, [courses, videos, teachers]);

  // Helper getters
  const getTeacherById = (id) => teachers.find(t => t.id === id);
  const getCourseById = (id) => courses.find(c => c.id === id);
  const getVideosForCourse = (courseId) => videos.filter(v => v.courseId === courseId);

  // CRUD Courses
  const addCourse = (data) => {
    const newCourse = {
      id: 'c_' + Date.now(),
      title: data.title || 'Yangi Kurs',
      description: data.description || '',
      thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      teacherId: data.teacherId || activeTeacherId,
      category: data.category || 'General',
      status: data.status || 'draft',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCourses(prev => [newCourse, ...prev]);
    if (addToast) addToast("Kurs muvaffaqiyatli saqlandi", "success");
    return newCourse;
  };

  const updateCourse = (id, data) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    if (addToast) addToast("Kurs ma'lumotlari yangilandi", "success");
  };

  const deleteCourse = (id) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    // Cascade delete associated videos
    setVideos(prev => prev.filter(v => v.courseId !== id));
    if (addToast) addToast("Kurs va unga tegishli barcha videolar o'chirildi", "info");
  };

  // CRUD Videos
  const addVideo = (data) => {
    if (!data.courseId) {
      if (addToast) addToast("Video yaratish uchun kurs tanlanishi shart!", "error");
      return null;
    }
    const newVideo = {
      id: 'v_' + Date.now(),
      courseId: data.courseId,
      title: data.title || 'Yangi Video',
      description: data.description || '',
      videoUrl: data.videoUrl || 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
      thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      duration: data.duration || '10:00',
      status: data.status || 'draft',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setVideos(prev => [newVideo, ...prev]);
    if (addToast) addToast("Video muvaffaqiyatli qo'shildi", "success");
    return newVideo;
  };

  const updateVideo = (id, data) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
    if (addToast) addToast("Video tahrirlandi", "success");
  };

  const deleteVideo = (id) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    if (addToast) addToast("Video o'chirildi", "info");
  };

  // CRUD Teachers
  const addTeacher = (data) => {
    const newTeacher = {
      id: 't_' + Date.now(),
      name: data.name || 'Yangi Ustoz',
      email: data.email || 'ustoz@academy.uz',
      subject: data.subject || 'Dasturlash',
      bio: data.bio || '',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTeachers(prev => [...prev, newTeacher]);
    if (addToast) addToast("Yangi ustoz qo'shildi", "success");
    return newTeacher;
  };

  const updateTeacher = (id, data) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    if (addToast) addToast("Ustoz ma'lumotlari yangilandi", "success");
  };

  const deleteTeacher = (id) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    if (addToast) addToast("Ustoz o'chirildi", "info");
  };

  return (
    <LmsContext.Provider value={{
      teachers,
      courses,
      videos,
      currentRole,
      setCurrentRole,
      activeTeacherId,
      setActiveTeacherId,
      stats,
      getTeacherById,
      getCourseById,
      getVideosForCourse,
      addCourse,
      updateCourse,
      deleteCourse,
      addVideo,
      updateVideo,
      deleteVideo,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      resetDemoData
    }}>
      {children}
    </LmsContext.Provider>
  );
};

export const useLms = () => {

  const context = useContext(LmsContext);
  if (!context) {
    return {
      courses: [],
      videos: [],
      teachers: [],
      currentRole: 'student',
      getCourseById: () => null,
      getTeacherById: () => null,
      getVideosForCourse: () => []
    };
  }
  return context;
};


