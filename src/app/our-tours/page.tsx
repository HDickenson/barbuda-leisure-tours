import Image from 'next/image';
import Link from 'next/link';
import WaveDivider from '@/components/WaveDivider';
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
      <section className="relative h-96">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-9.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <WaveDivider
          pathD="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,133.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          viewBox="0 0 1440 320"
          fillColor="#FFFFFF"
          position="bottom"
          height="100px"
        />
        <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Our Tours</h1>
            <p className="text-xl text-white/90">Discover Barbuda Your Way</p>
          </div>
        </div>
      </section>

      {/* Signature Tours Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Signature Tours</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our most popular day tours featuring the best of Barbuda&apos;s natural beauty and culture.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {signatureTours.map((tour) => (
              <div key={tour.slug} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group">
                <div className="relative h-64">
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
                  <div className="absolute top-4 right-4 bg-turquoise text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {tour.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-800">{tour.title}</h3>
                  {tour.subtitle && (
                    <p className="text-turquoise font-medium mb-3">{tour.subtitle}</p>
                  )}
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{tour.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {tour.duration}
                    </span>
                  </div>
                  <Link
                    href={`/tours/${tour.slug}`}
                    className="inline-block px-6 py-3 bg-turquoise text-white rounded-full hover:bg-turquoise-hover transition font-semibold"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Tours Section */}
      {localTours.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Already in Barbuda?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join our local guided tours if you&apos;re already on the island.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {localTours.map((tour) => (
                <div key={tour.slug} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group">
                  <div className="relative h-48">
                    {tour.heroImage && (
                      <Image
                        src={tour.heroImage}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {tour.price}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{tour.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{tour.description}</p>
                    <Link
                      href={`/tours/${tour.slug}`}
                      className="inline-block px-5 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition font-semibold text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shared Adventures Section */}
      {sharedTours.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Shared Adventures</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join a group tour for a social and affordable way to experience Barbuda.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {sharedTours.map((tour) => (
                <div key={tour.slug} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group border-2 border-orange-100">
                  <div className="relative h-56">
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
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {tour.price}
                    </div>
                    {tour.partnerOperated && (
                      <div className="absolute bottom-4 left-4 bg-white/90 text-gray-800 px-3 py-1 rounded text-xs font-medium">
                        Partner: {tour.partnerName}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 text-gray-800">{tour.title}</h3>
                    {tour.subtitle && (
                      <p className="text-orange-500 font-medium mb-3">{tour.subtitle}</p>
                    )}
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{tour.description}</p>
                    <Link
                      href={`/tours/${tour.slug}`}
                      className="inline-block px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold"
                    >
                      View Details
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
        <section className="py-16 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Private Charters</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Exclusive experiences for those seeking luxury and privacy.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {privateTours.map((tour) => (
                <div key={tour.slug} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition group">
                  <div className="relative h-48">
                    {tour.heroImage && (
                      <Image
                        src={tour.heroImage}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute top-4 right-4 bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                      {tour.price}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">{tour.title}</h3>
                    {tour.subtitle && (
                      <p className="text-yellow-400 font-medium mb-3 text-sm">{tour.subtitle}</p>
                    )}
                    <p className="text-gray-400 mb-4 text-sm line-clamp-2">{tour.description}</p>
                    <Link
                      href={`/tours/${tour.slug}`}
                      className="inline-block px-5 py-2 bg-yellow-500 text-gray-900 rounded-full hover:bg-yellow-400 transition font-semibold text-sm"
                    >
                      Inquire Now
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
    </main>
  );
}

export const metadata = {
  title: 'Our Tours - Barbuda Leisure Day Tours',
  description: 'Explore our signature tours, shared adventures, and private charters to discover the pristine beauty of Barbuda.',
};
