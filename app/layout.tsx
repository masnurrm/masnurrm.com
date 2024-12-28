import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import Providers from "@/components/providers";
import { cn } from "@/lib/utils";
import { bimbo, della, doodle, nunito } from "@/styles/font";
import "@/styles/global.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { SocialProfileJsonLd } from "next-seo";

export const metadata: Metadata = {
  metadataBase: new URL("httpss://www.masnurrm.com"),
  title: {
    template: "%s | masnurrm",
    default: "Hi! I'm Nur Muhammad"
  },
  description:
    "I'm a software engineer focusing on Cloud, DevSecOps, and Backend Development.\n Psst, talking about business too!",
  robots: {
    follow: true,
    index: true,
    googleBot: {
      index: true,
      follow: true,
    },
  }
};

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          nunito.className,
          della.variable,
          doodle.variable,
          bimbo.variable
        )}
      >
        <SocialProfileJsonLd
          useAppDir={true}
          type="Person"
          name="Nur Muhammad"
          url={process.env.BASE_URL!}
          sameAs={[
            "https://linkedin.com/in/nurmuhammad22/",
            "https://instagram.com/masnurrm",
          ]}
        />
        <SpeedInsights />
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  )}