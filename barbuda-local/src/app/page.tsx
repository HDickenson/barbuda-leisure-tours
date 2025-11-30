import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <Image
          src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-7.jpg"
          alt="Barbuda Beach"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Discover Barbuda for a Day…
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Your escape to the untouched beauty of this Caribbean paradise!
          </p>
          <Link
            href="/our-tours"
            className="inline-block px-8 py-3 bg-[#32373c] text-white rounded hover:bg-black transition-colors font-medium text-lg"
          >
            Explore Our Tours
          </Link>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Hottest Tours</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Tour 1: Discover Barbuda by Sea */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
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
                  Perfect for those wanting a full-day experience on the water. Enjoy the scenic boat ride and explore Barbuda's stunning beaches.
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
            <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
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
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#32373c] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Seamless, Top-Tier Service</h3>
              <p className="text-gray-600">
                We've partnered with the best in the tourism industry to ensure your experience is flawless.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#32373c] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Convenient Travel Options</h3>
              <p className="text-gray-600">
                Choose from air, sea, private boat, or helicopter options to suit your preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#32373c] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Luxury and Comfort</h3>
              <p className="text-gray-600">
                Collaborations with premier hotels and resorts ensure a luxurious experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#32373c] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Flexible Tour Options</h3>
              <p className="text-gray-600">
                Beach days, cultural explorations, or adventure activities—customize your perfect day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premier Experience Section */}
      <section className="py-16 bg-[#32373c] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            A Premier Experience Awaits
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Connecting guests with Barbuda's beauty, wildlife, and tranquility, delivering seamless travel solutions.
          </p>
          <Link
            href="/our-tours"
            className="inline-block px-8 py-3 bg-white text-[#32373c] rounded hover:bg-gray-100 transition-colors font-medium text-lg"
          >
            Explore Our Tours
          </Link>
        </div>
      </section>
    </>
  );
}
