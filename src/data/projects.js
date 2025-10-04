export const projectsData = [
  {
    id: 1,
    title: "BET-H Thermal Management System",
    category: "Thermal Engineering",
    description: "Advanced battery cooling system using phase change materials",
    image: "/projects/beth.jpg",
    tech: ["ANSYS Fluent", "MATLAB", "Arduino", "PCM"],
    metrics: {
      efficiency: "+15% cooling",
      cost: "-20% operational",
      weight: "12kg system"
    },
    aar: {
      right: "PCM integration reduced peak temperatures by 15°C",
      wrong: "Initial sensor array created dead zones",  
      learned: "Distributed sensing critical for thermal mapping"
    }
  },
  {
    id: 2,
    title: "Coastal Erosion Dynamics",
    category: "Fluid Dynamics",
    description: "PIV analysis of sediment transport in wave conditions",
    image: "/projects/coastal.jpg",
    tech: ["PIV System", "MATLAB", "OpenFOAM", "Python"],
    metrics: {
      accuracy: "±2mm resolution",
      dataset: "10TB captured",
      models: "3 validated"
    },
    aar: {
      right: "Multi-angle PIV captured vortex formations",
      wrong: "Underestimated data storage needs",
      learned: "Real-time processing saves 70% storage"
    }
  },
  {
    id: 3,
    title: "Vibration Test Rig",
    category: "Structural Dynamics",
    description: "6-DOF vibration testing platform for component validation",
    image: "/projects/vibration.jpg",
    tech: ["SolidWorks", "LabVIEW", "Modal Analysis", "FEA"],
    metrics: {
      frequency: "0.1-10kHz",
      acceleration: "±50g",
      precision: "0.01mm"
    },
    aar: {
      right: "Modular design allows quick reconfiguration",
      wrong: "Initial damping system overdamped",
      learned: "Variable damping essential for wide frequency range"
    }
  }
]