import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Configuration des polices
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Métadonnées de la page
export const metadata = {
  title: "Vitality Assessment",
  description: "A quick assessment exploring your daily energy, mindset, and internal alignment",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* X Pixel Base Code */}
        <Script
          id="twitter-pixel-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(e,t,n,s,u,a){
                e.twq||(s=e.twq=function(){
                  s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
                },
                s.version='1.1',s.queue=[],
                u=t.createElement(n),u.async=!0,
                u.src='https://static.ads-twitter.com/uwt.js',
                a=t.getElementsByTagName(n)[0],
                a.parentNode.insertBefore(u,a))
              }(window,document,'script');
              
              // REMPLACER PAR VOTRE VRAI PIXEL ID
              twq('config','r1bmm');
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${cormorant.variable} antialiased`}
      >
        {/* 1. Chargement de la bibliothèque Google Tag Manager */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WLXVWP8KZM"
          strategy="afterInteractive"
        />

        {/* 2. Initialisation de Google Analytics (Inline Script) */}
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WLXVWP8KZM');
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}