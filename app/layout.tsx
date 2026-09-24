import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://3dgap.it"),
  title: "3D GAP — Stampa 3D su misura e preventivi semplici",
  description:
    "Carica un file 3D o descrivi il progetto: ricevi un preventivo chiaro per stampe 3D su misura, gadget aziendali, piccoli lotti e prototipi.",
  keywords: [
    "stampa 3D",
    "manifattura additiva",
    "prototipazione rapida",
    "FDM",
    "resina LCD",
    "Campania",
    "corporate gadget",
    "HoReCa",
  ],
  authors: [{ name: "3D GAP" }],
  openGraph: {
    title: "3D GAP — Stampa 3D su misura",
    description:
      "Preventivi chiari per stampe 3D, gadget aziendali e piccoli lotti personalizzati.",
    type: "website",
    locale: "it_IT",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        {/* Prevent theme flash before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('3dgap-theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
