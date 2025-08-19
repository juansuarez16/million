import "./globals.css";
import Providers from "./providers";

import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

export const metadata = {
  title: "Million Properties",
  description: "Real estate catalog",
};

const setTheme = `
;(() => {
  try {
    const stored = localStorage.getItem('theme'); // 'dark' | 'light' | null
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored ? stored === 'dark' : prefers;
    document.documentElement.classList.toggle('dark', dark);
  } catch {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: setTheme }} />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
      </head>
      
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-100">
        
        <Providers>
          <Navbar />
          <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
