import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteChrome } from "@/components/site-chrome";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { getContactInfo } from "@/lib/site-data";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kambestmeds.com"),
  title: {
    default: "KAMBEST Tradomedical Services | Natural Healing, Real Results",
    template: "%s | KAMBEST Tradomedical Services",
  },
  description:
    "KAMBEST Tradomedical Services offers trusted herbal solutions for fibroid, hepatitis, liver detox, fertility and more — natural healing, real results, rooted in Nigerian tradomedical expertise.",
  keywords: [
    "KAMBEST tradomedical",
    "tradomedical Services Nigeria",
    "herbal medicine Port Harcourt",
    "trado medical Lekki Lagos",
    "fibroid cure herbal",
    "hepatitis liver detox herbal",
    "sperm booster herbal Nigeria",
    "natural fertility treatment Nigeria",
    "buy herbal medicine online Nigeria",
  ],
  openGraph: {
    title: "KAMBEST Tradomedical Services | Natural Healing, Real Results",
    description:
      "Trusted herbal solutions — rooted in nature, proven in results. Explore KAMBEST's tradomedical products and services.",
    url: "https://www.kambestmeds.com",
    siteName: "KAMBEST Tradomedical Services",
    images: ["/opengraph-image_v2.jpg"],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KAMBEST Tradomedical Services | Natural Healing, Real Results",
    description:
      "Trusted herbal solutions — rooted in nature, proven in results. Explore KAMBEST's tradomedical products and services.",
    images: ["/opengraph-image_v2.jpg"],
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f4ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1610" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetched once here, cached, rather than through a per-visitor Convex
  // subscription in the footer.
  const contact = await getContactInfo();

  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${nunito.variable} h-full antialiased`}>
      <body className='min-h-full flex flex-col font-sans'>
        <ClerkProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange>
            <SiteChrome contact={contact}>{children}</SiteChrome>
            <Toaster richColors position='top-center' />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
