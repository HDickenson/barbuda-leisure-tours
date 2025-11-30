import Image from 'next/image';
import InnerPageHero from '@/components/InnerPageHero';
import TestimonialCarousel from '@/components/TestimonialCarousel';

export default function AboutUsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <InnerPageHero
        title="About Us"
        subtitle="Your Gateway to Discovering Barbuda"
        backgroundImage="/images/downloaded/m-6-scaled-e1731509852408.jpg"
        showWave={true}
        waveFillColor="#FFFFFF"
      />

      

      {/* Main Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="font-leckerli text-[48px] font-light text-[rgb(48,187,216)] mb-4 leading-[48px]">Welcome to Barbuda Leisure Day Tours</h2>
              <div className="">
                <p className="font-open-sans text-[16px] font-semibold text-[rgb(122,122,122)] leading-[24px] mb-[14.4px]">At Barbuda Leisure Day Tours, we&apos;re passionate about sharing the unspoiled beauty of Barbuda with the world. As the only dedicated Barbuda day tour concierge company, we&apos;ve been proudly serving guests since 2011, offering exceptional experiences and flexible travel options between Antigua and Barbuda.</p>
                <p className="font-open-sans text-[16px] font-semibold text-[rgb(122,122,122)] leading-[24px] mb-[14.4px]">Whether by air, sea, private boat, or even helicopter, we&apos;re your trusted partner in making your visit to Barbuda truly unforgettable.</p>
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
          <h2 className="font-roboto text-[40px] font-semibold text-[rgb(84,89,95)] mb-4 leading-[48px]">Thank You for Considering Us</h2>
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
