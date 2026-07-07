// src/content/siteConfig.js
export const site = {
  brand: {
    name: 'Alex Brown',
    logoInitials: 'AB',
    tagline: 'Mechanical • R&D • Defense • Energy',
  },

  // About is a real route; the others are homepage anchors.
  nav: [
    { href: '#hero',     label: 'Home' },
    { href: '#projects', label: 'Projects' },
    { href: '/about',    label: 'About' },
    { href: '#contact',  label: 'Contact' },
  ],

  hero: {
    titleTop: 'Alex Brown',
    titleBottom: 'Mechanical Engineer / Builder',
    subtitle:
      'Mechanical engineering student translating five years of high-stakes Navy operations into rigorous, hands-on R&D — from mechatronics and coastal fluid dynamics to phase-change materials and bio-inspired thermal systems.',
    bullets: ['Mech Design', 'Lab Prototyping', 'Controls & Data', 'CFD / PIV'],
    // Trimmed to four load-bearing numbers — no filler.
    stats: [
      { label: 'Prototypes built',       value: '40', suffix: '+' },
      { label: 'Years operating',        value: '6',  suffix: '+' },
      { label: 'PIV accuracy gain',      value: '40', suffix: '%' },
      { label: 'Damping improvement',    value: '10', suffix: '×' },
    ],
  },

  features: { showTimeline: true },
}
