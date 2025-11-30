import Image from 'next/image';
import { Heading } from '@/components/ui/heading';

export default function ReviewsPage() {
  return (
    <main className="min-h-screen">
      {/* Page: Reviews */}
            <section
        className="py-12 pt-[0%] pb-[0%]"
        style={{ backgroundImage: 'url(https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-6-2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-4">
        
          </div>
        </div>
      </section>

      <section
        className="py-12 pt-[80px] pb-[30px]"
        
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-4">
        
          </div>
        </div>
      </section>

      <section
        className="py-12 pt-[30px] pb-[75px]"
        
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 pt-[20px] pb-[20px] pl-[20px] pr-[20px]">
            <h5 className="text-2xl font-bold mb-4">
                Jessica R.
              </h5>
            </div>
                    <div className="col-span-12 pt-[20px] pb-[20px] pl-[20px] pr-[20px]">
            <h5 className="text-2xl font-bold mb-4">
                Daniel S.
              </h5>
            </div>
                    <div className="col-span-12 pt-[20px] pb-[20px] pl-[20px] pr-[20px]">
            <h5 className="text-2xl font-bold mb-4">
                Sophia T.
              </h5>
            </div>
                    <div className="col-span-12 pt-[20px] pb-[20px] pl-[20px] pr-[20px]">
            <h5 className="text-2xl font-bold mb-4">
                James P.
              </h5>
            </div>
                    <div className="col-span-12 pt-[20px] pb-[20px] pl-[20px] pr-[20px]">
            <h5 className="text-2xl font-bold mb-4">
                Emily W.
              </h5>
            </div>
                    <div className="col-span-12 pt-[20px] pb-[20px] pl-[20px] pr-[20px]">
            <h5 className="text-2xl font-bold mb-4">
                Michael L.
              </h5>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export const metadata = {
  title: 'Reviews',
  description: 'Barbuda Leisure - Reviews',
};
