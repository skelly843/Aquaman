export interface FallbackService {
  id: string
  title: string
  slug: string
  short_description: string
  full_description: string
  price_range: string
  featured_image: string
  is_published: boolean
  sort_order: number
}

export interface FallbackGalleryItem {
  id: string
  title: string
  description: string
  before_image: string
  after_image: string
  completion_date: string
  service_category: string
  location: string
  is_published: boolean
  is_private: boolean
  sort_order: number
}

export const FALLBACK_SERVICES: FallbackService[] = [
  {
    id: 'f-1',
    title: 'Emergency Plumbing Services',
    slug: 'emergency-plumbing',
    short_description: 'Rapid-response diagnostic and resolution for active burst pipes, sewer back-ups, and severe leaks 24/7.',
    full_description: 'When plumbing failures threaten your property, our emergency responders dispatch immediately. Equipped with advanced cameras, heavy-duty rooters, and premium replacement components, we restore safety and functionality to your drainage and supply networks in record time.',
    price_range: 'Starting at $149',
    featured_image: '',
    is_published: true,
    sort_order: 1
  },
  {
    id: 'f-2',
    title: 'Water Heater Installation & Repair',
    slug: 'water-heater-services',
    short_description: 'Professional tank and tankless system diagnostics, maintenance, and ultra-efficient replacements.',
    full_description: 'Struggling with inconsistent hot water? Our certified plumbers provide meticulous diagnostics for conventional gas/electric reservoirs as well as high-efficiency tankless units. We optimize flow rates, purge sediment buildup, and ensure total code compliance on all replacements.',
    price_range: 'Starting at $199',
    featured_image: '',
    is_published: true,
    sort_order: 2
  },
  {
    id: 'f-3',
    title: 'Drain Cleaning & Hydro-Jetting',
    slug: 'drain-cleaning-hydro-jetting',
    short_description: 'Clear structural blockages and restore pristine drain velocity with high-pressure hydro-jet solutions.',
    full_description: 'Grease, scale, and root intrusions are no match for our precision high-velocity water jets. We scrub internal pipe walls to bare metal without the use of corrosive chemicals, keeping your lines performing perfectly for years to come.',
    price_range: 'Starting at $120',
    featured_image: '',
    is_published: true,
    sort_order: 3
  },
  {
    id: 'f-4',
    title: 'Bathroom & Kitchen Remodeling',
    slug: 'kitchen-bathroom-remodeling',
    short_description: 'Complete high-end structural general contracting, fixture piping, flooring, and luxury cabinetry design.',
    full_description: 'Upgrade your living space with our experienced general contracting division. We handle all elements of kitchen and bathroom renovations—from code-compliant structural framing and premium copper/PEX layout lines to custom tiling, luxury fixture integration, and quartz finishes.',
    price_range: 'Custom Quote Available',
    featured_image: '',
    is_published: true,
    sort_order: 4
  },
  {
    id: 'f-5',
    title: 'Sewer Repair & Trenchless Services',
    slug: 'sewer-repair-trenchless',
    short_description: 'Advanced camera diagnostics and trenchless pipe lining restoration with zero yard disruption.',
    full_description: 'Save your yard and driveways with modern trenchless epoxy lining technology. We locate root damages using micro-optic lines, ream out obstructions, and insert seamless, heavy-duty liners that carry a lifetime structural guarantee.',
    price_range: 'Starting at $350',
    featured_image: '',
    is_published: true,
    sort_order: 5
  },
  {
    id: 'f-6',
    title: 'General Repairs & Property Drywall',
    slug: 'general-contracting-repairs',
    short_description: 'Comprehensive general contracting fixes, framing, paint touch-ups, and moisture barrier installations.',
    full_description: 'From repairing structural water damage or drywall sections post-leak to complete room framing and waterproof paint coatings, our general contracting technicians keep your residential or commercial asset in pristine shape.',
    price_range: 'Starting at $95',
    featured_image: '',
    is_published: true,
    sort_order: 6
  }
]

export const FALLBACK_GALLERY_ITEMS: FallbackGalleryItem[] = [
  {
    id: 'g-1',
    title: 'Complete Master Bath Remodel',
    description: 'Removed deteriorated drywall and corroded galvanized supply lines. Restructured the plumbing layout for a freestanding soak tub, custom rainfall glass shower, premium floating double vanity, and high-contrast marble mosaic tile work.',
    before_image: '',
    after_image: '',
    completion_date: '2026-04-10',
    service_category: 'Remodeling',
    location: 'Beverly Hills, CA',
    is_published: true,
    is_private: false,
    sort_order: 1
  },
  {
    id: 'g-2',
    title: 'Trenchless Sewer Line Restoration',
    description: 'Diagnosed severe root intrusion in a main cast-iron lateral line using micro-optical cameras. Used advanced pneumatic cleaning, followed by full seamless epoxy-sleeve pipe liner insertion. Restored full hydraulic velocity without any structural excavation.',
    before_image: '',
    after_image: '',
    completion_date: '2026-05-18',
    service_category: 'Sewer Repair',
    location: 'Santa Monica, CA',
    is_published: true,
    is_private: false,
    sort_order: 2
  }
]

export const FALLBACK_PAGE_BLOCKS = [
  {
    id: 'b-home-1',
    page_id: 'home',
    block_type: 'hero',
    display_order: 10,
    is_visible: true,
    draft_data: {
      title: 'Premium Plumbing & General Contracting',
      subtitle: 'Expert maintenance, urgent emergency dispatch, and custom remodeling services at your fingertips. Manage operations through our live client portal.',
      ctaText: 'Book a Service',
      ctaUrl: '/request-service',
      secondaryCtaText: 'View Our Work',
      secondaryCtaUrl: '/gallery',
      backgroundImage: ''
    },
    published_data: {
      title: 'Premium Plumbing & General Contracting',
      subtitle: 'Expert maintenance, urgent emergency dispatch, and custom remodeling services at your fingertips. Manage operations through our live client portal.',
      ctaText: 'Book a Service',
      ctaUrl: '/request-service',
      secondaryCtaText: 'View Our Work',
      secondaryCtaUrl: '/gallery',
      backgroundImage: ''
    }
  },
  {
    id: 'b-home-2',
    page_id: 'home',
    block_type: 'features',
    display_order: 20,
    is_visible: true,
    draft_data: {
      title: 'Why Aquaman Contracting is Rated #1',
      subtitle: 'Our primary design values',
      items: [
        { title: 'Licensed & Fully Insured', desc: 'Our technicians are certified plumbing engineers and General B contractors who respect your property.' },
        { title: 'State-of-the-Art Scheduling', desc: 'Book, adjust, pay invoices, and review high-resolution project files instantly via our premium client portal.' },
        { title: 'Fixed, Transparent Pricing', desc: 'Enjoy absolute cost certainty. We compile comprehensive upfront estimates with line-by-line transparency.' }
      ]
    },
    published_data: {
      title: 'Why Aquaman Contracting is Rated #1',
      subtitle: 'Our primary design values',
      items: [
        { title: 'Licensed & Fully Insured', desc: 'Our technicians are certified plumbing engineers and General B contractors who respect your property.' },
        { title: 'State-of-the-Art Scheduling', desc: 'Book, adjust, pay invoices, and review high-resolution project files instantly via our premium client portal.' },
        { title: 'Fixed, Transparent Pricing', desc: 'Enjoy absolute cost certainty. We compile comprehensive upfront estimates with line-by-line transparency.' }
      ]
    }
  }
]
