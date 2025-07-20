
import React, { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { 
  fetchCutoffData, 
  fetchAvailableCollegeTypes, 
  fetchAvailableCategories,
  fetchAvailableBranches,
  fetchAllCollegeNames,
  type CutoffRecord 
} from "@/services/databaseService";
import { FormData, CollegeMatch, CollegeType } from "@/components/college-analysis/FormDataTypes";
import { processCollegeMatches } from "@/components/college-analysis/CollegeAnalysisService";
import { validateForm, validateStep } from "@/components/college-analysis/FormValidation";
import { ResultsDisplay } from "@/components/college-analysis/ResultsDisplay";
import { LoadingDisplay } from "@/components/college-analysis/LoadingDisplay";
import { HomeDisplay } from "@/components/college-analysis/HomeDisplay";
import { FormDisplay } from "@/components/college-analysis/FormDisplay";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<CollegeMatch[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);
  const [availableCollegeTypes, setAvailableCollegeTypes] = useState<string[]>([]);
  const [isGuest, setIsGuest] = useState(true); // Default to guest mode
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: 'Guest User',
    aggregate: '',
    category: '',
    preferredBranches: [],
    collegeTypes: [],
    selectedColleges: [],
    collegeSelections: [],
    selectedCities: []
  });

  const collegeTypeOptions: CollegeType[] = [
    { value: 'Government', label: 'Government' },
    { value: 'Government Autonomous', label: 'Government Autonomous' },
    { value: 'Private', label: 'Private' },
  ];

  useEffect(() => {
    loadAvailableOptions();
  }, []);

  const loadAvailableOptions = async () => {
    setIsLoadingOptions(true);
    try {
      const [categories, branches, collegeTypes] = await Promise.all([
        fetchAvailableCategories(),
        fetchAvailableBranches(),
        fetchAvailableCollegeTypes()
      ]);
      
      console.log('Loaded options:', { categories, branches, collegeTypes });
      
      setAvailableCategories(categories);
      setAvailableBranches(branches);
      setAvailableCollegeTypes(collegeTypes);
    } catch (error) {
      console.error('Failed to load options:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load form options. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const handleSubmit = async () => {
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
      toast({
        title: "Incomplete Form",
        description: errors.join(". "),
        variant: "destructive"
      });
      return;
    }

    const aggregate = parseFloat(formData.aggregate);
    setIsAnalyzing(true);
    
    try {
      // Use all colleges if none selected specifically
      let collegesToSearch = formData.selectedColleges;
      if (collegesToSearch.length === 0) {
        // Auto-select all available colleges
        const allColleges = await fetchAllCollegeNames();
        collegesToSearch = allColleges;
      }

      console.log('Fetching data for branches:', formData.preferredBranches);
      console.log('Category:', formData.category);
      console.log('College types filter:', formData.collegeTypes);
      console.log('Selected cities:', formData.selectedCities);
      console.log('Colleges to search:', collegesToSearch.length);
      
      // Handle category - convert to array if it's a string, or use the array directly
      const categoryArray = Array.isArray(formData.category) ? formData.category : 
                            formData.category ? [formData.category] : [];
      
      // Fetch data for all selected branches and categories
      const allCutoffData: CutoffRecord[] = [];
      
      for (const branch of formData.preferredBranches) {
        // If no categories selected or "ALL" is selected, fetch all categories
        if (categoryArray.length === 0 || categoryArray.includes("ALL")) {
          const branchData = await fetchCutoffData(
            undefined, // undefined for all categories
            branch,
            formData.collegeTypes.length > 0 ? formData.collegeTypes : undefined,
            formData.selectedCities.length > 0 ? formData.selectedCities : undefined
          );
          allCutoffData.push(...branchData);
        } else {
          // Fetch data for each selected category
          for (const category of categoryArray) {
            const branchData = await fetchCutoffData(
              category,
              branch,
              formData.collegeTypes.length > 0 ? formData.collegeTypes : undefined,
              formData.selectedCities.length > 0 ? formData.selectedCities : undefined
            );
            allCutoffData.push(...branchData);
          }
        }
      }

      console.log('Total cutoff records found:', allCutoffData.length);

      if (allCutoffData.length === 0) {
        toast({
          title: "No Data Available",
          description: "No cutoff data found for your selected criteria. Try different options or contact admin.",
          variant: "destructive"
        });
        setIsAnalyzing(false);
        return;
      }

      const collegeMatches = processCollegeMatches(
        allCutoffData, 
        aggregate, 
        formData.preferredBranches, 
        formData.selectedCities
      );
      console.log('Processed matches:', collegeMatches.length);
      
      setResults(collegeMatches);
      setShowResults(true);
      
      const eligibleCount = collegeMatches.filter(college => college.eligible).length;
      
      toast({
        title: "Analysis Complete!",
        description: `Found ${collegeMatches.length} college options (${eligibleCount} eligible) for ${formData.fullName}.`
      });
      
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze college options. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = () => {
    const error = validateStep(currentStep, formData, isGuest);
    if (error) {
      toast({
        title: currentStep === 1 ? "Name Required" : "Required Fields Missing",
        description: error,
        variant: "destructive"
      });
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const refillForm = () => {
    setShowResults(false);
    setCurrentStep(1);
    setFormData({
      fullName: 'Guest User',
      aggregate: '',
      category: '',
      preferredBranches: [],
      collegeTypes: [],
      selectedColleges: [],
      collegeSelections: [],
      selectedCities: []
    });
    setIsGuest(true);
    setShowForm(false);
  };

  const handleGuestAccess = () => {
    setIsGuest(true);
    setFormData({ ...formData, fullName: 'Guest User' });
  };

  const handleStartJourney = () => {
    setShowForm(true);
    setIsGuest(true);
  };

  const handleCollegeTypeChange = (collegeType: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        collegeTypes: [...formData.collegeTypes, collegeType]
      });
    } else {
      setFormData({
        ...formData,
        collegeTypes: formData.collegeTypes.filter(type => type !== collegeType)
      });
    }
  };

  const handleBranchChange = (branch: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        preferredBranches: [...formData.preferredBranches, branch]
      });
    } else {
      setFormData({
        ...formData,
        preferredBranches: formData.preferredBranches.filter(b => b !== branch)
      });
    }
  };

  const handleCityChange = (cities: string[]) => {
    setFormData({
      ...formData,
      selectedCities: cities
    });
  };

  const handleFormDataChange = (updates: Partial<FormData>) => {
    setFormData({ ...formData, ...updates });
  };

  if (showResults) {
    return (
      <ResultsDisplay 
        results={results}
        formData={formData}
        onRefillForm={refillForm}
        onLoginClick={() => {}} // No-op since login is removed
      />
    );
  }

  if (isLoadingOptions) {
    return <LoadingDisplay onLoginClick={() => {}} />; // No-op since login is removed
  }

  if (!showForm) {
    return (
      <HomeDisplay 
        onStartJourney={handleStartJourney}
        onLoginClick={() => {}} // No-op since login is removed
      />
    );
  }

  return (
    <FormDisplay
      currentStep={currentStep}
      isGuest={isGuest}
      isAnalyzing={isAnalyzing}
      showSaveDataAlert={false} // Always false since no login
      formData={formData}
      availableCategories={availableCategories}
      onFormDataChange={handleFormDataChange}
      onGuestAccess={handleGuestAccess}
      onEmailLogin={() => {}} // No-op since login is removed
      onAlertClose={() => {}} // No-op since no alert
      onNext={handleNext}
      onPrev={handlePrev}
      onSubmit={handleSubmit}
      onBranchChange={handleBranchChange}
      onCollegeTypeChange={handleCollegeTypeChange}
      onCityChange={handleCityChange}
      onLoginClick={() => {}} // No-op since login is removed
    />
  );
};

export default Index;
