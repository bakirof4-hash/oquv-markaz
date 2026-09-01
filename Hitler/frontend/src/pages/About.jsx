import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function About() {
  const textRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(textRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1 })
  }, [])

  return (
    <div className="section" style={{ paddingTop: '8rem', minHeight: '100vh' }}>
      <div className="container">
        <div className="grid grid-cols-2" style={{ alignItems: 'center' }}>
          <div ref={textRef}>
            <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Biz haqimizda</h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Biz Farg'ona viloyatida amaliy bilimga tayangan IT ta'lim beramiz. Maqsadimiz - o'quvchini real loyihalar orqali ishga tayyorlash.
            </p>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Darslar React, Django, mobil ishlab chiqish va dizayn yo'nalishlarida olib boriladi. Har bir yo'nalish bo'yicha mentorlik va amaliy topshiriqlar bor.
            </p>
            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h3 className="text-gradient" style={{ fontSize: '2.5rem', margin: 0 }}>500+</h3>
                <p>Bitiruvchilar</p>
              </div>
              <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h3 className="text-gradient" style={{ fontSize: '2.5rem', margin: 0 }}>95%</h3>
                <p>Ishga joylashish</p>
              </div>
            </div>
          </div>
          <div className="glass-card" style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0', overflow: 'hidden' }}>
            <svg viewBox="0 0 640 640" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
              <defs>
                <linearGradient id="aboutBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0b1126" />
                  <stop offset="100%" stopColor="#050814" />
                </linearGradient>
                <linearGradient id="aboutGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="aboutScreen" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#111b3a" />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.75" />
                </linearGradient>
                <radialGradient id="aboutOrb" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="640" height="640" fill="url(#aboutBg)" />
              <circle cx="480" cy="120" r="120" fill="url(#aboutOrb)" opacity="0.35" />
              <circle cx="150" cy="120" r="90" fill="#7c3aed" opacity="0.18" />
              <circle cx="510" cy="500" r="110" fill="#06b6d4" opacity="0.12" />

              <g opacity="0.12">
                <path d="M40 120H600" stroke="#94a3b8" strokeWidth="2" />
                <path d="M40 200H600" stroke="#94a3b8" strokeWidth="2" />
                <path d="M40 280H600" stroke="#94a3b8" strokeWidth="2" />
                <path d="M40 360H600" stroke="#94a3b8" strokeWidth="2" />
                <path d="M40 440H600" stroke="#94a3b8" strokeWidth="2" />
                <path d="M40 520H600" stroke="#94a3b8" strokeWidth="2" />
                <path d="M120 40V600" stroke="#94a3b8" strokeWidth="2" />
                <path d="M220 40V600" stroke="#94a3b8" strokeWidth="2" />
                <path d="M320 40V600" stroke="#94a3b8" strokeWidth="2" />
                <path d="M420 40V600" stroke="#94a3b8" strokeWidth="2" />
                <path d="M520 40V600" stroke="#94a3b8" strokeWidth="2" />
              </g>

              <g transform="translate(105 150)">
                <rect x="0" y="0" rx="28" ry="28" width="430" height="250" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
                <rect x="28" y="28" rx="18" ry="18" width="200" height="194" fill="url(#aboutScreen)" stroke="rgba(255,255,255,0.08)" />
                <rect x="52" y="56" width="152" height="12" rx="6" fill="#22d3ee" opacity="0.9" />
                <rect x="52" y="82" width="110" height="10" rx="5" fill="#94a3b8" opacity="0.75" />
                <rect x="52" y="108" width="128" height="10" rx="5" fill="#94a3b8" opacity="0.5" />
                <rect x="52" y="134" width="140" height="10" rx="5" fill="#94a3b8" opacity="0.4" />
                <rect x="52" y="160" width="96" height="10" rx="5" fill="#94a3b8" opacity="0.35" />

                <g transform="translate(250 32)">
                  <rect x="0" y="0" rx="18" ry="18" width="150" height="84" fill="rgba(37,99,235,0.18)" stroke="rgba(37,99,235,0.35)" />
                  <circle cx="28" cy="42" r="16" fill="#22d3ee" opacity="0.9" />
                  <path d="M20 42l5 5 10-12" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="58" y="24" width="64" height="10" rx="5" fill="#fff" opacity="0.9" />
                  <rect x="58" y="44" width="42" height="8" rx="4" fill="#cbd5e1" opacity="0.7" />
                </g>

                <g transform="translate(250 132)">
                  <rect x="0" y="0" rx="18" ry="18" width="150" height="84" fill="rgba(124,58,237,0.18)" stroke="rgba(124,58,237,0.35)" />
                  <circle cx="28" cy="42" r="16" fill="#a855f7" opacity="0.9" />
                  <path d="M20 42l5 5 10-12" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="58" y="24" width="72" height="10" rx="5" fill="#fff" opacity="0.9" />
                  <rect x="58" y="44" width="50" height="8" rx="4" fill="#cbd5e1" opacity="0.7" />
                </g>
              </g>

              <g transform="translate(150 420)">
                <rect x="0" y="0" rx="24" ry="24" width="340" height="110" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
                <rect x="26" y="28" width="110" height="12" rx="6" fill="url(#aboutGlow)" />
                <rect x="26" y="54" width="186" height="10" rx="5" fill="#cbd5e1" opacity="0.6" />
                <rect x="26" y="72" width="150" height="10" rx="5" fill="#cbd5e1" opacity="0.4" />
                <rect x="248" y="24" width="68" height="68" rx="20" fill="rgba(6,182,212,0.1)" stroke="rgba(6,182,212,0.25)" />
                <path d="M270 60h24M282 48v24" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
