
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, TrendingUp, Users, GraduationCap, MapPin, BookOpen } from 'lucide-react';

interface HeroSectionProps {
  onStartClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartClick }) => {
  return (
    <section className="hero-section py-16 lg:py-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary/5 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/5 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-secondary/20 rounded-full animate-bounce" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-accent/30 rounded-full animate-bounce" style={{animationDelay: '5s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-primary/15 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Main Hero Content */}
          <div className="mb-12 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-card border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm animate-scale-in">
              <GraduationCap className="h-4 w-4" />
              <span>Built for DSE Students</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight text-center animate-slide-up">
              Find Your Perfect
              <span className="block text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight text-center">
                DSE Engineering College in Maharashtra</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed text-center animate-slide-up" style={{animationDelay: '0.2s'}}>
              Built exclusively for diploma students aiming for Direct Second Year (DSE) B.Tech admissions across Maharashtra. 
              Instantly discover colleges you qualify for using official CAP cutoff data (2024–25) — no more guessing, no more government PDFs.
            </p>

            <div className="mb-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Start Your Journey</h2>
              </div>
              <p className="text-base text-muted-foreground mb-6">
                Tap the button below, enter your diploma marks, and get a personalized list of matching colleges.
              </p>
            </div>

            <div className="flex justify-center w-full animate-scale-in" style={{animationDelay: '0.6s'}}>
              <Button
                onClick={onStartClick}
                className="text-lg px-8 py-4 group bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl text-primary-foreground transform hover:scale-105 transition-all duration-200"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-8 animate-slide-up" style={{animationDelay: '0.8s'}}>
            <div className="flex items-center justify-center gap-2 mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Why Students Trust FindMyClg</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { 
                  icon: Users,
                  number: '10,000+', 
                  label: 'DSE Students Guided', 
                  desc: 'Real-time help with successful lateral admissions across Maharashtra.' 
                },
                { 
                  icon: Target,
                  number: '500+', 
                  label: 'Engineering Colleges Covered', 
                  desc: 'All data sourced from official CAP Rounds I, II, and III.' 
                },
                { 
                  icon: TrendingUp,
                  number: '99%', 
                  label: 'Data Accuracy', 
                  desc: 'Verified directly from DTE Maharashtra\'s official records.' 
                }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-6 text-center group hover:border-primary/30 hover:shadow-md transition-all duration-200 w-full animate-scale-in" style={{animationDelay: `${1 + index * 0.1}s`}}>
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-2">{stat.number}</div>
                    <div className="font-semibold text-foreground mb-2">{stat.label}</div>
                    <div className="text-sm text-muted-foreground">{stat.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
