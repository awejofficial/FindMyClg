
import React from 'react';
import { Search, TrendingUp, FileText, Target, Users, BookOpen } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: '🔧 Built for DSE Students',
    description: 'Not a generic portal — laser-focused on Direct Second Year (DSE) B.Tech admissions only.',
  },
  {
    icon: TrendingUp,
    title: '📑 Real Data. Real Guidance.',
    description: 'We use government-published CAP cutoff data from 2024–25 (Rounds I, II, III).',
  },
  {
    icon: Search,
    title: '🤖 Smart Search System',
    description: 'You don\'t search colleges — we match you with them based on your marks, category, and city preference.',
  },
  {
    icon: FileText,
    title: '🌆 City-Wise Filters',
    description: 'Want only Pune, Mumbai, Nagpur, or Nashik? Just choose your city — we\'ll handle the rest.',
  },
  {
    icon: Users,
    title: '👥 Category-Based Results',
    description: 'Full support for all categories — GOPEN, EWS, OBC, SC, ST — with actual past-year cutoffs.',
  },
  {
    icon: BookOpen,
    title: '🙌 Built by Students, for Students',
    description: 'Designed by diploma graduates who faced the same confusion — and built a solution that just works.',
  }
];

export const FeatureCards: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-black mb-3">
            🎯 What Makes FindMyClg Different?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A student-first platform designed specifically for diploma students pursuing DSE admissions in Maharashtra
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto animate-slide-up">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="card-professional group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-xl mb-4 group-hover:border-black transition-all duration-200">
                  <Icon className="h-6 w-6 text-black" />
                </div>
                
                <h3 className="text-lg font-semibold text-black mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed text-sm">
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
