import Header from "@/components/Header";
import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Toaster as ToasterUI } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import Footer from "@/components/Footer";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import InstallDialog from "@/components/InstallDialog";
import ServiceWorkerInstall from "@/components/ServiceWorkerInstall";
import NotificationPrompt from "@/components/NotificationPrompt";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WEB2 - Round Robin",
  description:
    "Web app by Fran Markulin for the 1st project assignment of the course WEB2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ServiceWorkerInstall />
      <InstallDialog />
      <body
        className={`${spaceGrotesk.className} relative selection:bg-primary selection:text-primary-foreground min-h-screen`}
      >
        <NotificationPrompt />
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <ToasterUI />
            <Header />
            <main className="max-w-7xl mx-auto p-8 pb-16">{children}</main>
            <Footer />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
