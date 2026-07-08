// src/content/siteConfig.js
export const site = {
  brand: {
    name: 'Alex Brown',
    logoInitials: 'AB',
    tagline: 'Aerospace · Manufacturing · R&D',
  },

  // About is a real route; the others are homepage anchors.
  nav: [
    { href: '#hero',        label: 'Home' },
    { href: '#internship',  label: 'Internship' },
    { href: '#projects',    label: 'Projects' },
    { href: '/about',       label: 'About' },
    { href: '#contact',     label: 'Contact' },
  ],

  hero: {
    status: {
      // Aerospace-first framing: the strongest credential leads.
      primary: 'Interning · Verus Aerospace · Manufacturing & Quality',
      secondary: 'Tacoma, WA · Available Summer 2026 · Open to relocate',
    },
    titleTop: 'Alex Brown',
    titleBottom: 'Mechanical Engineering · Aerospace-Focused',
    subtitle:
      'Mechanical engineering student and U.S. Navy veteran. Currently interning at Verus Aerospace supporting flight-critical hardware — AS9102 First Article Inspection, GD&T, Infor VISUAL ERP configuration control, and Quality Clinic operations. Hands-on machining, mechatronics, and R&D case studies below.',
    bullets: [
      'AS9102 FAI',
      'GD&T · Metrology',
      'Manual + CNC machining',
      'Mechatronics · Controls',
      'CFD / PIV · Thermal R&D',
    ],
    // Four load-bearing numbers. No filler.
    stats: [
      { label: 'Precision tolerance held', value: '±0.005', suffix: ' in' },
      { label: 'PIV accuracy gain',        value: '40',     suffix: '%'   },
      { label: 'Damping improvement',      value: '10',     suffix: '×'   },
      { label: 'Years operating',          value: '6',      suffix: '+'   },
    ],
  },

  features: { showTimeline: true, showInternshipBand: true },
}
