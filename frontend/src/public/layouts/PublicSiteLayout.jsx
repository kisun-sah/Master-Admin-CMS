import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PopupModal from '../components/common/PopupModal';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function PublicSiteLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-600 selection:text-white font-sans">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <PopupModal />
      <Footer />
    </div>
  );
}
