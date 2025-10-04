export const site = {
  brand: {
    name: 'Alex Brown',
    logoEmoji: '⚙',
    tagline: 'Mechanical • Defense • R&D • Energy',
  },

  // About is a real route; the others are homepage anchors
  nav: [
    { href: '#hero',     label: 'Home' },
    { href: '#projects', label: 'Projects' },
    { href: '/about',    label: 'About' },
    { href: '#contact',  label: 'Contact' },
  ],

  hero: {
    titleTop: 'ALEX BROWN',
    titleBottom: 'MECHANICAL ENGINEERING',
    subtitle:
      'Aspiring mechanical engineer with a builder’s bias: rapid prototyping, data-driven validation, and mission-ready systems across energy, materials, R&D, and defense tech.',
    bullets: ['Mech Design', 'Lab Prototyping', 'Controls & Data', 'CFD/PIV'],
    ctas: [
      { href: '#projects', label: 'Explore Projects', intent: 'primary' },
      { href: '#contact',  label: 'Get In Touch',     intent: 'secondary' },
    ],
    stats: [
      { label: 'Prototypes Built',          value: '40', suffix: '+' },
      { label: 'Lab Systems Run',           value: '12' },
      { label: 'Years Operating',           value: '6',  suffix: '+' },
      { label: 'Clinical Error Reduction',  value: '30', suffix: '%' },
      { label: 'Systems Shipped/Deployed',  value: '10', suffix: '+' },
      { label: 'Events Led (SAME/UWT)',     value: '15', suffix: '+' },
      { label: 'SOPs & Protocols Authored', value: '10', suffix: '+' },
    ],
  },

  features: {showTimeline: true },
}
