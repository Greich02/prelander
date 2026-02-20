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
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* REDDIT PIXEL - BASE CODE */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Script
          id="reddit-pixel-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(w,d){
                if(!w.rdt){
                  var p=w.rdt=function(){
                    p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)
                  };
                  p.callQueue=[];
                  var t=d.createElement("script");
                  t.src="https://www.redditstatic.com/ads/pixel.js";
                  t.async=!0;
                  var s=d.getElementsByTagName("script")[0];
                  s.parentNode.insertBefore(t,s)
                }
              }(window,document);
              
              // Initialize Reddit Pixel with your ID
              rdt('init','a2_ii7jiw9uywto', {"optOut":false,"useDecimalCurrencyValues":true});
              
              // Track PageVisit on all pages
              rdt('track', 'PageVisit');
              
              console.log('✅ Reddit Pixel initialized: a2_ii7jiw9uywto');
            `,
          }}
        />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* X PIXEL - BASE CODE */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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
              
              twq('config','r1bmm');
            `,
          }}
        />
      </head>
      
      <body
        className={`${inter.variable} ${playfair.variable} ${cormorant.variable} antialiased`}
      >
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* GOOGLE ANALYTICS */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WLXVWP8KZM"
          strategy="afterInteractive"
        />
        
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