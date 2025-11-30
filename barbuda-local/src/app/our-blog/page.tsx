import Image from 'next/image';


export default function OurBlogPage() {
  return (
    <main className="min-h-screen">
      {/* Page: Blog */}
            <section
        className="py-12 pt-[0%] pb-[6%]"
        style={{ backgroundImage: 'url(https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureToursSection-2-2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-4">
        
          </div>
        </div>
      </section>

      <section
        className="py-12 pt-[100px] pb-[200px]"
        
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
  title: 'Blog',
  description: 'Barbuda Leisure - Blog',
};
