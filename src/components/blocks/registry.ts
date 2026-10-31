export interface BlockDefinition {
  type: string
  label: string
  description: string
  defaults: () => Record<string, any>
}

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: 'hero',
    label: 'Hero header',
    description: 'Big headline with subtitle, buttons and an optional background photo',
    defaults: () => ({
      variant: 'large',
      title: 'New headline',
      subtitle: 'Add a short supporting sentence.',
      ctaText: 'Get Started',
      ctaUrl: '/request-service',
      secondaryCtaText: '',
      secondaryCtaUrl: '',
      backgroundImage: ''
    })
  },
  {
    type: 'text_image',
    label: 'Text with image',
    description: 'Heading and paragraph beside a photo (left or right)',
    defaults: () => ({
      title: 'Section heading',
      body: 'Write a paragraph about this topic.',
      quote: '',
      image_url: '',
      image_side: 'right'
    })
  },
  {
    type: 'features',
    label: 'Features grid',
    description: 'Repeatable cards with an icon, title and description',
    defaults: () => ({
      title: 'Why choose us',
      subtitle: '',
      items: [
        { icon: 'shield', title: 'Feature', desc: 'Describe this feature.' },
        { icon: 'clock', title: 'Feature', desc: 'Describe this feature.' },
        { icon: 'star', title: 'Feature', desc: 'Describe this feature.' }
      ]
    })
  },
  {
    type: 'team',
    label: 'Team members',
    description: 'Repeatable people with photo, name, role and bio',
    defaults: () => ({
      title: 'Meet the team',
      subtitle: '',
      members: [{ name: 'Team member', role: 'Role', bio: 'Short bio.', photo: '' }]
    })
  },
  {
    type: 'gallery_grid',
    label: 'Project gallery',
    description: 'Before/after cards from your published gallery items',
    defaults: () => ({ title: 'Recent projects', subtitle: '' })
  },
  {
    type: 'services_grid',
    label: 'Services grid',
    description: 'Cards for your published services',
    defaults: () => ({ title: 'Our Services', subtitle: '', limit: 0 })
  },
  {
    type: 'contact_info',
    label: 'Contact details',
    description: 'Phone, email, address, hours and service areas from company settings',
    defaults: () => ({ title: 'Get in Touch', body: 'Reach out directly or send us a message.' })
  },
  {
    type: 'contact_form',
    label: 'Contact form',
    description: 'Name, email, phone and message form',
    defaults: () => ({
      title: 'Send us a Message',
      intro: '',
      buttonText: 'Send Message',
      successMessage: 'Message submitted successfully!'
    })
  },
  {
    type: 'request_form',
    label: 'Service request form',
    description: 'Full booking form that creates a service request',
    defaults: () => ({
      title: 'Request a Service',
      intro: '',
      buttonText: 'Submit Service Request',
      successMessage: 'Booking request submitted! We will contact you soon.'
    })
  },
  {
    type: 'cta_banner',
    label: 'Call-to-action banner',
    description: 'Colored strip with a headline and one button',
    defaults: () => ({
      title: 'Ready to get started?',
      body: 'Book a visit with our team today.',
      buttonText: 'Request Service',
      buttonUrl: '/request-service'
    })
  },
  {
    type: 'image',
    label: 'Image',
    description: 'A single photo with an optional caption',
    defaults: () => ({ image_url: '', caption: '', width: 'contained' })
  },
  {
    type: 'spacer',
    label: 'Spacer',
    description: 'Empty vertical space between sections',
    defaults: () => ({ size: 'md' })
  }
]

export function getBlockDefinition(type: string): BlockDefinition | undefined {
  return BLOCK_DEFINITIONS.find((d) => d.type === type)
}
