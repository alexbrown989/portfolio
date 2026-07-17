// src/content/knowledgeBase.js
//
// Curated knowledge base powering the on-site chat assistant.
// Keyword + phrase scored (see matcher.js). No LLM calls, no telemetry,
// runs entirely in the browser.
//
// Entry shape:
//   {
//     id,
//     title,           // shown as a subtle header on the answer
//     tags: [...],     // low-specificity keywords, matched anywhere
//     terms: [...],    // higher-specificity words / short phrases
//     patterns: [...], // full example queries — exact-phrase hit = strong
//     answer,          // 1-3 short paragraphs
//     links?: [ { label, to } ],   // deep-links surfaced with the answer
//   }
//
// Guidance for editing:
//   - `terms` should be things that unambiguously identify this entry
//   - `tags` should be softer keywords (bag-of-words style)
//   - `patterns` should mirror how a human would actually ask

export const knowledgeBase = [
  /* ---------- Contact / how to reach ---------- */
  {
    id: 'contact',
    title: 'Contact · overview',
    tags: ['contact', 'reach', 'get in touch', 'hire', 'hiring', 'talk', 'message', 'connect'],
    terms: ['contact', 'contact section', 'contact page', 'reach out', 'get in touch'],
    patterns: [
      'how do i contact alex', 'how can i reach you', 'how do i get in touch',
      'contact section', 'contact info', 'how do i hire you', 'how to reach alex',
    ],
    answer:
      'Fastest path is email (alexbrow@uw.edu). LinkedIn works too. Both are on the Contact section of the home page along with a resume download.',
    links: [
      { label: 'Contact section', to: '/#contact' },
      { label: 'Email',            to: 'mailto:alexbrow@uw.edu', external: true },
      { label: 'LinkedIn',         to: 'https://www.linkedin.com/in/alexanderchasebrown/', external: true },
      { label: 'Resume (PDF)',     to: '/Resume.pdf', external: true },
    ],
  },
  {
    id: 'email',
    title: 'Email',
    tags: ['email', 'mail'],
    terms: ['email', 'email address', 'e-mail'],
    patterns: ['what is your email', 'whats alex\'s email', 'how do i email you', 'email address'],
    answer: 'alexbrow@uw.edu. Usually reply within a day.',
    links: [{ label: 'Send an email', to: 'mailto:alexbrow@uw.edu', external: true }],
  },
  {
    id: 'phone',
    title: 'Phone',
    tags: ['phone', 'call', 'text', 'number', 'sms', 'mobile', 'cell'],
    terms: ['phone number', 'phone', 'cell number', 'call you'],
    patterns: [
      'what is your phone number', 'whats alex\'s phone number',
      'can i call you', 'can i text you', 'phone number please',
    ],
    answer:
      'I don\'t publish a phone number on the site. The best way to reach me is email (alexbrow@uw.edu). If we\'re already in touch and you need my number, I\'ll share it directly.',
    links: [{ label: 'Send an email', to: 'mailto:alexbrow@uw.edu', external: true }],
  },
  {
    id: 'linkedin',
    title: 'LinkedIn',
    tags: ['linkedin', 'social'],
    terms: ['linkedin', 'linkedin profile'],
    patterns: ['do you have linkedin', 'linkedin link', 'linkedin profile'],
    answer: 'linkedin.com/in/alexanderchasebrown/. All work history, endorsements, and the same project write-ups you see here.',
    links: [{ label: 'Open LinkedIn', to: 'https://www.linkedin.com/in/alexanderchasebrown/', external: true }],
  },
  {
    id: 'resume',
    title: 'Resume',
    tags: ['resume', 'cv', 'curriculum vitae', 'pdf'],
    terms: ['resume', 'cv', 'resume pdf'],
    patterns: ['do you have a resume', 'can i see your resume', 'resume link', 'download resume'],
    answer: 'The current PDF resume is available at /Resume.pdf. It covers aerospace manufacturing quality at Verus, hands-on machining and gearbox design, Navy service, skills, and education.',
    links: [{ label: 'Download resume', to: '/Resume.pdf', external: true }],
  },
  {
    id: 'github',
    title: 'GitHub',
    tags: ['github', 'code', 'repos'],
    terms: ['github', 'source code', 'code repo'],
    patterns: ['do you have a github', 'github link', 'source code'],
    answer:
      "I don't link a public GitHub here yet. When I have a curated set of pinned repositories worth showing, that link will land in the Contact section.",
  },

  /* ---------- Identity ---------- */
  {
    id: 'who',
    title: 'Who is Alex Brown?',
    tags: ['who', 'introduce', 'yourself', 'about you'],
    terms: ['who are you', 'who is alex', 'introduce yourself', 'tell me about yourself', 'tell me about alex'],
    patterns: [
      'who are you', 'who is alex', 'who is alex brown',
      'tell me about yourself', 'tell me about alex', 'introduce yourself',
      'give me the elevator pitch', 'summary of alex',
    ],
    answer:
      'Mechanical engineering student at the University of Washington Tacoma and a U.S. Navy veteran (five years as a Hospital Corpsman). Currently the Lead Intern at Verus Aerospace, supporting flight-critical hardware: AS9102 FAI, Infor VISUAL ERP configuration control, Quality Clinic operations, and over-check inspections on Gulfstream assemblies. Seeking full-time engineering roles starting Summer 2027.',
    links: [{ label: 'Full profile', to: '/about' }],
  },
  {
    id: 'availability',
    title: 'Availability',
    tags: ['available', 'availability', 'graduate', 'graduating', 'full time', 'full-time', 'hire', 'hiring', 'start'],
    terms: ['when are you available', 'when do you graduate', 'availability', 'start date', 'looking for'],
    patterns: [
      'when are you available', 'when can you start', 'when do you graduate',
      'are you looking for work', 'are you looking for a job',
      'when are you graduating', 'full time availability', 'when are you free',
    ],
    answer:
      'Full-time, Summer 2027. Willing to relocate anywhere in the U.S. U.S. citizen, eligible for and able to maintain a security clearance.',
  },
  {
    id: 'location',
    title: 'Location',
    tags: ['location', 'where', 'city', 'state', 'live', 'relocate', 'tacoma', 'washington'],
    terms: ['location', 'where do you live', 'tacoma', 'seattle', 'washington'],
    patterns: [
      'where are you located', 'where do you live', 'what city are you in',
      'are you in washington', 'will you relocate',
    ],
    answer: 'Based in Tacoma, WA. Fully open to relocation for the right full-time role.',
  },
  {
    id: 'citizenship',
    title: 'Citizenship & clearance',
    tags: ['citizen', 'citizenship', 'clearance', 'security clearance', 'nationality', 'itar'],
    terms: ['citizen', 'security clearance', 'clearance eligible', 'itar'],
    patterns: [
      'are you a us citizen', 'do you have a clearance', 'clearance eligible',
      'can you get a clearance', 'itar eligible',
    ],
    answer:
      'U.S. citizen, clearance-eligible, and able to obtain and maintain a U.S. security clearance. Prior military service supports the eligibility.',
  },

  /* ---------- Verus / current internship ---------- */
  {
    id: 'verus',
    title: 'Verus Aerospace · Lead Intern',
    tags: ['verus', 'aerospace', 'internship', 'intern', 'current job', 'current role'],
    terms: ['verus', 'verus aerospace', 'current internship', 'current role', 'aerospace internship'],
    patterns: [
      'tell me about verus', 'what do you do at verus', 'current role', 'current internship',
      'aerospace experience', 'what is your internship', 'verus aerospace',
    ],
    answer:
      'Dec 2025 – Present, Tacoma, WA. I support aerospace manufacturing, quality, and process improvement for flight-critical hardware in a high-mix production environment. My work covers Engineering Masters and configuration control in Infor VISUAL ERP, developing inspection plans and quality documentation, AS9102 First Article Inspection activities, and independent over-check inspections on Gulfstream assemblies. I also lead the Quality Clinic (non-conforming hardware disposition + workflow redesign) and was selected as Lead Intern to onboard incoming interns.',
    links: [{ label: 'Internship section', to: '/#internship' }],
  },
  {
    id: 'as9102',
    title: 'AS9102 First Article Inspection',
    tags: ['as9102', 'fai', 'first article', 'aerospace inspection'],
    terms: ['as9102', 'first article inspection', 'fai'],
    patterns: ['do you know as9102', 'what is as9102', 'first article inspection experience'],
    answer:
      'At Verus I develop inspection plans and quality documentation to support AS9102 First Article Inspection on flight-critical hardware. Work covers GD&T interpretation, documentation package review, and independent over-check inspections on Gulfstream assemblies before release.',
  },
  {
    id: 'quality-clinic',
    title: 'Quality Clinic',
    tags: ['quality clinic', 'ncr', 'disposition', 'non-conforming', 'scrap'],
    terms: ['quality clinic', 'non-conforming hardware', 'disposition'],
    patterns: ['what is the quality clinic', 'quality clinic work', 'disposition of parts'],
    answer:
      'I lead Quality Clinic operations at Verus — tracking non-conforming hardware through rework, reassignment, and scrap disposition while improving traceability and material flow. I\'m also redesigning the disposition workflow to strengthen communication between engineering, quality, production, and inspection teams.',
  },
  {
    id: 'infor-erp',
    title: 'Infor VISUAL ERP',
    tags: ['infor', 'visual', 'erp', 'configuration control', 'engineering masters'],
    terms: ['infor visual', 'erp', 'engineering masters', 'configuration control'],
    patterns: ['do you know erp', 'infor experience', 'erp systems'],
    answer:
      'I maintain Engineering Masters and configuration control in Infor VISUAL ERP at Verus. That covers revision control, traceability, and production release readiness across active aerospace programs.',
  },
  {
    id: 'ti-inconel',
    title: 'Titanium & Inconel exposure',
    tags: ['titanium', 'inconel', 'multi-spindle', 'aerospace materials'],
    terms: ['titanium', 'inconel', 'multi-spindle cnc'],
    patterns: ['have you worked with titanium', 'have you worked with inconel', 'aerospace materials'],
    answer:
      'At Verus I have exposure to multi-spindle CNC machining of titanium and Inconel components: close-tolerance aerospace manufacturing at real production scale. Combined with the Multi-Tool Fabrication project, that means both hands-on machining and the aerospace-production perspective on why tolerances are non-negotiable.',
  },

  /* ---------- Navy / military ---------- */
  {
    id: 'navy',
    title: 'U.S. Navy Corpsman',
    tags: ['navy', 'military', 'corpsman', 'medic', 'veteran', 'service'],
    terms: ['navy', 'military', 'corpsman', 'veteran'],
    patterns: [
      'tell me about your navy service', 'military background', 'were you in the military',
      'navy corpsman', 'were you a corpsman',
    ],
    answer:
      'Aug 2018 – May 2023. Five years as a Hospital Corpsman. Optimized a $102K medical supply system for 20% downtime reduction, authored SOPs that cut documentation errors 30%, raised training compliance to 92% across 57 personnel, and earned the Armed Forces Service Medal. The Navy is where I learned to run high-stakes systems under real accountability.',
    links: [{ label: 'Full timeline', to: '/#timeline' }],
  },

  /* ---------- Projects (overview + each) ---------- */
  {
    id: 'projects-overview',
    title: 'Projects · overview',
    tags: ['projects', 'work', 'portfolio', 'case studies', 'best projects'],
    terms: ['projects', 'portfolio', 'case studies', 'your work'],
    patterns: [
      'what projects have you done', 'show me your work', 'best projects',
      'what have you built', 'walk me through your projects',
    ],
    answer:
      'Seven case studies. Ordered by relevance to a manufacturing / aerospace hire: Multi-Tool Fabrication (machining + GD&T), Reduction Gearbox (mechanical design + tolerance stack-up), 2-Axis Autonomous Turret (mechatronics), PCM Vibration (10× damping validation), Saipan Coastal Wave Dynamics (PIV + 40% accuracy gain), BET-H (bio-inspired thermal framework), Equitable Micromobility Study (co-authored research).',
    links: [{ label: 'Open the grid', to: '/#projects' }],
  },
  {
    id: 'multitool',
    title: 'Multi-Tool Fabrication',
    tags: ['multi-tool', 'multitool', 'machining', 'cnc', 'gdt', 'gd&t', 'tolerance', 'inspection', 'metrology', 'manufacturing'],
    terms: ['multi-tool', 'multitool', 'machining project', 'manufacturing project', 'gd&t project'],
    patterns: ['multi-tool project', 'walk me through the multi-tool', 'gd&t project', 'machining project'],
    answer:
      'Mar–Jun 2026. Fabricated a functional folding multi-tool from raw aluminum on manual mill + CNC, holding ±0.005 in precision, 0.003 in parallelism, and 0.002 in flatness against a full GD&T drawing package. Verified every feature with calipers, gauges, and dial indicators; recorded measurements against the print. Integrated pivots, bushings, spacers, and fasteners into a working articulated assembly.',
    links: [{ label: 'Case study', to: '/projects/multitool' }],
  },
  {
    id: 'gearbox',
    title: 'Three-Stage Reduction Gearbox · Robotic Elbow',
    tags: ['gearbox', 'reduction', 'robotic elbow', 'gears', 'agma', 'mechanical design', 'tolerance stack', 'stack-up', 'design review'],
    terms: ['gearbox', 'reduction gearbox', 'robotic elbow', 'gear design', 'agma'],
    patterns: ['gearbox project', 'robotic elbow', 'mechanical design project'],
    answer:
      'Mar–Apr 2026. Quarter-long small-team design of a three-stage spur-gear reduction for a 1-DOF robotic elbow. 4000 → 50 RPM, 2.11 → 169 lb-in, total ratio 80:1. Full AGMA 2001-D04 bending-stress analysis across all six gears: mixed 4140-steel / 6061-T6-aluminum stack, every gear passes with margin (G6 closest to the limit at FoS 2.30). Live CAD assembly + tolerance stack-up + GD&T. Design-review approved.',
    links: [{ label: 'Case study', to: '/projects/gearbox' }],
  },
  {
    id: 'turret',
    title: '2-Axis Autonomous Turret',
    tags: ['turret', 'robotics', 'mechatronics', 'servo', 'arduino', 'nodemcu', 'autonomous'],
    terms: ['turret', 'mechatronics project', 'autonomous turret', 'nodemcu'],
    patterns: ['turret project', 'mechatronics project', 'robotics project'],
    answer:
      'SolidWorks multi-part assembly + FDM prints (nine parts) + NodeMCU/Arduino embedded C++. Randomized scan pattern with servo motion profiles and angular limits. 0.8° angular repeatability (σ) over 100 cycles at ±45° per axis. Platform is built to host LiDAR and vision fusion next.',
    links: [{ label: 'Case study', to: '/projects/turret' }],
  },
  {
    id: 'vibration',
    title: 'PCM Vibration Analysis',
    tags: ['vibration', 'pcm', 'damping', 'composite', 'beeswax', 'oscilloscope', 'piezo', 'ring-down'],
    terms: ['pcm', 'vibration project', 'damping project', 'composite project', 'ring-down'],
    patterns: ['pcm project', 'vibration project', 'damping project', 'composite damping'],
    answer:
      '2024. Novel composite (epoxy + beeswax PCM + graphite conductive filler) with a monolithic SolidWorks test rig driven through three iteration cycles to remove joint flex. Instrumented with piezo + oscilloscope for ring-down capture. Result: ~10× increase in damping factor and a near-critical damping state when thermally triggered. ±0.1 mm fabrication tolerance, < $500 prototype cost.',
    links: [{ label: 'Case study', to: '/projects/vibration' }],
  },
  {
    id: 'coastal',
    title: 'Saipan Coastal Wave Dynamics',
    tags: ['coastal', 'saipan', 'piv', 'wave', 'fluid dynamics', 'seawall', 'erosion', 'cfd', 'pacific'],
    terms: ['coastal', 'saipan', 'piv', 'wave dynamics', 'seawall'],
    patterns: ['coastal project', 'saipan project', 'piv accuracy', 'wave dynamics'],
    answer:
      'First lab-scale pipeline quantifying wave–coast interactions for Saipan (~$45M+ infrastructure exposure). Processed DEM in MATLAB, 3D-printed the island geometry at 0.2 mm layers, and designed a novel polka-dot Visual Field Architecture background that improved PIV particle correlation ~40%. Tank runs under Froude similarity produced ↓37% wave energy at the shoreline, ↓42% coastal vorticity, and identified three high-risk zones.',
    links: [{ label: 'Case study', to: '/projects/coastal' }],
  },
  {
    id: 'beth',
    title: 'BET-H · Biological Elastin Thermoregulation',
    tags: ['beth', 'bet-h', 'elastin', 'thermal', 'biological', 'bio-inspired', 'passive'],
    terms: ['beth', 'bet-h', 'elastin', 'thermal framework', 'bio-inspired thermal'],
    patterns: ['beth project', 'bet-h', 'elastin project', 'bio-inspired thermal', 'passive thermal'],
    answer:
      'Speculative framework that abstracts elastin\'s entropy-driven behavior in nature into a design pattern for passive thermal systems. The concept is public; specific formulations, layer stacks, and validation data are intentionally held back while the work is in progress. Happy to walk a serious team through the technical depth in a private conversation.',
    links: [
      { label: 'Case study', to: '/projects/beth' },
      { label: 'Email',      to: 'mailto:alexbrow@uw.edu', external: true },
    ],
  },
  {
    id: 'micromobility',
    title: 'Equitable Micromobility Study',
    tags: ['micromobility', 'equity', 'urban', 'policy', 'dedoose', 'peer-reviewed', 'co-author'],
    terms: ['micromobility', 'equity study', 'urban mobility'],
    patterns: ['micromobility project', 'equity study', 'urban mobility project'],
    answer:
      'Co-authored peer-reviewed study translating equity policy from 250+ U.S. programs into concrete engineering constraints. Coded documents into 4,000+ analytical categories in Dedoose. Quantified four gaps: 29.0% physical accessibility, 48.8% financial inclusion, 42.4% digital access, 42.4% system integration. Translated each gap into a hardware / policy requirement.',
    links: [{ label: 'Case study', to: '/projects/micromobility' }],
  },

  /* ---------- Skills ---------- */
  {
    id: 'cad',
    title: 'CAD',
    tags: ['cad', 'solidworks', 'onshape', 'modeling', '3d modeling', 'ansys'],
    terms: ['solidworks', 'onshape', 'cad'],
    patterns: ['do you use solidworks', 'cad experience', '3d modeling'],
    answer:
      'Primary: SolidWorks. Secondary: Onshape. Comfortable maintaining live team assemblies (see the Gearbox project) and running section views, stack-ups, and manufacturability reviews.',
  },
  {
    id: 'embedded',
    title: 'Embedded / controls',
    tags: ['embedded', 'arduino', 'nodemcu', 'c++', 'firmware', 'controls', 'microcontroller'],
    terms: ['embedded', 'arduino', 'nodemcu', 'microcontroller', 'firmware'],
    patterns: ['embedded experience', 'do you code', 'arduino', 'firmware'],
    answer:
      'Arduino IDE + NodeMCU + Arduino Uno. Embedded C++ for the 2-Axis Autonomous Turret (servo motion profiles, angular limits, randomized scan cadence), and Arduino-driven DAQ + piezo capture for the PCM vibration rig.',
  },
  {
    id: 'analysis',
    title: 'Analysis stack',
    tags: ['matlab', 'python', 'analysis', 'signal processing', 'data', 'excel'],
    terms: ['matlab', 'python', 'data analysis', 'signal processing'],
    patterns: ['do you use matlab', 'python experience', 'data analysis'],
    answer:
      'MATLAB (DEM processing for the Coastal study, PIVLab, general signal work), Python (data cleanup + plots), Excel (Amazon ergonomic dashboards, Verus KPI monitoring). Comfortable moving between all three depending on what the data wants.',
  },
  {
    id: 'ltspice',
    title: 'Analog / circuits',
    tags: ['ltspice', 'analog', 'circuits', 'electronics', 'op-amp'],
    terms: ['ltspice', 'analog circuit', 'op-amp'],
    patterns: ['ltspice', 'analog circuits'],
    answer: 'LTspice for analog circuit simulation. Comfortable with op-amp signal conditioning and troubleshooting analog stages with a scope.',
  },

  /* ---------- Non-technical background ---------- */
  {
    id: 'same',
    title: 'SAME President · UW Tacoma',
    tags: ['same', 'president', 'leadership', 'club', 'society', 'american military engineers'],
    terms: ['same', 'same president', 'club president', 'engineering society'],
    patterns: ['what is same', 'leadership experience', 'club president', 'engineering society'],
    answer:
      'President of the Society of American Military Engineers at UW Tacoma since Oct 2024. Grew membership 30%, managed a $10K+ budget across workshops and events, and built industry partnerships with 5+ teams to open internship pipelines for students.',
  },
  {
    id: 'amazon',
    title: 'Amazon · Onsite Medical Representative',
    tags: ['amazon', 'ergonomics', 'safety', 'medical representative', 'kent'],
    terms: ['amazon', 'onsite medical', 'ergonomics'],
    patterns: ['amazon experience', 'ergonomics', 'onsite medical'],
    answer:
      'May 2023 – Jan 2024, Kent WA fulfillment site. Built an Excel-based injury tracking system using ergonomic engineering principles (−20% data errors). Partnered with safety and engineering to cut emergency response times 25%. Ran wellness programs that dropped absenteeism 20% and raised engagement 15%.',
  },

  /* ---------- Basic recruiter / job-related questions ---------- */
  {
    id: 'why-you',
    title: 'Why hire Alex?',
    tags: ['why', 'differentiator', 'strengths', 'fit', 'unique', 'stand out', 'hire you', 'best fit'],
    terms: ['why should i hire you', 'why you', 'what makes you different', 'stand out', 'differentiator'],
    patterns: [
      'why should i hire you', 'why you', 'what makes you different',
      'what makes you stand out', 'what is your differentiator',
    ],
    answer:
      'I bring a rare pair. Five years in the U.S. Navy running high-accountability systems, and an active aerospace manufacturing internship at Verus (AS9102 FAI, GD&T, ERP configuration control) while a full-time mechanical engineering student. That means I already know how to execute inside a real production environment, I read GD&T fluently, and I have hands-on manufacturing evidence to back it up (the Multi-Tool project holds ±0.005 in). Most new-grads offer one of those; I bring all three.',
    links: [
      { label: 'Internship', to: '/#internship' },
      { label: 'Projects',   to: '/#projects' },
    ],
  },
  {
    id: 'strengths',
    title: 'Strengths',
    tags: ['strength', 'strengths', 'best at', 'good at'],
    terms: ['strengths', 'what are you good at', 'your best skill'],
    patterns: ['what are your strengths', 'what is your greatest strength', 'what are you best at'],
    answer:
      'Ownership under load, GD&T interpretation, and process-mindedness. I inherit responsibility for systems (Verus Quality Clinic, Navy medical supply, SAME chapter) and leave them measurably better. In engineering terms: I plan the order of operations before I touch the tool, and I inspect what I build against the print.',
  },
  {
    id: 'weakness',
    title: 'Growth areas',
    tags: ['weakness', 'weaknesses', 'growth', 'improve', 'improvement'],
    terms: ['weakness', 'weaknesses', 'growth area', 'what do you need to work on'],
    patterns: [
      'what is your greatest weakness', 'what are your weaknesses',
      'what do you need to work on', 'growth areas',
    ],
    answer:
      "Formal FEA / simulation isn't yet at the level of my hands-on manufacturing experience. I've done modal work and ring-down validation on the PCM vibration project, but I want deeper ANSYS Mechanical / structural-nonlinear time before I claim it as a strength. I'm treating my Summer 2027 target role as the environment to close that gap.",
  },
  {
    id: 'achievement',
    title: 'Biggest achievement',
    tags: ['achievement', 'proud', 'accomplishment', 'greatest'],
    terms: ['biggest achievement', 'proudest', 'greatest accomplishment'],
    patterns: [
      'what is your biggest achievement', 'what are you most proud of',
      'greatest accomplishment', 'proudest moment',
    ],
    answer:
      'Being selected as Lead Intern at Verus Aerospace. It means I have the trust of engineering, quality, and production leads to onboard incoming interns and own the Quality Clinic workflow redesign. It is not a certificate, it is a live responsibility on flight-critical hardware.',
    links: [{ label: 'Internship', to: '/#internship' }],
  },
  {
    id: 'challenge',
    title: 'Biggest challenge',
    tags: ['challenge', 'hardest', 'difficult', 'tough', 'obstacle'],
    terms: ['biggest challenge', 'hardest project', 'toughest'],
    patterns: [
      'what was your biggest challenge', 'hardest project', 'tell me about a difficult problem',
      'toughest thing you worked on',
    ],
    answer:
      'The PCM vibration rig. First two rig designs failed for non-obvious reasons: an off-the-shelf vise looked rigid but flexed dynamically, and a modular bed design added micro-movement at bolted interfaces. Getting to clean ring-down data required rejecting both, going monolithic, and inventing an open-channel clamp that accepted real cast parts. The takeaway: static rigidity is not dynamic rigidity, and every joint you add flexes.',
    links: [{ label: 'Vibration case study', to: '/projects/vibration' }],
  },
  {
    id: 'teamwork',
    title: 'Working style',
    tags: ['team', 'teamwork', 'collaborate', 'style', 'working style', 'work with others'],
    terms: ['teamwork', 'working style', 'how do you work', 'collaboration'],
    patterns: [
      'how do you work in a team', 'tell me about your working style',
      'give me an example of teamwork', 'do you work well with others',
    ],
    answer:
      "Corpsman first. That means calm under pressure, explicit handoffs, and never leaving a teammate to hold the bag on a deliverable I own. On the gearbox project I owned the tolerance stack-up while a teammate owned the bearing calcs; we reconciled in the live CAD assembly at every design review checkpoint. On the Verus team I'm the interface between quality, engineering, and production on Quality Clinic tickets.",
  },
  {
    id: 'passion',
    title: 'What drives you',
    tags: ['passion', 'motivation', 'drive', 'love', 'why engineering'],
    terms: ['passion', 'what drives you', 'why engineering', 'motivation'],
    patterns: [
      'what are you passionate about', 'why did you choose engineering',
      'what motivates you', 'why do you love this work',
    ],
    answer:
      'I build things that matter and hold up under review. The Navy taught me that a well-designed system saves people. Engineering is the same idea at a bigger scale: aerospace hardware that flies, thermal systems that keep infrastructure alive, quality processes that stop defects before they ship. That is the through-line.',
  },
  {
    id: 'salary',
    title: 'Compensation',
    tags: ['salary', 'pay', 'compensation', 'money', 'comp'],
    terms: ['salary', 'compensation', 'pay range', 'expected salary'],
    patterns: [
      'what is your salary expectation', 'salary expectations', 'how much do you want',
      'compensation expectations', 'expected pay',
    ],
    answer:
      "Happy to discuss real numbers in an interview once I understand the role, location, and benefit structure. Broadly: I'm targeting competitive full-time entry-level engineering compensation for aerospace / defense / advanced manufacturing.",
  },
  {
    id: 'references',
    title: 'References',
    tags: ['references', 'referrals', 'recommender'],
    terms: ['references', 'reference letter', 'recommenders'],
    patterns: ['do you have references', 'can you provide references', 'reference letter'],
    answer:
      'Yes. I can provide references from Verus Aerospace, SAME at UW Tacoma, and my Navy chain. Available on request through email once we are further into the conversation.',
    links: [{ label: 'Email', to: 'mailto:alexbrow@uw.edu', external: true }],
  },
  {
    id: 'gpa',
    title: 'GPA / education',
    tags: ['gpa', 'grades', 'academic', 'transcript', 'coursework'],
    terms: ['gpa', 'grades', 'coursework', 'transcript'],
    patterns: ['what is your gpa', 'what classes have you taken', 'coursework', 'transcript'],
    answer:
      "Full transcript is available on request. Coursework focuses on mechanics, thermodynamics, fluid mechanics, materials, mechatronics, and design-for-manufacturing. Where it matters, the projects on this site are the evidence I'd point to over a number.",
  },
  {
    id: 'graduation',
    title: 'Graduation',
    tags: ['graduate', 'graduation', 'degree'],
    terms: ['graduate', 'graduation date', 'degree'],
    patterns: ['when do you graduate', 'graduation date', 'when will you finish school'],
    answer:
      'B.S. Mechanical Engineering, University of Washington Tacoma. Graduating June 2027. Available full-time starting Summer 2027.',
  },
  {
    id: 'remote',
    title: 'Remote / hybrid / onsite',
    tags: ['remote', 'hybrid', 'onsite', 'work location'],
    terms: ['remote', 'hybrid', 'onsite work'],
    patterns: ['are you open to remote', 'hybrid or onsite', 'work from home'],
    answer:
      "Mechanical engineering is a hands-on discipline, so I default to onsite or hybrid where a real production environment or lab is available. Fully remote would only work for narrow analysis / simulation roles.",
  },
  {
    id: 'travel',
    title: 'Travel',
    tags: ['travel', 'traveling', 'traveling for work'],
    terms: ['travel', 'travel for work'],
    patterns: ['are you willing to travel', 'travel for work'],
    answer:
      'Yes. Navy experience prepared me to travel for the mission. Open to regular domestic travel and long-term site rotations if the role calls for it.',
  },
  {
    id: 'defense',
    title: 'Aerospace / defense interest',
    tags: ['aerospace', 'defense', 'primes', 'anduril', 'boeing', 'lockheed', 'northrop', 'spacex', 'raytheon', 'itar'],
    terms: ['aerospace', 'defense', 'defense industry', 'aerospace industry'],
    patterns: ['are you interested in defense', 'aerospace roles', 'do you want to work in defense'],
    answer:
      'Yes. Verus Aerospace is my current internship, my Navy background gave me clearance eligibility, and the projects on this site (multi-tool, gearbox, PCM composite, coastal, BET-H) are all rehearsals for high-consequence hardware work. Aerospace, defense, and advanced manufacturing are my target space for full-time.',
  },
  {
    id: 'programming',
    title: 'Programming / software',
    tags: ['programming', 'code', 'software', 'python', 'matlab', 'c++', 'languages'],
    terms: ['programming languages', 'coding', 'code experience'],
    patterns: ['what languages do you code in', 'programming experience', 'do you code'],
    answer:
      'Not primary. Python for data cleanup and plotting, MATLAB for DEM processing / PIVLab / signal work, embedded C++ (Arduino/NodeMCU) for the turret and PCM DAQ. I use software where it earns its place in a mechanical workflow.',
  },
  {
    id: 'certifications',
    title: 'Certifications',
    tags: ['certification', 'certified', 'cert', 'osha', 'six sigma'],
    terms: ['certifications', 'certified'],
    patterns: ['do you have any certifications', 'certifications'],
    answer:
      'Military-side: Hospital Corpsman qualifications from active-duty Navy service. Awarded the Armed Forces Service Medal. Engineering-side: no formal external certifications yet; the manufacturing / GD&T / AS9102 exposure comes through the Verus internship rather than a stand-alone cert.',
  },
  {
    id: 'hobbies',
    title: 'Outside of engineering',
    tags: ['hobbies', 'fun', 'personal', 'outside', 'hiking', 'coach', 'soccer'],
    terms: ['hobbies', 'outside of work', 'what do you do for fun'],
    patterns: ['hobbies', 'what do you do for fun', 'outside of engineering'],
    answer:
      'Youth soccer coach, veteran-community volunteer, and SAME chapter president. Outdoors when the weather in Tacoma allows for it.',
  },
  {
    id: 'ai',
    title: 'AI / autonomy interest',
    tags: ['ai', 'autonomy', 'ml', 'machine learning', 'lidar', 'vision'],
    terms: ['ai', 'autonomy', 'machine learning', 'computer vision'],
    patterns: ['are you interested in ai', 'autonomous systems', 'machine learning experience'],
    answer:
      "The turret project was scoped from day one as a foundation for later LiDAR + vision fusion, and I have the mechatronics chops to interface with an autonomy stack. I don't claim ML modeling as a core skill yet — that would be a growth vector inside the right role.",
  },

  /* ---------- Meta ---------- */
  {
    id: 'site',
    title: 'How this site is built',
    tags: ['site', 'website', 'portfolio', 'built', 'stack', 'tech stack'],
    terms: ['how did you build this', 'tech stack', 'how is this site built'],
    patterns: ['how did you build this site', 'what is this site built with', 'tech stack'],
    answer:
      'React 19 + Vite + Tailwind + framer-motion + @react-three/fiber for the STL viewers + lucide-react for icons. Fully client-rendered SPA. Security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy) served via vercel.json. Zero telemetry, zero external LLM calls, zero user data collected.',
  },
  {
    id: 'chat',
    title: 'About this chat',
    tags: ['chat', 'ai', 'chatbot', 'assistant', 'gpt', 'llm', 'bot'],
    terms: ['chat', 'chatbot', 'ai assistant'],
    patterns: ['are you a chatbot', 'is this ai', 'how does this chat work', 'is this an llm'],
    answer:
      'Local keyword-and-phrase scored assistant, not an LLM. Every answer here is written by Alex and pulled from a curated knowledge base. Nothing leaves your browser. Try asking about a specific project (multi-tool, gearbox, PCM), his internship at Verus, his availability, or how to reach him.',
  },
]

// Suggested prompts shown in the empty state.
export const suggestedPrompts = [
  'What is Alex doing at Verus Aerospace?',
  'Walk me through the multi-tool project.',
  'When is Alex available for full-time?',
  'How do I contact Alex?',
  'Tell me about the BET-H thermal framework.',
  'What was hardest about the gearbox project?',
]
