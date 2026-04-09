import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kygoo Group - photography, coffee, and digital services",
  description: "Kygoo Group - Professional services platform for photography, coffee, and digital services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"
      className="dark"
      style={{ colorScheme: "dark" }}
    >
      <body
        className={`${poppins.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html >
  );
}
