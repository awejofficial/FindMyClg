
import React from 'react';
import { GraduationCap } from "lucide-react";
import { TNEAStyleResultsTable } from "./TNEAStyleResultsTable";
import { FeedbackSection } from "./FeedbackSection";
import { CutoffButtons } from "./CutoffButtons";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CollegeMatch, FormData } from "./FormDataTypes";

interface ResultsDisplayProps {
  results: CollegeMatch[];
  formData: FormData;
  onRefillForm: () => void;
  onLoginClick: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  formData,
  onRefillForm
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F3]">
      <Header />
      <div className="flex-1">
        <div className="bg-white border-b shadow-sm mb-6">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[#002C3E] mb-2 flex items-center justify-center gap-2">
                <GraduationCap className="h-8 w-8 text-[#F7444E]" />
                FindMyClg - DSE College Finder 2024
              </h1>
              <div className="text-gray-600 space-y-1">
                <p>DSE College Eligibility Results for <strong className="text-[#002C3E]">{formData.fullName}</strong></p>
                <div className="text-sm bg-[#F7F8F3] rounded p-2 inline-block mt-2 border border-[#78BCC4]/30">
                  <span><strong>Diploma Aggregate:</strong> {formData.aggregate}% | </span>
                  <span><strong>Category:</strong> {formData.category} | </span>
                  <span><strong>Branches:</strong> {formData.preferredBranches.length} selected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <CutoffButtons />
        </div>

        <TNEAStyleResultsTable 
          results={results} 
          studentName={formData.fullName}
          studentAggregate={parseFloat(formData.aggregate)}
          onRefillForm={onRefillForm}
        />

        {/* Feedback Section */}
        <div className="max-w-7xl mx-auto px-4 py-8 mb-12">
          <FeedbackSection />
        </div>
      </div>
      <Footer />
    </div>
  );
};
