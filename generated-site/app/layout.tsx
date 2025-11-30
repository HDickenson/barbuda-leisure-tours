/**
 * Root Layout - Includes Tailwind CSS and Google Fonts
 */

import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";

export const metadata: Metadata = {
	metadataBase: new URL("https://www.barbudaleisure.com"),
	title: "Barbuda Leisure Day Tours – One Day, Endless Memories",
	description:
		"Experience the natural beauty, tranquility, and charm of Barbuda with our carefully curated day tours and adventures. Book your unforgettable island escape today.",
	openGraph: {
		title: "Barbuda Leisure Day Tours – One Day, Endless Memories",
		description:
			"Experience the natural beauty, tranquility, and charm of Barbuda with our carefully curated day tours and adventures.",
		url: "https://www.barbudaleisure.com",
		siteName: "Barbuda Leisure Day Tours",
		type: "website",
	},
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link
					href="https://fonts.googleapis.com/css2?family=Leckerli+One&family=Montserrat:wght@300;400;500;600;700;800&display=swap"
					rel="stylesheet"
				/>
			</head>
						<body>
							{children}
							<Footer />
						</body>
		</html>
	);
}
