import InnerPageHero from '@/components/InnerPageHero';
import TestimonialList from '@/components/TestimonialList';

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <InnerPageHero
        title="Customer Reviews"
        subtitle=""
        backgroundImage="/images/downloaded/BarbudaLeisureTours-7.jpg"
        showWave={true}
        waveFillColor="#FFFFFF"
      />

      <div className="page-content">

      {/* Main Content Section */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <p className="font-['Lexend_Deca'] text-[16px] font-semibold text-[rgb(122,122,122)] leading-[24px] mb-[14.4px] text-left">We greatly value your feedback and are excited to hear how we&apos;re doing! Your input—whether shared through email, social media, your hotel&apos;s tour desk or by completing our Customer Feedback Survey—is instrumental in helping us grow and elevate our services.</p>
              <p className="font-['Lexend_Deca'] text-[16px] font-semibold text-[rgb(122,122,122)] leading-[24px] text-left">We are committed to reviewing each piece of feedback and continuously enhancing our offerings based on your valuable insights. Thank you for helping us improve and make your experiences even better!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Pink Quote Boxes */}
      <section className="pb-14 md:pb-20 pt-0 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <TestimonialList />
          </div>
        </div>
      </section>

      {/* close page-content wrapper */}
      </div>
    </main>
  );
}

export const metadata = {
  title: 'Reviews',
  description: 'Barbuda Leisure - Reviews',
};
