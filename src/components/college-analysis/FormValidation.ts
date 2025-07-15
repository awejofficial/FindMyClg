
import { FormData } from "./FormDataTypes";

export const validateForm = (formData: FormData) => {
  const errors = [];
  
  if (!formData.fullName.trim()) {
    errors.push("Full name is required");
  }
  
  if (!formData.aggregate || isNaN(parseFloat(formData.aggregate))) {
    errors.push("Valid aggregate percentage is required");
  } else {
    const aggregate = parseFloat(formData.aggregate);
    if (aggregate < 0 || aggregate > 100) {
      errors.push("Aggregate percentage must be between 0 and 100");
    }
  }
  
  // Handle category validation for both string and array types
  const categoryArray = Array.isArray(formData.category) ? formData.category : 
                        formData.category ? [formData.category] : [];
  
  if (categoryArray.length === 0) {
    errors.push("Category selection is required");
  }
  
  if (formData.preferredBranches.length === 0) {
    errors.push("At least one branch must be selected");
  }
  
  return errors;
};

export const validateStep = (currentStep: number, formData: FormData, isGuest: boolean) => {
  if (currentStep === 1 && isGuest && !formData.fullName.trim()) {
    return "Please enter your full name to continue.";
  }
  
  if (currentStep === 2) {
    const errors = [];
    if (!formData.aggregate || isNaN(parseFloat(formData.aggregate))) {
      errors.push("Valid aggregate percentage is required");
    }
    
    // Handle category validation for both string and array types
    const categoryArray = Array.isArray(formData.category) ? formData.category : 
                          formData.category ? [formData.category] : [];
    
    if (categoryArray.length === 0) {
      errors.push("Category selection is required");
    }
    
    if (errors.length > 0) {
      return errors.join(". ");
    }
  }
  
  return null;
};
