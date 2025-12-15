import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen gradient-bg bg-grid">
      <div className="fixed inset-0 bg-radial-gradient pointer-events-none" />
      <Navbar />
      <main className="relative pt-16">{children}</main>
    </div>
  );
}
