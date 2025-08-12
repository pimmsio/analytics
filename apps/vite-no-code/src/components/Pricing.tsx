import React from 'react';
import { Check } from 'lucide-react';
import Container from './ui/Container';
import Button from './ui/Button';
import { pricingPlans } from '../constants/siteData';

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600">
            Start for free, upgrade as you grow. No hidden fees or complicated
            plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 ${
                plan.popular ? 'relative ring-2 ring-teal-500 md:scale-105' : ''
              }`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 bg-teal-500 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                <h3 className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="ml-1 text-xl font-medium text-gray-500">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-gray-600">{plan.description}</p>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex">
                      <Check className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {plan.name === 'Enterprise' ? (
                    <Button
                      variant="outline"
                      fullWidth
                      data-cal-link="alexandre-sarfati-pidjvv/30min?pimms_id=1"
                      data-cal-namespace="30min"
                      data-cal-config='{"layout":"month_view"}'
                    >
                      Schedule a Call
                    </Button>
                  ) : (
                    <Button
                      variant={plan.popular ? 'primary' : 'outline'}
                      href={plan.stripeLink || '/fake-page'}
                      fullWidth
                    >
                      {plan.cta}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-600">
          Need a custom plan?{' '}
          <a href="#contact" className="text-teal-600 font-medium">
            Contact us
          </a>{' '}
          to discuss your requirements.
        </div>
      </Container>
    </section>
  );
};

export default Pricing;
