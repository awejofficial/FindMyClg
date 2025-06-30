
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Info } from 'lucide-react';

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

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center h-12 bg-white rounded-lg border border-border overflow-hidden">
              <img 
                src="/lovable-uploads/214526ee-d1c4-40fc-b3b1-0b58d7e80662.png" 
                alt="FindMyCLG Logo" 
                className={`h-full w-auto object-contain transition-all duration-1000 ${
                  showLogo ? 'opacity-100 scale-100' : 'opacity-90 scale-95'
                }`}
              />
            </div>
            <div className="flex flex-col">
              <div className="h-6 flex items-center">
                <span 
                  className={`text-lg font-semibold text-foreground transition-all duration-1000 ${
                    showLogo ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
                  }`}
                >
                  {rotatingContent[currentContentIndex].title}
                </span>
              </div>
              <p className={`text-xs text-muted-foreground hidden sm:block transition-all duration-1000 ${
                showLogo ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
              }`}>
                {rotatingContent[currentContentIndex].subtitle}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            <Link
              to="/feedback"
              className="flex items-center gap-2 text-secondary hover:text-primary transition-colors duration-200 text-sm font-medium"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Feedback</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-2 text-secondary hover:text-primary transition-colors duration-200 text-sm font-medium"
            >
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
