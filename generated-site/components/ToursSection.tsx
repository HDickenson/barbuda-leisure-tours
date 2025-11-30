interface TourCard {
  image: string | null;
  alt?: string | null;
  title?: string | null;
  description?: string | null;
  buttonText?: string | null;
  buttonHref?: string | null;
}

interface ToursSectionProps {
  heading: string;
  backgroundColor?: string;
  tours?: TourCard[];
}

export default function ToursSection({
  heading,
  backgroundColor = 'transparent',
  tours = []
}: ToursSectionProps) {
  return (
    <section
      style={{
        backgroundColor,
        padding: '4rem 1rem'
      }}
    >
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          {heading}
        </h2>

        {tours.length === 0 ? (
          <p className="text-center text-gray-600">
            Tour data not yet extracted.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tours.map((tour, index) => (
              <article
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
              >
                {tour.image && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={tour.image}
                      alt={tour.alt || ''}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  {tour.title && (
                    <h3 className="text-xl font-semibold mb-2">
                      {tour.title}
                    </h3>
                  )}
                  {tour.description && (
                    <p className="text-gray-600 mb-4 flex-1">
                      {tour.description}
                    </p>
                  )}
                  {tour.buttonText && (
                    <a
                      href={tour.buttonHref || '#'}
                      className="inline-block mt-auto px-6 py-2 bg-cyan text-white rounded-lg hover:opacity-90 transition"
                    >
                      {tour.buttonText}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
