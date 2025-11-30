import Image from 'next/image';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';

export default function AboutUsPage() {
  return (
    <main className="min-h-screen">
      {/* Page: About Us */}
            <section
        className="py-12 pt-[0%] pb-[07.5%]"
        style={{ backgroundImage: 'url(https://www.barbudaleisure.com/wp-content/uploads/2024/11/m-6-scaled-e1731509852408.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-4">
        
          </div>
        </div>
      </section>

      <section
        className="py-12 pt-[250px] pb-[200px]"
        
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6 pt-[50px] pb-[50px] pl-[50px] pr-[100px]">
            <h2 className="text-2xl font-bold mb-4">
                Welcome to Barbuda Leisure Day Tours
              </h2>
            <h4 className="text-2xl font-bold mb-4">
                Your Gateway to Discovering Barbuda
              </h4>
            <div
                className="prose prose-lg"
                dangerouslySetInnerHTML={{ __html: `<p>At Barbuda Leisure Day Tours, we're passionate about sharing the unspoiled beauty of Barbuda with the world. As the only dedicated Barbuda day tour concierge company, we've been proudly serving guests since 2011, offering exceptional experiences and flexible travel options between Antigua and Barbuda.</p>` }}
              />
            <div
                className="prose prose-lg"
                dangerouslySetInnerHTML={{ __html: `<p>Whether by air, sea, private boat, or even helicopter, we're your trusted partner in making your visit to Barbuda truly unforgettable.</p>` }}
              />
            </div>
                    <div className="col-span-6 pl-[40px]">
            <Image
                src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-6.jpg"
                alt=""
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            <Image
                src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-4.jpg"
                alt=""
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            <Image
                src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/PFA4070-scaled.jpg"
                alt=""
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            <Image
                src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/DSC3331-scaled.jpg"
                alt=""
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            <Image
                src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/MG_9010.tif.jpg"
                alt=""
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            <Image
                src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-3.jpg"
                alt=""
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            <Image
                src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-12.jpg"
                alt=""
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-12 pt-[80px] pb-[80px]"
        
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-4">
        
          </div>
        </div>
      </section>

      <section
        className="py-12 pt-[81px] pb-[200px]"
        
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6 pl-[40px]">
            <Image
                src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-7-2.jpg"
                alt=""
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            <Image
                src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-8.jpg"
                alt=""
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            <Image
                src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-6-2.jpg"
                alt=""
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            <Image
                src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-7.jpg"
                alt=""
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            </div>
                    <div className="col-span-12">
            <h2 className="text-2xl font-bold mb-4">
                Thank You for Considering Us
              </h2>
            <div
                className="prose prose-lg"
                dangerouslySetInnerHTML={{ __html: `<p>We look forward to making your trip a memorable one!</p>` }}
              />
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
    </main>
  );
}

export const metadata = {
  title: 'About Us',
  description: 'Barbuda Leisure - About Us',
};
