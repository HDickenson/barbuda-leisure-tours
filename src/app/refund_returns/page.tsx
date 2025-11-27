import InnerPageHero from '@/components/InnerPageHero';

export default function RefundReturnsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <InnerPageHero
        title="Tour Cancellation Policy"
        subtitle="Get in touch — we're here to help"
        backgroundImage="/images/downloaded/BarbudaLeisureTours-15.jpg"
        showWave={true}
        waveFillColor="#FFFFFF"
      />

      {/* Main Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-['Open_Sans'] text-[24px] font-semibold text-[rgb(122,122,122)] leading-[24px] mb-6 text-center">
              Tour Cancellation Policy
            </h2>
            <div className="space-y-6 font-['Open_Sans'] text-[14px] font-semibold text-[rgb(122,122,122)] leading-[21px]">
              <div>
                <p className="mb-2">1. Deposit Requirement: A 100% deposit is required to confirm your reservation.</p>
              </div>

              <div>
                <p className="mb-2">2. Cancellation by Customer:</p>
                <ul className="list-disc pl-10 space-y-2">
                  <li>You may cancel your reservation up to 72 hours before the departure date. If traveling to Barbuda by airplane, flight costs and fees are non-refundable, but you will receive a refund for the tour portion only.</li>
                  <li>Cancellations within 72 hours of the departure date are not eligible for a refund.</li>
                </ul>
              </div>

              <div>
                <p className="mb-2">3. No-Show Policy: A no-show will result in a charge of 100% of the full price.</p>
              </div>

              <div>
                <p className="mb-2">4. Cancellation by Tour Operator: If the tour is canceled due to bad weather or service provider issues, we will either refund your entire deposit or rebook your tour for another day, based on your preference.</p>
              </div>

              <div>
                <p className="mb-2">5. Flight and Ferry Cancellations: We act as a third-party agent for airlines, ferries, and tour operators in Barbuda. Therefore, for flight or ferry cancellations, you are responsible for contacting these partners directly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export const metadata = {
  title: 'Refund and Returns Policy',
  description: 'Barbuda Leisure - Refund Returns',
};
