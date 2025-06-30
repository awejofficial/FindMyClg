
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Info, Menu, X } from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-secondary/20 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand Section */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="flex items-center justify-center h-10 w-10 bg-white rounded-lg border border-secondary/30 overflow-hidden group-hover:border-primary/50 transition-all duration-200">
              <img 
                src="/lovable-uploads/214526ee-d1c4-40fc-b3b1-0b58d7e80662.png" 
                alt="FindMyCLG Logo" 
                className={`h-full w-auto object-contain transition-all duration-1000 ${
                  showLogo ? 'opacity-100 scale-100' : 'opacity-90 scale-95'
                }`}
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <div className="h-5 flex items-center">
                <span 
                  className={`text-lg font-bold text-foreground group-hover:text-primary transition-all duration-300 ${
                    showLogo ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
                  }`}
                >
                  {rotatingContent[currentContentIndex].title}
                </span>
              </div>
              <p className={`text-xs text-muted-foreground transition-all duration-1000 ${
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
              className="text-foreground hover:text-primary transition-colors duration-200 text-sm font-medium relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              to="/feedback"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-200 text-sm font-medium relative group"
            >
              <MessageSquare className="h-4 w-4" />
              Feedback
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-200 text-sm font-medium relative group"
            >
              <Info className="h-4 w-4" />
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary/20 bg-background/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground hover:text-primary transition-colors duration-200 text-sm font-medium py-2 px-3 rounded-lg hover:bg-accent"
              >
                Home
              </Link>
              <Link
                to="/feedback"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-200 text-sm font-medium py-2 px-3 rounded-lg hover:bg-accent"
              >
                <MessageSquare className="h-4 w-4" />
                Feedback
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-200 text-sm font-medium py-2 px-3 rounded-lg hover:bg-accent"
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
