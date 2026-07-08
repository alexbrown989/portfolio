// src/content/knowledgeBase.js
//
// Curated knowledge base powering the on-site chat assistant. This is a
// keyword-scored FAQ (not an LLM call) so it works offline, respects the
// CSP, and costs nothing to serve. Every entry is derived from real content
// on the site and from Alex's LinkedIn / project write-ups.
//
// Entry shape:
//   { id, tags:[keywords for scoring],
//     patterns:[strings the user might type],
//     title, answer,
//     link?:{label, to} }
//
// The chat component sums matched tag hits + phrase overlap and returns the
// top-N answers. Keep tags lowercase and specific.

export const knowledgeBase = [
  /* ----- Identity + high-level ----------------------------------- */
  {
    id: 'who',
    tags: ['who', 'alex', 'name', 'yourself', 'introduce', 'about you'],
    patterns: ['who are you', 'about you', 'introduce yourself', 'tell me about alex'],
    title: 'Who is Alex Brown?',
    answer:
      'Mechanical engineering student at the University of Washington Tacoma and a U.S. Navy veteran (five years as a Hospital Corpsman). Currently the Lead Intern at Verus Aerospace in Tacoma, WA, supporting flight-critical hardware: AS9102 FAI, Infor VISUAL ERP configuration control, Quality Clinic operations, and over-check inspections on Gulfstream assemblies. Seeking full-time engineering roles starting Summer 2027.',
    link: { label: 'Full profile', to: '/about' },
  },
  {
    id: 'availability',
    tags: ['available', 'availability', 'when', 'start', 'graduating', 'graduate', 'full time', 'full-time', 'hire', 'hiring'],
    patterns: ['when are you available', 'when do you graduate', 'are you looking for a job', 'when can you start'],
    title: 'Availability',
    answer:
      'Full-time, Summer 2027. Willing to relocate. U.S. citizen, eligible for and able to maintain a U.S. security clearance.',
  },
  {
    id: 'contact',
    tags: ['contact', 'email', 'reach', 'linkedin', 'phone', 'message'],
    patterns: ['how do i contact', 'how can i reach', 'email address'],
    title: 'How to reach Alex',
    answer:
      'Email: alexbrow@uw.edu (fastest response, usually within a day). LinkedIn: linkedin.com/in/alexanderchasebrown/. Both link buttons live in the Contact section on the home page.',
    link: { label: 'Contact section', to: '/#contact' },
  },

  /* ----- Verus / current internship ------------------------------ */
  {
    id: 'verus',
    tags: ['verus', 'aerospace', 'internship', 'intern', 'quality', 'manufacturing', 'current job', 'current role'],
    patterns: ['tell me about verus', 'what do you do at verus', 'current role', 'current internship', 'aerospace experience'],
    title: 'Verus Aerospace · Lead Intern',
    answer:
      'Dec 2025 – Present, Tacoma, WA. Support aerospace manufacturing, quality, and process improvement for flight-critical hardware in a high-mix production environment. Key work: maintain Engineering Masters and configuration control in Infor VISUAL ERP; develop inspection plans and quality documentation; run AS9102 First Article Inspection activities; perform independent over-check inspections on Gulfstream assemblies; lead the Quality Clinic (non-conforming hardware disposition + workflow redesign); monitor manufacturing / quality KPIs. Selected as Lead Intern for onboarding and coordination of incoming interns.',
    link: { label: 'Internship section', to: '/#internship' },
  },
  {
    id: 'as9102',
    tags: ['as9102', 'fai', 'first article', 'inspection', 'aerospace inspection'],
    patterns: ['what is as9102', 'do you know as9102', 'first article inspection'],
    title: 'AS9102 FAI experience',
    answer:
      'At Verus Aerospace I develop inspection plans and quality documentation to support AS9102 First Article Inspection on flight-critical hardware. That covers GD&T interpretation, documentation package review, and independent over-check inspections on Gulfstream assemblies before release.',
  },
  {
    id: 'ti-inconel',
    tags: ['titanium', 'inconel', 'cnc', 'multi-spindle', 'machining', 'aerospace materials'],
    patterns: ['have you worked with titanium', 'have you worked with inconel', 'aerospace materials'],
    title: 'Titanium and Inconel exposure',
    answer:
      'At Verus I have exposure to multi-spindle CNC machining of titanium and Inconel components: close-tolerance aerospace manufacturing at real production scale. Combined with the Multi-Tool Fabrication project, that means both hands-on machining and the aerospace-production perspective on why tolerances are non-negotiable.',
  },

  /* ----- Navy ---------------------------------------------------- */
  {
    id: 'navy',
    tags: ['navy', 'military', 'corpsman', 'medical', 'veteran'],
    patterns: ['tell me about your navy service', 'military background', 'your military'],
    title: 'U.S. Navy Corpsman · 2018–2023',
    answer:
      'Five years as a Hospital Corpsman. Highlights: optimized a $102K medical supply system for 20% downtime reduction, developed SOPs that cut documentation errors 30%, raised training compliance to 92% across 57 personnel, coordinated safety protocols for 50+ chemicals, supported CDC-partnered CHARM-Atlanta research, and earned the Armed Forces Service Medal. The Navy is where I learned to run high-stakes systems under real accountability.',
    link: { label: 'Full timeline', to: '/#timeline' },
  },
  {
    id: 'clearance',
    tags: ['clearance', 'security', 'defense', 'itar'],
    patterns: ['do you have a security clearance', 'clearance eligible', 'defense'],
    title: 'Security clearance',
    answer:
      'U.S. citizen, clearance-eligible, and able to obtain and maintain a U.S. security clearance. My prior military service supports that eligibility.',
  },

  /* ----- Projects ------------------------------------------------ */
  {
    id: 'projects-overview',
    tags: ['projects', 'work', 'portfolio', 'case studies', 'show me', 'best projects'],
    patterns: ['what projects have you done', 'show me your work', 'best projects'],
    title: 'Project portfolio',
    answer:
      'Seven case studies on the site. Ordered for a hiring manager: Multi-Tool Fabrication (machining + GD&T + inspection), Reduction Gearbox (mechanical design + tolerance stack-up), 2-Axis Autonomous Turret (mechatronics), PCM Vibration (10× damping validation), Saipan Coastal Wave Dynamics (PIV + 40% accuracy gain), BET-H (bio-inspired thermal framework), Equitable Micromobility Study (co-authored research).',
    link: { label: 'Projects', to: '/#projects' },
  },
  {
    id: 'multitool',
    tags: ['multi-tool', 'multitool', 'machining', 'cnc', 'gdt', 'gd&t', 'tolerance', 'inspection', 'metrology'],
    patterns: ['multi-tool project', 'multitool', 'machining project', 'gd&t project'],
    title: 'Multi-Tool Fabrication',
    answer:
      'Mar–Jun 2026. Fabricated a functional folding multi-tool from raw aluminum on manual mill + CNC, holding ±0.005 in precision, 0.003 in parallelism, and 0.002 in flatness against a full GD&T drawing package. Verified every feature (hole size, thickness, profile, flatness, parallelism, symmetry, position) with calipers, gauges, and dial indicators; recorded measurements in a spreadsheet. Integrated pivots, bushings, spacers, and fasteners into a working articulated assembly.',
    link: { label: 'Case study', to: '/projects/multitool' },
  },
  {
    id: 'gearbox',
    tags: ['gearbox', 'reduction', 'robotic elbow', 'gears', 'design project', 'mechanical design', 'tolerance stack', 'stack-up'],
    patterns: ['gearbox project', 'robotic elbow', 'design project'],
    title: 'Reduction Gearbox for Robotic Elbow',
    answer:
      'Mar–Apr 2026. Small-team, quarter-long design of a shaft reduction gearbox for a 1-DOF robotic elbow. Own contributions covered gear-ratio selection, torque transmission, shaft sizing, bearing selection, keyway calls, and tolerance stack-up for backlash control. Maintained a live CAD assembly for shaft alignment, gear placement, bearing fitment, and fastener access. Approved through design review.',
    link: { label: 'Case study', to: '/projects/gearbox' },
  },
  {
    id: 'turret',
    tags: ['turret', 'robotics', 'mechatronics', 'servo', 'arduino', 'nodemcu', 'autonomous'],
    patterns: ['turret project', 'mechatronics project', 'robotics project'],
    title: '2-Axis Autonomous Turret',
    answer:
      'SolidWorks multi-part assembly + FDM prints (nine parts) + NodeMCU/Arduino embedded C++. Randomized scan pattern with servo motion profiles and angular limits. Measured 0.8° angular repeatability (σ) over 100 cycles at ±45° per axis. Platform is built to host LiDAR and vision fusion next.',
    link: { label: 'Case study', to: '/projects/turret' },
  },
  {
    id: 'vibration',
    tags: ['vibration', 'pcm', 'damping', 'composite', 'beeswax', 'oscilloscope', 'piezo'],
    patterns: ['pcm project', 'vibration project', 'damping project', 'composite project'],
    title: 'PCM Vibration Analysis',
    answer:
      '2024. Novel composite: epoxy + beeswax (PCM) + graphite (conductive filler). Custom SolidWorks test rig (monolithic, adaptable clamp) driven through three iteration cycles to remove joint flex. Instrumented with piezo + oscilloscope for ring-down capture. Result: ~10× increase in damping factor and a near-critical damping state when thermally triggered. ±0.1 mm fabrication tolerance, < $500 prototype cost.',
    link: { label: 'Case study', to: '/projects/vibration' },
  },
  {
    id: 'coastal',
    tags: ['coastal', 'saipan', 'piv', 'wave', 'fluid dynamics', 'seawall', 'erosion', 'cfd', 'pacific'],
    patterns: ['coastal project', 'saipan', 'piv', 'wave dynamics'],
    title: 'Saipan Coastal Wave Dynamics',
    answer:
      'First lab-scale pipeline quantifying wave–coast interactions for Saipan (~$45M+ infrastructure exposure). Processed DEM in MATLAB, 3D-printed the island geometry at 0.2 mm layers, and designed a polka-dot Visual Field Architecture background that improved PIV particle correlation by ~40%. Tank runs under Froude similarity produced ↓37% wave energy at the shoreline, ↓42% coastal vorticity, and identified three high-risk zones.',
    link: { label: 'Case study', to: '/projects/coastal' },
  },
  {
    id: 'beth',
    tags: ['beth', 'bet-h', 'elastin', 'thermal', 'pcm', 'graphite', 'carbon black', 'biological', 'bio-inspired', 'passive'],
    patterns: ['beth project', 'bet-h', 'elastin', 'thermal framework', 'bio-inspired thermal'],
    title: 'BET-H · Biological Elastin Thermoregulation',
    answer:
      'Framework abstracting elastin\'s entropy-driven behavior into a design pattern for passive thermal systems. Materials: n-eicosane PCM (~247 kJ/kg latent heat), graphite (~4300 W/m·K in-plane conductivity), carbon black (~98% solar absorption), copper (~400 W/m·K isotropic). Framework principles: abstraction over imitation, passive by design, scalable materials. Conceptual applications: EV battery thermal buffer, solar roofing system, Stirling dissipator.',
    link: { label: 'Case study', to: '/projects/beth' },
  },
  {
    id: 'micromobility',
    tags: ['micromobility', 'equity', 'urban', 'policy', 'dedoose'],
    patterns: ['micromobility project', 'equity study', 'urban mobility'],
    title: 'Equitable Micromobility Study',
    answer:
      'Co-authored a peer-reviewed study translating equity policy from 250+ U.S. programs into concrete engineering constraints. Coded documents into 4,000+ analytical categories in Dedoose. Quantified four gaps: 29.0% physical accessibility, 48.8% financial inclusion, 42.4% digital access, 42.4% system integration. Translated each into hardware / policy requirements teams can build against.',
    link: { label: 'Case study', to: '/projects/micromobility' },
  },

  /* ----- Skills / stacks ---------------------------------------- */
  {
    id: 'cad',
    tags: ['cad', 'solidworks', 'onshape', 'modeling', '3d modeling'],
    patterns: ['do you use solidworks', 'cad experience', '3d modeling'],
    title: 'CAD',
    answer:
      'Primary: SolidWorks. Secondary: Onshape. Comfortable maintaining live team assemblies (see the Gearbox project) and running section views, stack-ups, and manufacturability reviews. Also SolidWorks for the Vibration rig, Turret assembly, and Multi-Tool feature planning.',
  },
  {
    id: 'embedded',
    tags: ['embedded', 'arduino', 'nodemcu', 'c++', 'firmware', 'controls', 'microcontroller'],
    patterns: ['embedded experience', 'arduino', 'firmware'],
    title: 'Embedded / controls',
    answer:
      'Arduino IDE + NodeMCU + Arduino Uno. Embedded C++ for the 2-Axis Autonomous Turret (servo motion profiles, angular limits, randomized scan cadence), and Arduino-driven DAQ + piezo capture for the PCM vibration rig.',
  },
  {
    id: 'analysis',
    tags: ['matlab', 'python', 'analysis', 'signal processing', 'data'],
    patterns: ['do you use matlab', 'python experience', 'data analysis'],
    title: 'Analysis stack',
    answer:
      'MATLAB (DEM processing for Coastal, PIVLab, general signal work), Python (data cleanup + plots), Excel (Amazon ergonomic dashboards, Verus KPI monitoring). Comfortable moving between all three depending on what the data wants.',
  },
  {
    id: 'ltspice',
    tags: ['ltspice', 'analog', 'circuits', 'electronics'],
    patterns: ['ltspice', 'analog circuits'],
    title: 'Analog / circuits',
    answer:
      'LTspice for analog circuit simulation. Comfortable building op-amp-based signal conditioning and troubleshooting analog stages with a scope.',
  },

  /* ----- Leadership / soft ------------------------------------- */
  {
    id: 'same',
    tags: ['same', 'president', 'leadership', 'club', 'society', 'american military engineers'],
    patterns: ['what is same', 'leadership experience', 'club president'],
    title: 'SAME President · UW Tacoma',
    answer:
      'President of the Society of American Military Engineers at UW Tacoma since Oct 2024. Grew membership 30%, managed $10K+ budget across workshops and events, and built industry partnerships with 5+ teams to open internship pipelines for students.',
  },
  {
    id: 'amazon',
    tags: ['amazon', 'ergonomics', 'safety', 'medical representative', 'kent'],
    patterns: ['amazon experience', 'onsite medical', 'ergonomics'],
    title: 'Amazon · Onsite Medical Representative',
    answer:
      'May 2023 – Jan 2024, Kent WA fulfillment site. Built an Excel-based injury tracking system using ergonomic engineering principles (−20% data errors). Partnered with safety and engineering to cut emergency response times 25%. Ran wellness programs that dropped absenteeism 20% and raised engagement 15%. Automated weekly incident rollups for leadership decisions.',
  },

  /* ----- Meta / site -------------------------------------------- */
  {
    id: 'site',
    tags: ['site', 'website', 'portfolio', 'built', 'stack', 'tech stack', 'how did you make'],
    patterns: ['how did you build this site', 'what is this site built with', 'tech stack'],
    title: 'How this site is built',
    answer:
      'React 19 + Vite + Tailwind + framer-motion + @react-three/fiber for the STL viewers + lucide-react for icons. Fully client-rendered SPA. Security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy) served via vercel.json. No telemetry, no external LLM calls, no user data collected. The chat you are using right now is a local, keyword-scored knowledge base that runs entirely client-side.',
  },
  {
    id: 'chat',
    tags: ['chat', 'ai', 'chatbot', 'assistant', 'gpt'],
    patterns: ['are you a chatbot', 'is this ai', 'how does this chat work'],
    title: 'About this chat',
    answer:
      'You are talking to a local, keyword-scored assistant (not an LLM). Every answer here is written by Alex and pulled from a curated knowledge base of his projects, timeline, and skills. No API calls, no data leaves your browser, no telemetry. Try asking about a specific project (multi-tool, gearbox, PCM), his internship at Verus, or his availability.',
  },
]

// Suggested prompts shown in the empty state.
export const suggestedPrompts = [
  'What are you doing at Verus Aerospace?',
  'Walk me through the multi-tool project.',
  'When are you available for full-time?',
  'Tell me about the BET-H thermal framework.',
  'What was hardest about the gearbox project?',
  'How can I contact you?',
]
