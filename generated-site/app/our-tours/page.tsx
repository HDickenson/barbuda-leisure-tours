import Image from 'next/image';
import Link from 'next/link';
import InnerPageHero from '@/components/InnerPageHero';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import { getToursByCategory } from '@/data/tours';

export default function OurToursPage() {
  const signatureTours = getToursByCategory('signature');
  const localTours = getToursByCategory('local');
  const sharedTours = getToursByCategory('shared');
  const privateTours = getToursByCategory('private');

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <InnerPageHero
        title="Our Tours"
        subtitle="Discover Barbuda Your Way"
        backgroundImage="/images/downloaded/Pink-Beach-North-scaled.jpg"
        showWave={true}
        waveFillColor="#FFFFFF"
      />

      <div className="page-content">

      {/* Intro Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              Experience the natural beauty, tranquility, and charm of Barbuda with our carefully curated tours and adventures - designed for every kind of traveler. Whether you prefer to soar above the Caribbean, cruise across turquoise waters, or enjoy a private luxury escape, <strong>Barbuda Leisure Day Tours</strong> has the perfect experience for you.
            </p>
          </div>
        </div>
      </section>

      {/* Signature Tours Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Signature Tours</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our most popular and highly rated day trips, perfect for visitors seeking the full Barbuda experience.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {signatureTours.map((tour) => (
              <div key={tour.slug} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group flex flex-col h-full">
                <div className="relative aspect-square">
                  {tour.heroImage && (
                    <Image
                      src={tour.heroImage}
                      alt={tour.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute top-4 right-4 bg-turquoise text-white px-3 py-1 rounded-full text-sm font-semibold hidden">
                    {tour.price}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-lexend text-[16px] font-semibold text-[rgb(122,122,122)] mb-[30px]">{tour.title}</h3>
                  {tour.subtitle && (
                    <p className="text-turquoise font-medium mb-3 hidden">{tour.subtitle}</p>
                  )}
                  <p className="font-open-sans text-[14px] font-semibold text-[rgb(97,97,97)] leading-[23.8px] mb-[25px] line-clamp-3">{tour.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 hidden">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {tour.duration}
                    </span>
                  </div>
                  <Link
                    href={`/tours/${tour.slug}`}
                    className="inline-flex items-center justify-center bg-[rgb(48,187,216)] font-roboto text-[14px] font-medium text-white px-[25px] py-[15px] rounded-[5px] hover:bg-[rgb(35,150,175)] transition mt-auto"
                  >
                    REQUEST BOOKING
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Tours Section - Horizontal Card */}
      {localTours.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            {localTours.map((tour) => (
              <div key={tour.slug} className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition group">
                <div className="grid grid-cols-1 lg:grid-cols-2">

                  {/* Tour Image - Left */}
                  <div className="relative w-full h-full">
                    {tour.heroImage && (
                      <Image
                        src={tour.heroImage}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    )}
                  </div>

                  {/* All Content - Right */}
                  <div className="p-8 flex flex-col justify-between">
                    <div>
                      <h2 className="text-4xl font-bold text-gray-800 mb-4 text-left">Already in Barbuda?</h2>
                      <p className="text-lg text-gray-600 mb-8 text-left">
                        If you&apos;re already on the island, you can still experience Barbuda Leisure&apos;s guided tours! Join our local excursions that include sightseeing, beach relaxation, and cultural exploration - available daily upon request.
                      </p>
                      <h3 className="font-lexend text-[16px] font-semibold text-[rgb(122,122,122)] mb-3 text-left">{tour.title}</h3>
                      <p className="text-sm text-gray-700 mb-2 text-left font-semibold">{tour.price}</p>
                      <p className="text-sm text-gray-600 mb-4 text-left">{tour.duration}</p>
                      <p className="font-open-sans text-[14px] font-semibold text-[rgb(97,97,97)] leading-[23.8px] mb-3 line-clamp-3 text-left">{tour.description}</p>
                    </div>
                    <Link
                      href={`/tours/${tour.slug}`}
                      className="inline-flex items-center justify-center bg-[rgb(48,187,216)] font-roboto text-[14px] font-medium text-white px-[25px] py-[15px] rounded-[5px] hover:bg-[rgb(35,150,175)] transition w-fit"
                    >
                      REQUEST BOOKING
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Shared Charter/Adventures Section */}
      {sharedTours.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Shared Charter/Adventures</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Enjoy these exceptional shared experiences operated in partnership with trusted local providers.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {sharedTours.map((tour) => (
                <div key={tour.slug} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group flex flex-col h-full">
                  <div className="relative aspect-square">
                    {tour.heroImage && (
                      <Image
                        src={tour.heroImage}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute top-4 right-4 bg-[rgb(245,182,211)] text-white px-3 py-1 rounded-full text-sm font-semibold hidden">
                      {tour.price}
                    </div>
                    {tour.partnerOperated && (
                      <div className="absolute bottom-4 left-4 bg-white/90 text-gray-800 px-3 py-1 rounded text-xs font-medium">
                        Partner: {tour.partnerName}
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-lexend text-[16px] font-semibold text-[rgb(122,122,122)] mb-[30px]">{tour.title}</h3>
                    {tour.subtitle && (
                      <p className="text-[rgb(48,187,216)] font-medium mb-3 hidden">{tour.subtitle}</p>
                    )}
                    <p className="font-open-sans text-[14px] font-semibold text-[rgb(97,97,97)] leading-[23.8px] mb-[25px] line-clamp-3">{tour.description}</p>
                    <Link
                      href={`/tours/${tour.slug}`}
                      className="inline-flex items-center justify-center bg-[rgb(48,187,216)] font-roboto text-[14px] font-medium text-white px-[25px] py-[15px] rounded-[5px] hover:bg-[rgb(35,150,175)] transition mt-auto"
                    >
                      REQUEST BOOKING
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Private Charters Section */}
      {privateTours.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Private Charters</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                For those seeking exclusivity and personalized service, our private charter experiences offer the ultimate in comfort and luxury.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {privateTours.map((tour) => (
                <div key={tour.slug} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group flex flex-col h-full">
                  <div className="relative aspect-square">
                    {tour.heroImage && (
                      <Image
                        src={tour.heroImage}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute top-4 right-4 bg-[rgb(245,182,211)] text-white px-3 py-1 rounded-full text-sm font-semibold hidden">
                      {tour.price}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-lexend text-[16px] font-semibold text-[rgb(122,122,122)] mb-[30px]">{tour.title}</h3>
                    {tour.subtitle && (
                      <p className="text-[rgb(48,187,216)] font-medium mb-3 hidden">{tour.subtitle}</p>
                    )}
                    <p className="font-open-sans text-[14px] font-semibold text-[rgb(97,97,97)] leading-[23.8px] mb-[25px] line-clamp-3">{tour.description}</p>
                    <Link
                      href={`/tours/${tour.slug}`}
                      className="inline-flex items-center justify-center bg-[rgb(48,187,216)] font-roboto text-[14px] font-medium text-white px-[25px] py-[15px] rounded-[5px] hover:bg-[rgb(35,150,175)] transition mt-auto"
                    >
                      REQUEST BOOKING
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial Carousel Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      </div>
    </main>
  );
}

export const metadata = {
  title: 'Our Tours - Barbuda Leisure Day Tours',
  description: 'Explore our signature tours, shared adventures, and private charters to discover the pristine beauty of Barbuda.',
};
