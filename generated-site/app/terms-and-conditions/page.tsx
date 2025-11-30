import InnerPageHero from '@/components/InnerPageHero';

export default function TermsandConditionsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <InnerPageHero
        title="Terms and Conditions"
        subtitle="Important information about bookings and safety"
        backgroundImage="/images/downloaded/BarbudaLeisureTours-4.jpg"
        showWave={true}
        waveFillColor="#FFFFFF"
      />

      {/* Main Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-['Open_Sans'] text-[48px] font-semibold text-[rgb(122,122,122)] leading-[48px] mb-6 text-center">
              Terms and Conditions
            </h1>
            <div className="space-y-6 font-['Open_Sans'] text-[14px] text-[rgb(122,122,122)] leading-[21px]">
              <div>
                <p className="font-semibold mb-2">1. Booking and Payment</p>
                <ul className="list-disc pl-5 space-y-2 font-normal text-[rgb(51,51,51)] text-[16px] leading-[24px]">
                  <li>A 100% deposit is required at the time of booking to confirm your reservation.</li>
                  <li>All bookings are subject to availability and confirmation.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-2">2. Age and Health Recommendations</p>
                <ul className="list-disc pl-5 space-y-2 font-normal text-[rgb(51,51,51)] text-[16px] leading-[24px]">
                  <li>This tour is not recommended for children younger than 2 years old.</li>
                  <li>This tour is also not recommended for individuals with a physical disability.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-2">3. Liability Waiver</p>
                <p className="mb-2">By reserving this tour, you acknowledge and accept the following:</p>
                <ul className="list-disc pl-5 space-y-2 font-normal text-[rgb(51,51,51)] text-[16px] leading-[24px]">
                  <li><strong>Inherent Risks:</strong> You understand that there are inherent risks involved with snorkeling and boating, including but not limited to equipment failure, perils of the sea, adverse weather conditions, harm or bites caused by marine creatures, acts of fellow participants, entering and exiting the water, boarding or disembarking boats, and activities on the docks. You hereby assume such risks.</li>
                  <li><strong>Duty of Care:</strong> You have a duty to exercise reasonable care for your own safety and actions during the tour and agree to do so.</li>
                  <li><strong>Physical Fitness:</strong> You assert that you are physically fit to hike, snorkel, and ride on a boat. You will not hold Barbuda Leisure Day Tours or its affiliation partners responsible or legally liable for any injuries (medical, accidental, or otherwise) or damage related to snorkeling, riding on the boat, or participating in the trip.</li>
                  <li><strong>Personal Property:</strong> You understand that Barbuda Leisure Day Tours or its affiliation partners is not responsible for reimbursement or replacement of any personal property items lost, stolen, damaged, or fallen into the sea during the trip.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-2">4. Changes to Itinerary</p>
                <p className="font-normal text-[rgb(51,51,51)] text-[16px] leading-[24px]">We reserve the right to adjust or cancel tours if necessary due to unforeseen circumstances such as weather, safety concerns, or other operational reasons. We will notify you of any significant changes as soon as possible.</p>
              </div>

              <div>
                <p className="font-semibold mb-2">5. Travel Requirements</p>
                <ul className="list-disc pl-5 space-y-2 font-normal text-[rgb(51,51,51)] text-[16px] leading-[24px]">
                  <li>It is the customer’s responsibility to ensure they have valid identification and any necessary travel documents for the tour.</li>
                  <li>For air travel, passengers may be subject to weight and baggage restrictions as imposed by the airline.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-2">6. Third-Party Providers</p>
                <p className="font-normal text-[rgb(51,51,51)] text-[16px] leading-[24px]">We work with various third-party providers (such as airlines and boat operators). While we ensure the quality of service, we are not responsible for the actions or omissions of these third parties.</p>
              </div>

              <div>
                <p className="font-semibold mb-2">7. Force Majeure</p>
                <p className="font-normal text-[rgb(51,51,51)] text-[16px] leading-[24px]">We are not liable for any failure or delay in performing our obligations due to events beyond our reasonable control, including but not limited to weather conditions, strikes, pandemics, or government actions.</p>
              </div>

              <div>
                <p className="font-semibold mb-2">8. Agreement</p>
                <p className="font-normal text-[rgb(51,51,51)] text-[16px] leading-[24px]">By reserving this tour, you affirm that you have fully understood and agreed to these Terms and Conditions and the Tour Cancellation Policy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export const metadata = {
  title: 'Terms and Conditions',
  description: 'Barbuda Leisure - Terms and Conditions',
};
