import { Outfit } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Mohona by CGFWA",
  description: "বাংলাদেশ কোস্ট গার্ড পরিবার কল্যাণ সংঘের তত্ত্বাবধানে পরিচালিত হস্তশিল্প ও গৃহসজ্জ্বা সামগ্রীর একটি নির্ভরযোগ্য প্রতিষ্ঠান",
};

import { SiteSettingsProvider } from "./context/SiteSettingsContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${outfit.variable} antialiased min-h-screen flex flex-col bg-gray-50 font-sans overflow-x-hidden`}>
        <SiteSettingsProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}

