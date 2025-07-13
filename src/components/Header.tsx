
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Info, Menu, X, Home, GraduationCap } from 'lucide-react';

const rotatingContent = [
  {
    title: "Find Your Perfect Engineering College",
    subtitle: "Smart Search for Smarter Choices"
  },
  {
    title: "DSE College Finder 2024",
    subtitle: "Your Admission Buddy"
  },
  {
    title: "Engineering Admission Guide",
    subtitle: "Decode CAP Rounds Easily"
  },
  {
    title: "College Search Platform",
    subtitle: "College Search Simplified"
  }
];

export const Header: React.FC = () => {
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [showLogo, setShowLogo] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowLogo(false);
      
      setTimeout(() => {
        setCurrentContentIndex((prevIndex) => (prevIndex + 1) % rotatingContent.length);
        setShowLogo(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand Section */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="flex items-center justify-center h-12 w-12 bg-white rounded-lg border border-gray-200 overflow-hidden group-hover:border-primary/50 transition-all duration-200 shadow-sm">
              <img 
                src="/lovable-uploads/0b03c0c9-e954-4cec-82c9-48e194652cf3.png" 
                alt="FindMyCLG Logo" 
                className={`h-full w-full object-contain transition-all duration-1000 ${
                  showLogo ? 'opacity-100 scale-100' : 'opacity-90 scale-95'
                }`}
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <div className="h-5 flex items-center">
                <span 
                  className={`text-lg font-bold text-[#002C3E] group-hover:text-primary transition-all duration-300 ${
                    showLogo ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
                  }`}
                >
                  {rotatingContent[currentContentIndex].title}
                </span>
              </div>
              <p className={`text-xs text-gray-600 transition-all duration-1000 ${
                showLogo ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
              }`}>
                {rotatingContent[currentContentIndex].subtitle}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-[#002C3E] hover:text-primary transition-colors duration-200 text-sm font-medium relative group"
            >
              <Home className="h-4 w-4" />
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              to="/feedback"
              className="flex items-center gap-2 text-[#002C3E] hover:text-primary transition-colors duration-200 text-sm font-medium relative group"
            >
              <MessageSquare className="h-4 w-4" />
              Feedback
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-2 text-[#002C3E] hover:text-primary transition-colors duration-200 text-sm font-medium relative group"
            >
              <Info className="h-4 w-4" />
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-[#F7F8F3] transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-[#002C3E]" />
            ) : (
              <Menu className="h-5 w-5 text-[#002C3E]" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-[#002C3E] hover:text-primary transition-colors duration-200 text-sm font-medium py-2 px-3 rounded-lg hover:bg-[#F7F8F3]"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                to="/feedback"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-[#002C3E] hover:text-primary transition-colors duration-200 text-sm font-medium py-2 px-3 rounded-lg hover:bg-[#F7F8F3]"
              >
                <MessageSquare className="h-4 w-4" />
                Feedback
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-[#002C3E] hover:text-primary transition-colors duration-200 text-sm font-medium py-2 px-3 rounded-lg hover:bg-[#F7F8F3]"
              >
                <Info className="h-4 w-4" />
                About
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
