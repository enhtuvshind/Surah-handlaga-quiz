import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const baseUrl = `${protocol}://${host}`;
  return {
    title: "Суралцах хандлагын сорил",
    description: "Туршлагаар дамжуулан суралцах хандлагаа эргэцүүлэх Монгол хэл дээрх сорил.",
    icons: { icon: "/favicon.svg" },
    openGraph: { title: "Суралцах хандлагын сорил", description: "Туршлагаар дамжуулан суралцах хандлагаа эргэцүүлээрэй.", images: [`${baseUrl}/og.png`] },
    twitter: { card: "summary_large_image", title: "Суралцах хандлагын сорил", images: [`${baseUrl}/og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="mn"><body>{children}</body></html>;
}
