
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, TrendingUp, Users } from 'lucide-react';

interface HeroSectionProps {
  onStartClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartClick }) => {
  return (
    <section className="hero-section py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Main Hero Content */}
          <div className="mb-12 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-card border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
              <Target className="h-4 w-4" />
              <span>Built for DSE Students</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight text-center">
              🎓 Find Your Perfect
              <span className="block text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight text-center">
                DSE Engineering College in Maharashtra</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed text-center">
              Built exclusively for diploma students aiming for Direct Second Year (DSE) B.Tech admissions across Maharashtra. 
              Instantly discover colleges you qualify for using official CAP cutoff data (2024–25) — no more guessing, no more government PDFs.
            </p>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-3">🔎 Start Your Journey</h2>
              <p className="text-base text-muted-foreground mb-6">
                📍 Tap the button below, enter your diploma marks, and get a personalized list of matching colleges.
              </p>
            </div>

            <div className="flex justify-center w-full">
              <Button
                onClick={onStartClick}
                className="text-lg px-8 py-4 group bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl text-primary-foreground"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">📊 Why Students Trust FindMyClg</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up max-w-4xl mx-auto">
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
                  <div key={stat.label} className="bg-card rounded-lg border border-border p-5 text-center group hover:border-primary/30 hover:shadow-md transition-all duration-200 w-full">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mx-auto mb-3 group-hover:bg-primary/20 transition-colors duration-200">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-2">{stat.number}</div>
                    <div className="font-semibold text-foreground mb-1">{stat.label}</div>
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
