import "./home-15-1.css";

export default function Home151Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="home-15-1-shell">{children}</div>;
}
