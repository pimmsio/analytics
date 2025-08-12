export const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Blog', href: '#' },
];

export const features = [
  {
    title: 'Shorten Links',
    description:
      'Create memorable, branded short links in seconds. No more lengthy URLs cluttering your content.',
    icon: 'link',
  },
  {
    title: 'Track Analytics',
    description:
      'Gain valuable insights with robust analytics. Monitor clicks, geographic data, and referral sources.',
    icon: 'bar-chart',
  },
  {
    title: 'Custom Domains',
    description:
      'Use your own domain for short links. Enhance brand recognition and user trust.',
    icon: 'globe',
  },
  {
    title: 'API Access',
    description:
      'Seamlessly integrate Pimms into your workflow with our developer-friendly API.',
    icon: 'code',
  },
  {
    title: 'Team Collaboration',
    description:
      'Work together efficiently. Share, manage, and organize links across your entire team.',
    icon: 'users',
  },
  {
    title: 'Enterprise Security',
    description:
      'Rest easy with enterprise-grade security features and compliance standards.',
    icon: 'shield',
  },
];

export const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for personal use',
    features: [
      '1,000 links per month',
      'Basic analytics',
      'Standard support',
      'Pimms branded domain',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'For professionals and small teams',
    features: [
      '10,000 links per month',
      'Advanced analytics',
      'Priority support',
      '1 custom domain',
      'Team dashboard',
    ],
    cta: 'Try Free for 14 Days',
    popular: true,
    stripeLink: 'https://buy.stripe.com/test_dR66oD6MX2AydJ65kk',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Unlimited links',
      'Enterprise analytics',
      'Dedicated support',
      'Multiple custom domains',
      'Advanced security',
      'SLA guarantees',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export const faqs = [
  {
    question: 'What is Pimms?',
    answer:
      'Pimms is a powerful URL shortening service that helps you create shorter, branded links. It also provides comprehensive analytics and tracking for all your shortened links.',
  },
  {
    question: 'How does Pimms compare to Bitly?',
    answer:
      'While Bitly pioneered link shortening, Pimms offers more advanced features at competitive prices, including better analytics, more custom domain options, and a more intuitive interface.',
  },
  {
    question: 'Can I use my own domain?',
    answer:
      'Yes! Pro and Enterprise plans allow you to use your own custom domains, helping maintain brand consistency across all your shortened links.',
  },
  {
    question: 'Is there an API available?',
    answer:
      'Absolutely. We offer a robust API that allows you to integrate Pimms link shortening into your applications, websites, or workflows.',
  },
  {
    question: 'What analytics do you provide?',
    answer:
      'Our analytics include click counts, geographic data, device information, referral sources, and time-based analytics. Pro and Enterprise plans offer even more detailed insights.',
  },
];
