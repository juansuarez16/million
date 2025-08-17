import "./globals.css";
import Providers from "./providers";

export const metadata = { title: "Million Properties", description: "Clean front" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-6xl p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold">Properties</h1>
          </header>
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
