const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Course = require('./models/Course');
const Instructor = require('./models/Instructor');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/it_academy';

const initialInstructors = [
  {
    name: 'Asadbek',
    role: 'Python Mentor',
    exp: '5 yillik tajriba',
    grad: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    initials: 'A',
    socials: { linkedin: 'https://linkedin.com', telegram: 'https://t.me', youtube: 'https://youtube.com' }
  },
  {
    name: 'Shahzod',
    role: 'Web Developer',
    exp: '6 yillik tajriba',
    grad: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    initials: 'S',
    socials: { linkedin: 'https://linkedin.com', telegram: 'https://t.me', youtube: 'https://youtube.com' }
  },
  {
    name: 'Diyorbek',
    role: 'Mobile Developer',
    exp: '4 yillik tajriba',
    grad: 'linear-gradient(135deg, #10b981, #06b6d4)',
    initials: 'D',
    socials: { linkedin: 'https://linkedin.com', telegram: 'https://t.me', youtube: 'https://youtube.com' }
  },
  {
    name: 'Islom',
    role: 'Data Scientist',
    exp: '5 yillik tajriba',
    grad: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    initials: 'I',
    socials: { linkedin: 'https://linkedin.com', telegram: 'https://t.me', youtube: 'https://youtube.com' }
  },
  {
    name: 'Sanjar',
    role: 'UI/UX Designer',
    exp: '4 yillik tajriba',
    grad: 'linear-gradient(135deg, #f59e0b, #ec4899)',
    initials: 'S',
    socials: { linkedin: 'https://linkedin.com', telegram: 'https://t.me', youtube: 'https://youtube.com' }
  },
  {
    name: 'Muqaddas',
    role: 'Graphic Designer',
    exp: '3 yillik tajriba',
    grad: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
    initials: 'M',
    socials: { linkedin: 'https://linkedin.com', telegram: 'https://t.me', youtube: 'https://youtube.com' }
  },
  {
    name: 'Javohir',
    role: 'SMM Expert',
    exp: '4 yillik tajriba',
    grad: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    initials: 'J',
    socials: { linkedin: 'https://linkedin.com', telegram: 'https://t.me', youtube: 'https://youtube.com' }
  },
  {
    name: 'Bekzod',
    role: 'DevOps Engineer',
    exp: '4 yillik tajriba',
    grad: 'linear-gradient(135deg, #10b981, #8b5cf6)',
    initials: 'B',
    socials: { linkedin: 'https://linkedin.com', telegram: 'https://t.me', youtube: 'https://youtube.com' }
  }
];

const initialCourses = [
  {
    title: 'Python Dasturlash',
    category: 'backend',
    desc: 'Python tilini 0 dan boshlab o\'rganing va professional dasturchiga aylaning. Amaliy loyihalar orqali bilimlarni mustahkamlang.',
    duration: '8 oylik kurs',
    price: '1 500 000 so\'m',
    isPopular: true,
    icon: 'code',
    badgeColor: '#3b82f6',
    level: 'Boshlang\'ichdan Yuqori darajagacha',
    lessons: '32 ta',
    lang: 'O\'zbek tilida',
    cert: 'Mavjud',
    mentorName: 'Asadbek',
    mentorRole: 'Python Mentor',
    mentorExp: '5 yillik tajriba',
    mentorGrad: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    mentorInitials: 'A',
    modules: [
      { id: 1, title: 'Python asoslari', details: 'O\'zgaruvchilar, ma\'lumot turlari, kiritish-chiqarish operatorlari.' },
      { id: 2, title: 'Shart operatorlari va Tsikllar', details: 'if, elif, else, while va for takrorlanuvchi operatorlari.' },
      { id: 3, title: 'Funksiyalar va Modullar', details: 'def, argumentlar, lambda va modul tayyorlash.' }
    ]
  },
  {
    title: 'Web Dasturlash',
    category: 'frontend',
    desc: 'HTML, CSS, JavaScript, React va Node.js bo\'yicha mukammal bilimga ega bo\'ling. Portfolio yaratish va ishlash imkoniyati.',
    duration: '8 oylik kurs',
    price: '1 800 000 so\'m',
    isPopular: true,
    icon: 'layout',
    badgeColor: '#06b6d4',
    level: 'Boshlang\'ichdan Professionalgacha',
    lessons: '48 ta',
    lang: 'O\'zbek tilida',
    cert: 'Mavjud',
    mentorName: 'Shahzod',
    mentorRole: 'Web Developer',
    mentorExp: '6 yillik tajriba',
    mentorGrad: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    mentorInitials: 'S',
    modules: [
      { id: 1, title: 'HTML & CSS asoslari', details: 'Semantic teglar, CSS selektorlar, box-model va responsive dizayn.' },
      { id: 2, title: 'JavaScript & React.js', details: 'DOM bilan ishlash, React Components, Hooks, State va API integratsiyasi.' }
    ]
  },
  {
    title: 'Mobil Dasturlash',
    category: 'mobile',
    desc: 'Flutter yordamida Android va iOS operatsion tizimlari uchun bir vaqtning o\'zida ilovalar ishlab chiqishni o\'rganing.',
    duration: '6 oylik kurs',
    price: '1 700 000 so\'m',
    isPopular: false,
    icon: 'smartphone',
    badgeColor: '#10b981',
    level: 'Boshlang\'ichdan O\'rta darajagacha',
    lessons: '36 ta',
    lang: 'O\'zbek tilida',
    cert: 'Mavjud',
    mentorName: 'Diyorbek',
    mentorRole: 'Mobile Developer',
    mentorExp: '4 yillik tajriba',
    mentorGrad: 'linear-gradient(135deg, #10b981, #06b6d4)',
    mentorInitials: 'D',
    modules: [
      { id: 1, title: 'Dart tili asoslari', details: 'OOP, sinflar, obyektlar va Dart sintaksisi.' },
      { id: 2, title: 'Flutter Widgetlar va State', details: 'Stateless/Stateful widgetlar, Provider hamda Bloc state management.' }
    ]
  },
  {
    title: 'UI/UX Dizayn',
    category: 'design',
    desc: 'Figma va zamonaviy UI/UX qoidalarini o\'rganib, chiroyli va qulay interfeyslar chizing hamda foydalanuvchi tajribasini loyihang.',
    duration: '4 oylik kurs',
    price: '1 200 000 so\'m',
    isPopular: false,
    icon: 'feather',
    badgeColor: '#a855f7',
    level: 'Boshlang\'ichdan O\'rta darajagacha',
    lessons: '24 ta',
    lang: 'O\'zbek tilida',
    cert: 'Mavjud',
    mentorName: 'Sanjar',
    mentorRole: 'UI/UX Designer',
    mentorExp: '4 yillik tajriba',
    mentorGrad: 'linear-gradient(135deg, #f59e0b, #ec4899)',
    mentorInitials: 'S',
    modules: [
      { id: 1, title: 'Dizayn nazariyasi', details: 'Ranglar nazariyasi, tipografiya va setkalar.' },
      { id: 2, title: 'Figma & Prototip', details: 'Auto layout, componentlar va interaktiv prototiplar.' }
    ]
  },
  {
    title: 'SMM Mutaxassis',
    category: 'marketing',
    desc: 'Ijtimoiy tarmoqlar (Telegram, Instagram, Facebook) bilan ishlash, target va kontent rejalashtirish strategiyalarini egallang.',
    duration: '3 oylik kurs',
    price: '900 000 so\'m',
    isPopular: false,
    icon: 'send',
    badgeColor: '#f59e0b',
    level: 'Boshlang\'ichdan O\'rta darajagacha',
    lessons: '18 ta',
    lang: 'O\'zbek tilida',
    cert: 'Mavjud',
    mentorName: 'Javohir',
    mentorRole: 'SMM Expert',
    mentorExp: '4 yillik tajriba',
    mentorGrad: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    mentorInitials: 'J',
    modules: [
      { id: 1, title: 'SMM Strategiya va Target', details: 'Auditoriya tahlili, postlar va Facebook Ads manager.' }
    ]
  },
  {
    title: 'Data Science',
    category: 'data',
    desc: 'Python, Big Data, Machine Learning va Data Analysis usullarini o\'rganib, murakkab ma\'lumotlar tahlilini amalga oshiring.',
    duration: '6 oylik kurs',
    price: '2 000 000 so\'m',
    isPopular: false,
    icon: 'database',
    badgeColor: '#ec4899',
    level: 'O\'rta darajadan Yuqori darajagacha',
    lessons: '40 ta',
    lang: 'O\'zbek tilida',
    cert: 'Mavjud',
    mentorName: 'Islom',
    mentorRole: 'Data Scientist',
    mentorExp: '5 yillik tajriba',
    mentorGrad: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    mentorInitials: 'I',
    modules: [
      { id: 1, title: 'Python & Pandas', details: 'NumPy, Pandas va data visualization tools.' }
    ]
  }
];

async function seedDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB ga ulanildi.');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Instructor.deleteMany({});

    // Seed Admin User
    const adminPassword = await bcrypt.hash('admin12345', 10);
    const adminUser = new User({
      fullname: 'Bosh Admin',
      email: 'admin@itacademy.uz',
      password: adminPassword,
      phone: '+998 90 123 45 67',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin foydalanuvchi yaratildi: admin@itacademy.uz / admin12345');

    // Seed Instructors
    await Instructor.insertMany(initialInstructors);
    console.log(`${initialInstructors.length} ta o'qituvchi bazaga qo'shildi.`);

    // Seed Courses
    await Course.insertMany(initialCourses);
    console.log(`${initialCourses.length} ta kurs bazaga qo'shildi.`);

    console.log('Seed jarayoni muvaffaqiyatli yakunlandi!');
    process.exit(0);
  } catch (error) {
    console.error('Seed xatoligi:', error);
    process.exit(1);
  }
}

seedDB();
