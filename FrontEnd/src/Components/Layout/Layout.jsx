import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function Layout({ children }) {
  const location = useLocation();

  useEffect(() => {
    // Prevent browser back button from going beyond home page
    const handlePopState = (e) => {
      // If user is on home page and tries to go back, prevent it
      if (location.pathname === '/home') {
        window.history.pushState(null, null, window.location.href);
      }
    };

    // Add event listener for browser back/forward buttons
    window.addEventListener('popstate', handlePopState);

    // Push current state to prevent going back
    if (location.pathname === '/home') {
      window.history.pushState(null, null, window.location.href);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname]);

  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
