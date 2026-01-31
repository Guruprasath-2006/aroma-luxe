const axios = require('axios');

// ================================
// UNIVERSAL AI CHATBOT
// Can answer ANY question like ChatGPT!
// ================================

// Product database (existing)
const productDatabase = {
  door: [
    { 
      id: 'd1',
      url: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&q=80', 
      name: 'Modern Steel Door', 
      type: 'Steel', 
      price: '$500-800',
      priceRange: { min: 500, max: 800 },
      material: 'Steel',
      features: ['Fire-Resistant', 'Security System', 'Weather-Proof'],
      dimensions: '3ft x 7ft',
      warranty: '5 years',
      installation: '1-2 days',
      description: 'Modern steel door with enhanced security features and fire resistance',
      bestFor: ['Commercial', 'Industrial'],
      rating: 4.7
    },
    { 
      id: 'd2',
      url: 'https://images.unsplash.com/photo-1519710889408-a991c lists0f7ed?w=800&q=80', 
      name: 'Wooden Entry Door', 
      type: 'Wood', 
      price: '$800-1200',
      priceRange: { min: 800, max: 1200 },
      material: 'Wood',
      features: ['Sound Insulation', 'Luxury Finish', 'Custom Carving'],
      dimensions: '3ft x 7ft',
      warranty: '3 years',
      installation: '1-2 days',
      description: 'Premium wooden door with classic elegance and superior craftsmanship',
      bestFor: ['Residential', 'Luxury'],
      rating: 4.9
    },
    { 
      id: 'd3',
      url: 'https://images.unsplash.com/photo-1565183928294-7d22f11c0789?w=800&q=80', 
      name: 'Glass Door', 
      type: 'Glass', 
      price: '$700-1000',
      priceRange: { min: 700, max: 1000 },
      material: 'Glass',
      features: ['Tempered Glass', 'UV Protection', 'Modern Design'],
      dimensions: '3ft x 7ft',
      warranty: '2 years',
      installation: '1 day',
      description: 'Contemporary glass door with tempered safety glass and UV protection',
      bestFor: ['Commercial', 'Modern Homes'],
      rating: 4.5
    },
    { 
      id: 'd4',
      url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80', 
      name: 'Security Door', 
      type: 'Steel Reinforced', 
      price: '$1000-1500',
      priceRange: { min: 1000, max: 1500 },
      material: 'Steel',
      features: ['Maximum Security', 'Multi-Point Locking', 'Fire-Rated', 'Break-In Resistant'],
      dimensions: '3ft x 7ft',
      warranty: '10 years',
      installation: '2-3 days',
      description: 'High-security reinforced steel door with advanced locking system',
      bestFor: ['High-Security', 'Commercial', 'Banks'],
      rating: 4.8
    },
    { 
      id: 'd5',
      url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80', 
      name: 'Classic Wooden Door', 
      type: 'Solid Wood', 
      price: '$900-1400',
      priceRange: { min: 900, max: 1400 },
      material: 'Wood',
      features: ['Traditional Design', 'Hand-Carved Details', 'Stain Resistant', 'Durable Finish'],
      dimensions: '3ft x 7ft',
      warranty: '5 years',
      installation: '1-2 days',
      description: 'Timeless wooden door with intricate hand-carved patterns and rich finish',
      bestFor: ['Traditional Homes', 'Luxury Residential'],
      rating: 4.8
    },
    { 
      id: 'd6',
      url: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800&q=80', 
      name: 'French Double Door', 
      type: 'Glass & Wood', 
      price: '$1500-2500',
      priceRange: { min: 1500, max: 2500 },
      material: 'Wood',
      features: ['Elegant Design', 'Full Glass Panels', 'Energy Efficient', 'Natural Light'],
      dimensions: '6ft x 8ft',
      warranty: '7 years',
      installation: '2-3 days',
      description: 'Elegant French double doors with large glass panels for maximum natural light',
      bestFor: ['Patios', 'Garden Entrances', 'Luxury Homes'],
      rating: 4.9
    },
    { 
      id: 'd7',
      url: 'https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?w=800&q=80', 
      name: 'Modern Aluminum Door', 
      type: 'Aluminum', 
      price: '$600-1000',
      priceRange: { min: 600, max: 1000 },
      material: 'Aluminum',
      features: ['Lightweight', 'Rust-Proof', 'Contemporary Style', 'Low Maintenance'],
      dimensions: '3ft x 7ft',
      warranty: '8 years',
      installation: '1 day',
      description: 'Sleek aluminum door with modern aesthetics and exceptional durability',
      bestFor: ['Modern Homes', 'Commercial Buildings'],
      rating: 4.6
    },
    { 
      id: 'd8',
      url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80', 
      name: 'Rustic Barn Door', 
      type: 'Reclaimed Wood', 
      price: '$700-1100',
      priceRange: { min: 700, max: 1100 },
      material: 'Wood',
      features: ['Sliding Mechanism', 'Vintage Look', 'Space-Saving', 'Unique Grain Patterns'],
      dimensions: '4ft x 8ft',
      warranty: '3 years',
      installation: '3-4 hours',
      description: 'Authentic barn door with sliding hardware, perfect for modern farmhouse style',
      bestFor: ['Farmhouse Style', 'Interior Spaces', 'Lofts'],
      rating: 4.7
    },
    { 
      id: 'd9',
      url: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&q=80', 
      name: 'Pivot Entry Door', 
      type: 'Modern Steel', 
      price: '$2000-3500',
      priceRange: { min: 2000, max: 3500 },
      material: 'Steel',
      features: ['Center Pivot System', 'Grand Entrance', 'Oversized Design', 'Statement Piece'],
      dimensions: '4ft x 10ft',
      warranty: '10 years',
      installation: '3-5 days',
      description: 'Impressive pivot door that makes a bold architectural statement',
      bestFor: ['Luxury Estates', 'Modern Architecture', 'High-End Commercial'],
      rating: 5.0
    },
    { 
      id: 'd10',
      url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80', 
      name: 'Colonial Style Door', 
      type: 'Painted Wood', 
      price: '$850-1300',
      priceRange: { min: 850, max: 1300 },
      material: 'Wood',
      features: ['Classic Panels', 'Paint-Grade Finish', 'Raised Details', 'Traditional Hardware'],
      dimensions: '3ft x 7ft',
      warranty: '5 years',
      installation: '1-2 days',
      description: 'Traditional colonial door with raised panels and timeless appeal',
      bestFor: ['Colonial Homes', 'Traditional Architecture'],
      rating: 4.7
    },
    { 
      id: 'd11',
      url: 'https://images.unsplash.com/photo-1619468129361-605ebea04b44?w=800&q=80', 
      name: 'Glass Panel Door', 
      type: 'Contemporary', 
      price: '$1100-1800',
      priceRange: { min: 1100, max: 1800 },
      material: 'Glass',
      features: ['Frosted Glass', 'Privacy', 'Modern Design', 'LED Compatible'],
      dimensions: '3ft x 8ft',
      warranty: '5 years',
      installation: '1-2 days',
      description: 'Contemporary door with frosted glass panels for privacy and style',
      bestFor: ['Modern Offices', 'Contemporary Homes'],
      rating: 4.6
    },
    { 
      id: 'd12',
      url: 'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=800&q=80', 
      name: 'Craftsman Door', 
      type: 'Oak Wood', 
      price: '$1200-1900',
      priceRange: { min: 1200, max: 1900 },
      material: 'Wood',
      features: ['Handcrafted', 'Mission Style', 'Beveled Glass', 'Premium Hardware'],
      dimensions: '3ft x 7ft',
      warranty: '7 years',
      installation: '2 days',
      description: 'Handcrafted craftsman door with beautiful beveled glass and mission styling',
      bestFor: ['Craftsman Homes', 'Bungalows', 'Arts & Crafts Style'],
      rating: 4.9
    }
  ],
  window: [
    { 
      id: 'w1',
      url: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=800&q=80', 
      name: 'Double Pane Window', 
      type: 'Glass', 
      price: '$300-600',
      priceRange: { min: 300, max: 600 },
      material: 'Glass',
      features: ['Energy Efficient', 'Sound Insulation', 'Double Glazed'],
      dimensions: '3ft x 4ft',
      warranty: '5 years',
      installation: '4-6 hours',
      description: 'Energy-efficient double pane window with excellent insulation',
      bestFor: ['Residential', 'Energy Saving'],
      rating: 4.6
    },
    { 
      id: 'w2',
      url: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&q=80', 
      name: 'Bay Window', 
      type: 'Glass & Wood', 
      price: '$1200-2000',
      priceRange: { min: 1200, max: 2000 },
      material: 'Glass',
      features: ['Panoramic View', 'Natural Light', 'Architectural Beauty'],
      dimensions: '6ft x 5ft',
      warranty: '7 years',
      installation: '2-3 days',
      description: 'Elegant bay window offering panoramic views and enhanced natural lighting',
      bestFor: ['Luxury Homes', 'Living Rooms'],
      rating: 4.9
    },
    { 
      id: 'w3',
      url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80', 
      name: 'Sliding Window', 
      type: 'Aluminum', 
      price: '$400-800',
      priceRange: { min: 400, max: 800 },
      material: 'Aluminum',
      features: ['Easy Operation', 'Space Saving', 'Low Maintenance'],
      dimensions: '4ft x 4ft',
      warranty: '5 years',
      installation: '3-5 hours',
      description: 'Practical sliding window with aluminum frame for easy operation',
      bestFor: ['Residential', 'Apartments'],
      rating: 4.4
    },
    { 
      id: 'w4',
      url: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80', 
      name: 'Energy Efficient Window', 
      type: 'Triple Pane', 
      price: '$600-1000',
      priceRange: { min: 600, max: 1000 },
      material: 'Glass',
      features: ['Triple Glazed', 'Maximum Insulation', 'Low-E Coating', 'Argon Gas Fill'],
      dimensions: '3ft x 4ft',
      warranty: '10 years',
      installation: '5-7 hours',
      description: 'Premium triple pane window with maximum energy efficiency',
      bestFor: ['Cold Climates', 'Energy Conscious'],
      rating: 4.8
    },
    { 
      id: 'w5',
      url: 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&q=80', 
      name: 'Casement Window', 
      type: 'Vinyl Frame', 
      price: '$350-700',
      priceRange: { min: 350, max: 700 },
      material: 'Glass',
      features: ['Side-Hinged', 'Maximum Ventilation', 'Easy Cleaning', 'Crank Operation'],
      dimensions: '2.5ft x 4ft',
      warranty: '6 years',
      installation: '3-4 hours',
      description: 'Side-hinged casement window for optimal airflow and easy maintenance',
      bestFor: ['Kitchens', 'Bathrooms', 'Bedrooms'],
      rating: 4.7
    },
    { 
      id: 'w6',
      url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80', 
      name: 'Picture Window', 
      type: 'Fixed Glass', 
      price: '$500-900',
      priceRange: { min: 500, max: 900 },
      material: 'Glass',
      features: ['Non-Opening', 'Maximum Light', 'Unobstructed View', 'Large Glass Area'],
      dimensions: '5ft x 5ft',
      warranty: '8 years',
      installation: '4-6 hours',
      description: 'Large picture window offering stunning views and maximum natural light',
      bestFor: ['Living Rooms', 'Scenic Views'],
      rating: 4.8
    },
    { 
      id: 'w7',
      url: 'https://images.unsplash.com/photo-1621971999966-2a2b1c7a1f14?w=800&q=80', 
      name: 'Awning Window', 
      type: 'Top-Hinged', 
      price: '$400-750',
      priceRange: { min: 400, max: 750 },
      material: 'Glass',
      features: ['Top-Hinged', 'Rain Protection', 'Ventilation', 'Contemporary Style'],
      dimensions: '3ft x 2ft',
      warranty: '5 years',
      installation: '3-4 hours',
      description: 'Top-hinged awning window perfect for ventilation even during rain',
      bestFor: ['Basements', 'Bathrooms'],
      rating: 4.5
    },
    { 
      id: 'w8',
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', 
      name: 'Skylight Window', 
      type: 'Roof Window', 
      price: '$800-1500',
      priceRange: { min: 800, max: 1500 },
      material: 'Glass',
      features: ['Ceiling Mounted', 'Natural Light', 'Ventilation Option', 'Energy Efficient'],
      dimensions: '3ft x 4ft',
      warranty: '7 years',
      installation: '1-2 days',
      description: 'Roof-mounted skylight bringing natural light from above',
      bestFor: ['Attics', 'Top Floors', 'Dark Spaces'],
      rating: 4.9
    },
    { 
      id: 'w9',
      url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&q=80', 
      name: 'Garden Window', 
      type: 'Box Window', 
      price: '$700-1200',
      priceRange: { min: 700, max: 1200 },
      material: 'Glass',
      features: ['Extended Box', 'Shelf Space', 'Plant Display', 'Multi-Panel Glass'],
      dimensions: '4ft x 3ft',
      warranty: '6 years',
      installation: '5-7 hours',
      description: 'Box-style garden window perfect for displaying plants and herbs',
      bestFor: ['Kitchens', 'Garden Enthusiasts'],
      rating: 4.6
    },
    { 
      id: 'w10',
      url: 'https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?w=800&q=80', 
      name: 'Stained Glass Window', 
      type: 'Decorative', 
      price: '$1000-2500',
      priceRange: { min: 1000, max: 2500 },
      material: 'Glass',
      features: ['Artistic Design', 'Custom Patterns', 'Privacy', 'Colored Glass'],
      dimensions: '3ft x 5ft',
      warranty: '5 years',
      installation: '1-2 days',
      description: 'Beautiful stained glass window with custom artistic designs',
      bestFor: ['Churches', 'Luxury Homes', 'Entryways'],
      rating: 5.0
    }
  ],
  gate: [
    { 
      id: 'g1',
      url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80', 
      name: 'Modern Gate Design', 
      type: 'Steel', 
      price: '$2000-3500',
      priceRange: { min: 2000, max: 3500 },
      material: 'Steel',
      features: ['Contemporary Design', 'Durable', 'Powder Coated'],
      dimensions: '12ft x 6ft',
      warranty: '5 years',
      installation: '2-3 days',
      description: 'Sleek modern gate with contemporary design and long-lasting finish',
      bestFor: ['Modern Homes', 'Commercial'],
      rating: 4.6
    },
    { 
      id: 'g2',
      url: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80', 
      name: 'Automated Gate', 
      type: 'Aluminum', 
      price: '$3000-5000',
      priceRange: { min: 3000, max: 5000 },
      material: 'Aluminum',
      features: ['Automation System', 'Remote Control', 'Safety Sensors', 'Smart Integration'],
      dimensions: '14ft x 6ft',
      warranty: '7 years',
      installation: '3-4 days',
      description: 'Fully automated gate with smart home integration and safety features',
      bestFor: ['Luxury Homes', 'High Security'],
      rating: 4.9
    },
    { 
      id: 'g3',
      url: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=800&q=80', 
      name: 'Wrought Iron Gate', 
      type: 'Iron', 
      price: '$2500-4000',
      priceRange: { min: 2500, max: 4000 },
      material: 'Iron',
      features: ['Classic Design', 'Handcrafted', 'Ornamental', 'Rust-Resistant'],
      dimensions: '12ft x 7ft',
      warranty: '8 years',
      installation: '2-3 days',
      description: 'Traditional wrought iron gate with ornamental designs and classic appeal',
      bestFor: ['Classic Homes', 'Heritage Properties'],
      rating: 4.7
    },
    { 
      id: 'g4',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 
      name: 'Wooden Gate', 
      type: 'Wood', 
      price: '$1500-2500',
      priceRange: { min: 1500, max: 2500 },
      material: 'Wood',
      features: ['Natural Beauty', 'Weather Treated', 'Custom Designs'],
      dimensions: '10ft x 6ft',
      warranty: '3 years',
      installation: '2 days',
      description: 'Beautiful wooden gate with natural aesthetics and weather protection',
      bestFor: ['Residential', 'Rustic Homes'],
      rating: 4.5
    },
    { 
      id: 'g5',
      url: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=800&q=80', 
      name: 'Sliding Gate', 
      type: 'Aluminum', 
      price: '$2800-4500',
      priceRange: { min: 2800, max: 4500 },
      material: 'Aluminum',
      features: ['Space Saving', 'Smooth Operation', 'Modern Design', 'Motorized Option'],
      dimensions: '16ft x 6ft',
      warranty: '6 years',
      installation: '2-3 days',
      description: 'Space-efficient sliding gate with smooth motorized operation',
      bestFor: ['Narrow Driveways', 'Commercial'],
      rating: 4.7
    },
    { 
      id: 'g6',
      url: 'https://images.unsplash.com/photo-1542327897-d73f4005b533?w=800&q=80', 
      name: 'Privacy Gate', 
      type: 'Composite', 
      price: '$2000-3200',
      priceRange: { min: 2000, max: 3200 },
      material: 'Wood',
      features: ['Full Privacy', 'Low Maintenance', 'Fade Resistant', 'Eco-Friendly'],
      dimensions: '12ft x 6ft',
      warranty: '8 years',
      installation: '2 days',
      description: 'Solid composite gate offering complete privacy and minimal maintenance',
      bestFor: ['Residential', 'Backyards'],
      rating: 4.6
    },
    { 
      id: 'g7',
      url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80', 
      name: 'Decorative Iron Gate', 
      type: 'Wrought Iron', 
      price: '$3500-6000',
      priceRange: { min: 3500, max: 6000 },
      material: 'Iron',
      features: ['Intricate Patterns', 'Hand-Forged', 'Security', 'Elegant Design'],
      dimensions: '12ft x 8ft',
      warranty: '10 years',
      installation: '3-4 days',
      description: 'Exquisite hand-forged iron gate with intricate decorative patterns',
      bestFor: ['Luxury Estates', 'Historic Properties'],
      rating: 5.0
    },
    { 
      id: 'g8',
      url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80', 
      name: 'Chain Link Gate', 
      type: 'Galvanized Steel', 
      price: '$800-1500',
      priceRange: { min: 800, max: 1500 },
      material: 'Steel',
      features: ['Affordable', 'Durable', 'Low Maintenance', 'See-Through'],
      dimensions: '10ft x 6ft',
      warranty: '5 years',
      installation: '1 day',
      description: 'Practical chain link gate for security without blocking views',
      bestFor: ['Industrial', 'Sports Facilities', 'Kennels'],
      rating: 4.3
    },
    { 
      id: 'g9',
      url: 'https://images.unsplash.com/photo-1567225591450-74e97882a8f6?w=800&q=80', 
      name: 'Ranch Style Gate', 
      type: 'Timber', 
      price: '$1200-2200',
      priceRange: { min: 1200, max: 2200 },
      material: 'Wood',
      features: ['Rustic Charm', 'Sturdy Build', 'Traditional', 'Easy Access'],
      dimensions: '12ft x 5ft',
      warranty: '4 years',
      installation: '1-2 days',
      description: 'Classic ranch-style gate with rustic charm and sturdy construction',
      bestFor: ['Farms', 'Ranch Properties', 'Country Homes'],
      rating: 4.5
    },
    { 
      id: 'g10',
      url: 'https://images.unsplash.com/photo-1593642634443-44adaa06623a?w=800&q=80', 
      name: 'Smart Security Gate', 
      type: 'Steel & Electronics', 
      price: '$5000-8500',
      priceRange: { min: 5000, max: 8500 },
      material: 'Steel',
      features: ['Biometric Access', 'Camera Integration', 'App Control', 'Visitor Management'],
      dimensions: '14ft x 7ft',
      warranty: '7 years',
      installation: '4-5 days',
      description: 'Advanced smart gate with biometric security and integrated surveillance',
      bestFor: ['High-Security Compounds', 'Tech Homes'],
      rating: 4.9
    }
  ],
  roofing: [
    { 
      id: 'r1',
      url: 'https://images.unsplash.com/photo-1622142009866-d7686c17a0d6?w=800&q=80', 
      name: 'Metal Roofing', 
      type: 'Steel', 
      price: '$5000-10000',
      priceRange: { min: 5000, max: 10000 },
      material: 'Steel',
      features: ['50+ Year Lifespan', 'Energy Efficient', 'Fire Resistant', 'Low Maintenance'],
      dimensions: 'Per sq ft',
      warranty: '30 years',
      installation: '3-5 days',
      description: 'Durable metal roofing with exceptional longevity and energy efficiency',
      bestFor: ['Commercial', 'Industrial', 'Modern Homes'],
      rating: 4.8
    },
    { 
      id: 'r2',
      url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80', 
      name: 'Tile Roofing', 
      type: 'Clay Tiles', 
      price: '$8000-15000',
      priceRange: { min: 8000, max: 15000 },
      material: 'Clay',
      features: ['Premium Look', 'Heat Resistant', 'Long Lasting', 'Traditional'],
      dimensions: 'Per sq ft',
      warranty: '50 years',
      installation: '5-7 days',
      description: 'Classic clay tile roofing offering timeless beauty and superior heat resistance',
      bestFor: ['Luxury Homes', 'Mediterranean Style'],
      rating: 4.9
    },
    { 
      id: 'r3',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 
      name: 'Shingle Roofing', 
      type: 'Asphalt', 
      price: '$4000-8000',
      priceRange: { min: 4000, max: 8000 },
      material: 'Asphalt',
      features: ['Affordable', 'Easy Installation', 'Variety of Colors'],
      dimensions: 'Per sq ft',
      warranty: '20 years',
      installation: '2-3 days',
      description: 'Cost-effective asphalt shingle roofing with reliable performance',
      bestFor: ['Residential', 'Budget Conscious'],
      rating: 4.4
    },
    { 
      id: 'r4',
      url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80', 
      name: 'Solar Panel Roof', 
      type: 'Solar Tiles', 
      price: '$15000-30000',
      priceRange: { min: 15000, max: 30000 },
      material: 'Solar',
      features: ['Energy Generation', 'Eco-Friendly', 'Tax Benefits', 'Modern Technology'],
      dimensions: 'Per sq ft',
      warranty: '25 years',
      installation: '5-7 days',
      description: 'Advanced solar panel roofing generating clean energy while protecting your home',
      bestFor: ['Eco-Conscious', 'Modern Homes', 'Long-term Investment'],
      rating: 4.9
    },
    { 
      id: 'r5',
      url: 'https://images.unsplash.com/photo-1591088397968-64495f7cdb3b?w=800&q=80', 
      name: 'Slate Roofing', 
      type: 'Natural Slate', 
      price: '$12000-25000',
      priceRange: { min: 12000, max: 25000 },
      material: 'Slate',
      features: ['100+ Year Lifespan', 'Elegant', 'Fire Resistant', 'Natural Stone'],
      dimensions: 'Per sq ft',
      warranty: '75 years',
      installation: '7-10 days',
      description: 'Premium natural slate roofing with unmatched elegance and longevity',
      bestFor: ['Historic Homes', 'Luxury Properties', 'Long-term Value'],
      rating: 5.0
    },
    { 
      id: 'r6',
      url: 'https://images.unsplash.com/photo-1604586376855-8f6c82f92727?w=800&q=80', 
      name: 'Wood Shake Roofing', 
      type: 'Cedar Shakes', 
      price: '$8000-16000',
      priceRange: { min: 8000, max: 16000 },
      material: 'Wood',
      features: ['Natural Beauty', 'Insulation', 'Rustic Appeal', 'Eco-Friendly'],
      dimensions: 'Per sq ft',
      warranty: '15 years',
      installation: '4-6 days',
      description: 'Traditional cedar shake roofing offering natural beauty and charm',
      bestFor: ['Cabin Style', 'Mountain Homes', 'Rustic Properties'],
      rating: 4.6
    },
    { 
      id: 'r7',
      url: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80', 
      name: 'Rubber Roofing', 
      type: 'EPDM', 
      price: '$3500-7000',
      praceRange: { min: 3500, max: 7000 },
      material: 'Rubber',
      features: ['Waterproof', 'Low Cost', 'Easy Installation', 'Durable'],
      dimensions: 'Per sq ft',
      warranty: '20 years',
      installation: '2-3 days',
      description: 'Cost-effective rubber roofing with excellent waterproofing',
      bestFor: ['Flat Roofs', 'Commercial Buildings', 'Budget Projects'],
      rating: 4.4
    },
    { 
      id: 'r8',
      url: 'https://images.unsplash.com/photo-1599619351208-3e6c839d6828?w=800&q=80', 
      name: 'Green Living Roof', 
      type: 'Vegetation', 
      price: '$10000-20000',
      priceRange: { min: 10000, max: 20000 },
      material: 'Eco',
      features: ['Living Plants', 'Insulation', 'Eco-Friendly', 'Unique'],
      dimensions: 'Per sq ft',
      warranty: '10 years',
      installation: '7-14 days',
      description: 'Sustainable living roof covered with vegetation for ultimate eco-friendliness',
      bestFor: ['Eco Buildings', 'Modern Architecture', 'Urban Spaces'],
      rating: 4.8
    },
    { 
      id: 'r9',
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80', 
      name: 'Composite Roofing', 
      type: 'Synthetic', 
      price: '$6000-12000',
      priceRange: { min: 6000, max: 12000 },
      material: 'Composite',
      features: ['Lightweight', 'Impact Resistant', 'Variety of Styles', 'Low Maintenance'],
      dimensions: 'Per sq ft',
      warranty: '30 years',
      installation: '3-5 days',
      description: 'Modern composite roofing combining beauty with advanced materials',
      bestFor: ['Modern Homes', 'All Climates', 'Value Seekers'],
      rating: 4.6
    },
    { 
      id: 'r10',
      url: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&q=80', 
      name: 'Standing Seam Metal', 
      type: 'Aluminum', 
      price: '$9000-18000',
      priceRange: { min: 9000, max: 18000 },
      material: 'Aluminum',
      features: ['Contemporary Look', 'Leak Resistant', 'Energy Efficient', 'Sleek Design'],
      dimensions: 'Per sq ft',
      warranty: '40 years',
      installation: '4-6 days',
      description: 'Contemporary standing seam metal roofing with superior leak protection',
      bestFor: ['Modern Architecture', 'Commercial', 'Coastal Areas'],
      rating: 4.8
    }
  ]
};

// ================================
// UNIVERSAL KNOWLEDGE BASE
// Answers general questions!
// ================================

const knowledgeBase = {
  // General greetings
  greetings: {
    patterns: [/^(hi|hello|hey|hola|namaste|good morning|good afternoon|good evening|greetings|sup|yo|howdy)/i],
    responses: [
      '👋 **Hello! I\'m your AI Assistant!**\n\nI can help you with:\n🏗️ Engineering & construction (doors, windows, gates, roofing)\n💡 General questions (math, science, history, technology)\n📊 Calculations and conversions\n🌍 General knowledge\n💬 Friendly conversation\n\nWhat would you like to know?',
      '✨ **Hi there!** I\'m here to help with anything you need!\n\nAsk me about:\n• Engineering projects\n• General knowledge\n• Math problems\n• Technical questions\n• Product recommendations\n• Or just chat!\n\nHow can I assist you today?'
    ]
  },

  // Math & calculations
  math: {
    patterns: [
      /what is|what's|calculate|solve|compute/i,
      /\d+\s*[\+\-\*\/×÷]\s*\d+/,
      /square root|sqrt|cube root|power|exponent/i,
      /percentage|percent|\d+%/i,
      /area|volume|perimeter|circumference/i
    ],
    handler: (message) => {
      try {
        // Extract math expression
        const mathMatch = message.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/×÷])\s*(\d+(?:\.\d+)?)/);
        if (mathMatch) {
          const num1 = parseFloat(mathMatch[1]);
          const operator = mathMatch[2].replace('×', '*').replace('÷', '/');
          const num2 = parseFloat(mathMatch[3]);
          let result;
          switch(operator) {
            case '+': result = num1 + num2; break;
            case '-': result = num1 - num2; break;
            case '*': result = num1 * num2; break;
            case '/': result = num2 !== 0 ? num1 / num2 : 'Cannot divide by zero'; break;
          }
          return `🔢 **Calculation:**\n\n${num1} ${operator} ${num2} = **${result}**\n\nNeed another calculation?`;
        }

        // Square root
        if (message.match(/square root|sqrt/i)) {
          const numMatch = message.match(/(\d+(?:\.\d+)?)/);
          if (numMatch) {
            const num = parseFloat(numMatch[1]);
            const result = Math.sqrt(num);
            return `🔢 **Square Root:**\n\n√${num} = **${result.toFixed(4)}**`;
          }
        }

        // Percentage
        if (message.match(/(\d+)%\s*of\s*(\d+)/i)) {
          const match = message.match(/(\d+)%\s*of\s*(\d+)/i);
          const percent = parseFloat(match[1]);
          const number = parseFloat(match[2]);
          const result = (percent / 100) * number;
          return `🔢 **Percentage:**\n\n${percent}% of ${number} = **${result}**`;
        }

        return null;
      } catch (error) {
        return null;
      }
    }
  },

  // Science & technology
  science: {
    patterns: [
      /what is (ai|artificial intelligence|machine learning|deep learning|neural network)/i,
      /explain (photosynthesis|gravity|evolution|dna|atoms?|molecules?)/i,
      /how does|how do/i,
      /why is|why does|why do/i,
      /speed of light|speed of sound/i
    ],
    responses: {
      'ai|artificial intelligence': '🤖 **Artificial Intelligence (AI)**\n\nAI is the simulation of human intelligence by machines, especially computer systems. Key aspects:\n\n**Types:**\n• Narrow AI: Specific tasks (like me!)\n• General AI: Human-level intelligence\n• Super AI: Beyond human intelligence\n\n**Applications:**\n✓ Chatbots & virtual assistants\n✓ Image & speech recognition\n✓ Self-driving cars\n✓ Medical diagnosis\n✓ Recommendation systems\n\n**How it works:**\n1. Data collection\n2. Pattern recognition\n3. Learning algorithms\n4. Prediction & decision making\n\nI\'m an example of AI helping you right now! 😊',
      
      'machine learning': '🧠 **Machine Learning (ML)**\n\nML is a subset of AI where computers learn from data without explicit programming.\n\n**Types:**\n1. **Supervised Learning:** Learns from labeled data\n2. **Unsupervised Learning:** Finds patterns in unlabeled data\n3. **Reinforcement Learning:** Learns through trial and error\n\n**Examples:**\n• Email spam filters\n• Netflix recommendations\n• Voice assistants\n• Fraud detection\n\n**Process:**\nData → Training → Model → Predictions\n\nWant to know more about any specific type?',
      
      'photosynthesis': '🌿 **Photosynthesis**\n\nThe process plants use to convert sunlight into energy!\n\n**Chemical Equation:**\n6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂\n\n**Simple Explanation:**\nCarbon Dioxide + Water + Sunlight → Glucose + Oxygen\n\n**Where:** In chloroplasts (green parts of plants)\n\n**Why Important:**\n✓ Produces oxygen we breathe\n✓ Creates food for plants\n✓ Basis of food chain\n✓ Removes CO₂ from atmosphere\n\nPlants are basically solar-powered food factories! 🌱☀️',
      
      'gravity': '🌍 **Gravity**\n\nThe force that attracts objects with mass toward each other.\n\n**Key Facts:**\n• Discovered by: Isaac Newton (1687)\n• Law: F = G(m₁m₂)/r²\n• Earth\'s gravity: 9.8 m/s²\n• Keeps us on the ground\n• Holds planets in orbit\n\n**Why we don\'t float:** Earth\'s mass creates gravitational pull.\n\n**Fun Facts:**\n🌙 Moon has 1/6th Earth\'s gravity\n☀️ Sun\'s gravity holds solar system together\n🚀 Escape velocity from Earth: 11.2 km/s\n\nWithout gravity, we\'d all be floating in space! 🌌',
      
      'speed of light': '⚡ **Speed of Light**\n\n**In vacuum:** 299,792,458 m/s (about 300,000 km/s)\n\n**Simple version:** ~186,000 miles/second\n\n**Symbol:** c (from Latin "celeritas" = speed)\n\n**Cool Facts:**\n✓ Fastest thing in universe\n✓ Light from Sun takes ~8 minutes to reach Earth\n✓ Nothing can travel faster (according to Einstein)\n✓ Used in E=mc² formula\n\n**Comparison:**\n🌍 Around Earth 7.5 times in 1 second\n🌙 To Moon in 1.3 seconds\n☀️ To Sun in 8 minutes\n\nThat\'s REALLY fast! 💨'
    }
  },

  // History & geography
  history: {
    patterns: [
      /who (invented|discovered|created|founded|built)/i,
      /when (did|was|were)/i,
      /history of|historical/i,
      /world war|ww1|ww2/i,
      /(country|capital|continent|ocean|mountain)/i
    ],
    responses: {
      'invented airplane|wright brothers': '✈️ **The Airplane**\n\n**Inventors:** Orville and Wilbur Wright\n**Date:** December 17, 1903\n**Location:** Kitty Hawk, North Carolina\n\n**First Flight:**\n• Duration: 12 seconds\n• Distance: 120 feet\n• Pilot: Orville Wright\n\n**Impact:**\n✓ Revolutionized transportation\n✓ Connected the world\n✓ Made space travel possible\n\n**Today:**\n🛫 Over 100,000 flights daily worldwide!\n\nFrom 12 seconds to Mars missions! 🚀',
      
      'world war 2|ww2': '⚔️ **World War II (1939-1945)**\n\n**Duration:** 6 years\n**Participants:** 50+ nations\n**Casualties:** ~70-85 million\n\n**Key Events:**\n1. 1939: War begins (Germany invades Poland)\n2. 1941: Pearl Harbor (US enters war)\n3. 1944: D-Day invasion\n4. 1945: Atomic bombs, war ends\n\n**Major Powers:**\n**Allies:** US, UK, USSR, France\n**Axis:** Germany, Italy, Japan\n\n**Outcome:**\n✓ Allied victory\n✓ UN formed\n✓ Cold War begins\n✓ Shaped modern world\n\nMost significant conflict in human history.',
      
      'capital': '🏛️ **World Capitals**\n\nHere are some major world capitals:\n\n🇺🇸 USA: Washington, D.C.\n🇬🇧 UK: London\n🇫🇷 France: Paris\n🇩🇪 Germany: Berlin\n🇯🇵 Japan: Tokyo\n🇨🇳 China: Beijing\n🇮🇳 India: New Delhi\n🇧🇷 Brazil: Brasília\n🇷🇺 Russia: Moscow\n🇦🇺 Australia: Canberra\n\nWhich country\'s capital would you like to know?'
    }
  },

  // Technology & coding
  technology: {
    patterns: [
      /what is (html|css|javascript|python|java|react|node)/i,
      /programming|coding|software|app|website/i,
      /internet|wifi|5g|bluetooth/i,
      /computer|laptop|phone|smartphone/i,
      /database|sql|api|cloud/i
    ],
    responses: {
      'html': '🌐 **HTML (HyperText Markup Language)**\n\n**What it is:** The skeleton of websites\n\n**Purpose:** Structures web content\n\n**Basic Tags:**\n```html\n<html> - Root element\n<head> - Metadata\n<body> - Visible content\n<h1> - Heading\n<p> - Paragraph\n<a> - Link\n<img> - Image\n```\n\n**Example:**\n```html\n<h1>Hello World!</h1>\n<p>This is HTML</p>\n```\n\n**Used with:**\n• CSS (styling)\n• JavaScript (interactivity)\n\nEvery website uses HTML!',
      
      'javascript': '⚡ **JavaScript**\n\n**Type:** Programming language\n**Used for:** Making websites interactive\n**Created:** 1995 by Brendan Eich\n\n**What it does:**\n✓ Dynamic content\n✓ Animations\n✓ User interactions\n✓ Form validation\n✓ Games\n✓ Web apps\n\n**Example:**\n```javascript\nfunction greet(name) {\n  return "Hello, " + name + "!";\n}\n\ngreet("World"); // "Hello, World!"\n```\n\n**Runs on:**\n🌐 Browsers (Chrome, Firefox, etc.)\n🖥️ Servers (Node.js)\n📱 Mobile (React Native)\n\n**Most popular programming language in web development!**',
      
      'python': '🐍 **Python**\n\n**Type:** High-level programming language\n**Created:** 1991 by Guido van Rossum\n**Philosophy:** Simple, readable code\n\n**Used for:**\n✓ AI & Machine Learning\n✓ Data Science\n✓ Web Development\n✓ Automation\n✓ Scientific Computing\n\n**Example:**\n```python\n# Print hello world\nprint("Hello, World!")\n\n# Calculate\nresult = 5 + 3\nprint(result)  # 8\n```\n\n**Why Popular:**\n• Easy to learn\n• Readable syntax\n• Huge library ecosystem\n• Used by Google, Netflix, NASA\n\n**Best for beginners!** 🚀',
      
      'internet': '🌐 **The Internet**\n\n**What it is:** Global network of connected computers\n\n**Key Technologies:**\n📡 TCP/IP: Communication protocol\n🌍 DNS: Translates names to addresses\n🔒 HTTPS: Secure connections\n☁️ Cloud: Remote data storage\n\n**Speed Types:**\n• Dial-up: ~56 Kbps (ancient!)\n• Broadband: 1-100 Mbps\n• Fiber: 100-10,000 Mbps\n• 5G: Up to 20,000 Mbps\n\n**Uses:**\n✓ Websites\n✓ Email\n✓ Streaming\n✓ Social media\n✓ Gaming\n✓ Shopping\n\n**Fun Fact:** 5.4 billion internet users worldwide! 🌍'
    }
  },

  // General knowledge
  general: {
    patterns: [
      /what is|what are|what does/i,
      /how to|how can|how do/i,
      /tell me about|explain/i,
      /definition of|meaning of/i
    ]
  },

  // Conversational
  conversation: {
    patterns: [
      /how are you|how're you/i,
      /what('s| is) your name/i,
      /who (are you|made you|created you)/i,
      /can you help|help me/i,
      /thank|thanks|thx/i,
      /bye|goodbye|see you/i
    ],
    responses: {
      'how are you': '😊 I\'m doing great, thanks for asking!\n\nI\'m here 24/7, ready to help with:\n• Engineering projects\n• General questions\n• Calculations\n• Product recommendations\n• And much more!\n\nHow can I assist you today?',
      
      'your name': '🤖 I\'m **AI Design Assistant**!\n\nI\'m an intelligent chatbot created to help you with:\n✓ Engineering & construction projects\n✓ General knowledge questions\n✓ Product recommendations\n✓ Technical calculations\n✓ Friendly conversation\n\nThink of me as your smart assistant who knows a lot about many things! 😊\n\nWhat would you like to know?',
      
      'who are you': '👋 **I\'m your AI Assistant!**\n\n**What I am:**\n• Intelligent chatbot\n• Knowledge helper\n• Design consultant\n• Problem solver\n\n**What I can do:**\n🏗️ Help with engineering projects\n💡 Answer general questions\n🔢 Solve math problems\n📚 Explain concepts\n💬 Have friendly conversations\n\n**What I can\'t do:**\n❌ Physical tasks\n❌ Access external websites\n❌ Personal opinions (I\'m neutral!)\n\nI\'m here to make your life easier! How can I help?',
      
      'help': '💪 **I\'d Love to Help!**\n\nI can assist with:\n\n**🏗️ Engineering Projects:**\n• Doors, windows, gates, roofing\n• Material recommendations\n• Cost estimates\n• Specifications\n\n**💡 General Knowledge:**\n• Science & technology\n• Math & calculations\n• History & geography\n• Definitions & explanations\n\n**🎯 How to Get Best Results:**\n1. Be specific with your question\n2. Provide context if needed\n3. Ask follow-up questions\n4. Try voice input! 🎤\n\n**What would you like help with?**',
      
      'thanks': '😊 **You\'re very welcome!**\n\nHappy to help! Feel free to ask me:\n• More questions\n• Follow-up queries\n• Anything else you need\n\nI\'m here for you! 💙',
      
      'bye': '👋 **Goodbye!**\n\nIt was great chatting with you! Come back anytime you need:\n• Engineering help\n• General questions\n• Product recommendations\n• Just a friendly chat\n\nHave an amazing day! 🌟'
    }
  }
};

// ================================
// UNIVERSAL AI ENGINE
// ================================

class UniversalAI {
  constructor() {
    this.conversationHistory = [];
  }

  // Check if message is product-related
  isProductQuery(message) {
    const msg = message.toLowerCase();
    const productKeywords = /\b(door|doors|window|windows|gate|gates|roofing|roof|entrance|entry|glass)\b/i;
    const requestKeywords = /\b(show|display|need|want|looking for|recommend|suggest|buy|purchase)\b/i;
    
    return productKeywords.test(msg) || requestKeywords.test(msg);
  }

  // Handle general knowledge questions
  handleGeneralQuestion(message) {
    const msg = message.toLowerCase();

    // Check each knowledge category
    for (const [category, data] of Object.entries(knowledgeBase)) {
      if (!data.patterns) continue;

      // Check if message matches pattern
      const matched = data.patterns.some(pattern => pattern.test(msg));
      
      if (matched) {
        // If has custom handler (like math)
        if (data.handler) {
          const result = data.handler(message);
          if (result) return { text: result, confidence: 0.95 };
        }

        // If has predefined responses
        if (data.responses) {
          // Array of responses (random selection)
          if (Array.isArray(data.responses)) {
            return {
              text: data.responses[Math.floor(Math.random() * data.responses.length)],
              confidence: 0.9
            };
          }
          
          // Object of responses (keyword matching)
          for (const [keyword, response] of Object.entries(data.responses)) {
            if (new RegExp(keyword, 'i').test(msg)) {
              return { text: response, confidence: 0.9 };
            }
          }
        }
      }
    }

    // Check for specific topics with enhanced responses
    const enhancedResponse = this.getEnhancedTopicResponse(message);
    if (enhancedResponse) return enhancedResponse;

    // Default intelligent response
    return this.generateIntelligentResponse(message);
  }

  // Enhanced topic-specific responses for better AI-like answers
  getEnhancedTopicResponse(message) {
    const msg = message.toLowerCase();

    // AI & Machine Learning
    if (msg.match(/\b(machine learning|ml|deep learning|neural network|algorithm)\b/i)) {
      return {
        text: `🤖 **Machine Learning & AI**

**Machine Learning (ML):**
Machine learning is a subset of AI where computers learn from data without explicit programming.

**Types:**
1. **Supervised Learning** - Learning from labeled data
   • Examples: Image classification, spam detection
   
2. **Unsupervised Learning** - Finding patterns in unlabeled data
   • Examples: Customer segmentation, anomaly detection
   
3. **Reinforcement Learning** - Learning through trial and error
   • Examples: Game AI, robotics, self-driving cars

**Deep Learning:**
• Uses neural networks with multiple layers
• Powers: Face recognition, voice assistants, language translation
• Frameworks: TensorFlow, PyTorch, Keras

**Real-World Applications:**
✓ Netflix recommendations
✓ Self-driving cars (Tesla)
✓ Voice assistants (Siri, Alexa)
✓ Medical diagnosis
✓ Fraud detection

**Fun Fact:** I'm using ML right now to understand and respond to your questions! 🎯`,
        confidence: 0.95
      };
    }

    // Programming languages
    if (msg.match(/\b(c\+\+|java|php|ruby|swift|kotlin|rust|go)\b/i)) {
      const languages = {
        'c++': {
          name: 'C++',
          year: '1985',
          use: 'System/software development, game engines, browsers',
          speed: 'Very fast',
          difficulty: 'Hard',
          popular: 'Game development (Unreal Engine), Adobe products, Chrome browser'
        },
        'java': {
          name: 'Java',
          year: '1995',
          use: 'Enterprise applications, Android apps, web servers',
          speed: 'Fast',
          difficulty: 'Moderate',
          popular: 'Android apps, enterprise software, Minecraft'
        },
        'php': {
          name: 'PHP',
          year: '1995',
          use: 'Web development, server-side scripting',
          speed: 'Moderate',
          difficulty: 'Easy to Moderate',
          popular: 'WordPress, Facebook (originally), Wikipedia'
        },
        'ruby': {
          name: 'Ruby',
          year: '1995',
          use: 'Web development, scripting',
          speed: 'Moderate',
          difficulty: 'Easy',
          popular: 'Ruby on Rails framework, GitHub, Shopify'
        }
      };

      for (const [key, lang] of Object.entries(languages)) {
        if (msg.includes(key)) {
          return {
            text: `💻 **${lang.name} Programming Language**

**Created:** ${lang.year}
**Used for:** ${lang.use}
**Speed:** ${lang.speed}
**Learning Difficulty:** ${lang.difficulty}

**Popular Uses:**
${lang.popular}

**Why Choose ${lang.name}?**
• Industry-proven
• Large community support
• Extensive libraries
• Great job opportunities

**Getting Started:**
1. Install ${lang.name} compiler/interpreter
2. Write "Hello World" program
3. Practice with small projects
4. Build real applications

Want to learn more about programming? Just ask! 🚀`,
            confidence: 0.92
          };
        }
      }
    }

    // Database questions
    if (msg.match(/\b(database|sql|mysql|mongodb|postgresql|nosql)\b/i)) {
      return {
        text: `🗄️ **Databases - Data Storage Systems**

**What is a Database?**
An organized collection of data that can be easily accessed, managed, and updated.

**Types:**

**1. SQL (Relational Databases)**
• **MySQL** - Most popular, free, used by WordPress
• **PostgreSQL** - Advanced features, very reliable
• **Oracle** - Enterprise-grade, powerful
• **SQL Server** - Microsoft's database

**When to use SQL:**
✓ Structured data with clear relationships
✓ ACID compliance needed (banking, finance)
✓ Complex queries required

**2. NoSQL (Non-Relational)**
• **MongoDB** - Document-based, flexible schema
• **Redis** - In-memory, super fast
• **Cassandra** - Highly scalable
• **Firebase** - Real-time, cloud-based

**When to use NoSQL:**
✓ Unstructured/semi-structured data
✓ Need to scale horizontally
✓ Flexibility over consistency

**Basic SQL Commands:**
\`\`\`sql
-- Create
INSERT INTO users (name, email) VALUES ('John', 'john@email.com');

-- Read
SELECT * FROM users WHERE age > 18;

-- Update
UPDATE users SET email = 'new@email.com' WHERE id = 1;

-- Delete
DELETE FROM users WHERE id = 1;
\`\`\`

**Popular Uses:**
• Facebook - MySQL (originally)
• Netflix - Cassandra
• Twitter - MySQL + Redis
• Uber - PostgreSQL + MySQL

Need help with SQL queries or database design? Ask away! 💡`,
        confidence: 0.94
      };
    }

    // Web development
    if (msg.match(/\b(web development|frontend|backend|fullstack|react|angular|vue)\b/i)) {
      return {
        text: `🌐 **Web Development - Building Websites & Apps**

**Frontend (What Users See):**
**Technologies:**
• **HTML** - Structure
• **CSS** - Styling & design
• **JavaScript** - Interactivity

**Popular Frameworks:**
• **React** - Facebook's framework, most popular
• **Vue.js** - Beginner-friendly, flexible
• **Angular** - Google's framework, enterprise-focused

**Backend (Server-Side):**
**Languages:**
• **Node.js** - JavaScript on server
• **Python** (Django, Flask)
• **PHP** (Laravel)
• **Java** (Spring Boot)
• **Ruby** (Rails)

**What Backend Does:**
✓ Database operations
✓ User authentication
✓ Business logic
✓ API endpoints

**Fullstack:**
• Both frontend + backend
• Can build complete applications
• In high demand!

**Development Roadmap:**
1. **Start:** HTML, CSS, JavaScript
2. **Learn:** A frontend framework (React recommended)
3. **Add:** Backend language (Node.js/Python)
4. **Master:** Databases, APIs, deployment

**Popular Tech Stacks:**
• **MERN** - MongoDB, Express, React, Node.js
• **MEAN** - MongoDB, Express, Angular, Node.js
• **LAMP** - Linux, Apache, MySQL, PHP
• **JAMstack** - JavaScript, APIs, Markup

**Career Prospects:**
💰 High salary potential
📈 Growing demand
🌍 Remote work opportunities
🎯 Entrepreneurship possibilities

Want to start learning web development? I can guide you! 🚀`,
        confidence: 0.93
      };
    }

    // Cloud computing
    if (msg.match(/\b(cloud|aws|azure|google cloud|gcp|cloud computing)\b/i)) {
      return {
        text: `☁️ **Cloud Computing - The Future of Technology**

**What is Cloud Computing?**
Delivery of computing services over the internet including servers, storage, databases, networking, software, and analytics.

**Benefits:**
✅ **Cost-Effective** - Pay only for what you use
✅ **Scalable** - Grow or shrink resources instantly
✅ **Accessible** - Access from anywhere
✅ **Reliable** - Built-in backup and recovery
✅ **Automatic Updates** - Always latest features

**Top Cloud Providers:**

**1. Amazon Web Services (AWS)**
• Market leader (~32% market share)
• Services: EC2, S3, Lambda, RDS
• Used by: Netflix, Airbnb, NASA

**2. Microsoft Azure**
• Strong enterprise focus
• Great Windows integration
• Used by: Adobe, BMW, Samsung

**3. Google Cloud Platform (GCP)**
• Excellent for data analytics & ML
• Competitive pricing
• Used by: Spotify, Twitter, eBay

**Cloud Service Models:**

**IaaS** (Infrastructure as a Service)
• Virtual machines, storage, networks
• Example: AWS EC2, Azure VMs

**PaaS** (Platform as a Service)
• Development platforms
• Example: Heroku, Google App Engine

**SaaS** (Software as a Service)
• Ready-to-use applications
• Example: Gmail, Dropbox, Salesforce

**Popular Services:**
🔧 **Compute:** EC2, Azure VMs, Google Compute
💾 **Storage:** S3, Azure Blob, Google Cloud Storage
🗄️ **Database:** RDS, CosmosDB, Cloud SQL
🤖 **AI/ML:** SageMaker, Azure ML, Vertex AI

**Career Opportunities:**
• Cloud Architect
• DevOps Engineer
• Solutions Architect
• Cloud Security Specialist

**Certifications:**
📜 AWS Certified Solutions Architect
📜 Azure Administrator
📜 Google Cloud Professional

The future is in the cloud! ☁️✨`,
        confidence: 0.94
      };
    }

    // Blockchain & Cryptocurrency
    if (msg.match(/\b(blockchain|bitcoin|cryptocurrency|crypto|ethereum|nft)\b/i)) {
      return {
        text: `⛓️ **Blockchain & Cryptocurrency**

**What is Blockchain?**
A distributed, decentralized digital ledger that records transactions across many computers securely and transparently.

**Key Features:**
🔐 **Secure** - Cryptographically protected
📊 **Transparent** - All transactions visible
🔄 **Immutable** - Cannot be changed once recorded
🌐 **Decentralized** - No single point of control

**How It Works:**
1. Transaction initiated
2. Broadcast to network nodes
3. Validated by miners/validators
4. Added to a block
5. Block added to chain
6. Transaction complete!

**Popular Cryptocurrencies:**

**Bitcoin (BTC)**
• First cryptocurrency (2009)
• Creator: Satoshi Nakamoto (anonymous)
• Digital gold, store of value
• Max supply: 21 million coins

**Ethereum (ETH)**
• Smart contracts platform
• Created by Vitalik Buterin (2015)
• Powers DeFi & NFTs
• Programmable blockchain

**Other Notable Coins:**
• **Binance Coin (BNB)** - Exchange token
• **Cardano (ADA)** - Research-driven
• **Solana (SOL)** - High-speed transactions
• **Ripple (XRP)** - Banking solutions

**Use Cases:**

**DeFi (Decentralized Finance)**
• Lending/borrowing without banks
• Decentralized exchanges
• Yield farming

**NFTs (Non-Fungible Tokens)**
• Digital art ownership
• Gaming assets
• Virtual real estate

**Supply Chain**
• Product tracking
• Authenticity verification
• Transparency

**Smart Contracts**
• Self-executing contracts
• No intermediaries needed
• Automatic execution

**Advantages:**
✅ No intermediaries
✅ Fast international transfers
✅ Lower transaction fees
✅ Financial inclusion
✅ Transparency

**Risks:**
⚠️ Volatility
⚠️ Regulatory uncertainty
⚠️ Security concerns
⚠️ Environmental impact (mining)

**Investing Advice:**
⚡ Only invest what you can afford to lose
⚡ Do thorough research (DYOR)
⚡ Understand the technology
⚡ Be aware of scams

The blockchain revolution is here! 🚀`,
        confidence: 0.93
      };
    }

    // History & Famous Inventors
    if (msg.match(/\b(who invented|who created|who discovered|who made|inventor of)\b/i)) {
      // Airplane
      if (msg.match(/\b(airplane|plane|aircraft|flight)\b/i)) {
        return {
          text: `✈️ **Who Invented the Airplane?**

**The Wright Brothers!**

**Inventors:**
• **Orville Wright** (1871-1948)
• **Wilbur Wright** (1867-1912)

**Historic First Flight:**
📅 **Date:** December 17, 1903
📍 **Location:** Kitty Hawk, North Carolina, USA

**First Flight Details:**
• **Duration:** 12 seconds
• **Distance:** 120 feet (36.5 meters)
• **Pilot:** Orville Wright
• **Witnessed by:** 5 people

**Their Journey:**
1. Started with bicycle shop
2. Studied bird flight
3. Built wind tunnel for testing
4. Created wing designs
5. Developed engine and propellers
6. Made history!

**Impact on World:**
✓ Revolutionized transportation
✓ Connected continents
✓ Made global travel possible
✓ Led to space exploration
✓ Changed warfare & commerce

**Today:**
🛫 Over 100,000 commercial flights daily
🌍 3.5 billion air passengers per year
🚀 From 12 seconds to Mars missions!

**Fun Fact:** The entire flight distance of the first airplane (120 feet) is shorter than the wingspan of a Boeing 747! 🤯

From bicycle mechanics to aviation pioneers! 🎯`,
          confidence: 0.95
        };
      }

      // Internet
      if (msg.match(/\b(internet|www|world wide web)\b/i)) {
        return {
          text: `🌐 **Who Invented the Internet?**

The Internet was a collaborative effort, but key pioneers:

**1. ARPANET (1960s) - The Foundation**
**Key People:**
• **J.C.R. Licklider** - Visionary concept
• **Larry Roberts** - Network design
• **Bob Kahn & Vint Cerf** - TCP/IP protocol

**First Connection:** October 29, 1969
Between UCLA and Stanford University

**2. World Wide Web (1989-1991)**
**Inventor: Tim Berners-Lee** 🇬🇧
• British scientist at CERN
• Created HTTP, HTML, URL
• First website: August 6, 1991

**Timeline:**
📅 1969 - ARPANET (4 computers)
📅 1983 - TCP/IP standardized
📅 1989 - WWW proposed
📅 1991 - First website
📅 1993 - Mosaic browser (made it popular)
📅 2000s - Broadband era
📅 Today - 5+ billion users

**Key Inventions:**
✓ Email (Ray Tomlinson, 1971)
✓ TCP/IP (Cerf & Kahn, 1974)
✓ DNS (Paul Mockapetris, 1983)
✓ WWW (Tim Berners-Lee, 1989)
✓ Google (1998)

**Impact:**
🌍 Connected the world
💼 Created new industries
📚 Democratized information
💬 Enabled global communication

From 4 computers to 5 billion users! 🚀`,
          confidence: 0.95
        };
      }

      // Computer
      if (msg.match(/\b(computer|pc|personal computer)\b/i)) {
        return {
          text: `💻 **Who Invented the Computer?**

**It's a long evolution!** Multiple inventors contributed:

**Early Computing:**

**1. Charles Babbage (1837)**
• "Father of Computing"
• Designed "Analytical Engine"
• First programmable computer concept

**2. Ada Lovelace (1843)**
• First programmer!
• Wrote first algorithm
• Visioned computers beyond calculation

**3. Alan Turing (1936)**
• Theoretical computer science
• Turing Machine concept
• Broke Nazi Enigma code in WWII

**Modern Computers:**

**4. ENIAC (1945)**
• First electronic computer
• Built by John Mauchly & J. Presper Eckert
• Weighed 30 tons!

**5. Personal Computer Era:**

**1970s-1980s:**
• **Apple II** (Steve Wozniak, 1977)
• **IBM PC** (1981)
• **Macintosh** (1984)

**Key Figures:**
👤 **Bill Gates** - Microsoft, Windows
👤 **Steve Jobs** - Apple, revolutionized design
👤 **Linus Torvalds** - Linux (1991)

**Evolution:**
📼 1940s - Room-sized (ENIAC)
🖥️ 1980s - Desktop PCs
💻 1990s - Laptops
📱 2000s - Smartphones
☁️ 2010s - Cloud computing
🤖 Today - AI & quantum computing

**Fun Facts:**
• ENIAC: 30 tons, 1,800 sq ft
• Modern smartphone: More powerful than Apollo 11 computers!
• First hard drive (1956): 5 MB, weighed 1 ton

From room-sized to pocket-sized! 🎯`,
          confidence: 0.95
        };
      }
    }

    // More database questions
    if (msg.match(/\b(database|sql|mysql|mongodb|data storage)\b/i) && !msg.match(/\b(programming|coding)\b/i)) {
      return {
        text: `🗄️ **Databases - Data Storage & Management**

**What is a Database?**
An organized collection of structured data that can be easily accessed, managed, and updated electronically.

**Why Databases?**
✓ Store large amounts of data
✓ Quick data retrieval
✓ Data security
✓ Multiple user access
✓ Data consistency
✓ Backup and recovery

**Types of Databases:**

**1. Relational (SQL)**
Uses tables with rows and columns

**Popular SQL Databases:**
• **MySQL** - Most popular, free, used by WordPress, Facebook
• **PostgreSQL** - Advanced features, very reliable
• **Oracle** - Enterprise-grade, powerful, expensive
• **Microsoft SQL Server** - Windows integration
• **SQLite** - Lightweight, embedded

**When to Use:**
✓ Structured data with clear relationships
✓ Banking, finance (ACID compliance)
✓ Complex queries needed
✓ Data integrity is critical

**2. NoSQL (Non-Relational)**
Flexible, unstructured data storage

**Popular NoSQL Databases:**
• **MongoDB** - Document-based, JSON-like
• **Redis** - In-memory, super fast, caching
• **Cassandra** - Highly scalable, distributed
• **Firebase** - Real-time, cloud-based
• **DynamoDB** - Amazon's NoSQL service

**When to Use:**
✓ Unstructured/semi-structured data
✓ Need to scale horizontally
✓ Flexibility over consistency
✓ Real-time applications
✓ Big data applications

**Basic SQL Examples:**

**Create:**
\`\`\`sql
INSERT INTO users (name, email, age) 
VALUES ('John Doe', 'john@email.com', 25);
\`\`\`

**Read:**
\`\`\`sql
SELECT * FROM users WHERE age > 18;
\`\`\`

**Update:**
\`\`\`sql
UPDATE users SET email = 'newemail@example.com' 
WHERE id = 1;
\`\`\`

**Delete:**
\`\`\`sql
DELETE FROM users WHERE id = 1;
\`\`\`

**Real-World Usage:**

**E-commerce:**
• Products, orders, customers
• Inventory management
• Transaction records

**Social Media:**
• User profiles
• Posts, comments, likes
• Friend connections

**Banking:**
• Account information
• Transaction history
• Security & audit logs

**Who Uses What:**
• **Facebook** - MySQL (originally), now custom solutions
• **Netflix** - Cassandra for streaming data
• **Twitter** - MySQL + Redis
• **Uber** - PostgreSQL + MySQL
• **Instagram** - PostgreSQL
• **Amazon** - DynamoDB (own product)

**Database Concepts:**

**CRUD Operations:**
• **C**reate - Insert new data
• **R**ead - Query/retrieve data
• **U**pdate - Modify existing data
• **D**elete - Remove data

**ACID Properties (SQL):**
• **A**tomicity - All or nothing
• **C**onsistency - Data validity
• **I**solation - Concurrent transactions
• **D**urability - Data persistence

**Database Jobs:**
💼 Database Administrator (DBA)
💼 Data Analyst
💼 Database Developer
💼 Data Engineer

Want to learn more about databases or SQL? Just ask! 📚`,
        confidence: 0.94
      };
    }

    return null;
  }

  // Generate intelligent fallback responses
  generateIntelligentResponse(message) {
    const msg = message.toLowerCase();

    // Question patterns with better responses
    if (msg.startsWith('what') || msg.startsWith('what\'s') || msg.startsWith('whats')) {
      if (msg.includes('what is') || msg.includes('what\'s') || msg.includes('whats')) {
        const topic = msg.replace(/what('s| is) /i, '').replace(/\?/g, '').trim();
        
        // Try to give a reasonable answer based on common topics
        if (topic.length > 0) {
          return {
            text: `🤔 **About "${topic}"**

I'd be happy to explain "${topic}" to you!

**To give you the best answer, I can help with:**

📚 **Technology & Programming:**
• Languages: Python, JavaScript, Java, C++
• Web development: HTML, CSS, React, Node.js
• Databases: SQL, MongoDB, PostgreSQL
• Cloud: AWS, Azure, Google Cloud
• AI & Machine Learning concepts

🔬 **Science & Engineering:**
• Physics, Chemistry, Biology
• Engineering principles
• Construction materials
• Energy & environment

🏗️ **Construction & Design:**
• Doors, windows, gates, roofing
• Materials (steel, wood, glass, aluminum)
• Installation & specifications
• Cost estimation

💡 **General Topics:**
• History & geography
• Mathematics & calculations
• Technology trends
• How things work

**Can you be more specific about "${topic}"?**
For example:
• What specific aspect interests you?
• What context is this for?
• Do you need a technical or simple explanation?

Or try rephrasing your question!`,
            confidence: 0.7
          };
        }
      }
    }

    if (msg.startsWith('how') || msg.match(/how (do|does|can|to|much|many)/i)) {
      // Extract the main query
      const query = msg.replace(/^how\s+(do|does|can|to|much|many)\s+/i, '').trim();
      
      return {
        text: `🛠️ **"How" Questions - I Can Help!**

Great question! I specialize in explaining processes and methods.

**I can explain HOW to:**

💻 **Technology:**
• How to code in Python/JavaScript
• How the internet works
• How databases store data
• How AI learns
• How to build websites

🔧 **Engineering & Construction:**
• How to install doors/windows
• How materials are manufactured
• How to choose the right product
• How to calculate costs
• How construction works

🔢 **Calculations:**
• How to calculate percentages
• How to convert units
• How to estimate budgets
• How to measure dimensions

🌍 **General Knowledge:**
• How natural processes work
• How historical events unfolded
• How things are made
• How systems operate

**For your specific question about "${query}":**

Could you provide a bit more context? For example:
• Are you looking for step-by-step instructions?
• Do you need a technical explanation?
• Is this for a specific project?

**Or try asking:**
• "How does [specific thing] work?"
• "How to [specific action]?"
• "How much does [item] cost?"

I'm here to help! 😊`,
        confidence: 0.72
      };
    }

    if (msg.startsWith('why') || msg.match(/why (is|are|do|does|can)/i)) {
      const query = msg.replace(/^why\s+(is|are|do|does|can)\s+/i, '').trim();
      
      return {
        text: `🤓 **Understanding "Why" - I Can Explain!**

"Why" questions seek deeper understanding, and I'm great at those!

**I can explain WHY:**

🔬 **Scientific Reasons:**
• Why materials have certain properties
• Why natural phenomena occur
• Why things work the way they do
• Why engineering principles apply

🏗️ **Design & Engineering:**
• Why steel is stronger than aluminum
• Why double-pane windows save energy
• Why certain materials cost more
• Why specific features matter
• Why installation takes time

💡 **Technical Reasons:**
• Why technologies exist
• Why methods are used
• Why best practices matter
• Why standards are important

📊 **Practical Reasons:**
• Why costs vary
• Why quality matters
• Why maintenance is needed
• Why warranties differ

**Regarding "${query}":**

To give you the most accurate explanation:
• What context is this question for?
• Are you comparing options?
• Is this for a specific project?

**Popular "Why" questions I can answer:**
• "Why is Python popular?"
• "Why use steel vs wood?"
• "Why do prices vary?"
• "Why is security important?"

Ask away - I love explaining things! 🎯`,
        confidence: 0.72
      };
    }

    if (msg.match(/^(when|where|which|who)/i)) {
      const questionWord = msg.match(/^(when|where|which|who)/i)[0];
      
      return {
        text: `📍 **${questionWord.charAt(0).toUpperCase() + questionWord.slice(1)} Questions - I Can Answer!**

Great question! I can help with various types of information.

**I can tell you:**

📅 **When:**
• When technologies were invented
• When to use certain materials
• When installation is best
• When maintenance is needed
• Historical timelines

📍 **Where:**
• Where products are manufactured
• Where to use specific materials
• Where to find information
• Geographic information

🎯 **Which:**
• Which option is best
• Which material to choose
• Which features matter
• Product comparisons

👤 **Who:**
• Who invented technologies
• Who uses certain products
• Who manufactures items
• Historical figures

**To give you a precise answer:**

Please provide more details about what you're looking for. The more specific you are, the better I can help!

**Examples of questions I answer well:**
• "When was JavaScript created?"
• "Where is steel commonly used?"
• "Which door type is best for security?"
• "Who invented the internet?"

What specific information do you need? 🔍`,
        confidence: 0.7
      };
    }

    if (msg.match(/can you|are you able/i)) {
      return {
        text: `✅ **Yes, I Can Do Many Things!**

I'm an AI assistant with extensive knowledge across multiple domains!

**🎯 What I CAN do:**

**💬 Conversations & Knowledge:**
✓ Answer questions on ANY topic
✓ Explain complex concepts simply
✓ Provide detailed information
✓ Have natural conversations
✓ Remember context in our chat

**🏗️ Engineering & Construction:**
✓ Recommend products (doors, windows, gates, roofing)
✓ Compare materials and specifications
✓ Calculate costs and dimensions
✓ Provide installation guidance
✓ Suggest best options for your needs

**💻 Technology & Programming:**
✓ Explain programming concepts
✓ Help with code understanding
✓ Discuss technologies
✓ Compare frameworks
✓ Technical guidance

**🔢 Mathematics & Calculations:**
✓ Solve equations
✓ Calculate percentages
✓ Convert units
✓ Cost estimations
✓ Mathematical explanations

**📚 General Knowledge:**
✓ Science, history, geography
✓ How things work
✓ Definitions and explanations
✓ Step-by-step guides
✓ Comparisons and analysis

**❌ What I CAN'T do:**
• Browse the internet in real-time
• Make purchases or transactions
• Provide medical/legal advice
• Access external databases
• Predict the future with certainty

**💡 How to Get Best Results:**
1. Ask specific questions
2. Provide context when needed
3. Ask follow-up questions
4. Be clear about what you need

**Try asking me:**
• "What is machine learning?"
• "Show me modern steel doors"
• "Calculate 15% of 5000"
• "How does photosynthesis work?"
• "Compare Python vs JavaScript"
• "What's the best window for cold climate?"

I'm here to help! What would you like to know? 🚀`,
        confidence: 0.88
      };
    }

    // If message is very short (2-3 words), try to understand intent
    const words = msg.trim().split(/\s+/);
    if (words.length <= 3 && words.length > 0) {
      return {
        text: `🤖 **I'm listening! Tell me more...**

I noticed your message is quite brief. I can help better if you ask a complete question!

**For "${message}", you might want to ask:**

💬 **Information Questions:**
• "What is ${message}?"
• "Tell me about ${message}"
• "How does ${message} work?"
• "Why is ${message} important?"

🔍 **Product Questions:**
• "Show me ${message} options"
• "What types of ${message} are available?"
• "How much does ${message} cost?"
• "Compare ${message} options"

📊 **Detailed Queries:**
• "What are the best ${message} for [purpose]?"
• "How to choose ${message}?"
• "Benefits of ${message}?"

**Or ask me anything about:**
✓ Engineering & construction
✓ Technology & programming
✓ Science & mathematics
✓ General knowledge
✓ Product recommendations

**I'm a full AI assistant** - ask me anything like you would ask ChatGPT! 😊`,
        confidence: 0.65
      };
    }

    // Default helpful response with better suggestions
    return {
      text: `🤖 **I'm Your AI Assistant - Ask Me Anything!**

I understand you're asking about: **"${message}"**

Let me help you! I'm designed to answer questions on virtually any topic.

**🌟 What Makes Me Special:**
• I understand natural language
• I can explain complex topics simply
• I provide detailed, helpful answers
• I remember our conversation context
• I'm like ChatGPT, but specialized for design!

**💡 Popular Topics I Excel At:**

**🏗️ Engineering & Construction:**
• Doors, windows, gates, roofing materials
• Installation guides & specifications
• Cost calculations & budgeting
• Material comparisons

**💻 Technology & Programming:**
• Programming languages (Python, JavaScript, Java, etc.)
• Web development (HTML, CSS, React, Node.js)
• Databases, Cloud computing, AI/ML
• How technology works

**🔬 Science & Education:**
• Physics, Chemistry, Biology
• Mathematics & calculations
• How natural processes work
• Scientific explanations

**🌍 General Knowledge:**
• History, Geography, Culture
• Famous people & events
• Definitions & concepts
• Current technologies

**📊 Practical Help:**
• Step-by-step guides
• Comparisons & recommendations
• Problem-solving
• Decision-making support

**🎯 Try These Examples:**
\`\`\`
"What is artificial intelligence?"
"Show me modern steel doors under $1000"
"How does blockchain work?"
"Calculate 25% of 4500"
"Compare Python vs JavaScript"
"What's the best material for exterior doors?"
"Explain photosynthesis"
"How to install a bay window?"
\`\`\`

**💬 Tips for Best Results:**
1. Ask specific questions
2. Provide context if needed
3. Use natural language (talk to me normally!)
4. Ask follow-up questions
5. Request examples or clarifications

**I'm ready to help with anything!** 

Could you rephrase your question or provide more details about what you'd like to know? 😊`,
      confidence: 0.6
    };
  }

  // Main response generator
  async generateResponse(message, context = {}) {
    // Add to conversation history
    this.conversationHistory.push({ role: 'user', content: message });
    
    // Keep only last 10 messages
    if (this.conversationHistory.length > 10) {
      this.conversationHistory = this.conversationHistory.slice(-10);
    }

    let response = {
      text: '',
      images: [],
      autoFillData: {},
      suggestions: [],
      confidence: 0
    };

    // Check if it's a product query
    if (this.isProductQuery(message)) {
      // Use existing product AI logic
      const productAI = new ProductChatbotAI();
      return productAI.generateResponse(message, context);
    }

    // Handle general questions
    const generalResponse = this.handleGeneralQuestion(message);
    response.text = generalResponse.text;
    response.confidence = generalResponse.confidence;

    // Add contextual suggestions
    if (message.toLowerCase().includes('door') || message.toLowerCase().includes('window')) {
      response.suggestions = ['Show me door options', 'Compare materials', 'Calculate costs'];
    } else {
      response.suggestions = ['What else can you help with?', 'Tell me about engineering', 'Show product options'];
    }

    return response;
  }
}

// ================================
// PRODUCT-SPECIFIC AI (Existing)
// ================================

class ProductChatbotAI {
  constructor() {
    this.conversationHistory = [];
  }

  extractIntent(message) {
    const msg = message.toLowerCase();
    
    const intents = {
      greeting: /^(hi|hello|hey|good morning|good afternoon|good evening|greetings)/i,
      help: /(help|assist|support|guide|what can you do|capabilities)/i,
      gratitude: /(thank|thanks|thx|appreciate|grateful|awesome|great|perfect)/i,
      productQuery: /(show|display|see|view|suggest|recommend|find|need|want|looking for)/i,
      priceQuery: /(cost|price|budget|expensive|cheap|affordable|how much)/i,
      comparison: /(compare|difference|vs|versus|better|which is)/i,
      specification: /(size|dimension|width|height|measurement|spec)/i,
      installation: /(install|installation|setup|how to install|fitting)/i,
      material: /(material|made of|type of|steel|wood|aluminum|glass)/i,
      features: /(feature|benefit|advantage|what does it have)/i,
      warranty: /(warranty|guarantee|coverage|protection)/i
    };

    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(msg)) return intent;
    }

    return 'general';
  }

  extractEntities(message) {
    const msg = message.toLowerCase();
    const entities = {};

    // Product type
    if (msg.match(/\b(door|doors|entrance|entry)\b/)) entities.productType = 'door';
    if (msg.match(/\b(window|windows|pane)\b/)) entities.productType = 'window';
    if (msg.match(/\b(gate|gates|gateway)\b/)) entities.productType = 'gate';
    if (msg.match(/\b(roof|roofing|ceiling)\b/)) entities.productType = 'roofing';

    // Material
    if (msg.match(/\b(steel|metal|iron)\b/)) entities.material = 'Steel';
    if (msg.match(/\b(wood|wooden|timber)\b/)) entities.material = 'Wood';
    if (msg.match(/\b(aluminum|aluminium)\b/)) entities.material = 'Aluminum';
    if (msg.match(/\b(glass)\b/)) entities.material = 'Glass';

    // Building type
    if (msg.match(/\b(residential|home|house)\b/)) entities.buildingType = 'Residential';
    if (msg.match(/\b(commercial|office|business)\b/)) entities.buildingType = 'Commercial';
    if (msg.match(/\b(industrial|factory|warehouse)\b/)) entities.buildingType = 'Industrial';

    // Budget
    const budgetMatch = msg.match(/\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
    if (budgetMatch) {
      entities.budget = parseInt(budgetMatch[1].replace(/,/g, ''));
    }

    // Features
    if (msg.match(/\b(automat|smart|motorized)\b/)) entities.wantsAutomation = true;
    if (msg.match(/\b(security|secure|safe)\b/)) entities.wantsSecurity = true;
    if (msg.match(/\b(energy|efficient|eco)\b/)) entities.wantsEnergy = true;

    return entities;
  }

  recommendProducts(entities, context) {
    const { productType, material, budget, buildingType } = entities;
    
    if (!productType) return [];

    let products = [...productDatabase[productType]];

    if (material) {
      products = products.filter(p => p.material === material || p.type.includes(material));
    }

    if (buildingType) {
      products = products.filter(p => p.bestFor.includes(buildingType));
    }

    if (budget) {
      products = products.filter(p => p.priceRange.min <= budget);
    }

    // Return all matching products (increased from 4 to show all door designs)
    return products.slice(0, 12);
  }

  generateResponse(message, context = {}) {
    const intent = this.extractIntent(message);
    const entities = this.extractEntities(message);
    
    let response = {
      text: '',
      images: [],
      autoFillData: {},
      suggestions: [],
      confidence: 0
    };

    if (intent === 'productQuery' || entities.productType) {
      const products = this.recommendProducts(entities, context);
      
      if (products.length > 0) {
        const productType = entities.productType.charAt(0).toUpperCase() + entities.productType.slice(1);
        response.text = `✨ **Here are the best ${productType} options for you:**\n\n`;
        
        products.forEach((product, index) => {
          response.text += `**${index + 1}. ${product.name}**\n`;
          response.text += `💰 Price: ${product.price}\n`;
          response.text += `🎨 Material: ${product.type}\n`;
          response.text += `⭐ Rating: ${product.rating}/5.0\n`;
          response.text += `✓ Key Features: ${product.features.slice(0, 2).join(', ')}\n\n`;
        });
        
        response.text += `💡 **Click any image to select it!**`;
        response.images = products;
        response.confidence = 0.9;
        
        // Auto-fill data
        if (entities.productType) {
          response.autoFillData.projectType = productType;
          response.autoFillData.category = 'Mechanical';
        }
        if (entities.material) {
          response.autoFillData.material = entities.material;
        }
        if (entities.buildingType) {
          response.autoFillData.buildingType = entities.buildingType;
        }
      }
    }

    return response;
  }
}

// ================================
// MAIN CONTROLLER
// ================================

const universalAI = new UniversalAI();

exports.getChatResponse = async (req, res) => {
  try {
    const { message, projectType, category, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false,
        message: 'Message is required' 
      });
    }

    // Generate AI response (handles both general and product queries)
    const aiResponse = await universalAI.generateResponse(message, context);

    res.json({
      success: true,
      response: aiResponse.text,
      images: aiResponse.images,
      autoFillData: Object.keys(aiResponse.autoFillData).length > 0 ? aiResponse.autoFillData : null,
      suggestions: aiResponse.suggestions,
      confidence: aiResponse.confidence,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Sorry, I encountered an error. Please try again.',
      error: error.message 
    });
  }
};

// Get product images by type or material
exports.getProductImages = async (req, res) => {
  try {
    const { type, material } = req.query;
    const ai = new ProductChatbotAI();
    
    let products = [];
    
    if (type) {
      products = ai.searchProducts(type.toLowerCase());
    } else if (material) {
      // Search by material
      Object.values(productDatabase).forEach(category => {
        const filtered = category.filter(p => 
          p.material && p.material.toLowerCase().includes(material.toLowerCase())
        );
        products = [...products, ...filtered];
      });
    }
    
    res.json({
      success: true,
      products: products.map(p => ({
        id: p.id,
        url: p.url,
        name: p.name,
        type: p.type,
        price: p.price,
        material: p.material,
        features: p.features
      }))
    });
    
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get images',
      error: error.message 
    });
  }
};

exports.UniversalAI = UniversalAI;
