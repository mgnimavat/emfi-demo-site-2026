import { Oswald } from "next/font/google";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-oswald",
});

export default function Home3Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={`home-3 ${oswald.variable}`}>{children}</div>;
}
