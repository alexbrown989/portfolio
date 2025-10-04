// src/content/timeline.js
export const timeline = [
  // 1) Military first
  {
    period: 'Aug 2018 – May 2023',
    title: 'Hospital Corpsman — Engineering & Operations',
    org: 'United States Navy',
    icon: '⚓',
    summary: 'Operational excellence in high-stakes environments with measurable process and safety gains.',
    highlights: [
      'Optimized $102K medical supply system, reducing downtime by 20% through workflow redesign and inventory controls',
      'Developed safety protocols and SDS documentation for 50+ chemicals; standardized handling and training',
      'Conducted biomedical research with CDC-partnered CHARM-Atlanta study; implemented data-driven procedures',
      'Authored clinical SOPs that reduced documentation errors by 30% via systems analysis and fail-safes',
      'Recipient of Armed Forces Service Medal for exceptional service',

      // Added per your notes — leadership + scheduling + training ownership + hands-on analysis
      'Coordinated 30 administrative folders (training, evals, awards) for departmental readiness and audits',
      'Raised training compliance to 92% across 57 personnel by tracking delinquencies and driving completion plans',
      'Rebuilt shift schedules for 25 healthcare workers; +21% productivity via constraint-aware rosters',
      'Supported 200+ subcutaneous procedures; analyzed device performance and surgical ergonomics firsthand'
    ],
    expandedInfo: {
      metrics: '$102K system • 20% downtime reduction • 30% error reduction • 92% training compliance',
      technologies: [
        'Process Optimization', 'Safety Engineering', 'SOP Design',
        'Data Analysis', 'Team Leadership', 'Operations'
      ]
    }
  },

  // 2) Amazon next
  {
    period: 'May 2023 – Jan 2024',
    title: 'Onsite Medical Representative',
    org: 'Amazon — Kent, WA',
    icon: '🏥',
    summary: 'Delivered data-driven safety improvements and rapid response optimization for a high-throughput site.',
    highlights: [
      'Designed an Excel-based injury tracking system using ergonomic engineering principles; reduced data errors by 20%',
      'Partnered with safety and engineering to optimize emergency response plans; cut response times by 25%',
      'Maintained 100% accuracy in medical records; strengthened the data layer for continuous safety improvements',
      'Implemented wellness programs; 20% drop in absenteeism and 15% increase in engagement with health initiatives',
      'Built cross-functional workflows for incident review and trend analysis; improved corrective-action follow-through',

      // Extra engineering-leaning depth
      'Created ergonomic risk-scoring worksheet (task factors, posture, duration) to prioritize mitigations',
      'Automated weekly incident rollups (Excel formulas + visuals) for leadership decision-making',
      'Collaborated on workstation adjustments (reach, lift, cart pathing) to lower repetitive strain exposure'
    ],
    expandedInfo: {
      metrics: '25% faster response • 20% fewer data errors • 20% absenteeism reduction • +15% engagement',
      technologies: [
        'Excel (analytics & dashboards)', 'Ergonomics', 'Process Improvement',
        'Incident Trend Analysis', 'Cross-Functional Ops'
      ]
    }
  },

  // 3) Degree (now includes your former “Lead Researcher” details)
  {
    period: 'Sep 2021 – Jun 2027',
    title: 'B.S. Mechanical Engineering',
    org: 'University of Washington — Tacoma',
    icon: '🎓',
    current: true,
    summary: 'Mechanics, systems, and R&D focus with hands-on lab prototyping and leadership.',
    highlights: [
      'Focus: thermal systems, fluid mechanics, mechatronics, equity-focused design',
      'Advanced CAD, experimental methods, and lab prototyping (SolidWorks, Onshape, MATLAB, Python)',
      'Active in 5+ concurrent research projects across multiple disciplines',
      'Bridging veteran community with engineering programs and industry connections',

      // Folded-in “Lead Researcher” accomplishments
      'Introduced BET-H framework for zero-energy thermal regulation; simulation + prototyping roadmap',
      'Improved PIV accuracy by ~40% via a novel Visual Field Architecture and controlled illumination',
      'Analyzed phase-change materials (≈250 kJ/kg) for thermal buffering; scoped validation protocol',
      'Developed 2-axis autonomous turret prototype; controls + fabrication with AI integration path',
      'Co-authoring an equity-focused micromobility study; instrumentation and experimental design'
    ],
    expandedInfo: {
      metrics: '3+ publications in progress • 5+ active projects • cross-lab collaboration',
      technologies: [
        'CAD/FEA', 'MATLAB/PIVLab', 'Python', 'SolidWorks',
        'Arduino/Embedded', 'LTspice', '3D Printing'
      ]
    }
  },

  // 4) SAME President (kept, placed after school)
  {
    period: 'Oct 2024 – Present',
    title: 'President — Society of American Military Engineers (SAME)',
    org: 'University of Washington Tacoma',
    current: true,
    icon: '🎯',
    summary: 'Leading 50+ member engineering society with strategic initiatives and industry pipelines.',
    highlights: [
      'Increased membership by 30% through hands-on programming and targeted outreach',
      'Managed $10K+ budget for technical workshops and networking events',
      'Established partnerships with 5+ industry leaders to create internship pipelines',
      'Connected 50+ students with career opportunities and mentorship programs',
      'Spearheaded cross-disciplinary initiatives focused on professional development'
    ],
    expandedInfo: {
      metrics: '30% growth • $10K budget • 50+ connections',
      technologies: [
        'Project Management', 'Strategic Planning', 'Event Ops', 'Partnership Development'
      ]
    }
  }
]

// Volunteering & service (unchanged, still rendered via dropdown in the component)
export const volunteering = [
  {
    label: 'Leadership & Service — SAME President',
    details: [
      'Organized cross-discipline events aligning student capabilities with industry needs',
      'Built bridges between veteran community and engineering programs',
      'Drove 30% participation increase through hands-on technical sessions'
    ]
  },
  {
    label: 'Youth Soccer Coach — Community Engagement',
    details: [
      'Mentored 8 first-time players fostering confidence and discipline',
      'Developed team dynamics across 12-game season',
      'Demonstrated leadership and communication skills beyond engineering'
    ]
  },
  {
    label: 'Veteran Mentorship — Career Transitions',
    details: [
      'Guided fellow veterans transitioning to engineering careers',
      'Shared expertise on leveraging military experience in civilian roles',
      'Connected veterans with academic and professional resources'
    ]
  }
]
