import WaveDivider from '@/components/WaveDivider';

export default function RefundReturnsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://www.barbudaleisure.com/wp-content/uploads/2024/10/BlackBarbuda-Leisure-Day-Tours-2-Colour.webp)',
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
            <h1 className="text-5xl font-bold text-white mb-4">Tour Cancellation Policy</h1>
            <p className="text-xl text-white max-w-2xl mx-auto">Get In Touch</p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <p>1. Deposit Requirement: A 100% deposit is required to confirm your reservation.</p>
            <p>3. No-Show Policy: A no-show will result in a charge of 100% of the full price.</p>
            <p>4. Cancellation by Tour Operator: If the tour is canceled due to bad weather or service provider issues, we will either refund your entiredeposit or rebook your tour for another day, based on your preference.</p>
            <p>5. Flight and Ferry Cancellations: We act as a third-party agent for airlines, ferries, and tour operators in Barbuda. Therefore, for flight orferry cancellations, you are responsible for contacting these partners directly.</p>
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
