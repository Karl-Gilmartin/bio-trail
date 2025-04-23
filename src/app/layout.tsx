import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import IntercomProvider from "./_components/intercom";
import SplashScreen from "./_components/splash_screen";

export const metadata: Metadata = {
  title: "BioTrail",
  description: "BioTrail",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="flex flex-col min-h-screen">
        <TRPCReactProvider>
          <IntercomProvider />
          <SplashScreen />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
