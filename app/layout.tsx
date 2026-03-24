import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "../providers/AuthProvider";
import Header from "../components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Airbnb - Trouvez des logements uniques et des expériences",
  description: "Réservez des logements, des expériences et plus encore avec Airbnb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} min-h-screen bg-white`}>
        <AuthProvider>
          <Header />
          <main className="pt-16">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}