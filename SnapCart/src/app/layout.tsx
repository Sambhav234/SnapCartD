import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";

export const metadata: Metadata = {
  title: "SnapCart | Your Own Delivery App",
  description: "Feels like your local kirana store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body   className="w-full min-h-screen bg-linear-to-b from-green-100">
      <Provider>
        <StoreProvider>
          <InitUser/>
        {children}
        </StoreProvider>
      </Provider>
      </body>
    </html>
  );
}
