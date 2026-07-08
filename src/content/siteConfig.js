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
      secondary: 'Tacoma, WA · Seeking full-time engineering roles · Available Summer 2027',
    },
    titleTop: 'Alex Brown',
    titleBottom: 'Mechanical Engineering · Aerospace-Focused',
    subtitle:
      'Mechanical engineering student and U.S. Navy veteran. Currently supporting flight-critical hardware at Verus Aerospace: AS9102 First Article Inspection, GD&T, Infor VISUAL ERP configuration control, and Quality Clinic operations. Hands-on machining, mechatronics, and R&D case studies below.',
    bullets: [
      'AS9102 FAI',
      'GD&T · Metrology',
      'Manual + CNC machining',
      'Mechatronics · Controls',
      'CFD / PIV · Thermal R&D',
    ],
    // System readout replaces the vanity-metric grid. See Hero.jsx.
    readout: [
      {
        label: 'Current mission',
        primary: 'Aerospace manufacturing & quality',
        secondary: 'Verus Aerospace · Tacoma, WA · Lead Intern',
        tone: 'brand',
      },
      {
        label: 'Prior service',
        primary: 'U.S. Navy Corpsman · 5 years',
        secondary: 'Armed Forces Service Medal · $102K supply system · 92% training compliance',
        tone: 'idle',
      },
      {
        label: 'Domains online',
        primary: 'Aerospace · Manufacturing · Mechatronics · R&D',
        secondary: 'GD&T · AS9102 · CNC · SolidWorks · MATLAB · Embedded',
        tone: 'idle',
      },
      {
        label: 'Availability',
        primary: 'Full-time · Summer 2027',
        secondary: 'Willing to relocate · Clearance-eligible · U.S. citizen',
        tone: 'ok',
      },
    ],
  },

  features: { showTimeline: true, showInternshipBand: true },
}
