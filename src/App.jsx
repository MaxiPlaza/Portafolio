import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import MainPortfolio from './components/sections/MainPortfolio';
import ProjectDetails from './components/sections/ProjectDetails';
import Footer from './components/layout/Footer';

// Component to handle scroll behavior between routes
const ScrollToAnchor = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

function App() {
  // Custom cursor effect
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'fixed w-8 h-8 rounded-full border border-accent pointer-events-none z-50 transition-transform duration-100 mix-blend-difference hidden md:block';
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX - 16}px`;
      cursor.style.top = `${e.clientY - 16}px`;
    };

    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      cursor.remove();
    };
  }, []);

  return (
    <Router>
      <ScrollToAnchor />
      <div className="bg-primary min-h-screen text-gray-200 selection:bg-accent/30 selection:text-white font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<MainPortfolio />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
