import { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      checkAdminRole();
    }
  }, [user]);

  const checkAdminRole = async () => {
    try {
      // Optimization: Check if user object already has role or fetch profile
      // Since firebase user object doesn't have custom claims easily accessible without force refresh or custom logic,
      // checking profile from API is safe.
      const { data } = await api.get(`/users/profile/${user?.uid}`);
      if (data.role === 'admin') setIsAdmin(true);
    } catch (e) {
      console.error("Failed to check admin role");
    }
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const isHomePage = location.pathname === '/';

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-4",
        isScrolled || !isHomePage ? "bg-background/80 backdrop-blur-md border-b border-white/10" : "bg-transparent",
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <RouterLink to="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
          EyeQ<span className="text-primary">.</span>
        </RouterLink>

        {/* Desktop Nav - Left Links */}
        <div className="hidden md:flex items-center gap-1 ml-8">
          {isHomePage ? (
            <Link to="home" smooth={true} duration={500} className="cursor-pointer px-4 py-2 text-sm font-medium hover:text-primary transition-colors">Home</Link>
          ) : (
            <RouterLink to="/" className="cursor-pointer px-4 py-2 text-sm font-medium hover:text-primary transition-colors">Home</RouterLink>
          )}

          <RouterLink to="/dashboard" className="cursor-pointer px-4 py-2 text-sm font-medium hover:text-primary transition-colors">Member</RouterLink>

          {isHomePage && (
            <>
              <Link to="about" smooth={true} duration={500} className="cursor-pointer px-4 py-2 text-sm font-medium hover:text-primary transition-colors">About</Link>
              <Link to="contact" smooth={true} duration={500} className="cursor-pointer px-4 py-2 text-sm font-medium hover:text-primary transition-colors">Contact</Link>
            </>
          )}
        </div>

        {/* Desktop Nav - Right Actions */}
        <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm ml-auto">
          {user ? (
            <>
              {isAdmin && (
                <RouterLink to="/eyeqcontrol2k25" className="cursor-pointer px-4 py-2 text-sm font-medium text-red-500 hover:text-red-400 transition-colors">Admin</RouterLink>
              )}
              <button onClick={handleLogout} className="cursor-pointer px-4 py-2 text-sm font-medium hover:text-red-500 transition-colors">Logout</button>
            </>
          ) : (
            <RouterLink to="/signup" className="cursor-pointer px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">Get Started</RouterLink>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden ml-auto">
          <motion.button
            className="text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className="absolute top-4 right-4 text-foreground p-2"
              onClick={() => setIsMobileMenuOpen(false)}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.button>

            <RouterLink to="/" onClick={handleNavClick} className="text-2xl font-bold hover:text-primary">Home</RouterLink>
            <RouterLink to="/dashboard" onClick={handleNavClick} className="text-2xl font-bold hover:text-primary">Member</RouterLink>
            {user ? (
              <>
                {isAdmin && <RouterLink to="/eyeqcontrol2k25" onClick={handleNavClick} className="text-2xl font-bold text-red-500 hover:text-red-400">Admin</RouterLink>}
                <button onClick={handleLogout} className="text-2xl font-bold hover:text-red-500">Logout</button>
              </>
            ) : (
              <RouterLink to="/signup" onClick={handleNavClick} className="text-2xl font-bold hover:text-primary">Get Started</RouterLink>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;