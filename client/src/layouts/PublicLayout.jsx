import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar.jsx";
import { Footer } from "@/components/layout/Footer.jsx";

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-white">
        Aller au contenu
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
