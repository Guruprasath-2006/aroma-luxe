const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aroma-luxe');
    console.log('📦 Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// START: Add your services here following this structure
const engineeringServices = [
  // Example service structure (remove this comment block after understanding):
  // {
  //   title: 'Service Name',
  //   brand: 'Velan Engineering - Division Name',
  //   price: 0000,  // Price in dollars
  //   category: 'Mechanical',  // Options: Mechanical, Industrial, Consulting, Maintenance
  //   size: 'Service Package Type',  // e.g., Standard Package, Complete System, Per Unit
  //   description: 'Detailed description of the service...',
  //   rating: 4.5,  // Rating out of 5
  //   images: ['image_url_1', 'image_url_2'],  // At least 2 images
  //   stock: 10,  // Availability count
  //   featured: true,  // true or false
  //   discount: 0,  // Discount percentage (0-100)
  //   tags: ['tag1', 'tag2', 'tag3'],
  //   serviceDetails: {
  //     scope: ['item1', 'item2'],
  //     deliverables: ['item1', 'item2'],
  //     requirements: ['item1', 'item2']
  //   },
  //   duration: '1-2 Weeks',  // Options: 1-2 Days, 3-7 Days, 1-2 Weeks, 2-3 Weeks, 2-4 Weeks, 1-3 Months, 3-6 Months, Custom
  //   complexity: 'Intermediate',  // Options: Basic, Intermediate, Advanced, Expert
  //   projectType: ['Design', 'Installation'],  // Options: Design, Installation, Maintenance, Consulting, Inspection, All Types
  //   industry: ['Commercial', 'Manufacturing']  // Options: Manufacturing, Construction, Energy, Infrastructure, Commercial, Residential
  // },

  // Add your services below this line:
  
  {
    title: 'HVAC System Design & Installation',
    brand: 'Velan Engineering - Mechanical Division',
    price: 400,
    category: 'Mechanical',
    size: 'Per Sq.Ft',
    description: 'Complete HVAC system design and installation for commercial and residential buildings in Tamil Nadu. Includes load calculation, duct design, equipment selection, and energy-efficient solutions complying with ASHRAE standards. Chennai and Tamil Nadu pricing.',
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1621905252472-b5e24347c97c?w=800', 'https://images.unsplash.com/photo-1635699900341-d1b65e8b0f47?w=800'],
    stock: 12,
    featured: true,
    discount: 10,
    tags: ['HVAC', 'air conditioning', 'ventilation', 'mechanical'],
    serviceDetails: {
      scope: ['Load calculation', 'Duct design', 'Equipment sizing', 'Installation'],
      deliverables: ['HVAC drawings', 'Equipment list', 'Energy analysis', 'Commissioning report'],
      requirements: ['Building plans', 'Occupancy details', 'Budget']
    },
    duration: '2-4 Weeks',
    complexity: 'Advanced',
    projectType: ['Design', 'Installation'],
    industry: ['Commercial', 'Residential']
  },
  {
    title: 'Industrial Automation Solutions',
    brand: 'Velan Engineering - Industrial Division',
    price: 650000,
    category: 'Industrial',
    size: 'Complete System',
    description: 'End-to-end industrial automation solutions including PLC programming, SCADA systems, and HMI development. We specialize in Siemens, Allen Bradley, and Schneider Electric platforms for manufacturing and process industries in Tamil Nadu. Chennai market rates.',
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800', 'https://images.unsplash.com/photo-1581092160607-ee67f8d9e5e4?w=800'],
    stock: 8,
    featured: true,
    discount: 15,
    tags: ['automation', 'PLC', 'SCADA', 'industrial'],
    serviceDetails: {
      scope: ['PLC programming', 'SCADA development', 'Panel design', 'Installation & commissioning'],
      deliverables: ['Control logic', 'HMI screens', 'Control schematics', 'User manual'],
      requirements: ['Process flow diagram', 'I/O list', 'Site layout']
    },
    duration: '1-3 Months',
    complexity: 'Expert',
    projectType: ['Design', 'Installation'],
    industry: ['Manufacturing', 'Energy']
  },
  {
    title: 'Process Plant Design & Optimization',
    brand: 'Velan Engineering - Industrial Division',
    price: 1200000,
    category: 'Industrial',
    size: 'Enterprise Package',
    description: 'Complete process plant design including P&ID development, equipment layout, piping design, and process optimization. Specializing in chemical, pharmaceutical, and food processing industries in Tamil Nadu. Chennai and Coimbatore industrial pricing.',
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800', 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800'],
    stock: 5,
    featured: true,
    discount: 20,
    tags: ['process plant', 'P&ID', 'industrial design', 'optimization'],
    serviceDetails: {
      scope: ['Process flow diagrams', 'Equipment selection', 'Piping layout', 'Safety systems'],
      deliverables: ['P&ID drawings', '3D plant model', 'Equipment specifications', 'Safety report'],
      requirements: ['Process requirements', 'Site data', 'Production capacity']
    },
    duration: '3-6 Months',
    complexity: 'Expert',
    projectType: ['Design', 'Consulting'],
    industry: ['Manufacturing', 'Energy']
  },
  {
    title: 'Mechanical Systems Coordination',
    brand: 'Velan Engineering - Consulting Division',
    price: 185000,
    category: 'Consulting',
    size: 'Professional Service',
    description: 'Expert coordination of mechanical systems for construction projects in Tamil Nadu. BIM-based clash detection, MEP coordination, and constructability reviews to ensure seamless installation. Chennai market rates.',
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800'],
    stock: 15,
    featured: false,
    discount: 0,
    tags: ['coordination', 'BIM', 'MEP', 'consulting'],
    serviceDetails: {
      scope: ['BIM coordination', 'Clash detection', 'Shop drawing review', 'Site coordination'],
      deliverables: ['Coordination drawings', 'Clash reports', 'Construction documents'],
      requirements: ['Architectural plans', 'MEP drawings', 'BIM models']
    },
    duration: '2-4 Weeks',
    complexity: 'Advanced',
    projectType: ['Consulting'],
    industry: ['Construction', 'Infrastructure']
  },
  {
    title: 'Fire Protection System Design',
    brand: 'Velan Engineering - Mechanical Division',
    price: 280000,
    category: 'Mechanical',
    size: 'Safety Package',
    description: 'Comprehensive fire protection system design including sprinkler systems, fire alarm, smoke detection, and fire suppression systems. NFPA compliant designs for all building types in Tamil Nadu. Chennai safety standards.',
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1583266293702-a2a431734de4?w=800', 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800'],
    stock: 10,
    featured: true,
    discount: 0,
    tags: ['fire protection', 'sprinkler', 'fire safety', 'NFPA'],
    serviceDetails: {
      scope: ['Hydraulic calculations', 'Sprinkler layout', 'Fire alarm design', 'Compliance review'],
      deliverables: ['Fire protection drawings', 'Hydraulic calc sheets', 'Equipment schedules', 'Compliance report'],
      requirements: ['Building plans', 'Occupancy classification', 'Local codes']
    },
    duration: '2-3 Weeks',
    complexity: 'Advanced',
    projectType: ['Design'],
    industry: ['Commercial', 'Residential', 'Infrastructure']
  },
  {
    title: 'Energy Audit & Efficiency Consulting',
    brand: 'Velan Engineering - Consulting Division',
    price: 125000,
    category: 'Consulting',
    size: 'Standard Audit',
    description: 'Detailed energy audit and efficiency analysis for industrial and commercial facilities in Tamil Nadu. Identify savings opportunities, recommend energy-efficient upgrades, and provide ROI analysis. Chennai and Coimbatore rates.',
    rating: 4.6,
    images: ['https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800', 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800'],
    stock: 20,
    featured: false,
    discount: 10,
    tags: ['energy audit', 'efficiency', 'sustainability', 'consulting'],
    serviceDetails: {
      scope: ['Site survey', 'Energy analysis', 'Recommendations', 'ROI calculation'],
      deliverables: ['Audit report', 'Energy model', 'Savings analysis', 'Implementation plan'],
      requirements: ['Utility bills', 'Site access', 'Equipment data']
    },
    duration: '1-2 Weeks',
    complexity: 'Intermediate',
    projectType: ['Consulting', 'Inspection'],
    industry: ['Manufacturing', 'Commercial', 'Energy']
  },
  {
    title: 'Facility Maintenance Planning',
    brand: 'Velan Engineering - Maintenance Division',
    price: 95000,
    category: 'Maintenance',
    size: 'Annual Plan',
    description: 'Comprehensive facility maintenance planning and preventive maintenance program development for Tamil Nadu facilities. Includes equipment inventory, maintenance schedules, and CMMS implementation. Chennai market pricing.',
    rating: 4.5,
    images: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800'],
    stock: 25,
    featured: false,
    discount: 0,
    tags: ['maintenance', 'preventive maintenance', 'facility management', 'CMMS'],
    serviceDetails: {
      scope: ['Equipment inventory', 'Maintenance schedule', 'Procedure development', 'CMMS setup'],
      deliverables: ['Maintenance manual', 'PM schedules', 'Work procedures', 'CMMS database'],
      requirements: ['Facility layout', 'Equipment list', 'Maintenance history']
    },
    duration: '2-4 Weeks',
    complexity: 'Intermediate',
    projectType: ['Maintenance', 'Consulting'],
    industry: ['Commercial', 'Manufacturing', 'Infrastructure']
  },
  {
    title: 'Custom Door Design & Fabrication',
    brand: 'Velan Engineering - Design Studio',
    price: 25000,
    category: 'Mechanical',
    size: 'Per Unit',
    description: 'Custom door design and engineering for residential, commercial, and industrial applications. Includes structural calculations, material selection, hardware specifications, and fabrication drawings. Specializing in steel, aluminum, wood, and composite materials. Tamil Nadu standard pricing.',
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800'],
    stock: 30,
    featured: true,
    discount: 0,
    tags: ['door design', 'custom doors', 'fabrication', 'structural design'],
    serviceDetails: {
      scope: ['Door design', 'Structural calculations', 'Material selection', 'Hardware specs', 'Fabrication drawings'],
      deliverables: ['Design drawings', 'Structural calculations', 'Material specifications', 'Hardware list', 'Installation guide'],
      requirements: ['Opening dimensions', 'Building type', 'Usage requirements', 'Budget', 'Design preferences']
    },
    duration: '1-2 Weeks',
    complexity: 'Intermediate',
    projectType: ['Design'],
    industry: ['Residential', 'Commercial', 'Infrastructure']
  },
  {
    title: 'Window System Design & Engineering',
    brand: 'Velan Engineering - Design Studio',
    price: 8500,
    category: 'Mechanical',
    size: 'Per Unit',
    description: 'Complete window system design and engineering including frame calculations, glazing specifications, thermal analysis, and wind load calculations. Expertise in aluminum, UPVC, and steel window systems for all building types. Tamil Nadu market pricing.',
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800'],
    stock: 35,
    featured: true,
    discount: 5,
    tags: ['window design', 'glazing', 'thermal analysis', 'energy efficient'],
    serviceDetails: {
      scope: ['Window design', 'Structural analysis', 'Glazing selection', 'Thermal calculations', 'Detail drawings'],
      deliverables: ['Design drawings', 'Load calculations', 'Glazing specs', 'Thermal report', 'Installation details'],
      requirements: ['Wall opening size', 'Building location', 'Climate data', 'Energy requirements', 'Style preferences']
    },
    duration: '3-7 Days',
    complexity: 'Intermediate',
    projectType: ['Design'],
    industry: ['Residential', 'Commercial']
  },
  {
    title: 'Main Gate Design & Engineering',
    brand: 'Velan Engineering - Design Studio',
    price: 75000,
    category: 'Mechanical',
    size: 'Complete System',
    description: 'Comprehensive main gate design including structural engineering, automation system integration, and security features. Specializing in sliding gates, swing gates, and overhead gates for residential, commercial, and industrial properties. Tamil Nadu standard rates.',
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    stock: 15,
    featured: true,
    discount: 10,
    tags: ['gate design', 'automated gates', 'security', 'structural design'],
    serviceDetails: {
      scope: ['Gate design', 'Structural calculations', 'Automation integration', 'Security features', 'Foundation design'],
      deliverables: ['Design drawings', 'Structural calculations', 'Automation specs', 'Material list', 'Installation guide'],
      requirements: ['Site dimensions', 'Gate type preference', 'Security requirements', 'Automation needs', 'Budget']
    },
    duration: '2-3 Weeks',
    complexity: 'Advanced',
    projectType: ['Design', 'Installation'],
    industry: ['Residential', 'Commercial', 'Infrastructure']
  },
  {
    title: 'Commercial Roofing Systems',
    brand: 'Velan Engineering - Structural Division',
    price: 450,
    category: 'Mechanical',
    size: 'Per Sq.Ft',
    description: 'Complete roofing system design and engineering for commercial buildings including malls, warehouses, and office complexes. Expertise in steel structures, pre-engineered buildings, and long-span roofing solutions with waterproofing and insulation. Tamil Nadu construction rates.',
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'],
    stock: 8,
    featured: true,
    discount: 15,
    tags: ['commercial roofing', 'mall roofing', 'steel structure', 'pre-engineered buildings'],
    serviceDetails: {
      scope: ['Structural design', 'Roof layout', 'Load calculations', 'Drainage design', 'Waterproofing system', 'Insulation specs'],
      deliverables: ['Structural drawings', 'Load calculations', 'Material specifications', 'Waterproofing details', 'BOQ'],
      requirements: ['Building dimensions', 'Occupancy type', 'Local wind/snow loads', 'Budget', 'Timeline']
    },
    duration: '1-3 Months',
    complexity: 'Expert',
    projectType: ['Design', 'Installation'],
    industry: ['Commercial', 'Infrastructure']
  },
  {
    title: 'High-Rise Residential Roofing',
    brand: 'Velan Engineering - Structural Division',
    price: 350,
    category: 'Mechanical',
    size: 'Per Sq.Ft',
    description: 'Specialized high-rise residential roofing design and engineering for apartment buildings and luxury homes. Includes structural analysis, weather protection systems, and modern architectural roofing solutions with emphasis on durability and aesthetics. Chennai and Tamil Nadu pricing.',
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
    stock: 10,
    featured: true,
    discount: 10,
    tags: ['high-rise roofing', 'residential roofing', 'luxury homes', 'apartment buildings'],
    serviceDetails: {
      scope: ['Roof structural design', 'Weather protection', 'Terrace waterproofing', 'Parapet design', 'Aesthetic features'],
      deliverables: ['Structural drawings', 'Waterproofing details', 'Material specifications', 'Aesthetic renders', 'Maintenance guide'],
      requirements: ['Building height', 'Floor plans', 'Local climate data', 'Architectural style', 'Budget']
    },
    duration: '2-4 Weeks',
    complexity: 'Advanced',
    projectType: ['Design', 'Installation'],
    industry: ['Residential']
  },
  {
    title: 'Complete Home Window Package',
    brand: 'Velan Engineering - Design Studio',
    price: 285000,
    category: 'Mechanical',
    size: 'Full Home Package',
    description: 'Comprehensive full home window design, fabrication, and installation package for entire residential properties. Includes all windows with premium aluminum/UPVC frames, energy-efficient glazing, mosquito mesh, blinds, and complete installation. Suitable for 2-4 BHK homes in Tamil Nadu. Chennai market rates.',
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800', 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800'],
    stock: 15,
    featured: true,
    discount: 15,
    tags: ['full home windows', 'complete window package', 'residential windows', 'UPVC windows', 'aluminum windows'],
    serviceDetails: {
      scope: ['Complete home survey', 'All window design & engineering', 'Premium frame materials', 'Energy-efficient glazing', 'Mosquito mesh', 'Blinds/curtain systems', 'Professional installation', 'Waterproofing', 'Finishing work'],
      deliverables: ['Complete design drawings', 'Material specifications', 'Installation timeline', 'Warranty documents', 'Maintenance guide'],
      requirements: ['Home floor plans', 'Number of windows', 'Building type', 'Budget preferences', 'Design style']
    },
    duration: '2-4 Weeks',
    complexity: 'Advanced',
    projectType: ['Design', 'Installation'],
    industry: ['Residential']
  },
  {
    title: 'Complete Home Door Package',
    brand: 'Velan Engineering - Design Studio',
    price: 320000,
    category: 'Mechanical',
    size: 'Full Home Package',
    description: 'All-inclusive full home door solution covering main entrance, bedroom doors, bathroom doors, and interior doors. Includes security features, premium materials (wood/steel/fiber), hardware, locks, and professional installation. Perfect for complete home projects in Tamil Nadu. Chennai standard pricing.',
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800', 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800'],
    stock: 12,
    featured: true,
    discount: 12,
    tags: ['full home doors', 'complete door package', 'main door', 'interior doors', 'security doors'],
    serviceDetails: {
      scope: ['Complete home door survey', 'Main entrance design', 'All interior doors', 'Bathroom doors', 'Premium materials', 'Security locks & hardware', 'Door frames', 'Professional installation', 'Painting/finishing'],
      deliverables: ['Design drawings', 'Material catalog', 'Hardware specifications', 'Installation schedule', 'Warranty certificate'],
      requirements: ['Home layout', 'Number of doors', 'Material preferences', 'Security requirements', 'Budget']
    },
    duration: '2-3 Weeks',
    complexity: 'Advanced',
    projectType: ['Design', 'Installation'],
    industry: ['Residential']
  },
  {
    title: 'All-in-One Complete House Engineering Package',
    brand: 'Velan Engineering - Project Division',
    price: 1850000,
    category: 'Consulting',
    size: 'Complete Home Project',
    description: 'Ultimate full house engineering package covering ALL aspects - complete window systems, all doors (main + interior), roofing, structural reinforcement, HVAC, plumbing coordination, electrical coordination, fire safety, and energy efficiency. Turn-key solution for 2000-3000 sq.ft homes in Tamil Nadu. Chennai comprehensive pricing.',
    rating: 5.0,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    stock: 8,
    featured: true,
    discount: 20,
    tags: ['complete home project', 'full house engineering', 'turn-key solution', 'comprehensive package', 'home renovation'],
    serviceDetails: {
      scope: ['Complete architectural coordination', 'All windows design & installation', 'All doors design & installation', 'Roofing systems', 'Structural assessment', 'HVAC design & installation', 'Plumbing coordination', 'Electrical coordination', 'Fire safety systems', 'Energy efficiency audit', 'Interior finishes', 'Project management'],
      deliverables: ['Complete engineering drawings', 'All material specifications', 'Project timeline', 'Cost breakdown', 'Quality certifications', 'Warranty packages', 'Maintenance manual'],
      requirements: ['Complete home plans', 'Site location', 'Current condition assessment', 'Budget range', 'Timeline expectations']
    },
    duration: '3-6 Months',
    complexity: 'Expert',
    projectType: ['Design', 'Installation', 'Consulting', 'All Types'],
    industry: ['Residential']
  },
  {
    title: 'Complete Office Window Package',
    brand: 'Velan Engineering - Commercial Division',
    price: 485000,
    category: 'Mechanical',
    size: 'Full Office Package',
    description: 'Professional commercial office window solution for complete office spaces (3000-5000 sq.ft). Premium aluminum curtain wall systems, sound-proof glazing, UV protection, energy-efficient design, and modern aesthetics. Perfect for corporate offices, co-working spaces, and business centers in Tamil Nadu. Chennai commercial rates.',
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'],
    stock: 10,
    featured: true,
    discount: 12,
    tags: ['office windows', 'commercial windows', 'curtain wall', 'soundproof glazing', 'corporate office'],
    serviceDetails: {
      scope: ['Office space survey', 'Commercial window design', 'Curtain wall systems', 'Sound & thermal insulation', 'UV protection glazing', 'Motorized blinds', 'Professional installation', 'Safety compliance', 'Warranty coverage'],
      deliverables: ['Commercial design drawings', 'Energy performance analysis', 'Material specifications', 'Installation plan', 'Safety certificates'],
      requirements: ['Office floor plan', 'Building type', 'Floor level', 'Acoustic requirements', 'Budget allocation']
    },
    duration: '3-6 Weeks',
    complexity: 'Advanced',
    projectType: ['Design', 'Installation'],
    industry: ['Commercial']
  },
  {
    title: 'Complete Office Door Package',
    brand: 'Velan Engineering - Commercial Division',
    price: 425000,
    category: 'Mechanical',
    size: 'Full Office Package',
    description: 'Comprehensive office door solution including main entrance, conference room doors, cabin doors, fire-rated doors, and emergency exits. Features access control integration, fire safety compliance, sound insulation, and professional aesthetics. Ideal for 3000-5000 sq.ft offices in Tamil Nadu. Chennai corporate pricing.',
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'],
    stock: 8,
    featured: true,
    discount: 10,
    tags: ['office doors', 'commercial doors', 'fire rated doors', 'access control', 'corporate entrance'],
    serviceDetails: {
      scope: ['Complete office door planning', 'Main entrance design', 'Conference room doors', 'Cabin doors', 'Fire-rated doors', 'Emergency exits', 'Access control integration', 'Soundproofing', 'Professional installation', 'Compliance certification'],
      deliverables: ['Design drawings', 'Fire safety certificates', 'Access control specs', 'Installation schedule', 'Warranty documentation'],
      requirements: ['Office layout', 'Number of rooms', 'Fire safety requirements', 'Access control needs', 'Budget']
    },
    duration: '2-4 Weeks',
    complexity: 'Advanced',
    projectType: ['Design', 'Installation'],
    industry: ['Commercial']
  },
  {
    title: 'All-in-One Complete Office Engineering Package',
    brand: 'Velan Engineering - Commercial Division',
    price: 2850000,
    category: 'Consulting',
    size: 'Complete Office Project',
    description: 'Ultimate comprehensive office engineering solution covering complete window systems, all doors, false ceiling, HVAC system design & installation, electrical systems, network cabling, fire safety, access control, security systems, and interior finishes. Complete turn-key solution for 4000-6000 sq.ft corporate offices in Tamil Nadu. Premium Chennai corporate rates.',
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'],
    stock: 5,
    featured: true,
    discount: 18,
    tags: ['complete office project', 'office fit-out', 'turn-key office', 'corporate package', 'office renovation'],
    serviceDetails: {
      scope: ['Complete architectural planning', 'All windows & curtain walls', 'All doors & partitions', 'False ceiling systems', 'Complete HVAC solution', 'Electrical systems', 'Network & data cabling', 'Fire safety systems', 'Access control & security', 'Lighting design', 'Interior finishes', 'Furniture coordination', 'Project management', 'Compliance certification'],
      deliverables: ['Complete engineering drawings', 'MEP designs', 'Material specifications', 'Project timeline', 'Cost breakdown', 'Quality certifications', 'Warranty packages', 'Operations manual'],
      requirements: ['Office space dimensions', 'Employee capacity', 'Department layout', 'IT requirements', 'Budget allocation', 'Timeline']
    },
    duration: '3-6 Months',
    complexity: 'Expert',
    projectType: ['Design', 'Installation', 'Consulting', 'All Types'],
    industry: ['Commercial']
  },
  {
    title: 'Luxury Villa Complete Engineering Package',
    brand: 'Velan Engineering - Luxury Division',
    price: 3500000,
    category: 'Consulting',
    size: 'Luxury Villa Project',
    description: 'Premium luxury villa engineering package for high-end residential properties (4000-8000 sq.ft). Includes designer windows & doors, smart home integration, central HVAC, swimming pool systems, landscape lighting, security systems, home automation, and premium finishes. Elite solution for luxury villas in Chennai and Tamil Nadu.',
    rating: 5.0,
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    stock: 3,
    featured: true,
    discount: 15,
    tags: ['luxury villa', 'smart home', 'premium package', 'home automation', 'high-end residential'],
    serviceDetails: {
      scope: ['Premium architectural design', 'Designer windows & doors', 'Smart home integration', 'Central HVAC with zones', 'Swimming pool systems', 'Home theater engineering', 'Landscape lighting', 'Security & surveillance', 'Home automation', 'Energy management', 'Premium finishes', 'Luxury fittings'],
      deliverables: ['Complete design package', 'Smart home specifications', 'All engineering drawings', 'Automation programming', 'Premium material catalog', 'Project management', 'Lifetime support'],
      requirements: ['Villa plans', 'Plot details', 'Luxury preferences', 'Smart home requirements', 'Budget range']
    },
    duration: '6-12 Months',
    complexity: 'Expert',
    projectType: ['Design', 'Installation', 'Consulting', 'All Types'],
    industry: ['Residential']
  },
  {
    title: 'Small Business Complete Setup Package',
    brand: 'Velan Engineering - SME Division',
    price: 650000,
    category: 'Consulting',
    size: 'Small Office Package',
    description: 'Budget-friendly complete engineering package for small businesses, startups, and retail shops (500-1500 sq.ft). Covers basic window & door solutions, lighting, basic HVAC, electrical setup, signage support, and essential finishes. Perfect starter package for small businesses in Tamil Nadu. Affordable Chennai pricing.',
    rating: 4.6,
    images: ['https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    stock: 20,
    featured: true,
    discount: 10,
    tags: ['small business', 'startup office', 'retail shop', 'budget package', 'SME solution'],
    serviceDetails: {
      scope: ['Space planning', 'Basic windows & doors', 'LED lighting', 'Split AC installation', 'Electrical wiring', 'False ceiling (basic)', 'Painting & finishes', 'Signage mounting support', 'Basic network setup'],
      deliverables: ['Simple layout plan', 'Material list', 'Electrical drawings', 'Installation schedule', 'Basic warranty'],
      requirements: ['Shop/office dimensions', 'Business type', 'Basic requirements', 'Budget constraints', 'Timeline']
    },
    duration: '2-3 Weeks',
    complexity: 'Intermediate',
    projectType: ['Design', 'Installation'],
    industry: ['Commercial']
  },
  {
    title: 'Industrial Facility Complete Engineering',
    brand: 'Velan Engineering - Industrial Division',
    price: 4500000,
    category: 'Industrial',
    size: 'Industrial Facility',
    description: 'Comprehensive industrial facility engineering package for manufacturing units, warehouses, and processing plants (10,000+ sq.ft). Includes industrial doors & windows, ventilation systems, fire safety, electrical distribution, crane support structures, and compliance certification. Complete solution for industrial facilities in Tamil Nadu.',
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'],
    stock: 4,
    featured: true,
    discount: 12,
    tags: ['industrial facility', 'manufacturing unit', 'warehouse', 'factory setup', 'industrial engineering'],
    serviceDetails: {
      scope: ['Industrial layout planning', 'Heavy-duty doors & windows', 'Industrial ventilation', 'Fire safety systems', 'Electrical distribution', 'Crane support structures', 'Material handling systems', 'Safety compliance', 'Process utilities', 'Effluent systems coordination'],
      deliverables: ['Complete engineering drawings', 'Load calculations', 'Fire safety designs', 'Compliance certificates', 'Factory layout', 'Safety manual'],
      requirements: ['Facility dimensions', 'Manufacturing process', 'Load requirements', 'Safety standards', 'Budget allocation']
    },
    duration: '6-12 Months',
    complexity: 'Expert',
    projectType: ['Design', 'Installation', 'Consulting', 'All Types'],
    industry: ['Manufacturing', 'Energy']
  },
  {
    title: 'Multi-Story Building Complete Engineering',
    brand: 'Velan Engineering - Infrastructure Division',
    price: 8500000,
    category: 'Consulting',
    size: 'Complete Building Project',
    description: 'Comprehensive multi-story building engineering package for apartments, commercial complexes, and mixed-use developments (G+5 to G+15). Includes all MEP systems, facade engineering, elevators coordination, fire safety, structural coordination, and project management. Complete solution for builders and developers in Tamil Nadu.',
    rating: 5.0,
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'],
    stock: 2,
    featured: true,
    discount: 15,
    tags: ['multi-story building', 'apartment complex', 'MEP services', 'building engineering', 'construction project'],
    serviceDetails: {
      scope: ['Complete MEP design', 'Facade engineering', 'HVAC systems', 'Plumbing systems', 'Electrical distribution', 'Fire safety systems', 'Elevator coordination', 'Structural coordination', 'BIM coordination', 'Authority approvals', 'Project management', 'Quality control'],
      deliverables: ['Complete MEP drawings', 'Facade designs', 'BIM models', 'Compliance certificates', 'Project schedule', 'Quality reports', 'Handover documentation'],
      requirements: ['Building plans', 'Number of floors', 'Units layout', 'Developer requirements', 'Authority norms', 'Budget']
    },
    duration: '12-24 Months',
    complexity: 'Expert',
    projectType: ['Design', 'Installation', 'Consulting', 'All Types'],
    industry: ['Construction', 'Infrastructure', 'Commercial', 'Residential']
  },
  {
    title: 'Lever Handle Stairs Stainless Steel Staircase Railing',
    brand: 'Velan Engineering - Fabrication Division',
    price: 799,
    category: 'Mechanical',
    size: 'Per Sq.Ft',
    description: 'Premium quality stainless steel staircase railing system with lever handle design. Made from SS304/SS316 grade stainless steel with mirror or satin finish. Includes handrails, balustrades, and lever handles. Perfect for residential, commercial, and industrial applications in Tamil Nadu. Customizable design with expert installation.',
    rating: 4.7,
    images: ['/images/lever-handle-railing.jpg', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
    stock: 25,
    featured: true,
    discount: 12,
    tags: ['staircase railing', 'stainless steel', 'lever handle', 'SS railing', 'balustrade'],
    serviceDetails: {
      scope: ['Site measurement', 'Custom design', 'SS fabrication', 'Surface finishing', 'Installation', 'Quality inspection'],
      deliverables: ['Design drawings', 'Material specifications', 'Installation guide', 'Warranty certificate'],
      requirements: ['Staircase dimensions', 'Height requirements', 'Finish preference', 'Load specifications']
    },
    duration: '2-3 Weeks',
    complexity: 'Intermediate',
    projectType: ['Design', 'Installation'],
    industry: ['Residential', 'Commercial', 'Infrastructure']
  }
];

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing services');
    
    // Insert engineering services
    await Product.insertMany(engineeringServices);
    
    console.log('✅ Engineering services added successfully!');
    console.log(`📊 Total services: ${engineeringServices.length}`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
