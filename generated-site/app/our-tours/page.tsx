import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Tour } from "@/data/tours";
import { getAllTours, getToursByCategory } from "@/data/tours";

export const metadata: Metadata = {
	title: "Our Tours & Adventures | Barbuda Leisure Day Tours",
	description:
		"Experience the natural beauty, tranquility, and charm of Barbuda with our carefully curated tours and adventures. From signature experiences to private charters, discover your perfect island escape.",
};

function TourCard({ tour }: { tour: Tour }) {
	return (
		<Link href={`/tours/${tour.slug}`} className="group block">
			<div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col transform hover:-translate-y-2">
				{/* Image */}
				<div className="relative h-72 overflow-hidden">
					<Image
						src={tour.heroImage || "/images/BarbudaLeisureTours-3.jpg"}
						alt={tour.title}
						fill
						className="object-cover group-hover:scale-110 transition-transform duration-700"
					/>

					{/* Overlay Gradient */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

					{/* Badge */}
					{tour.featured && (
						<div className="absolute top-4 left-4 bg-[#FF6B9D] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
							Featured
						</div>
					)}

					{/* Price Badge */}
					<div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#263238] px-4 py-2 rounded-full text-sm font-bold shadow-lg">
						{tour.price}
					</div>
				</div>

				{/* Content */}
				<div className="p-6 flex-1 flex flex-col">
					<div className="mb-4">
						<h3
							className={`text-2xl font-bold text-[#263238] mb-1 group-hover:text-[#4DD0E1] transition-colors line-clamp-2`}
						>
							{tour.title}
						</h3>
						{tour.subtitle && (
							<p className="text-[#FF6B9D] font-semibold text-sm uppercase tracking-wide">
								{tour.subtitle}
							</p>
						)}
					</div>

					<p className="text-gray-600 mb-4 flex-1 line-clamp-3">
						{tour.description
							.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
							.replace(/<[^>]*>/g, "")
							.substring(0, 150)}
						...
					</p>

					{/* Highlights */}
					{tour.included && tour.included.length > 0 && (
						<div className="mb-4">
							<div className="flex flex-wrap gap-2">
								{tour.included.slice(0, 3).map((item) => (
									<span
										key={item}
										className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
									>
										{item.length > 30 ? item.substring(0, 30) + "..." : item}
									</span>
								))}
							</div>
						</div>
					)}

					{/* Footer */}
					<div className="flex items-center justify-between pt-4 border-t border-gray-100">
						<div className="flex items-center text-gray-500 text-sm">
							<svg
								className="w-5 h-5 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							{tour.duration}
						</div>
						<div className="text-[#4DD0E1] font-bold text-sm group-hover:translate-x-2 transition-transform flex items-center gap-1">
							View Details
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}

function CategorySection({
	title,
	description,
	tours,
	icon,
}: {
	title: string;
	description: string;
	tours: Tour[];
	icon: React.ReactNode;
}) {
	if (tours.length === 0) return null;

	return (
		<section className="mb-24">
			<div className="mb-12 text-center max-w-3xl mx-auto">
				<div className="flex justify-center mb-4">{icon}</div>
				<h2
					className="text-5xl font-bold text-[#263238] mb-4"
					style={{ fontFamily: "'Leckerli One', cursive" }}
				>
					{title}
				</h2>
				<p className="text-xl text-gray-600 leading-relaxed">{description}</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
				{tours.map((tour) => (
					<TourCard key={tour.slug} tour={tour} />
				))}
			</div>
		</section>
	);
}

export default function OurToursPage() {
	const signatureTours = getToursByCategory("signature");
	const localTours = getToursByCategory("local");
	const sharedTours = getToursByCategory("shared");
	const privateTours = getToursByCategory("private");

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* Hero Section */}
			<div className="relative h-[600px] overflow-hidden">
				<div className="absolute inset-0">
					<Image
						src="/images/Pink-Beach-North-scaled.jpg"
						alt="Barbuda Tours"
						fill
						className="object-cover"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
				</div>

				<div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
					<h1
						className="text-7xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl"
						style={{ fontFamily: "'Leckerli One', cursive" }}
					>
						Our Tours & Adventures
					</h1>
					<p className="text-2xl md:text-3xl text-white/95 max-w-3xl mb-8 font-light">
						Discover the unspoiled beauty of Barbuda with our expertly crafted
						tours
					</p>
					<div className="flex flex-wrap gap-4 justify-center">
						<a
							href="#signature"
							className="bg-[#4DD0E1] hover:bg-[#26C6DA] text-white font-bold py-4 px-8 rounded-full text-lg transition-all hover:scale-105 shadow-2xl"
						>
							View Popular Tours
						</a>
						<Link
							href="/contact"
							className="bg-white/20 backdrop-blur-md hover:bg-white/30 border-2 border-white text-white font-bold py-4 px-8 rounded-full text-lg transition-all hover:scale-105"
						>
							Custom Inquiry
						</Link>
					</div>
				</div>

				{/* Wave Divider */}
				<div className="absolute bottom-0 left-0 right-0">
					<svg
						viewBox="0 0 1440 120"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="w-full h-auto"
					>
						<path
							d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
							fill="rgb(249, 250, 251)"
						/>
					</svg>
				</div>
			</div>

			{/* Tours Content */}
			<div className="max-w-[1600px] mx-auto px-6 py-20" id="signature">
				<CategorySection
					title="Signature Tours"
					description="Our most popular and highly rated day trips, perfect for visitors seeking the full Barbuda experience."
					tours={signatureTours}
					icon={
						<div className="w-16 h-16 bg-gradient-to-br from-[#4DD0E1] to-[#26C6DA] rounded-full flex items-center justify-center">
							<svg
								className="w-8 h-8 text-white"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
						</div>
					}
				/>

				<CategorySection
					title="Already in Barbuda?"
					description="If you're already on the island, join our local excursions for sightseeing, beach relaxation, and cultural exploration."
					tours={localTours}
					icon={
						<div className="w-16 h-16 bg-gradient-to-br from-[#FF6B9D] to-[#FF5789] rounded-full flex items-center justify-center">
							<svg
								className="w-8 h-8 text-white"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
					}
				/>

				<CategorySection
					title="Shared Adventures"
					description="Join fellow travelers on these exceptional shared experiences with trusted local providers."
					tours={sharedTours}
					icon={
						<div className="w-16 h-16 bg-gradient-to-br from-[#26C6DA] to-[#00ACC1] rounded-full flex items-center justify-center">
							<svg
								className="w-8 h-8 text-white"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
							</svg>
						</div>
					}
				/>

				<CategorySection
					title="Private Charters"
					description="Experience ultimate luxury and personalized service with our exclusive private charter options."
					tours={privateTours}
					icon={
						<div className="w-16 h-16 bg-gradient-to-br from-[#263238] to-[#37474F] rounded-full flex items-center justify-center">
							<svg
								className="w-8 h-8 text-white"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
					}
				/>

				{/* CTA Section */}
				<div className="mt-32 relative overflow-hidden rounded-3xl">
					<div className="absolute inset-0">
						<Image
							src="/images/BarbudaLeisureTours-3.jpg"
							alt="Book Now"
							fill
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-r from-[#4DD0E1]/95 to-[#26C6DA]/95"></div>
					</div>

					<div className="relative z-10 p-16 text-center text-white">
						<h2
							className="text-5xl font-bold mb-6"
							style={{ fontFamily: "'Leckerli One', cursive" }}
						>
							Ready for Your Barbuda Adventure?
						</h2>
						<p className="text-2xl mb-10 max-w-2xl mx-auto font-light">
							Let us help you plan the perfect day in paradise. Our team is
							ready to create an unforgettable experience.
						</p>
						<div className="flex flex-wrap gap-4 justify-center">
							<Link
								href="/contact"
								className="bg-white text-[#4DD0E1] hover:bg-gray-100 font-bold py-5 px-12 rounded-full text-xl transition-all hover:scale-105 shadow-2xl inline-flex items-center gap-2"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								Contact Us Today
							</Link>
							<a
								href="tel:+12687642524"
								className="bg-[#FF6B9D] hover:bg-[#FF5789] text-white font-bold py-5 px-12 rounded-full text-xl transition-all hover:scale-105 shadow-2xl inline-flex items-center gap-2"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
									/>
								</svg>
								Call +1 (268) 764-2524
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
