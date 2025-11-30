import Image from 'next/image';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';

export default function ReadyToExploreBarbudaPage() {
  return (
    <main className="min-h-screen">
      {/* Page: Ready to Explore Barbuda? */}
            <section
        className="py-12 pt-[0%] pb-[15%]"
        
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 pt-[50px] pb-[50px] pl-[50px] pr-[50px]">
            <h1 className="text-2xl font-bold mb-4">
                Discover Barbuda for a Day… 
              </h1>
            <h2 className="text-2xl font-bold mb-4">
                Your escape to the untouched beauty of this Caribbean paradise!
              </h2>
            <a
                href="https://www.barbudaleisure.com/our-tours/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Explore Our Tours
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-12 pt-[75px] pb-[75px]"
        
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  Popular
                </div>
                <Image
                  src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-3-2.jpg"
                  alt="Discover Barbuda by Sea"
                  width={800}
                  height={400}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Discover Barbuda by Sea</h3>
                  <p className="text-gray-600 mb-4"></p>
                  <a
                    href="https://www.barbudaleisure.com/product/discover-barbuda-by-sea/"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  Popular
                </div>
                <Image
                  src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-7.jpg"
                  alt="Discover Barbuda by Air"
                  width={800}
                  height={400}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Discover Barbuda by Air</h3>
                  <p className="text-gray-600 mb-4"></p>
                  <a
                    href="https://www.barbudaleisure.com/product/discover-barbuda-by-air/"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                
                <Image
                  src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-15.jpg"
                  alt="Private Charter by Air"
                  width={800}
                  height={400}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Private Charter by Air</h3>
                  <p className="text-gray-600 mb-4"></p>
                  <a
                    href="https://www.barbudaleisure.com/product/private-charter-by-air/"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                
                <Image
                  src="https://www.barbudaleisure.com/wp-content/uploads/2024/11/Allesandra-scaled.jpg"
                  alt="Private Charter by Sea"
                  width={800}
                  height={400}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Private Charter by Sea</h3>
                  <p className="text-gray-600 mb-4"></p>
                  <a
                    href="https://www.barbudaleisure.com/product/private-charter-by-sea/"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-12 pt-[150px] pb-[150px]"
        
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-4">
        
          </div>
        </div>
      </section>

      <section
        className="py-12 pt-[15%] pb-[25%]"
        style={{ backgroundImage: 'url(https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureToursSection-3-2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-4">
        
          </div>
        </div>
      </section>

      <section
        className="py-12 pt-[100px] pb-[100px]"
        
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-4">
        
          </div>
        </div>
      </section>

      <section
        className="py-12"
        
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-4">
        
          </div>
        </div>
      </section>
    </main>
  );
}

export const metadata = {
  title: 'Ready to Explore Barbuda?',
  description: 'Barbuda Leisure - Ready to Explore Barbuda?',
};
