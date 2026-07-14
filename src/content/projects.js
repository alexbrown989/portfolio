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
    imageFolded: '/projects/multitool-final-folded.jpg',
    thumb: '/projects/thumbs/multitool.jpg',
    videoCnc: '/projects/cnc-compressed.mp4',
    videoMill: '/projects/milling-compressed.mp4',
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
        'Proven skill set — process planning: order-of-operations, fixturing, and inspection strategy planned before touching a machine.',
        'Proven skill set — manual + CNC machining: comfortable moving between manual mill and CNC for the right operation on the right feature.',
        'Proven skill set — GD&T interpretation: read a full drawing package and translate flatness / parallelism / position callouts into machining strategy.',
        'Proven skill set — metrology: calipers, pin gauges, dial indicators, and granite surface used to prove parts against the print.',
        'Proven skill set — assembly integration: pivots, bushings, spacers, and fasteners integrated into an articulated assembly that actually works.',
        'Proven skill set — DFM communication: iterated with machinist feedback on tolerances and features that were expensive or fragile to produce.',
        'Direct rehearsal for the aerospace-manufacturing skill stack used every day at my Verus Aerospace internship.',
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
    title: 'Three-Stage Reduction Gearbox · Robotic Elbow',
    category: 'Mechanical Design',
    year: 'Mar – Apr 2026',
    summary:
      'Quarter-long small-team design of a three-stage spur-gear reduction for a 1-DOF robotic elbow. 4000 → 50 RPM, 2.11 → 169 lb-in, full AGMA 2001-D04 bending-stress analysis, mixed 4140-steel / 6061-T6-aluminum stack, design-review-approved.',
    image: '/projects/gearbox-render.jpg',
    thumb: '/projects/thumbs/gearbox.jpg',
    // STL assembly viewer lands when /models/gearbox.stl is uploaded.
    stl: null,
    tech: ['SolidWorks', 'AGMA 2001-D04', 'Spur Gears', 'Tolerance Stack-Up', 'GD&T'],
    status: 'COMPLETED',
    star: {
      situation:
        'Quarter-long small-team mechanical design project: build a shaft reduction gearbox to drive a 1-DOF robotic elbow. Input 4000 RPM, output target 50 RPM, real design-review checkpoints and full AGMA analysis expected.',
      task:
        'Own a slice of a real mechanical-systems design cycle from spec to calc to CAD to review. Deliver a manufacturable three-stage spur-gear reduction that meets the joint\'s torque and speed requirements.',
      actions: [
        'Designed a three-stage spur-gear reduction (5.0 × 4.0 × 4.0 = 80:1) between an input pinion and a terminal output gear, all at 20° pressure angle per AGMA 2001-D04.',
        'Ran the AGMA bending-stress analysis on every gear: Lewis form factor, tangential force from stage torque and pitch diameter, dynamic factor Kv, load-distribution Km, and factor of safety against material fatigue.',
        'Chose materials per-gear against the stress budget: 4140 steel for the loaded pinions and terminal output, 6061-T6 aluminum for lighter driven gears.',
        'Developed and maintained a live CAD assembly to validate shaft alignment, gear placement, bearing fitment, and fastener access ahead of the final review.',
        'Applied tolerance stack-up analysis, clearance / interference-fit calculations, and GD&T principles to control backlash and keep the assembly buildable.',
      ],
      results: [
        'Design-review-approved gearbox delivering 169.04 lb-in at 50 RPM from a 2.11 lb-in / 4000 RPM input.',
        'Every gear passes AGMA bending FoS ≥ 2.3, with the terminal output G6 sitting closest to the limit (FoS 2.30) and G1 the highest margin at 15.04.',
        'Full analysis package: kinematics table, tangential + radial force per stage, per-gear stress, FoS, and material assignments — ready for a manufacturability review.',
      ],
    },
    aar: {
      right:   'Working the AGMA analysis in parallel with the CAD kept material choices honest — 4140 vs 6061 wasn\'t vibes, it was stress budget.',
      wrong:   'Initial fastener access was tight in one quadrant of the housing. Caught in review, fixed before submission.',
      learned: 'A live CAD assembly is a team communication tool, not just a modeling tool. The AGMA worksheet is the same idea for the calculations.',
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
      'Speculative framework: passive thermal regulation inspired by elastin\'s entropy-driven behavior in nature. Concept-level here; technical depth held back while the work is in progress.',
    image: '/projects/beth.png',
    tech: ['Thermodynamics', 'Materials', 'Bio-inspired'],
    status: 'R&D',
    star: {
      situation:
        'Elastin manages thermal energy through reversible structural transitions in its hydration shell. That principle has not been formalized as a general materials-engineering framework.',
      task:
        'Propose and defend BET-H (Biological Elastin Thermoregulation): a design framework that abstracts elastin\'s entropy behavior into passive thermal systems, without publishing proprietary detail while the work is in progress.',
      actions: [
        'Extracted the thermodynamic principle from biology into a material-driven thermoregulation model (abstraction, not imitation).',
        'Scoped a small stack of common engineering materials that together deliver an absorb-store-release cycle without a control loop.',
        'Pressure-tested the concept across a short list of use cases to check whether the framework generalizes.',
      ],
      results: [
        'Documented framework, held at concept-level on the public site; technical depth reserved for private conversation.',
        'Clear next-step research plan: interface-loss characterization, durability testing, and instrumented prototypes.',
      ],
    },
    aar: {
      right:   'Concept holds together on paper; framework generalizes across at least three use cases.',
      wrong:   'Early models over-idealized conduction; added anisotropy and interface losses.',
      learned: 'Interfaces dominate performance. Geometry and contact are king.',
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
