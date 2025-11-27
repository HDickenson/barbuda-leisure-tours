'use client';

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

function QuoteIcon() {
  return (
    <svg
      className="w-[60px] h-[60px] text-[#cc3366] opacity-80 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    </svg>
  );
}

export default function TestimonialList() {
  return (
    <div className="space-y-6">
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className="bg-[rgba(204,51,102,0.08)] rounded-[10px] p-6 md:p-7 relative"
        >
          <div className="flex gap-4 md:gap-5">
            <div className="flex-shrink-0 pt-1">
              <QuoteIcon />
            </div>
            <div className="flex-1">
              <p className="font-['Open_Sans'] text-[14px] leading-[24px] text-[rgb(122,122,122)] mb-4">
                {testimonial.text}
              </p>
              <p className="font-['Open_Sans'] text-[14px] font-semibold text-[rgb(122,122,122)] text-right italic">
                {testimonial.author}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
