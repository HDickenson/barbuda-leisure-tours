import Image from 'next/image';
import WaveDivider from '@/components/WaveDivider';
import TestimonialCarousel from '@/components/TestimonialCarousel';

export default function AboutUsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://www.barbudaleisure.com/wp-content/uploads/2024/11/m-6-scaled-e1731509852408.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <WaveDivider
          pathD="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,133.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          viewBox="0 0 1440 320"
          fillColor="#FFFFFF"
          position="bottom"
          height="100px"
        />
        <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">About Us</h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Your Gateway to Discovering Barbuda
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-4">Welcome to Barbuda Leisure Day Tours</h2>
              <div className="prose prose-lg">
                <p>At Barbuda Leisure Day Tours, we&apos;re passionate about sharing the unspoiled beauty of Barbuda with the world. As the only dedicated Barbuda day tour concierge company, we&apos;ve been proudly serving guests since 2011, offering exceptional experiences and flexible travel options between Antigua and Barbuda.</p>
                <p>Whether by air, sea, private boat, or even helicopter, we&apos;re your trusted partner in making your visit to Barbuda truly unforgettable.</p>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-48 overflow-hidden rounded-lg">
                  <Image
                    src="/images/BarbudaLeisureTours-6-300x300.jpg"
                    alt="Barbuda Tours Experience"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="relative h-48 overflow-hidden rounded-lg">
                  <Image
                    src="/images/BarbudaLeisureTours-4-300x300.jpg"
                    alt="Barbuda Beach"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="relative h-48 overflow-hidden rounded-lg">
                  <Image
                    src="/images/BarbudaLeisureTours-3-2-300x300.jpg"
                    alt="Barbuda Landscape"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="relative h-48 overflow-hidden rounded-lg">
                  <Image
                    src="/images/BarbudaLeisureTours-12-300x300.jpg"
                    alt="Island Experience"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Carousel Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <TestimonialCarousel />
            <div className="text-center mt-8">
              <a
                href="/reviews"
                className="inline-block px-6 py-3 bg-white text-turquoise rounded hover:bg-gray-50 transition font-semibold border border-turquoise"
              >
                Read All Testimonials
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Thank You for Considering Us</h2>
          <p className="text-xl text-gray-700 mb-8">We look forward to making your trip a memorable one!</p>
          <a
            href="/our-tours"
            className="inline-block px-8 py-4 bg-turquoise text-white rounded-lg hover:bg-turquoise-hover transition text-lg font-semibold"
          >
            Explore Our Tours
          </a>
        </div>
      </section>
    </main>
  );
}


export const metadata = {
  title: 'About Us',
  description: 'Barbuda Leisure - About Us',
};
