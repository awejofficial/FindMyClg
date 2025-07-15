
export interface FormData {
  fullName: string;
  aggregate: string;
  category: string | string[]; // Updated to support multiple categories
  preferredBranches: string[];
  collegeTypes: string[];
  selectedColleges: string[];
  collegeSelections: CollegeSelection[];
  selectedCities: string[];
}

export interface CollegeSelection {
  collegeName: string;
  branches: string[];
}

export interface CollegeMatch {
  collegeName: string;
  city: string;
  branch: string;
  category: string;
  collegeType: string;
  cap1Cutoff: number | null;
  cap2Cutoff: number | null;
  cap3Cutoff: number | null;
  eligible: boolean;
}

export interface CollegeType {
  value: string;
  label: string;
}

export interface EligibilityResult {
  eligible: boolean;
  bestCutoff: number | null;
  cutoffType: string | null;
}
