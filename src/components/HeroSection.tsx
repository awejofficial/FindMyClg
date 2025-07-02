
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, TrendingUp, Users, GraduationCap, MapPin, BookOpen } from 'lucide-react';

interface HeroSectionProps {
  onStartClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartClick }) => {
  return (
    <section className="hero-section py-16 lg:py-24 relative overflow-hidden">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent/5 to-primary/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-secondary/5"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-secondary/10 to-accent/10 rounded-full mix-blend-multiply filter blur-xl animate-float-delay-2"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-float-delay-4"></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-to-tl from-primary/10 to-secondary/10 rounded-full mix-blend-multiply filter blur-xl animate-float-delay-3"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/30 rounded-full animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-secondary/30 rounded-full animate-bounce-gentle" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-accent/40 rounded-full animate-bounce-gentle" style={{animationDelay: '5s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-primary/20 rounded-full animate-bounce-gentle" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-32 left-1/3 w-1.5 h-1.5 bg-secondary/25 rounded-full animate-bounce-gentle" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-32 right-10 w-2.5 h-2.5 bg-primary/25 rounded-full animate-bounce-gentle" style={{animationDelay: '6s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Main Hero Content */}
          <div className="mb-12 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg animate-scale-in">
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
                className="text-lg px-8 py-4 group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl text-primary-foreground transform hover:scale-105 transition-all duration-300"
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
                  <div key={stat.label} className="bg-card/70 backdrop-blur-sm rounded-lg border border-border/50 p-6 text-center group hover:border-primary/30 hover:shadow-lg hover:bg-card/80 transition-all duration-300 w-full animate-scale-in" style={{animationDelay: `${1 + index * 0.1}s`}}>
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mx-auto mb-4 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
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
