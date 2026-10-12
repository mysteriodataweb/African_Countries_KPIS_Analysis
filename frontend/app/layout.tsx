import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Data Mart — Indicateurs de Développement Afrique",
  description:
    "Visualisation des indicateurs de développement pour les pays africains (source : World Bank)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
            <Link href="/" className="text-lg font-semibold text-primary-700 hover:text-primary-800">
              Africa Dev Data Mart
            </Link>
            <nav className="ml-auto flex gap-6 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary-600">Accueil</Link>
              <Link href="/comparaison" className="hover:text-primary-600">Comparaison</Link>
              <Link href="/methodologie" className="hover:text-primary-600">Méthodologie</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
          Source :{" "}
          <a href="https://data.worldbank.org/" className="underline hover:text-gray-700">
            World Bank Indicators API v2
          </a>{" "}
          &mdash; Licence CC-BY 4.0
        </footer>
      </body>
    </html>
  );
}
