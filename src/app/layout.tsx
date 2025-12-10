import type { Metadata, Viewport } from "next";
import localFont from 'next/font/local';
import ThemeProvider from "@Shared/components/theme-provider";
import '@Shared/styles/Global.css';
import WarmUpConnection from "@Shared/components/WarmUpConnection";

const geist = localFont({
  src: '../assets/fonts/Geist.ttf',
  variable: '--font-geist',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "Template",
  },
  description: 'description for template',

  authors: [{ name: "Lifo123" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: "/Flifo.svg",
    apple: "/Flifo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`text-gray-12 antialiased f-col ${geist.variable}`}>
        <WarmUpConnection />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <div className="absolute w-dvw h-dvh tab-layer" style={{
          zIndex: -1,
        }}></div>
        {/* #1ed760 spotify green */}
      </body>
    </html >
  );
}