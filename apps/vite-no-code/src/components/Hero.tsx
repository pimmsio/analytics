import React from 'react';
import { Link as LinkIcon, ExternalLink } from 'lucide-react';
import Button from './ui/Button';
import Container from './ui/Container';

const Hero: React.FC = () => {
  return (
    <section className="pt-16 pb-24 overflow-hidden bg-gradient-to-br from-teal-50 to-indigo-50">
      <Container>
        <div className="flex flex-col items-center text-center">
          <div
            className="px-4 mb-2 py-1.5 rounded-full bg-teal-100 text-teal-800 font-medium text-sm inline-flex items-center"
            data-aos="fade-down"
          >
            <span className="mr-1">🚀</span> Simpler than Bitly, more powerful
            than ever
          </div>

          <h1
            className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight max-w-4xl"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Short links with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">
              long-term impact
            </span>
          </h1>

          <p
            className="mt-6 text-xl text-gray-600 max-w-2xl"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Create, share, and track short links that drive results. Pimms gives
            you the tools to optimize your online presence with powerful
            analytics.
          </p>

          <div
            className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <Button
              size="lg"
              href="https://buy.stripe.com/test_dR66oD6MX2AydJ65kk"
              className="group"
            >
              Get Pro Plan Now
              <ExternalLink className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" href="https://app.pimms.io">
              Try For Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              href="https://app.iclosed.io/e/alexandresarfati/30-minutes-call"
            >
              Book a call (iClosed)
            </Button>
          </div>

          <div
            className="mt-12 w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="flex items-center bg-gray-800 px-4 py-2">
              <div className="flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="bg-white p-6 relative">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center">
                    <LinkIcon className="h-5 w-5 text-teal-600 mr-2" />
                    <span className="font-medium text-gray-700">
                      Original URL:
                    </span>
                  </div>
                  <div className="mt-2 sm:mt-0 sm:ml-4 text-gray-500 text-sm sm:text-base overflow-hidden overflow-ellipsis">
                    https://example.com/very/long/path/to/an/article/with/many/parameters?utm_source=newsletter&utm_medium=email&utm_campaign=summer_promotion
                  </div>
                </div>

                <div className="border-l-4 border-teal-500 bg-teal-50 p-4 rounded-r-lg">
                  <div className="flex items-center">
                    <LinkIcon className="h-5 w-5 text-teal-700 mr-2" />
                    <span className="font-medium text-teal-800">
                      Shortened URL:
                    </span>
                  </div>
                  <div className="mt-2 text-teal-700 font-medium flex items-center">
                    pimms.io/summer23
                    <button className="ml-2 text-xs bg-teal-200 hover:bg-teal-300 text-teal-800 px-2 py-1 rounded">
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
