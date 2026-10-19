import localFont from "next/font/local";

const oswald = localFont({
  src: "../../assets/fonts/oswald-latin-variable.woff2",
  weight: "200 700",
  style: "normal",
  display: "swap",
  variable: "--font-oswald",
});

export default function Home4Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={`home-4 ${oswald.variable}`}>{children}</div>;
}
