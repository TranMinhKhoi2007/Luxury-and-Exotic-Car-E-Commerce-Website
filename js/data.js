/**
 * APEX MOTORS - Mock Data Store
 * Luxury Supercars, Hypercars, Brands, Blogs & Showroom Info
 * 
 * DISCLAIMER: All prices, vehicle specifications, and showroom details
 * are illustrative mock data for demonstration purposes only.
 */

const APEX_DATA = {
  showroom: {
    name: "APEX MOTORS",
    tagline: "Beyond Speed. Beyond Luxury.",
    hotline: "+1 (800) 273-9668",
    email: "concierge@apexmotors.luxury",
    address: "740 5th Avenue, Luxury Mile, New York, NY 10019",
    businessHours: "Mon - Sat: 9:00 AM - 8:00 PM | Sun: By Appointment Only",
    demoNotice: "APEX MOTORS is a high-end luxury vehicle demonstration platform. Transactions and vehicle orders are strictly simulated for demonstration."
  },

  brands: [
    {
      id: "porsche",
      name: "Porsche",
      country: "Germany",
      founded: 1931,
      tagline: "Driven by Dreams",
      description: "Mastering precision engineering, race-bred agility, and timeless sports car aesthetics since 1931.",
      logo: "images/brands/brand-porsche.png",
      modelsCount: 4
    },
    {
      id: "ferrari",
      name: "Ferrari",
      country: "Italy",
      founded: 1939,
      tagline: "Essence of Italian Passion",
      description: "The pinnacle of Maranello motorsport heritage, screaming V8/V12 symphonies, and sculptured aerodynamic artistry.",
      logo: "images/brands/brand-ferrari.png",
      modelsCount: 4
    },
    {
      id: "lamborghini",
      name: "Lamborghini",
      country: "Italy",
      founded: 1963,
      tagline: "Expect the Unexpected",
      description: "Aggressive hexagonal architecture, naturally aspirated fury, and groundbreaking plug-in hybrid hypercars.",
      logo: "images/brands/brand-lamborghini.png",
      modelsCount: 3
    },
    {
      id: "bugatti",
      name: "Bugatti",
      country: "France",
      founded: 1909,
      tagline: "If Comparable, It Is No Longer Bugatti",
      description: "The ultimate hypercar royalty, combining 1,500+ horsepower quad-turbo engineering with bespoke French haute couture.",
      logo: "images/brands/brand-bugatti.png",
      modelsCount: 3
    },
    {
      id: "mclaren",
      name: "McLaren",
      country: "United Kingdom",
      founded: 1963,
      tagline: "Fearlessly Forward",
      description: "Formula 1 carbon-fibre monocoque architecture transferred directly into lightning-fast road legal track weapons.",
      logo: "images/brands/brand-mclaren.png",
      modelsCount: 3
    },
    {
      id: "aston-martin",
      name: "Aston Martin",
      country: "United Kingdom",
      founded: 1913,
      tagline: "Intensity. Driven.",
      description: "Quintessential British elegance wrapped around thunderous twin-turbo powerplants and bespoke handcrafted cockpits.",
      logo: "images/brands/brand-aston-martin.png",
      modelsCount: 2
    },
    {
      id: "koenigsegg",
      name: "Koenigsegg",
      country: "Sweden",
      founded: 1994,
      tagline: "The Spirit of Performance",
      description: "Swedish hypercar innovation breaking physical boundaries with Koenigsegg Freevalve, direct drive, and extreme mega-watts.",
      logo: "images/brands/brand-koenigsegg.png",
      modelsCount: 2
    }
  ],

  cars: [
    {
      id: "lamborghini-revuelto",
      brand: "Lamborghini",
      model: "Revuelto V12 HPEV",
      year: 2024,
      category: "Hypercar",
      price: 608358,
      originalPrice: 650000,
      badge: "Exclusive",
      color: "Orange",
      horsepower: 1001,
      topSpeed: 350,
      acceleration: "2.5s",
      torque: "1,062 Nm",
      engine: "6.5L Naturally Aspirated V12 + 3 Electric Motors",
      transmission: "8-speed Dual-Clutch Automatic",
      drivetrain: "All-Wheel Drive (e-AWD)",
      available: true,
      featured: true,
      collection: "latest",
      rating: 5.0,
      reviewsCount: 14,
      images: [
        "images/cars/lamborghini-revuelto-main.jpg",
        "images/cars/lamborghini-revuelto-side.jpg",
        "images/cars/lamborghini-revuelto-rear.jpg",
        "images/cars/lamborghini-revuelto-interior.jpg"
      ],
      description: "The Lamborghini Revuelto marks a revolutionary milestone as the first High Performance Electrified Vehicle (HPEV) hybrid super sports car from Sant'Agata Bolognese. Combining a ferocious 6.5-litre naturally aspirated mid-mounted V12 engine with three axial-flux electric motors, the Revuelto produces an astounding 1,001 horsepower through an all-new transversally mounted eight-speed dual-clutch transmission.",
      overview: "Carbon fiber 'monofuselage' monocoque chassis, active aerodynamic wing generating 61% more downforce than the Aventador Ultimae, and 13 driving modes spanning Recharge to Corsa.",
      technicalSpecs: {
        chassis: "Carbon-fiber Monofuselage with Forged Composites front frame",
        brakes: "Carbon Ceramic Brakes Plus (CCB Plus) 410x38mm front, 390x32mm rear",
        dryWeight: "1,772 kg",
        fuelTank: "63 Liters",
        emissions: "Euro 6d-ISC-FCM Compliant",
        batteryCapacity: "3.8 kWh Lithium-ion high-power pack"
      }
    },
    {
      id: "porsche-911-gt3-rs",
      brand: "Porsche",
      model: "911 GT3 RS (992)",
      year: 2024,
      category: "Sports Car",
      price: 241300,
      originalPrice: null,
      badge: "Track Legend",
      color: "White",
      horsepower: 518,
      topSpeed: 296,
      acceleration: "3.2s",
      torque: "465 Nm",
      engine: "4.0L High-Revving Naturally Aspirated Flat-6 (9,000 RPM)",
      transmission: "7-speed Porsche Doppelkupplung (PDK)",
      drivetrain: "Rear-Wheel Drive (RWD)",
      available: true,
      featured: true,
      collection: "topRated",
      rating: 4.9,
      reviewsCount: 28,
      images: [
        "images/cars/porsche-911-gt3-rs-main.jpg",
        "images/cars/porsche-911-gt3-rs-side.jpg",
        "images/cars/porsche-911-gt3-rs-rear.jpg",
        "images/cars/porsche-911-gt3-rs-interior.jpg"
      ],
      description: "The Porsche 911 GT3 RS represents the unapologetic translation of motorsport DNA into a road-registered track titan. With its colossal swan-neck rear wing equipped with Formula 1-style Drag Reduction System (DRS), centrally mounted single radiator concept, and carbon-fiber roll cage, it delivers unmatched downforce and telepathic cornering precision.",
      overview: "Generates 860 kg of active downforce at 285 km/h. Fitted with steering-wheel dials adjusting differential locking, traction control, and damper rebound/compression on the fly.",
      technicalSpecs: {
        chassis: "Intelligent lightweight construction in aluminum and carbon fiber reinforced plastic (CFRP)",
        brakes: "Porsche Ceramic Composite Brake (PCCB) 410mm front, 390mm rear",
        dryWeight: "1,450 kg",
        fuelTank: "64 Liters (optional 90L extended)",
        emissions: "Euro 6d-ISC-FCM",
        batteryCapacity: "12V Lightweight Starter Battery"
      }
    },
    {
      id: "ferrari-sf90-xx-stradale",
      brand: "Ferrari",
      model: "SF90 XX Stradale",
      year: 2024,
      category: "Hypercar",
      price: 890000,
      originalPrice: 950000,
      badge: "Limited Edition",
      color: "Red",
      horsepower: 1030,
      topSpeed: 320,
      acceleration: "2.3s",
      torque: "804 Nm",
      engine: "3.9L Twin-Turbocharged V8 + 3 Electric Motors",
      transmission: "8-speed F1 Dual-Clutch Gearbox",
      drivetrain: "All-Wheel Drive (AWD)",
      available: true,
      featured: true,
      collection: "latest",
      rating: 5.0,
      reviewsCount: 9,
      images: [
        "images/cars/ferrari-sf90-xx-stradale-main.jpg",
        "images/cars/ferrari-sf90-xx-stradale-side.jpg",
        "images/cars/ferrari-sf90-xx-stradale-rear.jpg",
        "images/cars/ferrari-sf90-xx-stradale-interior.jpg"
      ],
      description: "The SF90 XX Stradale is the first road-legal vehicle created under Ferrari's elite XX Programme. Pushing the boundaries of track aero and hybrid powertrain synergy, it introduces a fixed rear wing reminiscent of the iconic F40 and produces 530 kg of downforce at 250 km/h, mated to a razor-sharp 1,030 cv propulsion unit.",
      overview: "Limited to just 799 coupe units worldwide. Features patented ABS EVO controller, extra boost logic for qualifying laps, and bespoke titanium engine components.",
      technicalSpecs: {
        chassis: "Multi-material aluminum and high-tensile carbon alloy spaceframe",
        brakes: "Carbon ceramic aero-calipers with redesigned brake-by-wire cooling",
        dryWeight: "1,560 kg",
        fuelTank: "68 Liters",
        emissions: "Euro 6d",
        batteryCapacity: "7.9 kWh High Performance Pack"
      }
    },
    {
      id: "bugatti-chiron-pur-sport",
      brand: "Bugatti",
      model: "Chiron Pur Sport",
      year: 2023,
      category: "Hypercar",
      price: 3600000,
      originalPrice: null,
      badge: "Masterpiece",
      color: "Blue",
      horsepower: 1500,
      topSpeed: 350,
      acceleration: "2.3s",
      torque: "1,600 Nm",
      engine: "8.0L Quad-Turbocharged W16 Engine",
      transmission: "7-speed Dual-Clutch with close gear ratios",
      drivetrain: "Permanent All-Wheel Drive",
      available: true,
      featured: true,
      collection: "popular",
      rating: 5.0,
      reviewsCount: 7,
      images: [
        "images/cars/bugatti-chiron-pur-sport-main.jpg",
        "images/cars/bugatti-chiron-pur-sport-side.jpg",
        "images/cars/bugatti-chiron-pur-sport-rear.jpg",
        "images/cars/bugatti-chiron-pur-sport-interior.jpg"
      ],
      description: "Engineered specifically for ferocious agility and rapid lateral g-forces, the Chiron Pur Sport takes Bugatti's legendary 8.0-liter W16 monster and refines it with 15% closer transmission gear ratios, a 1.90-meter fixed carbon rear spoiler, magnesium aerodynamic wheels, and an escalated 6,900 RPM redline.",
      overview: "Uncompromising corner carver. Accelerates from 60 to 120 km/h in 6th gear in just 4.4 seconds—almost three seconds faster than the standard Chiron.",
      technicalSpecs: {
        chassis: "Carbon fiber monocoque with 50,000 Nm per degree torsional rigidity",
        brakes: "Titanium brake calipers with 420mm front carbon-silicon carbide discs",
        dryWeight: "1,945 kg",
        fuelTank: "100 Liters",
        emissions: "Euro 6",
        batteryCapacity: "12V Lightweight Gel Battery"
      }
    },
    {
      id: "mclaren-750s-coupe",
      brand: "McLaren",
      model: "750S Coupe",
      year: 2024,
      category: "Supercar",
      price: 329500,
      originalPrice: 345000,
      badge: "New Arrival",
      color: "Orange",
      horsepower: 740,
      topSpeed: 332,
      acceleration: "2.8s",
      torque: "800 Nm",
      engine: "4.0L Twin-Turbocharged M840T V8",
      transmission: "7-speed Seamless Shift Gearbox (SSG)",
      drivetrain: "Rear-Wheel Drive (RWD)",
      available: true,
      featured: true,
      collection: "latest",
      rating: 4.8,
      reviewsCount: 19,
      images: [
        "images/cars/mclaren-750s-coupe-main.jpg",
        "images/cars/mclaren-750s-coupe-side.jpg",
        "images/cars/mclaren-750s-coupe-rear.jpg",
        "images/cars/mclaren-750s-coupe-interior.jpg"
      ],
      description: "Building upon the celebrated 720S legacy, the McLaren 750S is 30 kg lighter with 30% new or revised components. Delivering 740 bhp from its mid-mounted twin-turbo V8 through McLaren's bespoke Proactive Chassis Control III suspension, the 750S offers purest mechanical connection and devastating benchmark acceleration.",
      overview: "Segment-leading power-to-weight ratio of 579 bhp-per-tonne. Features central high-exit stainless steel exhaust system inspired by the McLaren P1.",
      technicalSpecs: {
        chassis: "Carbon Fibre Monocage II-S with integrated upper passenger cell",
        brakes: "Carbon ceramic matrix discs with lightweight monolithic 6-piston front calipers",
        dryWeight: "1,277 kg",
        fuelTank: "72 Liters",
        emissions: "Euro 6d-Temp",
        batteryCapacity: "12V Lithium-ion Battery"
      }
    },
    {
      id: "aston-martin-valkyrie",
      brand: "Aston Martin",
      model: "Valkyrie Hypercar",
      year: 2023,
      category: "Hypercar",
      price: 3500000,
      originalPrice: null,
      badge: "Exclusive",
      color: "Silver",
      horsepower: 1160,
      topSpeed: 355,
      acceleration: "2.5s",
      torque: "900 Nm",
      engine: "6.5L Cosworth Naturally Aspirated V12 (11,100 RPM) + KERS",
      transmission: "7-speed Ricardo Single-Clutch Paddle Shift",
      drivetrain: "Rear-Wheel Drive (RWD)",
      available: true,
      featured: true,
      collection: "topRated",
      rating: 5.0,
      reviewsCount: 5,
      images: [
        "images/cars/aston-martin-valkyrie-main.jpg",
        "images/cars/aston-martin-valkyrie-side.jpg",
        "images/cars/aston-martin-valkyrie-rear.jpg",
        "images/cars/aston-martin-valkyrie-interior.jpg"
      ],
      description: "Co-developed with Red Bull Racing aerodynamicist Adrian Newey, the Aston Martin Valkyrie is as close to an LMP1 prototype racing car as legally permitted on public roads. Its naturally aspirated Cosworth 6.5-litre V12 screams to an astronomical 11,100 rpm, encased within a teardrop full carbon chassis with deep Venturi floor tunnels.",
      overview: "Generates up to 1,100 kg of aerodynamic downforce at speed without massive drag-inducing wings. Drivers sit in a reclined feet-up Formula 1 seating position.",
      technicalSpecs: {
        chassis: "100% Carbon fiber tub without a single steel structural component",
        brakes: "Surface Transforms Carbon Ceramic Matrix discs 420mm front, 385mm rear",
        dryWeight: "1,030 kg",
        fuelTank: "60 Liters",
        emissions: "Low volume homologated",
        batteryCapacity: "Rimac lightweight hybrid KERS pack"
      }
    },
    {
      id: "koenigsegg-jesko-attack",
      brand: "Koenigsegg",
      model: "Jesko Attack",
      year: 2024,
      category: "Hypercar",
      price: 3400000,
      originalPrice: null,
      badge: "Exclusive",
      color: "White",
      horsepower: 1600,
      topSpeed: 480,
      acceleration: "2.4s",
      torque: "1,500 Nm",
      engine: "5.0L Twin-Turbo Flat-Plane V8 with Air-Injection",
      transmission: "9-speed Koenigsegg Light Speed Transmission (LST)",
      drivetrain: "Rear-Wheel Drive with Electronic Differential",
      available: true,
      featured: true,
      collection: "popular",
      rating: 5.0,
      reviewsCount: 8,
      images: [
        "images/cars/koenigsegg-jesko-attack-main.jpg",
        "images/cars/koenigsegg-jesko-attack-side.jpg",
        "images/cars/koenigsegg-jesko-attack-rear.jpg",
        "images/cars/koenigsegg-jesko-attack-interior.jpg"
      ],
      description: "The Koenigsegg Jesko Attack is the definitive apex high-downforce weapon named after founder Christian von Koenigsegg's father. Featuring the world's lightest V8 flat-plane crankshaft, patented Light Speed Transmission that shifts between any gear seamlessly, and up to 1,400 kg of extreme downforce.",
      overview: "Active rear-wheel steering, triplex front damper suspension preventing squat under aggressive acceleration, and dihedral synchro-helix actuation doors.",
      technicalSpecs: {
        chassis: "Carbon fiber monocoque sandwich construction with aluminum honeycomb",
        brakes: "Koenigsegg ceramic discs with 6-piston front and 4-piston rear calipers",
        dryWeight: "1,320 kg",
        fuelTank: "72 Liters",
        emissions: "Compliant globally",
        batteryCapacity: "Supercapacitor assisted electronics"
      }
    },
    {
      id: "ferrari-296-gtb",
      brand: "Ferrari",
      model: "296 GTB Assetto Fiorano",
      year: 2024,
      category: "Supercar",
      price: 342205,
      originalPrice: 360000,
      badge: "New Arrival",
      color: "Yellow",
      horsepower: 819,
      topSpeed: 330,
      acceleration: "2.9s",
      torque: "740 Nm",
      engine: "3.0L 120° Twin-Turbo V6 + Rear MGU-K Electric Motor",
      transmission: "8-speed Dual-Clutch F1 Transmission",
      drivetrain: "Rear-Wheel Drive (RWD)",
      available: true,
      featured: true,
      collection: "popular",
      rating: 4.9,
      reviewsCount: 22,
      images: [
        "images/cars/ferrari-296-gtb-main.jpg",
        "images/cars/ferrari-296-gtb-side.jpg",
        "images/cars/ferrari-296-gtb-rear.jpg",
        "images/cars/ferrari-296-gtb-interior.jpg"
      ],
      description: "Defining 'fun to drive' in the modern era, the Ferrari 296 GTB introduces a 120° wide-angle twin-turbo V6 affectionately nicknamed the 'piccolo V12'. Together with an electric motor derived from Formula 1, it unleashes 830 cv with telepathic throttle response and intoxicating exhaust harmonics.",
      overview: "Equipped with the high-performance Assetto Fiorano pack: Multimatic DSSV racing dampers, carbon fiber aerodynamic lips, and Lexan lightweight rear screen.",
      technicalSpecs: {
        chassis: "Short wheelbase modular aluminum architecture for nimble rotation",
        brakes: "Brembo Aero carbon ceramic discs with 6-way chassis dynamic sensor",
        dryWeight: "1,470 kg",
        fuelTank: "65 Liters",
        emissions: "Euro 6d",
        batteryCapacity: "7.45 kWh high-voltage lithium battery"
      }
    },
    {
      id: "porsche-918-spyder",
      brand: "Porsche",
      model: "918 Spyder Weissach Package",
      year: 2022,
      category: "Hypercar",
      price: 1850000,
      originalPrice: null,
      badge: "Collector Icon",
      color: "Silver",
      horsepower: 887,
      topSpeed: 345,
      acceleration: "2.6s",
      torque: "1,280 Nm",
      engine: "4.6L Naturally Aspirated V8 + Dual Electric Motors",
      transmission: "7-speed Porsche Doppelkupplung (PDK)",
      drivetrain: "All-Wheel Drive (AWD)",
      available: true,
      featured: false,
      collection: "topRated",
      rating: 5.0,
      reviewsCount: 31,
      images: [
        "images/cars/porsche-918-spyder-main.jpg",
        "images/cars/porsche-918-spyder-side.jpg",
        "images/cars/porsche-918-spyder-rear.jpg",
        "images/cars/porsche-918-spyder-interior.jpg"
      ],
      description: "One-third of the legendary 'Holy Trinity' of hypercars, the Porsche 918 Spyder combines a 9,150 RPM racing V8 with twin electric motors and top-exit exhaust pipes. The Weissach package shaves 41 kg through magnesium wheels, ceramic wheel bearings, and exposed carbon aero addenda.",
      overview: "Sub-7 minute Nürburgring Nordschleife conqueror. Capable of silent electric cruising or thunderous hypercar sprint with rear-axle steering.",
      technicalSpecs: {
        chassis: "Carbon fiber reinforced plastics (CFRP) monocoque with unit carrier",
        brakes: "PCCB carbon-ceramic brake discs 410mm front, 390mm rear",
        dryWeight: "1,634 kg",
        fuelTank: "70 Liters",
        emissions: "Euro 6",
        batteryCapacity: "6.8 kWh liquid-cooled lithium-ion pack"
      }
    },
    {
      id: "lamborghini-huracan-sterrato",
      brand: "Lamborghini",
      model: "Huracán Sterrato All-Terrain",
      year: 2024,
      category: "Supercar",
      price: 278972,
      originalPrice: null,
      badge: "Limited Edition",
      color: "Blue",
      horsepower: 602,
      topSpeed: 260,
      acceleration: "3.4s",
      torque: "560 Nm",
      engine: "5.2L Naturally Aspirated V10",
      transmission: "7-speed Dual-Clutch LDF",
      drivetrain: "All-Wheel Drive with mechanical rear self-locking differential",
      available: true,
      featured: false,
      collection: "latest",
      rating: 4.8,
      reviewsCount: 16,
      images: [
        "images/cars/lamborghini-huracan-sterrato-main.jpg",
        "images/cars/lamborghini-huracan-sterrato-side.jpg",
        "images/cars/lamborghini-huracan-sterrato-rear.jpg",
        "images/cars/lamborghini-huracan-sterrato-interior.jpg"
      ],
      description: "The Huracán Sterrato is the world's first all-terrain super sports car equipped with a naturally aspirated V10. Raised by 44mm with widened front/rear tracks, reinforced sills, aluminum front underbody protection, and roof snorkel intake, it drifts effortlessly on loose gravel and tarmac alike.",
      overview: "Special rally mode for low-grip surfaces, Bridgestone Dueler all-terrain run-flat tyres, and auxiliary front bumper LED spotlights.",
      technicalSpecs: {
        chassis: "Hybrid chassis in aluminum and carbon fiber with reinforced suspension mounts",
        brakes: "Carbon ceramic brake discs with 6-piston front and 4-piston rear calipers",
        dryWeight: "1,470 kg",
        fuelTank: "80 Liters",
        emissions: "Euro 6d",
        batteryCapacity: "12V Standard Auxiliary Battery"
      }
    },
    {
      id: "mclaren-p1-gtr",
      brand: "McLaren",
      model: "McLaren P1 GTR Road Spec",
      year: 2022,
      category: "Hypercar",
      price: 2950000,
      originalPrice: 3200000,
      badge: "Exclusive",
      color: "Yellow",
      horsepower: 986,
      topSpeed: 362,
      acceleration: "2.4s",
      torque: "1,000 Nm",
      engine: "3.8L Twin-Turbocharged V8 + Lightweight Electric Motor",
      transmission: "7-speed Dual-Clutch Gearbox",
      drivetrain: "Rear-Wheel Drive (RWD)",
      available: true,
      featured: false,
      collection: "topRated",
      rating: 5.0,
      reviewsCount: 11,
      images: [
        "images/cars/mclaren-p1-gtr-main.jpg",
        "images/cars/mclaren-p1-gtr-side.jpg",
        "images/cars/mclaren-p1-gtr-rear.jpg",
        "images/cars/mclaren-p1-gtr-interior.jpg"
      ],
      description: "Conceived as the purest track car ever built by McLaren, and professionally converted for road legality by Lanzante Motorsport. Featuring an expansive fixed rear wing with DRS actuator, onboard titanium straight-pipe inconel exhaust, and 1,000 metric horsepower.",
      overview: "One of only 58 GTR chassis ever built. Features polycarbonate side windows with sliding ticket hatches and carbon fiber race bucket cockpit.",
      technicalSpecs: {
        chassis: "McLaren MonoCage carbon fiber tub",
        brakes: "Akebono layered carbon ceramic brake system",
        dryWeight: "1,345 kg",
        fuelTank: "70 Liters",
        emissions: "Exempt / Road Converted SVA",
        batteryCapacity: "4.7 kWh high-density track battery"
      }
    },
    {
      id: "bugatti-tourbillon",
      brand: "Bugatti",
      model: "Tourbillon V16",
      year: 2025,
      category: "Hypercar",
      price: 4100000,
      originalPrice: null,
      badge: "Exclusive",
      color: "Black",
      horsepower: 1800,
      topSpeed: 445,
      acceleration: "2.0s",
      torque: "2,000 Nm",
      engine: "8.3L Cosworth Naturally Aspirated V16 (9,000 RPM) + 3 Electric Motors",
      transmission: "8-speed Longitudinal Dual-Clutch Gearbox",
      drivetrain: "All-Wheel Drive (Electric Front Axle)",
      available: true,
      featured: true,
      collection: "latest",
      rating: 5.0,
      reviewsCount: 4,
      images: [
        "images/cars/bugatti-tourbillon-main.jpg",
        "images/cars/bugatti-tourbillon-side.jpg",
        "images/cars/bugatti-tourbillon-rear.jpg",
        "images/cars/bugatti-tourbillon-interior.jpg"
      ],
      description: "The dawn of a new Bugatti epoch. The Tourbillon abandons turbochargers in favor of an awe-inspiring 8.3-litre naturally aspirated V16 engine crafted with Cosworth that revs to 9,000 RPM, augmented by three electric motors producing a colossal 1,800 horsepower.",
      overview: "Interior instrument cluster manufactured by Swiss horologists using over 600 titanium, sapphire and ruby watchmaker components.",
      technicalSpecs: {
        chassis: "Next-gen T800 carbon composite monocoque with 3D-printed organic suspension wishbones",
        brakes: "Brembo Carbo-Silicium brake matrix with integrated aero cooling",
        dryWeight: "1,995 kg",
        fuelTank: "90 Liters",
        emissions: "Euro 6e compliant",
        batteryCapacity: "25 kWh 800V oil-cooled battery pack"
      }
    },
    {
      id: "aston-martin-dbs-770-ultimate",
      brand: "Aston Martin",
      model: "DBS 770 Ultimate Coupe",
      year: 2023,
      category: "Grand Tourer",
      price: 387600,
      originalPrice: 410000,
      badge: "Limited Edition",
      color: "Black",
      horsepower: 759,
      topSpeed: 340,
      acceleration: "3.4s",
      torque: "900 Nm",
      engine: "5.2L Twin-Turbocharged V12",
      transmission: "ZF 8-speed Automatic with recalibrated shift times",
      drivetrain: "Rear-Wheel Drive with mechanical limited-slip differential",
      available: true,
      featured: false,
      collection: "popular",
      rating: 4.9,
      reviewsCount: 15,
      images: [
        "images/cars/aston-martin-dbs-770-main.jpg",
        "images/cars/aston-martin-dbs-770-side.jpg",
        "images/cars/aston-martin-dbs-770-rear.jpg",
        "images/cars/aston-martin-dbs-770-interior.jpg"
      ],
      description: "The ferocious farewell to Aston Martin's flagship Super GT lineage. Boasting a breathtaking 770 PS output from its twin-turbo 5.2-litre V12, bespoke carbon fiber horseshoe hood louvers, and a 25% stiffer front crossmember for razor-sharp turn-in authority.",
      overview: "Limited to just 300 coupes worldwide. Finished with Sports Plus semi-aniline leather and Alcantara quilted seats with laser-etched badge accents.",
      technicalSpecs: {
        chassis: "Extruded bonded aluminum structure with carbon fiber composite body panels",
        brakes: "Carbon ceramic matrix discs 410mm front, 360mm rear",
        dryWeight: "1,845 kg",
        fuelTank: "78 Liters",
        emissions: "Euro 6",
        batteryCapacity: "12V AGM High Performance Battery"
      }
    },
    {
      id: "koenigsegg-gemera",
      brand: "Koenigsegg",
      model: "Gemera HV8 (Hybrid V8)",
      year: 2024,
      category: "Grand Tourer",
      price: 2100000,
      originalPrice: null,
      badge: "New Arrival",
      color: "Silver",
      horsepower: 2300,
      topSpeed: 400,
      acceleration: "1.9s",
      torque: "2,750 Nm",
      engine: "5.0L Hot-V Twin-Turbo V8 + 'Dark Matter' E-Motor",
      transmission: "9-speed Koenigsegg Light Speed Tourbillon Transmission (LSTT)",
      drivetrain: "All-Wheel Drive with All-Wheel Torque Vectoring",
      available: true,
      featured: true,
      collection: "latest",
      rating: 5.0,
      reviewsCount: 6,
      images: [
        "images/cars/koenigsegg-gemera-main.jpg",
        "images/cars/koenigsegg-gemera-side.jpg",
        "images/cars/koenigsegg-gemera-rear.jpg",
        "images/cars/koenigsegg-gemera-interior.jpg"
      ],
      description: "The world's first 'Mega-GT' offering four full-sized adult seats, ample luggage capacity for four carry-ons, and a mind-bending 2,300 horsepower when optioned with the Jesko-derived 5.0-litre Hot-V V8 paired with the patent-pending 800 hp 'Dark Matter' radial-flux electric motor.",
      overview: "B-pillarless Koenigsegg automated dihedral synchro-helix doors for effortless entry into front and rear seats. Four heated and cooled cup holders.",
      technicalSpecs: {
        chassis: "Full carbon monocoque with rear subframe integration",
        brakes: "Ceramic discs with 6-piston front, 4-piston rear calipers with e-booster",
        dryWeight: "1,990 kg",
        fuelTank: "75 Liters",
        emissions: "Global homologation",
        batteryCapacity: "14 kWh 850V liquid-cooled battery pack"
      }
    },
    {
      id: "ferrari-purosangue",
      brand: "Ferrari",
      model: "Purosangue V12",
      year: 2024,
      category: "Grand Tourer",
      price: 398350,
      originalPrice: null,
      badge: "Exclusive",
      color: "Black",
      horsepower: 715,
      topSpeed: 310,
      acceleration: "3.3s",
      torque: "716 Nm",
      engine: "6.5L Naturally Aspirated 65° V12 (8,250 RPM)",
      transmission: "8-speed Dual-Clutch Oil-Bath F1 Gearbox",
      drivetrain: "4RM-S evo 4-Wheel Drive with 4-Wheel Independent Steering",
      available: true,
      featured: false,
      collection: "popular",
      rating: 4.9,
      reviewsCount: 18,
      images: [
        "images/cars/ferrari-purosangue-main.jpg",
        "images/cars/ferrari-purosangue-side.jpg",
        "images/cars/ferrari-purosangue-rear.jpg",
        "images/cars/ferrari-purosangue-interior.jpg"
      ],
      description: "Ferrari's first-ever four-door, four-seater sports car, staying strictly true to brand heritage with an unassisted 6.5-litre naturally aspirated V12 mounted mid-front. Features rear-hinged welcome doors and Ferrari's revolutionary 48V active suspension system eliminating anti-roll bars.",
      overview: "Equal 49:51% front-to-rear weight distribution. Four independently adjustable heated and massage leather lounge seats.",
      technicalSpecs: {
        chassis: "High-strength aluminum alloy spaceframe with carbon fiber roof",
        brakes: "Carbon ceramic discs 398x38mm front, 380x34mm rear",
        dryWeight: "2,033 kg",
        fuelTank: "100 Liters",
        emissions: "Euro 6d",
        batteryCapacity: "12V High-Output AGM Battery"
      }
    },
    {
      id: "porsche-taycan-turbo-gt",
      brand: "Porsche",
      model: "Taycan Turbo GT Weissach",
      year: 2024,
      category: "Sports Car",
      price: 231995,
      originalPrice: 245000,
      badge: "New Arrival",
      color: "Blue",
      horsepower: 1019,
      topSpeed: 305,
      acceleration: "2.2s",
      torque: "1,340 Nm",
      engine: "Dual Permanent Magnet Synchronous Motors with SiC Inverter",
      transmission: "2-speed Transmission on rear axle, 1-speed on front",
      drivetrain: "All-Wheel Drive (AWD)",
      available: true,
      featured: false,
      collection: "topRated",
      rating: 4.9,
      reviewsCount: 13,
      images: [
        "images/cars/porsche-taycan-turbo-gt-main.jpg",
        "images/cars/porsche-taycan-turbo-gt-side.jpg",
        "images/cars/porsche-taycan-turbo-gt-rear.jpg",
        "images/cars/porsche-taycan-turbo-gt-interior.jpg"
      ],
      description: "The fastest accelerating series-production Porsche in history. Generating up to 1,092 hp with Attack Mode enabled and silicon-carbide semiconductor inverters, the Taycan Turbo GT conquered WeatherTech Raceway Laguna Seca and the Nürburgring Nordschleife in record times.",
      overview: "Rear seat removed in Weissach package for a 75 kg weight saving, replaced with a bespoke carbon storage tray. Full carbon aerodynamic diffuser and fixed wing.",
      technicalSpecs: {
        chassis: "Porsche Active Ride suspension with hydraulic actuators per wheel",
        brakes: "PCCB ceramic composite with lightweight calipers and optimized disc chambers",
        dryWeight: "2,220 kg",
        range: "555 km (WLTP)",
        emissions: "Zero Local Emissions",
        batteryCapacity: "105 kWh Performance Battery Plus (97 kWh usable)"
      }
    },
    {
      id: "lamborghini-countach-lpi-800-4",
      brand: "Lamborghini",
      model: "Countach LPI 800-4",
      year: 2023,
      category: "Supercar",
      price: 2640000,
      originalPrice: null,
      badge: "Collector Icon",
      color: "White",
      horsepower: 803,
      topSpeed: 355,
      acceleration: "2.8s",
      torque: "755 Nm",
      engine: "6.5L Naturally Aspirated V12 + 48V Supercapacitor E-Motor",
      transmission: "7-speed ISR (Independent Shifting Rods)",
      drivetrain: "All-Wheel Drive with rear mechanical self-locking differential",
      available: true,
      featured: false,
      collection: "popular",
      rating: 4.8,
      reviewsCount: 7,
      images: [
        "images/cars/lamborghini-countach-lpi-main.jpg",
        "images/cars/lamborghini-countach-lpi-side.jpg",
        "images/cars/lamborghini-countach-lpi-rear.jpg",
        "images/cars/lamborghini-countach-lpi-interior.jpg"
      ],
      description: "A visionary celebration of the 50th anniversary of the quintessential poster car. Reinterpreting the unmistakable silhouette of Marcello Gandini's original Countach with contemporary carbon fiber muscularity and the Sián's supercapacitor hybrid V12 powertrain.",
      overview: "Strictly limited to 112 numbered examples globally. Hexagonal taillights, periscopio roof glass panel, and telephone-dial retro forged wheels.",
      technicalSpecs: {
        chassis: "Full carbon fiber monocoque and outer body panels",
        brakes: "Carbon ceramic brakes 400mm front, 380mm rear",
        dryWeight: "1,595 kg",
        fuelTank: "70 Liters",
        emissions: "Euro 6d",
        batteryCapacity: "48V High-Density Supercapacitor (3x lighter than equivalent lithium)"
      }
    },
    {
      id: "bugatti-bolide",
      brand: "Bugatti",
      model: "Bolide Track Titan",
      year: 2024,
      category: "Hypercar",
      price: 4400000,
      originalPrice: null,
      badge: "Exclusive",
      color: "Blue",
      horsepower: 1825,
      topSpeed: 500,
      acceleration: "2.17s",
      torque: "1,850 Nm",
      engine: "8.0L Quad-Turbocharged W16 (110 Octane Race Fuel)",
      transmission: "7-speed Dual-Clutch with reinforced carbon shafts",
      drivetrain: "All-Wheel Drive with triple locking differentials",
      available: true,
      featured: false,
      collection: "latest",
      rating: 5.0,
      reviewsCount: 3,
      images: [
        "images/cars/bugatti-bolide-main.jpg",
        "images/cars/bugatti-bolide-side.jpg",
        "images/cars/bugatti-bolide-rear.jpg",
        "images/cars/bugatti-bolide-interior.jpg"
      ],
      description: "The most radical, uncompromised, and fastest vehicle in modern Bugatti history. Built around the FIA LMH/LMDh motorsport safety cell, the Bolide weighs just 1,450 kg while producing 1,850 PS, delivering a power-to-weight ratio of 0.91 kg per horsepower.",
      overview: "Morphable roof scoop with dimpled surface reducing aerodynamic drag by 10% at high speeds. 3,000 kg of downforce at 320 km/h.",
      technicalSpecs: {
        chassis: "Carbon fiber monocoque meeting strict FIA prototype safety regulations",
        brakes: "Brembo carbon-carbon Formula 1 level discs and monobloc racing calipers",
        dryWeight: "1,450 kg",
        fuelTank: "100 Liters FIA safety bladder",
        emissions: "Closed circuit competition only",
        batteryCapacity: "12V ultra-light motorsport battery"
      }
    }
  ],

  blogPosts: [
    {
      id: "evolution-of-the-porsche-911",
      slug: "evolution-of-the-porsche-911",
      title: "The Evolution of the Porsche 911: Six Decades of Rear-Engine Mastery",
      date: "October 18, 2026",
      category: "Engineering",
      author: {
        name: "Alexander Vance",
        role: "Chief Automotive Historian",
        avatar: "images/blog/author-alexander.jpg"
      },
      image: "images/blog/blog-porsche-evolution.jpg",
      readTime: "6 min read",
      excerpt: "From the original 1963 901 unveiled at the Frankfurt Motor Show to today's aerodynamic 992 GT3 RS, explore how Porsche perfected the unconventional rear-engine silhouette.",
      content: [
        "When Ferdinand Alexander Porsche penned the original 901 in 1963, critics questioned whether a sports car with its engine hanging behind the rear axle could ever deliver predictable high-speed dynamics. Over sixty years and eight generations later, the Porsche 911 has silenced every skeptic, standing as the most victorious and enduring sports car in motorsport history.",
        "The journey began with modest air-cooled flat-six engines producing just 130 horsepower. Through the iconic Carrera RS 2.7 of 1973 with its revolutionary ducktail spoiler, the twin-turbo 959 technical showcase, and the pivotal switch to water-cooling with the 996 generation, the core philosophy never wavered: surgical driver feedback, everyday usability, and uncompromising German engineering.",
        "Today's 992 generation demonstrates the pinnacle of that legacy. In vehicles like the GT3 RS, advanced multi-link front suspension inspired by the 911 RSR race car, active aerodynamics with Formula 1-derived DRS, and downforce exceeding 860 kg transform what physics originally deemed an imperfection into an overwhelming mechanical advantage."
      ],
      tags: ["Porsche", "Motorsport", "Heritage", "Engineering", "911 GT3"]
    },
    {
      id: "lamborghini-revuelto-v12-hybrid-era",
      slug: "lamborghini-revuelto-v12-hybrid-era",
      title: "Lamborghini Revuelto: Inside Sant'Agata's 1,001-HP V12 Hybrid Revolution",
      date: "October 12, 2026",
      category: "Supercars",
      author: {
        name: "Gianluca Rossi",
        role: "Powertrain Specialist",
        avatar: "images/blog/author-gianluca.jpg"
      },
      image: "images/blog/blog-lamborghini-revuelto.jpg",
      readTime: "8 min read",
      excerpt: "How Lamborghini preserved the roaring soul of the naturally aspirated V12 while integrating a triple-motor plug-in hybrid architecture to forge their HPEV benchmark.",
      content: [
        "In an automotive landscape rushing toward forced induction and downsizing, Automobili Lamborghini took a fiercely passionate stand with the Revuelto. Rather than sacrificing their signature naturally aspirated V12 engine, Sant'Agata's engineers turned the engine 180 degrees and integrated an advanced tri-motor plug-in hybrid system.",
        "The centerpiece remains the 6.5-liter L545 V12, the lightest and most potent 12-cylinder Lamborghini has ever built, redlining at an exhilarating 9,500 RPM. Paired with two axial-flux motors on the front axle and a third integrated into the brand-new transversal eight-speed dual-clutch transmission, the system yields 1,001 metric horsepower.",
        "Crucially, the Revuelto achieves zero-emissions electric four-wheel drive for silent urban navigation, yet can instantly unleash full combustion thunder at the touch of the steering wheel's Corsa mode. It proves that electrification, when executed with audacity, enhances emotional supercar drama rather than diluting it."
      ],
      tags: ["Lamborghini", "V12", "Hybrid", "Hypercars", "Revuelto"]
    },
    {
      id: "ferrari-aerodynamics-xx-programme",
      slug: "ferrari-aerodynamics-xx-programme",
      title: "Ferrari's Aerodynamic Philosophy: Harnessing the Invisible Wind",
      date: "October 05, 2026",
      category: "Aerodynamics",
      author: {
        name: "Matteo Bellini",
        role: "Aero Dynamics Engineer",
        avatar: "images/blog/author-matteo.jpg"
      },
      image: "images/blog/blog-ferrari-aero.jpg",
      readTime: "5 min read",
      excerpt: "Delve into the wind tunnel secrets behind Maranello's SF90 XX Stradale, S-Duct flow manipulation, and blown rear wings without excessive drag penalties.",
      content: [
        "At Ferrari, styling and aerodynamics are never treated as opposing forces; they are intertwined disciplines forged in the same Maranello wind tunnels. From the legendary F40 of 1987 to the newly debuted SF90 XX Stradale, Ferrari has perfected the art of manipulating air pressure to pin hypercars to the asphalt.",
        "The challenge of generating high downforce without creating crippling parasitic drag led Ferrari to pioneer solutions like the front S-Duct and patented shut-off Gurney flaps. Airflow entering beneath the nose is channeled through internal carbon ducting and ejected through the bonnet, keeping the front axle firmly planted through high-speed sweepers.",
        "With the SF90 XX Stradale, Ferrari returned to a fixed rear wing for the first time since the F50, working in conjunction with active mobile flaps that adjust between Low Drag (LD) and High Downforce (HD) in fractions of a second, cementing an aerodynamic tour de force."
      ],
      tags: ["Ferrari", "Aerodynamics", "SF90", "F1 Technology"]
    },
    {
      id: "bugatti-w16-to-v16-legacy",
      slug: "bugatti-w16-to-v16-legacy",
      title: "Bugatti and the Hypercar Legacy: Passing the Torch from W16 to V16",
      date: "September 28, 2026",
      category: "Hypercars",
      author: {
        name: "Helena Laurent",
        role: "Luxury Vehicle Analyst",
        avatar: "images/blog/author-helena.jpg"
      },
      image: "images/blog/blog-bugatti-legacy.jpg",
      readTime: "7 min read",
      excerpt: "Reflecting on two decades of quad-turbo W16 dominance from the Veyron to Chiron, and the bold introduction of the naturally aspirated 8.3L V16 Tourbillon.",
      content: [
        "In 2005, the Bugatti Veyron shattered every established parameter of automotive capability: 1,001 horsepower, quad turbochargers, 16 cylinders, and a top speed exceeding 400 km/h. Conceived under the visionary guidance of Ferdinand Piëch, the 8.0-liter W16 powerplant reigned as the benchmark of mechanical excess for twenty uninterrupted years.",
        "As the Chiron, Divo, and Bolide wrote the concluding chapters of the W16 epoch, Bugatti faced an existential question: what could possibly succeed the undisputed king of forced induction? The answer shocked the world with the announcement of the Bugatti Tourbillon.",
        "Instead of going fully electric or adopting a downsized turbocharged configuration, Bugatti partnered with Cosworth to engineer an 8.3-liter naturally aspirated 90-degree V16 engine. Measuring nearly a meter in length and singing to 9,000 RPM, it honors the timeless craftsmanship of fine mechanical horology."
      ],
      tags: ["Bugatti", "W16", "Tourbillon", "Chiron", "Hypercars"]
    },
    {
      id: "mclaren-carbon-monocoque-secrets",
      slug: "mclaren-carbon-monocoque-secrets",
      title: "McLaren's Lightweight Obsession: The Carbon Monocoque Advantage",
      date: "September 19, 2026",
      category: "Motorsport",
      author: {
        name: "David Sterling",
        role: "Carbon Composites Specialist",
        avatar: "images/blog/author-david.jpg"
      },
      image: "images/blog/blog-mclaren-carbon.jpg",
      readTime: "6 min read",
      excerpt: "Why McLaren refuses to build a supercar without a one-piece carbon fiber tub, tracing F1 innovation from the 1981 MP4/1 to the 750S MonoCage.",
      content: [
        "In 1981, McLaren changed motorsport forever by fielding the MP4/1 Formula 1 car, the first racing car built with a full carbon fiber composite chassis. Skeptics warned that carbon fiber was brittle and dangerous; when John Watson survived a massive 140 mph crash at Monza uninjured, the entire racing fraternity recognized carbon fiber as the ultimate protective armor.",
        "Every single McLaren road car built since the iconic 1992 McLaren F1 has featured a carbon fiber core at its structural heart. Today, manufactured at the McLaren Composites Technology Centre (MCTC) in Yorkshire, the MonoCage II-S utilized in the 750S provides structural rigidity that no aluminum or steel spaceframe can match.",
        "This obsession with weight reduction pays enormous dividends in dynamic agility. With lower unsprung mass and a curb weight hundreds of kilograms lighter than rivals, a McLaren changes direction with immediate, razor-like precision."
      ],
      tags: ["McLaren", "Carbon Fiber", "Formula 1", "750S", "Lightweight"]
    },
    {
      id: "supercar-investment-collectors-guide",
      slug: "supercar-investment-collectors-guide",
      title: "Inside the World of Exclusive Supercars: The Collector's Blueprint",
      date: "September 10, 2026",
      category: "Showroom",
      author: {
        name: "Marcus Sterling",
        role: "Managing Director, APEX MOTORS",
        avatar: "images/blog/author-marcus.jpg"
      },
      image: "images/blog/blog-collector-guide.jpg",
      readTime: "9 min read",
      excerpt: "A comprehensive analysis of limited-run hypercar market dynamics, preservation protocols, provenance documentation, and portfolio diversification.",
      content: [
        "In high-net-worth wealth management, rare supercars and hypercars have evolved from discretionary luxury indulgences into tangible alternative investment assets. Models like the Porsche 918 Spyder, Ferrari LaFerrari, and McLaren P1 have demonstrated remarkable price resilience and substantial appreciation.",
        "However, navigating the blue-chip automotive market requires meticulous connoisseurship. Value is intrinsically tied to three non-negotiable pillars: verified provenance and single-owner maintenance records, factory-original paintwork and carbon weave matching, and rare option packaging such as Porsche's Weissach package or Ferrari's Assetto Fiorano specification.",
        "At APEX MOTORS, our acquisition concierge works with elite collectors across North America, Europe, and the Middle East to secure allocations for low-volume homologation specials and historically significant supercars, ensuring each vehicle represents not only pure driving ecstasy, but enduring collectible worth."
      ],
      tags: ["Investment", "Showroom", "Collectors", "Exotic Cars", "APEX"]
    }
  ],

  categories: [
    { id: "all", name: "All Models" },
    { id: "supercar", name: "Supercar" },
    { id: "hypercar", name: "Hypercar" },
    { id: "sports-car", name: "Sports Car" },
    { id: "grand-tourer", name: "Grand Tourer" }
  ],

  promotions: [
    {
      id: "promo-porsche",
      title: "THE ART OF PERFORMANCE",
      subtitle: "Discover iconic Porsche models engineered for track supremacy.",
      brand: "Porsche",
      link: "shop-grid.html?brand=Porsche",
      image: "images/banners/banner-porsche.jpg",
      tag: "TRACK READY"
    },
    {
      id: "promo-lamborghini",
      title: "UNLEASH THE EXTRAORDINARY",
      subtitle: "Explore Lamborghini's masterpieces of naturally aspirated fury.",
      brand: "Lamborghini",
      link: "shop-grid.html?brand=Lamborghini",
      image: "images/banners/banner-lamborghini.jpg",
      tag: "V12 ELECTRIFIED"
    }
  ],

  coupons: {
    "APEX10": {
      discountPercent: 10,
      maxDiscount: 50000,
      description: "10% VIP Showroom Incentive (up to $50,000)"
    }
  }
};

// Freeze data to prevent accidental runtime mutations
Object.freeze(APEX_DATA);
