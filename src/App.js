import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavStore, useThemeStore } from "./lib/store";

// Layout components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import RequestWizard from "./components/wizard/RequestWizard";

// Section components
import Hero from "./components/home/Hero";
import FeaturedGames from "./components/home/FeaturedGames";
import Services from "./components/home/Services";
import About from "./components/home/About";
import GameEngine from "./components/home/GameEngine";
import FAQ from "./components/home/FAQ";
import GameStore from "./components/games/GameStore";
import Contact from "./components/contact/Contact";
import NotFound from "./components/layout/NotFound";
import Admin from "./components/admin/Admin";

function App() {
  const { page } = useNavStore();
  const { theme } = useThemeStore();


  // Sync theme class on mount
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Page switcher
  const renderPage = () => {
    switch (page) {
      case "home":
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <Hero />
            <FeaturedGames />
            <Services />
            <GameEngine />
            <About />
            <FAQ />
          </motion.div>
        );
      case "games":
        return (
          <motion.div
            key="games"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <GameStore />
          </motion.div>
        );
      case "services":
        return (
          <motion.div
            key="services"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <Services />
          </motion.div>
        );
      case "about":
        return (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <About />
          </motion.div>
        );
      case "contact":
        return (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <Contact />
          </motion.div>
        );
      case "not-found":
        return (
          <motion.div
            key="not-found"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <NotFound />
          </motion.div>
        );
      case 'admin':
        return (
          <motion.div
            key="admin"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <Admin />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] flex flex-col justify-between transition-colors duration-300">
      {/* Navigation Layer */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto pb-24 lg:pb-10">
        <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
      </main>

      {/* Footer Layer */}
      <Footer />

      {/* Request Modals Overlay */}
      <AnimatePresence>
        <RequestWizard />
      </AnimatePresence>
    </div>
  );
}

export default App;
