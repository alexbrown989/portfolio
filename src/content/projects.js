// Top projects with AAR. Replace images in /public/projects.
export const projects = [
  
  {
    id: 'coastal',
    title: 'Coastal Wave Dynamics & Seawall Design',
    summary:
      'Scaled Saipan geometry on a hydraulic bench with custom VFA; improved PIV accuracy by ~40% to quantify flow fields and overtopping.',
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
    summary:
      'Custom SolidWorks test rig, DFAM parts, Arduino + piezo + oscilloscope to measure frequency/damping across a temperature sweep.',
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
    summary:
      'Elastin-inspired passive thermal regulation using PCM, carbon black, graphite, and copper. Zero-energy design concepts for infrastructure-limited settings.',
    image: '/projects/beth.png',
    tech: ['Thermo', 'PCM', 'Graphite', 'Carbon Black'],
    status: 'ACTIVE',
    aar: {
      right:   'Latent capacity confirmed; architecture aligns with passive operation goals.',
      wrong:   'Early models over-idealized conduction; added anisotropy & interface losses.',
      learned: 'Interfaces dominate performance; geometry & contact are king.',
    },
  },
  {
    id: 'micromobility',
    title: 'Equitable Micromobility Study (Co-Author)',
    category:'Urban Systems',
    summary:'Translating equity policies into engineering constraints (range, frame design, terrain) across 250+ U.S. programs.',
    image: '/projects/micro.jpg',
    tech: ['Dedoose', 'MATLAB', 'Policy Analysis', 'UX Requirements'],
    status: 'ACTIVE',
  },
]
