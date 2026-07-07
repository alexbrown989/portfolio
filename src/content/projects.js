// src/content/projects.js
//
// The single source of truth for the project catalog. Order here is the order
// on the Projects grid. `id` is used both by the router (/projects/<id>) and
// by the Projects grid's prefetch map — keep them in sync with App.jsx.
//
// Statuses: ACTIVE | DEPLOYED | COMPLETED | DRAFT | 'R&D'
//
// Entries marked draft: true are placeholders — swap in real content before
// sharing publicly.

export const projects = [
  {
    id: 'coastal',
    title: 'Coastal Wave Dynamics & Seawall Design',
    category: 'Fluid Dynamics',
    year: '2024',
    summary:
      'Scaled Saipan geometry on a hydraulic bench with a custom Visual Field Architecture background; improved PIV accuracy ~40% to quantify flow fields and overtopping.',
    image: '/projects/coastal.jpg',
    tech: ['PIV', 'Hydraulic Bench', '3D Print', 'MATLAB'],
    status: 'ACTIVE',
    youtube: 'https://www.youtube.com/watch?v=Kec6vw9DtYk',
    stl: '/models/Saipan.stl',
    aar: {
      right:   'Polka-dot VFA significantly improved particle tracking & vector quality.',
      wrong:   'Initial prints warped; redesigned internal ribs and supports.',
      learned: 'Physical validation is non-negotiable — CFD must meet the tank.',
    },
  },
  {
    id: 'vibration',
    title: 'Vibration Analysis of Phase-Change Materials',
    category: 'Materials & Dynamics',
    year: '2024',
    summary:
      'Custom SolidWorks test rig, DFAM parts, Arduino + piezo + oscilloscope to measure frequency/damping across a temperature sweep. Validated 10× damping increase in thermally triggered PCM composite.',
    image: '/projects/oscilloscope_pcm.jpg',
    tech: ['SolidWorks', 'Arduino', 'Piezo', 'Oscilloscope'],
    status: 'ACTIVE',
    aar: {
      right:   'Adaptable clamp corrected specimen variance; data capture stabilized.',
      wrong:   'Over-rigid initial clamp amplified error; re-engineered for compliance.',
      learned: 'Design for tolerances first; instrument the truth second.',
    },
  },
  {
    id: 'turret',
    title: '2-Axis Autonomous Turret',
    category: 'Mechatronics',
    year: '2024',
    summary:
      'SolidWorks multi-part assembly; NodeMCU + Arduino randomized scan algorithm; designed for future LiDAR/vision fusion.',
    image: '/projects/turret.jpg',
    video: '/projects/turret-op.mp4',
    printVideo: '/projects/turret-print.mp4',
    stl: '/models/Turret.stl',
    tech: ['SolidWorks', 'Arduino', 'NodeMCU'],
    codeImage: '/projects/turret-code.png',
    status: 'ACTIVE',
    aar: {
      right:   'Mechanics achieve stable articulation with tight fits.',
      wrong:   'Early tolerances drifted; iterated to production-fit.',
      learned: 'Rapid prototyping + tolerance stack-up analysis is essential.',
    },
  },
  {
    id: 'beth',
    title: 'BET-H: Biological Elastin Thermoregulation',
    category: 'Thermal Systems',
    year: '2024',
    summary:
      'Elastin-inspired passive thermal regulation using PCM, carbon black, graphite, and copper. Zero-energy design concepts for infrastructure-limited settings.',
    image: '/projects/beth.png',
    tech: ['Thermo', 'PCM', 'Graphite', 'Carbon Black'],
    status: 'R&D',
    aar: {
      right:   'Latent capacity confirmed; architecture aligns with passive operation goals.',
      wrong:   'Early models over-idealized conduction; added anisotropy & interface losses.',
      learned: 'Interfaces dominate performance; geometry & contact are king.',
    },
  },
  {
    id: 'micromobility',
    title: 'Equitable Micromobility Study (Co-Author)',
    category: 'Urban Systems',
    year: '2024',
    summary:
      'Translating equity policies into engineering constraints (range, frame design, terrain) across 250+ U.S. programs.',
    image: '/projects/micro.jpg',
    tech: ['Dedoose', 'MATLAB', 'Policy Analysis', 'UX Requirements'],
    status: 'ACTIVE',
  },

  // ---------------------------------------------------------------------
  // NEW: Ternary Logic Adder
  //
  // Draft entry — the About page already references this work ("Analog
  // Computation: Ternary logic adder that connects theory to hardware").
  // The dedicated page at /projects/ternary is fully scaffolded; drop in
  // actual bench photos, an LTspice schematic capture, and measured
  // waveforms to finish it.
  // ---------------------------------------------------------------------
  {
    id: 'ternary',
    title: 'Balanced Ternary Logic Adder',
    category: 'Analog Computation',
    year: '2025',
    summary:
      'Analog implementation of a balanced-ternary (−, 0, +) half- and full-adder in LTspice, bridging non-binary logic theory to breadboarded hardware.',
    image: '/projects/alex-lab.jpg',
    tech: ['LTspice', 'Op-Amps', 'Breadboard', 'Balanced Ternary'],
    status: 'DRAFT',
    draft: true,
    aar: {
      right:   'Simulated truth tables matched theoretical balanced-ternary behavior across the full input space.',
      wrong:   'First analog level thresholds drifted with rail temperature; added reference clamping.',
      learned: 'Non-binary logic is limited less by theory than by analog noise budget and reference stability.',
    },
  },

  // ---------------------------------------------------------------------
  // NEW: FEA & Ring-Down Validation
  //
  // Draft entry — a natural extension of the vibration project's future
  // work ("Computational Validation: Predictive FEA model matched to
  // experimental ring-down"). Detail page scaffolded at
  // /projects/fea-validation.
  // ---------------------------------------------------------------------
  {
    id: 'fea-validation',
    title: 'FEA-Predicted Damping vs. Experimental Ring-Down',
    category: 'Simulation & Test',
    year: '2025',
    summary:
      'Building a predictive FEA model of the PCM-composite beam and correlating modal frequencies + damping ratios against measured ring-down curves.',
    image: '/projects/alex-thermals.jpg',
    tech: ['ANSYS / FEA', 'Modal Analysis', 'Python', 'MATLAB'],
    status: 'DRAFT',
    draft: true,
    aar: {
      right:   'Meshed geometry and material assignments captured the first two modes within 5% of measurement.',
      wrong:   'Initial linear damping model under-predicted amplitude decay at elevated temperature.',
      learned: 'Temperature-dependent loss factors are the bottleneck; simulation must inherit them from experiment.',
    },
  },
]
