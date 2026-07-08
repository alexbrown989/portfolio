// src/content/projects.js
//
// Single source of truth for the project catalog. Order here is the order on
// the Projects grid. `id` is used both by the router (/projects/<id>) and by
// the Projects grid's prefetch map — keep them in sync with App.jsx.
//
// Statuses: ACTIVE | DEPLOYED | COMPLETED | DRAFT | 'R&D'
//
// Schema per project:
//   { id, title, category, year, summary, image, tech, status,
//     video? / youtube? / stl?,
//     star?:      { situation, task, actions[], results[] },
//     aar?:       { right, wrong, learned },
//     downloads?: [ { label, href, description?, type? } ],
//     ...page-specific extras }
//
// Drop artifacts (PDF drawings, inspection logs, design reviews) into
// /public/projects/downloads/ and reference them via `downloads`. The
// Multi-Tool and Gearbox pages already render the Downloads block; the
// generic ProjectDetail page renders it in the aside.

export const projects = [
  // ---------------------------------------------------------------------
  // Aerospace-adjacent hands-on manufacturing project.
  // Leading the grid because it maps directly onto the aerospace / defense
  // manufacturing roles the internship at Verus is pointed at.
  // ---------------------------------------------------------------------
  {
    id: 'multitool',
    title: 'Folding Multi-Tool: Machining & Inspection',
    category: 'Manufacturing',
    year: 'Mar – Jun 2026',
    summary:
      'Fabricated a functional folding multi-tool from raw aluminum using manual mill + CNC operations. Held ±0.005 in precision dimensions, 0.003 in parallelism, and 0.002 in flatness against GD&T drawings; inspected and recorded every feature against the print.',
    image: '/projects/multitool-final.jpg',
    // TODO(alex): drop these into /public/projects/
    //   multitool-final.jpg      — final assembled multi-tool photo
    //   multitool-cnc-1.mp4      — CNC video #1
    //   multitool-cnc-2.mp4      — CNC video #2
    //   multitool-inspection.jpg — (optional) inspection setup / spreadsheet
    tech: ['Manual Mill', 'CNC', 'GD&T', 'Metrology', 'DFM'],
    status: 'COMPLETED',
    star: {
      situation:
        'Manufacturing course project: take a set of engineering drawings for a folding multi-tool and produce a functional, articulated assembly using production-realistic equipment and inspection practice.',
      task:
        'Machine every mating aluminum part (arms, jaws, pivot features, bottle-opener geometry) to the drawing’s GD&T requirements, verify each feature with proper metrology, and integrate everything into a working articulated assembly.',
      actions: [
        'Planned order of operations, fixturing, and inspection strategy for each part before touching a machine.',
        'Ran manual-mill and CNC operations to translate engineering drawings into physical hardware.',
        'Machined components to drawing requirements: ±0.010 in general, ±0.005 in precision, 0.003 in parallelism, 0.002 in flatness.',
        'Verified jaw and arm features against print requirements: hole size, thickness, profile, flatness, parallelism, symmetry, and positional tolerances.',
        'Inspected finished parts with calipers, gauges, and dial indicators; recorded measurements in a spreadsheet to compare actual dimensions against specified tolerances.',
        'Integrated pivots, bushings, spacers, and fasteners into an articulated assembly and validated alignment, fit, movement, and function.',
      ],
      results: [
        'Delivered a working folding multi-tool that met all dimensional and GD&T requirements in the print.',
        'Built practical fluency in manufacturing process planning, GD&T interpretation, tolerance control, and inspection strategy.',
        'Direct hands-on experience with machinist communication and design-for-manufacturability, the exact skill stack used every day at my Verus Aerospace internship.',
      ],
    },
    aar: {
      right:   'Process planning up front (op order + fixturing + inspection) kept fabrication predictable and repeatable.',
      wrong:   'Underestimated setup time on the first precision op; had to re-fixture to hold flatness within 0.002 in.',
      learned: 'Machining is a communication problem as much as a mechanical one. The drawing and the operator are one system.',
    },
  },

  // ---------------------------------------------------------------------
  // Small-team mechanical design project.
  // Ships alongside the multi-tool as a paired manufacturing + design story.
  // ---------------------------------------------------------------------
  {
    id: 'gearbox',
    title: 'Robotic Elbow: Reduction Gearbox Design',
    category: 'Mechanical Design',
    year: 'Mar – Apr 2026',
    summary:
      'Small-team design of a shaft reduction gearbox for a 1-DOF robotic elbow under a quarter-long deadline: gear ratio and shaft sizing, bearing selection, tolerance stack-up, and live CAD assembly management up to design review.',
    image: '/projects/gearbox-render.jpg',
    // TODO(alex): drop these into /public/projects/
    //   gearbox-render.jpg   — final CAD render / exploded view
    //   gearbox-cad-1.jpg    — CAD assembly screenshot #1
    //   gearbox-cad-2.jpg    — CAD assembly screenshot #2
    //   gearbox-review.jpg   — (optional) design review artifacts
    tech: ['SolidWorks', 'Gear Design', 'Tolerance Stack-Up', 'GD&T', 'Design Reviews'],
    status: 'COMPLETED',
    star: {
      situation:
        'Quarter-long, small-team mechanical design project: build a shaft reduction gearbox to drive a 1-DOF robotic elbow joint, under a fixed deadline with multiple design-review checkpoints.',
      task:
        'Own a slice of a real mechanical-systems design cycle: from spec to calc to CAD to design review, coordinating with teammates to land on a manufacturable, assemblable gearbox that meets the joint’s torque and speed requirements.',
      actions: [
        'Developed and maintained a live CAD assembly to validate shaft alignment, gear placement, bearing fitment, fastener access, and motion clearance before final submission.',
        'Performed mechanical design calculations: gear-ratio selection, torque transmission, shaft sizing, bearing selection, keyway considerations, and load verification.',
        'Applied tolerance stack-up analysis, clearance / interference-fit calculations, and GD&T principles to improve manufacturability, assembly repeatability, and backlash control.',
        'Coordinated with teammates on CAD conventions, design reviews, and division of deliverables under a quarter-long deadline.',
        'Participated in design reviews to identify mechanical interferences, resolve assembly constraints, and pressure-test whether the gearbox could realistically be fabricated, assembled, and inspected.',
      ],
      results: [
        'Delivered a design-review-approved gearbox assembly with a validated interface story: shafts, gears, bearings, fasteners, and clearances all accounted for.',
        'Strengthened practical understanding of power transmission, live assembly management, DFM, and deadline-driven team execution. That discipline transfers into every production mechanical-design role.',
      ],
    },
    aar: {
      right:   'Working the tolerance stack-up early exposed a fit problem before it became a fabrication problem.',
      wrong:   'Initial fastener access was tight in one quadrant of the housing. Caught in review, fixed before submission.',
      learned: 'A live CAD assembly is a team communication tool, not just a modeling tool.',
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
    star: {
      situation:
        'Personal R&D platform for autonomous systems: needed a repeatable, dual-axis actuation stack that could host future LiDAR / vision payloads.',
      task:
        'Design, fabricate, and validate a multi-part robotic turret that hits stable articulation, is serviceable in printed parts, and exposes a control interface open enough for sensor fusion later.',
      actions: [
        'Designed a multi-part SolidWorks assembly with press-fit servo mounts and a stabilized dual-axis gimbal.',
        'Fabricated nine printed parts via FDM; modular so components can be re-printed or upgraded individually.',
        'Wrote NodeMCU + Arduino embedded C++ for servo motion profiles, angular limits, and randomized scan cadence.',
        'Measured angular repeatability over 100 cycles to establish a real baseline number, not a marketing claim.',
      ],
      results: [
        '0.8° angular repeatability (σ) over 100 cycles at ±45° per axis.',
        'Serviceable, upgradeable platform ready for LiDAR + vision integration, on-board perception, and ROS migration.',
      ],
    },
    aar: {
      right:   'Mechanics achieve stable articulation with tight fits.',
      wrong:   'Early tolerances drifted; iterated to production-fit.',
      learned: 'Rapid prototyping + tolerance stack-up analysis is essential.',
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
    star: {
      situation:
        'Open question in composites: can a phase-change material like beeswax, embedded in an epoxy matrix, be thermally triggered into a near-critically damped state on demand?',
      task:
        'Build the whole loop yourself: novel composite matrix, a high-rigidity test apparatus that does not lie to the sensor, and a measurement pipeline that actually proves (or disproves) the hypothesis.',
      actions: [
        'Designed an 8-sample matrix isolating epoxy, beeswax (PCM), and graphite (conductive filler) contributions.',
        'Designed a monolithic SolidWorks test rig; iterated through three failure modes before an adaptable open-channel clamp fixed real-world sample variance without introducing joint flex.',
        'Instrumented ring-down capture with Arduino + piezo + oscilloscope for repeatable modal decay measurement.',
      ],
      results: [
        '~10× increase in damping factor in the heated PCM composite versus control.',
        'Achieved near-critical damping state on thermal trigger, validating the core hypothesis.',
        '±0.1 mm fabrication tolerance and < $500 total prototype cost.',
      ],
    },
    aar: {
      right:   'Adaptable clamp corrected specimen variance; data capture stabilized.',
      wrong:   'Over-rigid initial clamp amplified error; re-engineered for compliance.',
      learned: 'Design for tolerances first; instrument the truth second.',
    },
  },
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
    star: {
      situation:
        'Critical Pacific-island infrastructure ($45M+ exposure on Saipan) sits inside active erosion corridors, and no defensible lab-scale pipeline existed to quantify wave–coast interaction for that specific geometry.',
      task:
        'Build a physical modelling pipeline (DEM → scale-fidelity print → tank-ready model → PIV analysis) that produces measurable, publishable coastal-defense insight for Saipan.',
      actions: [
        'Processed bathymetry / coastal elevation in MATLAB to preserve slope fidelity through scale reduction.',
        '3D-printed the Saipan geometry at 0.2 mm layer height to preserve shoreline curvature.',
        'Designed and validated a novel polka-dot Visual Field Architecture background that measurably improved PIV particle correlation.',
        'Ran tank campaigns under Froude-similar wave conditions; cross-checked PIV vectors against manual particle tracks.',
      ],
      results: [
        '~40% improvement in PIV measurement accuracy versus baseline background.',
        '↓ 37% wave energy at shoreline · ↓ 42% coastal vorticity magnitude · 3 high-risk zones identified.',
        'Reproducible framework that extends to additional Pacific sites.',
      ],
    },
    aar: {
      right:   'Polka-dot VFA significantly improved particle tracking & vector quality.',
      wrong:   'Initial prints warped; redesigned internal ribs and supports.',
      learned: 'Physical validation is non-negotiable. CFD must meet the tank.',
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
    star: {
      situation:
        'Elastin manages energy through entropy changes in its hydration shell, absorbing and releasing heat during reversible structural transitions without active metabolism. That principle has not been formalized as a materials-engineering framework.',
      task:
        'Propose and defend BET-H (Biological Elastin Thermoregulation): a design framework that abstracts elastin’s entropy behavior into passive thermal systems built from PCM, graphite, carbon black, and copper.',
      actions: [
        'Extracted the thermodynamic principle from biology (abstraction, not imitation) into a material-driven thermoregulation model.',
        'Built out the material stack: PCM (~247 kJ/kg latent heat), graphite (~4300 W/m·K in-plane), carbon black (~98% solar absorption), copper (~400 W/m·K isotropic).',
        'Ran conceptual application studies (EV battery thermal buffer, solar roofing system, Stirling dissipator) to pressure-test the framework across use cases.',
      ],
      results: [
        'Documented framework with defensible material properties and four conceptual applications.',
        'Clear next-step research plan: interface-loss characterization, durability testing, and instrumented prototypes.',
      ],
    },
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
    star: {
      situation:
        'U.S. micromobility programs promise equity but rarely translate that promise into concrete engineering requirements. That gap kills adoption for the exact populations the programs claim to serve.',
      task:
        'Co-author a peer-reviewed study that quantifies the equity gap across 250+ U.S. programs and turns each finding into a testable engineering constraint for inclusive vehicle design.',
      actions: [
        'Systematically decoded hundreds of municipal documents into 4,000+ analytical codes in Dedoose.',
        'Quantified four equity dimensions (physical accessibility, financial inclusion, digital access, system integration) across the national program landscape.',
        'Translated each gap into a specific hardware / policy requirement: adaptive frames, cash / SMS unlock, offline failsafes, transit interoperability.',
      ],
      results: [
        '29.0% adaptive-vehicle incentive rate · 48.8% unbanked payment support · 42.4% smartphone-free access: a quantitative baseline the field previously lacked.',
        'A concrete constraint set that engineering teams can build against, not a wishlist.',
      ],
    },
  },
]
