
import React from 'react';
import { Github, Instagram, Linkedin, Heart, MessageSquare, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          {/* Left section - Brand and copyright */}
          <div className="flex flex-col items-center lg:items-start space-y-2">
            <p className="text-lg font-medium text-card-foreground flex items-center gap-2">
              Made with 
              <Heart className="h-4 w-4 text-destructive fill-current" />
              by 
              <span className="font-bold text-primary">Awej</span>
            </p>
            
          </div>

          {/* Center section - Navigation links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/feedback"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 text-sm font-medium"
            >
              <MessageSquare className="h-4 w-4" />
              Feedback
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 text-sm font-medium"
            >
              <Info className="h-4 w-4" />
              About
            </Link>
          </div>
          
          {/* Right section - Social links */}
          <div className="flex items-center bg-card border border-border rounded-lg p-1">
            <a
              href="https://instagram.com/awej04/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 p-2 rounded-lg hover:bg-accent"
              aria-label="Follow on Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            
            <a
              href="https://github.com/awejofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 p-2 rounded-lg hover:bg-accent"
              aria-label="Visit GitHub profile"
            >
              <Github className="h-5 w-5" />
            </a>
            
            <a
              href="https://www.linkedin.com/in/awejpathan/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 p-2 rounded-lg hover:bg-accent"
              aria-label="Connect on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
              <p className="text-sm text-muted-foreground">
              © 2025 FindMyClg. All rights reserved.
            </p>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
