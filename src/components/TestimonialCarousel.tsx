'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface Testimonial {
  text: string;
  author: string;
}

const testimonials: Testimonial[] = [
  {
    text: "Barbuda took our breath away! We loved every minute—from the pink sands to the serene bird sanctuary, it was all picture-perfect. Our guide was wonderful and made the tour so informative and fun. Can't wait to come back for another escape with Barbuda Leisure!",
    author: "Jessica R."
  },
  {
    text: "Thank you, Barbuda Leisure Day Tours, for an unforgettable day! The island is truly a hidden gem, and our experience was seamless from start to finish. The team went above and beyond to make sure we had everything we needed and more. Highly recommend the BBQ lunch and Frigate Bird Sanctuary tour—amazing sights and incredible service!",
    author: "Daniel S."
  },
  {
    text: "This was the highlight of our trip! Barbuda's natural beauty is unmatched, and the beaches were simply spectacular. The whole experience was well-organized, and the staff at Barbuda Leisure were attentive, friendly, and knowledgeable. We had a great time exploring the island and loved every bit of it. Worth every penny!",
    author: "Sophia T."
  },
  {
    text: "Absolutely the best way to see Barbuda! From the boat ride to the stunning beaches and incredible bird watching, we felt like we were in our own little paradise. The pink sand beach was even more amazing than the photos! Thanks to Barbuda Leisure for such a fantastic and hassle-free adventure!",
    author: "James P."
  },
  {
    text: "I can't believe how beautiful Barbuda is, and Barbuda Leisure Day Tours made it all possible. The team was so professional and friendly, and we learned so much about the island's history and wildlife. Loved the personalized touches and the care they put into everything. This tour is a must-do if you're visiting Antigua!",
    author: "Emily W."
  },
  {
    text: "An unforgettable day in paradise! Barbuda Leisure handled every detail perfectly, from the transport to the warm welcome on the island. The tour was relaxed, informative, and truly showcased Barbuda's unique beauty. I left with wonderful memories and already plan to visit again. Highly recommend it to anyone looking to explore this stunning island!",
    author: "Michael L."
  }
];

export default function TestimonialCarousel() {
  return (
    <div className="testimonial-carousel-wrapper">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop={true}
        className="testimonial-swiper"
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="bg-transparent p-0 flex flex-col justify-center items-center">
              <div className="max-w-[800px] mx-auto px-[20px] py-[20px]">
                <p className="font-['Lexend_Deca'] text-[16px] font-normal text-[rgb(51,51,51)] leading-[24px] mb-6 text-center">
                  &quot;{testimonial.text}&quot;
                </p>
                <p className="font-['Lexend_Deca'] text-[16px] font-bold text-[rgb(51,51,51)] text-center">
                  — {testimonial.author}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .testimonial-swiper {
          padding-bottom: 75px;
        }

        .testimonial-swiper .swiper-pagination {
          bottom: 10px;
        }

        .testimonial-swiper .swiper-pagination-bullet {
          background: #30bbd8;
          opacity: 0.5;
          width: 10px;
          height: 10px;
        }

        .testimonial-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 12px;
          height: 12px;
        }
      `}</style>
    </div>
  );
}
