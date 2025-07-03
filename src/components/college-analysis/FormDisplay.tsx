
import React from 'react';
import { GraduationCap } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  PersonalInfoStep,
  AcademicDetailsStep,
  FormStepper
} from "@/components/form-steps";
import { MinimalPreferencesStep } from "@/components/form-steps/MinimalPreferencesStep";
import { RulesInfoSection } from "./RulesInfoSection";
import { FormData } from "./FormDataTypes";

interface FormDisplayProps {
  currentStep: number;
  isGuest: boolean;
  isAnalyzing: boolean;
  showSaveDataAlert: boolean;
  formData: FormData;
  availableCategories: string[];
  onFormDataChange: (updates: Partial<FormData>) => void;
  onGuestAccess: () => void;
  onEmailLogin: () => void;
  onAlertClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  onBranchChange: (branch: string, checked: boolean) => void;
  onCollegeTypeChange: (collegeType: string, checked: boolean) => void;
  onCityChange: (cities: string[]) => void;
  onLoginClick: () => void;
}

export const FormDisplay: React.FC<FormDisplayProps> = ({
  currentStep,
  isGuest,
  isAnalyzing,
  formData,
  availableCategories,
  onFormDataChange,
  onGuestAccess,
  onNext,
  onPrev,
  onSubmit,
  onBranchChange,
  onCollegeTypeChange,
  onCityChange
}) => {
  // Auto-trigger guest access if not already set
  React.useEffect(() => {
    if (!isGuest) {
      onGuestAccess();
    }
  }, [isGuest, onGuestAccess]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                FindMyClg - DSE College Finder 2024
              </h1>
              <p className="text-muted-foreground">Find eligible DSE colleges based on real CAP cutoff data</p>
            </div>
          </div>

          {(isGuest || currentStep > 1) && (
            <>
              {(currentStep === 1 && isGuest) && (
                <PersonalInfoStep
                  fullName={formData.fullName}
                  onFullNameChange={(value) => onFormDataChange({ fullName: value })}
                />
              )}

              {currentStep === 2 && (
                <AcademicDetailsStep
                  aggregate={formData.aggregate}
                  category={formData.category}
                  availableCategories={availableCategories}
                  onAggregateChange={(value) => onFormDataChange({ aggregate: value })}
                  onCategoryChange={(value) => onFormDataChange({ category: value })}
                />
              )}

              {currentStep === 3 && (
                <MinimalPreferencesStep
                  preferredBranches={formData.preferredBranches}
                  collegeTypes={formData.collegeTypes}
                  selectedColleges={formData.selectedColleges}
                  category={formData.category}
                  selectedCities={formData.selectedCities}
                  onBranchChange={onBranchChange}
                  onCollegeTypeChange={onCollegeTypeChange}
                  onCollegeSelectionChange={(colleges) => onFormDataChange({ selectedColleges: colleges })}
                  onCategoryChange={(category) => onFormDataChange({ category })}
                  onCityChange={onCityChange}
                />
              )}

              <FormStepper
                currentStep={currentStep}
                isAnalyzing={isAnalyzing}
                onNext={onNext}
                onPrev={onPrev}
                onSubmit={onSubmit}
              />
            </>
          )}
        </div>
        
        {/* Rules and Information Section */}
        <RulesInfoSection />
      </div>
      <Footer />
    </div>
  );
};
