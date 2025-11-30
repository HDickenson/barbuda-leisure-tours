import Image from "next/image";
import Link from "next/link";
import WaveDivider from "@/components/WaveDivider";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-[15%]">
        <Image
          src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-7.jpg"
          alt="Barbuda Beach"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-radial from-[#30BBD870] via-[#30BBD8] to-[#30BBD8]" style={{
          background: 'radial-gradient(at 50% 50%, #30BBD870 28%, #30BBD8 100%)'
        }} />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block bg-gradient-to-r from-aqua/95 to-aqua-light/95 px-12 py-8 rounded-2xl shadow-[18px_30px_61px_50px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-transform hover:-translate-y-[50px] duration-800">
            <h1 className="text-5xl md:text-6xl lg:text-[5em] font-leckerli mb-4 text-white leading-tight" style={{ fontWeight: 300 }}>
              Discover Barbuda for a Day...
            </h1>
            <p className="text-xl md:text-2xl mb-6 font-lexend text-white" style={{ fontSize: '1.3em', fontWeight: 600 }}>
              Your escape to the untouched beauty of this Caribbean paradise!
            </p>
          </div>
          <Link
            href="/our-tours"
            className="inline-block px-8 py-4 mt-6 bg-cyan text-white rounded-lg hover:bg-cyan-dark transition-all duration-300 font-open-sans font-bold text-sm shadow-xl hover:shadow-2xl"
          >
            Explore Our Tours
          </Link>
        </div>
        <WaveDivider
          pathD="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          viewBox="0 0 1200 120"
          fillColor="#FFFFFF"
          position="bottom"
        />
      </section>

      {/* Featured Tours Section */}
      <section className="py-[75px] bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-lexend-deca font-semibold text-center mb-12" style={{ fontSize: '2em', fontWeight: 600 }}>Our Hottest Tours</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Tour 1: Discover Barbuda by Sea */}
            <div className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-[800ms] hover:brightness-112 hover:saturate-110 overflow-hidden relative">
              <div className="absolute top-4 right-4 bg-[#32373c] text-white px-3 py-1 rounded-full text-sm z-10">
                Popular
              </div>
              <Image
                src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-3-2-300x300.jpg"
                alt="Discover Barbuda by Sea"
                width={600}
                height={600}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">Discover Barbuda by Sea</h3>
                <p className="text-gray-600 mb-6">
                  Perfect for those wanting a full-day experience on the water. Enjoy the scenic boat ride and explore Barbuda&apos;s stunning beaches.
                </p>
                <Link
                  href="/product/discover-barbuda-by-sea"
                  className="inline-block px-6 py-2 bg-[#32373c] text-white rounded hover:bg-black transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Tour 2: Discover Barbuda by Air */}
            <div className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden relative">
              <div className="absolute top-4 right-4 bg-[#32373c] text-white px-3 py-1 rounded-full text-sm z-10">
                Popular
              </div>
              <Image
                src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-7-300x300.jpg"
                alt="Discover Barbuda by Air"
                width={600}
                height={600}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">Discover Barbuda by Air</h3>
                <p className="text-gray-600 mb-6">
                  Experience the thrill of flying to Barbuda and maximizing your time on this pristine island paradise.
                </p>
                <Link
                  href="/product/discover-barbuda-by-air"
                  className="inline-block px-6 py-2 bg-[#32373c] text-white rounded hover:bg-black transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Tour 3: Private Charter by Air */}
            <div className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
              <Image
                src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-15-300x300.jpg"
                alt="Private Charter by Air"
                width={600}
                height={600}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">Private Charter by Air</h3>
                <p className="text-gray-600 mb-6">
                  Enjoy an exclusive, private flight experience tailored to your schedule and preferences.
                </p>
                <Link
                  href="/product/private-charter-by-air"
                  className="inline-block px-6 py-2 bg-[#32373c] text-white rounded hover:bg-black transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Tour 4: Private Charter by Sea */}
            <div className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
              <Image
                src="https://www.barbudaleisure.com/wp-content/uploads/2024/11/Allesandra-300x200.jpg"
                alt="Private Charter by Sea"
                width={600}
                height={400}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">Private Charter by Sea</h3>
                <p className="text-gray-600 mb-6">
                  Embark on a private boat charter and experience Barbuda at your own pace with personalized service.
                </p>
                <Link
                  href="/product/private-charter-by-sea"
                  className="inline-block px-6 py-2 bg-[#32373c] text-white rounded hover:bg-black transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-[150px] px-[20px] min-h-[450px]" style={{
        background: '#F5B6D3',
        backgroundImage: 'url(https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-7.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(111%) contrast(163%) saturate(0%) blur(0.5px) hue-rotate(257deg)'
      }}>
        <WaveDivider
          pathD="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          viewBox="0 0 1200 120"
          fillColor="#F5B6D3"
          position="top"
        />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-lexend-deca font-semibold text-center mb-12 text-gray-900" style={{ fontSize: '2em', fontWeight: 600 }}>Why Choose Us</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-lexend font-semibold mb-3" style={{ fontWeight: 600 }}>Seamless, Top-Tier Service</h3>
              <p className="text-gray-900 font-open-sans">
                We&apos;ve partnered with the best in the tourism industry to ensure your experience is flawless.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-xl font-lexend font-semibold mb-3" style={{ fontWeight: 600 }}>Convenient Travel Options</h3>
              <p className="text-gray-900 font-open-sans">
                Choose from air, sea, private boat, or helicopter options to suit your preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-lexend font-semibold mb-3" style={{ fontWeight: 600 }}>Luxury and Comfort</h3>
              <p className="text-gray-900 font-open-sans">
                Collaborations with premier hotels and resorts ensure a luxurious experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-lexend font-semibold mb-3" style={{ fontWeight: 600 }}>Flexible Tour Options</h3>
              <p className="text-gray-900 font-open-sans">
                Beach days, cultural explorations, or adventure activities—customize your perfect day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premier Experience Section */}
      <section className="relative pt-[150px] pb-16 text-white" style={{
        background: 'linear-gradient(181deg, #30BBD8 0%, #001D46 84%)',
        filter: 'brightness(132%) contrast(130%) saturate(0%) blur(0.4px)'
      }}>
        <WaveDivider
          pathD="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          viewBox="0 0 1200 120"
          fillColor="#30BBD817"
          position="top"
        />
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-lexend-deca font-semibold mb-6" style={{ fontSize: '2em', fontWeight: 600 }}>
            A Premier Experience Awaits
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto font-open-sans">
            Connecting guests with Barbuda&apos;s beauty, wildlife, and tranquility, delivering seamless travel solutions.
          </p>
          <Link
            href="/our-tours"
            className="inline-block px-8 py-4 bg-cyan text-white rounded-lg hover:bg-cyan-dark transition-all duration-300 font-open-sans font-bold text-sm shadow-xl"
          >
            Explore Our Tours
          </Link>
        </div>
      </section>
    </>
  );
}
