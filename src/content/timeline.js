// src/content/timeline.js
//
// Ordered chronologically (most recent first). Icons are declared as keyword
// strings that the Timeline component maps to real lucide-react icons.
// Available keys: anchor | navy | amazon | medical | briefcase | intern
// | degree | school | president | leadership | award | default

export const timeline = [
  // ---------------------------------------------------------------------
  // 1) Verus Aerospace — Engineering Intern (Lead Intern)
  //    The current, active internship. Featured first so it lands at the
  //    top of the timeline where recruiters scan.
  // ---------------------------------------------------------------------
  {
    period: 'Dec 2025 – Present',
    title: 'Engineering Intern · Lead Intern',
    org: 'Verus Aerospace — Tacoma, WA',
    location: 'Tacoma, WA',
    icon: 'intern',
    current: true,
    summary:
      'Aerospace manufacturing, quality, and process improvement for flight-critical hardware in a high-mix production environment. Selected as Lead Intern for onboarding and coordination of incoming interns.',
    highlights: [
      'Maintain Engineering Masters and configuration control in Infor VISUAL ERP — revision control, traceability, and production release readiness across active aerospace programs.',
      'Develop inspection plans and quality documentation supporting verification of critical aerospace hardware, GD&T interpretation, and AS9102 First Article Inspection activities.',
      'Perform independent over-check inspections on Gulfstream assemblies and aerospace hardware — identifying dimensional discrepancies, defects, and documentation issues prior to release.',
      'Lead Quality Clinic operations: tracking non-conforming hardware through rework, reassignment, and scrap disposition while improving organization, traceability, and material flow.',
      'Redesigning Quality Clinic workflow and disposition processes to strengthen communication between engineering, quality, production, and inspection teams.',
      'Monitor and analyze monthly manufacturing and quality KPIs — throughput, scrap trends, FOD, quality escapes, production performance — to support data-driven process improvement.',
      'Assist in the development and revision of manufacturing standards, setup docs, inspection docs, and operating procedures used across engineering, quality, and production.',
      'Selected as Lead Intern — support onboarding, training, and coordination of incoming interns as a resource for ERP workflows, quality processes, and daily production support.',
      'Gained exposure to multi-spindle CNC machining of titanium and Inconel components, supporting close-tolerance aerospace manufacturing at real production scale.',
    ],
    expandedInfo: {
      metrics:
        'AS9102 FAI · Infor VISUAL ERP · Gulfstream over-check inspections · Quality Clinic redesign · Lead Intern',
      technologies: [
        'AS9102 FAI', 'Infor VISUAL ERP', 'GD&T', 'Quality Systems',
        'CNC Machining (Ti / Inconel)', 'Inspection Planning',
        'KPI Analysis', 'Process Improvement',
      ],
    },
  },

  // ---------------------------------------------------------------------
  // 2) SAME President
  // ---------------------------------------------------------------------
  {
    period: 'Oct 2024 – Present',
    title: 'President — Society of American Military Engineers (SAME)',
    org: 'University of Washington Tacoma',
    icon: 'president',
    current: true,
    summary:
      'Leading a 50+ member engineering society: programming, budget, industry pipelines.',
    highlights: [
      'Grew membership 30% through hands-on technical programming and targeted outreach.',
      'Managed a $10K+ budget across workshops, competitions, and networking events.',
      'Established partnerships with 5+ industry teams to build internship pipelines.',
      'Connected 50+ students to mentorship and career opportunities.',
      'Ran cross-disciplinary initiatives that blend veteran experience with engineering practice.',
    ],
    expandedInfo: {
      metrics: '30% growth • $10K budget • 50+ connections',
      technologies: [
        'Project Management', 'Strategic Planning', 'Event Ops', 'Partnership Development',
      ],
    },
  },

  // ---------------------------------------------------------------------
  // 3) Degree in progress
  // ---------------------------------------------------------------------
  {
    period: 'Sep 2021 – Jun 2027',
    title: 'B.S. Mechanical Engineering',
    org: 'University of Washington — Tacoma',
    icon: 'degree',
    current: true,
    summary: 'Mechanics, systems, and R&D focus with hands-on lab prototyping and leadership.',
    highlights: [
      'Focus areas: thermal systems, fluid mechanics, mechatronics, equity-focused design.',
      'Advanced CAD, experimental methods, and lab prototyping (SolidWorks, Onshape, MATLAB, Python).',
      'Active in 5+ concurrent research projects across multiple disciplines.',
      'Introduced BET-H framework for zero-energy thermal regulation with a simulation + prototyping roadmap.',
      'Improved PIV accuracy ~40% via a novel Visual Field Architecture and controlled illumination.',
      'Analyzed phase-change materials (~250 kJ/kg latent capacity) for thermal buffering; scoped validation protocol.',
      'Developed a 2-axis autonomous turret prototype; controls + fabrication with an AI integration path.',
      'Co-authoring an equity-focused micromobility study; instrumentation and experimental design.',
    ],
    expandedInfo: {
      metrics: '3+ publications in progress • 5+ active projects • cross-lab collaboration',
      technologies: [
        'CAD/FEA', 'MATLAB / PIVLab', 'Python', 'SolidWorks',
        'Arduino / Embedded', 'LTspice', '3D Printing',
      ],
    },
  },

  // ---------------------------------------------------------------------
  // 4) Amazon — Onsite Medical Representative
  // ---------------------------------------------------------------------
  {
    period: 'May 2023 – Jan 2024',
    title: 'Onsite Medical Representative',
    org: 'Amazon — Kent, WA',
    icon: 'amazon',
    summary:
      'Data-driven safety improvements and response optimization for a high-throughput fulfillment site.',
    highlights: [
      'Built an Excel-based injury tracking system using ergonomic engineering principles; cut data errors by 20%.',
      'Partnered with safety and engineering on emergency response plans; cut response times by 25%.',
      'Maintained 100% accuracy in medical records; strengthened the data layer for safety improvements.',
      'Launched wellness programs: 20% drop in absenteeism, 15% increase in health engagement.',
      'Created ergonomic risk-scoring worksheet (task, posture, duration) to prioritize mitigations.',
      'Automated weekly incident rollups (Excel formulas + visuals) for leadership decision-making.',
      'Collaborated on workstation adjustments (reach, lift, cart pathing) to lower repetitive-strain exposure.',
    ],
    expandedInfo: {
      metrics: '25% faster response • 20% fewer data errors • 20% lower absenteeism • +15% engagement',
      technologies: [
        'Excel (Analytics & Dashboards)', 'Ergonomics', 'Process Improvement',
        'Incident Trend Analysis', 'Cross-Functional Ops',
      ],
    },
  },

  // ---------------------------------------------------------------------
  // 5) Navy Corpsman
  // ---------------------------------------------------------------------
  {
    period: 'Aug 2018 – May 2023',
    title: 'Hospital Corpsman — Engineering & Operations',
    org: 'United States Navy',
    icon: 'navy',
    summary:
      'Operational excellence in high-stakes environments with measurable process and safety gains.',
    highlights: [
      'Optimized $102K medical supply system, reducing downtime 20% through workflow redesign and inventory controls.',
      'Developed safety protocols and SDS documentation for 50+ chemicals; standardized handling and training.',
      'Conducted biomedical research with CDC-partnered CHARM-Atlanta study; implemented data-driven procedures.',
      'Authored clinical SOPs that reduced documentation errors by 30% via systems analysis and fail-safes.',
      'Recipient of Armed Forces Service Medal for exceptional service.',
      'Coordinated 30 administrative folders (training, evals, awards) for departmental readiness and audits.',
      'Raised training compliance to 92% across 57 personnel by tracking delinquencies and driving completion plans.',
      'Rebuilt shift schedules for 25 healthcare workers; +21% productivity via constraint-aware rosters.',
      'Supported 200+ subcutaneous procedures; analyzed device performance and surgical ergonomics firsthand.',
    ],
    expandedInfo: {
      metrics: '$102K system • 20% downtime reduction • 30% error reduction • 92% training compliance',
      technologies: [
        'Process Optimization', 'Safety Engineering', 'SOP Design',
        'Data Analysis', 'Team Leadership', 'Operations',
      ],
    },
  },
]

// Volunteering & service — collapsed dropdown on the Timeline.
export const volunteering = [
  {
    label: 'Leadership & Service — SAME President',
    details: [
      'Organized cross-discipline events aligning student capabilities with industry needs.',
      'Built bridges between the veteran community and engineering programs.',
      'Drove a 30% participation increase through hands-on technical sessions.',
    ],
  },
  {
    label: 'Youth Soccer Coach — Community Engagement',
    details: [
      'Mentored 8 first-time players, fostering confidence and discipline.',
      'Developed team dynamics across a 12-game season.',
      'Practiced leadership and communication skills beyond engineering.',
    ],
  },
  {
    label: 'Veteran Mentorship — Career Transitions',
    details: [
      'Guided fellow veterans transitioning to engineering careers.',
      'Shared expertise on leveraging military experience in civilian roles.',
      'Connected veterans with academic and professional resources.',
    ],
  },
]
