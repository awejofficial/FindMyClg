
import React from 'react';
import { Search, TrendingUp, FileText, Target, Users, BookOpen, MapPin, Database, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Built for DSE Students',
    description: 'Not a generic portal — laser-focused on Direct Second Year (DSE) B.Tech admissions only.',
  },
  {
    icon: Database,
    title: 'Real Data. Real Guidance.',
    description: 'We use government-published CAP cutoff data from 2024–25 (Rounds I, II, III).',
  },
  {
    icon: Zap,
    title: 'Smart Search System',
    description: 'You don\'t search colleges — we match you with them based on your marks, category, and city preference.',
  },
  {
    icon: MapPin,
    title: 'City-Wise Filters',
    description: 'Want only Pune, Mumbai, Nagpur, or Nashik? Just choose your city — we\'ll handle the rest.',
  },
  {
    icon: Users,
    title: 'Category-Based Results',
    description: 'Full support for all categories — GOPEN, EWS, OBC, SC, ST — with actual past-year cutoffs.',
  },
  {
    icon: Shield,
    title: 'Built by Students, for Students',
    description: 'Designed by diploma graduates who faced the same confusion — and built a solution that just works.',
  }
];

export const FeatureCards: React.FC = () => {
  return (
    <section className="py-16 bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/3 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/3 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">
              What Makes FindMyClg Different?
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A student-first platform designed specifically for diploma students pursuing DSE admissions in Maharashtra
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="card-professional group animate-scale-in hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl mb-4 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-200">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
