
import React from 'react';
import { Github, Instagram, Linkedin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-section text-[#F7F8F3] border-t border-secondary py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          {/* Left section - Brand and copyright */}
          <div className="flex flex-col items-center lg:items-start space-y-2">
            <p className="text-lg font-medium text-[#F7F8F3] flex items-center gap-2">
              Made with 
              <Heart className="h-4 w-4 text-primary fill-current" />
              by 
              <span className="font-bold text-primary">Awej</span>
            </p>
            <p className="text-sm text-secondary">
              © 2025 FindMyClg. All rights reserved.
            </p>
          </div>
          
          {/* Right section - Social links */}
          <div className="flex items-center bg-card/10 border border-secondary/30 rounded-lg p-1">
            <a
              href="https://instagram.com/awej04/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary transition-colors duration-200 p-2 rounded-lg hover:bg-secondary/20"
              aria-label="Follow on Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            
            <a
              href="https://github.com/awejofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary transition-colors duration-200 p-2 rounded-lg hover:bg-secondary/20"
              aria-label="Visit GitHub profile"
            >
              <Github className="h-5 w-5" />
            </a>
            
            <a
              href="https://www.linkedin.com/in/awejpathan/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary transition-colors duration-200 p-2 rounded-lg hover:bg-secondary/20"
              aria-label="Connect on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
