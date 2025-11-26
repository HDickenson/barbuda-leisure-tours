import type { Metadata, Viewport } from "next";
import { Leckerli_One, Lexend, Lexend_Deca, Open_Sans, Roboto, Roboto_Slab, Lato, IBM_Plex_Sans } from "next/font/google";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import "./globals.css";
import "../styles/variables.css";
import "../styles/components.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const leckerliOne = Leckerli_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-leckerli",
  display: "swap",
});

const lexend = Lexend({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

const lexendDeca = Lexend_Deca({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-lexend-deca",
  display: "swap",
});

const openSans = Open_Sans({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  display: "swap",
});

const lato = Lato({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-ibm-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Barbuda Leisure Day Tours",
  description: "Experience the beauty of Barbuda with our exclusive day tours",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} ${lexendDeca.variable} ${leckerliOne.variable} ${openSans.variable} ${roboto.variable} ${robotoSlab.variable} ${lato.variable} ${ibmPlexSans.variable} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
