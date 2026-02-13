import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Z-Anonyme — Messages anonymes sécurisés",
    template: "%s | Z-Anonyme",
  },
  description:
    "Recevez des messages anonymes de vos amis, collègues et abonnés. 100% anonyme, 100% sécurisé. Créez votre lien unique et partagez-le.",
  keywords: [
    "messages anonymes",
    "anonymous messaging",
    "feedback anonyme",
    "lien anonyme",
    "Z-Anonyme",
  ],
  authors: [{ name: "Z-Anonyme" }],
  creator: "Z-Anonyme",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://z-anonyme.app"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Z-Anonyme",
    title: "Z-Anonyme — Messages anonymes sécurisés",
    description:
      "Recevez des messages anonymes de vos amis et collègues. Créez votre lien, partagez-le, et découvrez ce qu'ils pensent vraiment.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Z-Anonyme — Messages anonymes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Z-Anonyme — Messages anonymes sécurisés",
    description:
      "Recevez des messages anonymes de vos amis et collègues. 100% anonyme, 100% sécurisé.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo-black.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Z-Anonyme" />
        <link rel="apple-touch-icon" href="/logo-black.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
