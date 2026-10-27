import "../home-12/home-12.css";

export default function Home121Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="home-12-shell">{children}</div>;
}
