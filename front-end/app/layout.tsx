import type { Metadata } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import type React from "react";
import "./globals.css";
import { Providers } from "@/app/providers";

const _playfair = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-playfair",
});
const _lato = Lato({
	weight: ["300", "400", "700"],
	subsets: ["latin"],
	variable: "--font-lato",
});

export const metadata: Metadata = {
	title: "JanjiAkad | Undangan nikah premium favoritmu",
	description: "You are invited to celebrate our special day",
	icons: {
		icon: "/logo_JanjiAkad.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${_playfair.variable} ${_lato.variable} font-sans antialiased`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
