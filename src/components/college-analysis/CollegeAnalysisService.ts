
import { CutoffRecord } from "@/services/databaseService";
import { CollegeMatch } from "./FormDataTypes";

export const processCollegeMatches = (
  cutoffData: CutoffRecord[], 
  studentAggregate: number, 
  preferredBranches: string[] = [], 
  selectedCities: string[] = []
): CollegeMatch[] => {
  // Group by unique combination of college_name, branch_name, category
  const uniqueCombinations = new Map<string, CutoffRecord>();
  
  cutoffData.forEach(record => {
    const key = `${record.college_name}-${record.branch_name}-${record.category}`;
    if (!uniqueCombinations.has(key)) {
      uniqueCombinations.set(key, record);
    }
  });

  const matches: CollegeMatch[] = Array.from(uniqueCombinations.values()).map(record => {
    // Check eligibility against any available cutoff
    const eligibleForCap1 = record.cap1_cutoff ? studentAggregate >= record.cap1_cutoff : false;
    const eligibleForCap2 = record.cap2_cutoff ? studentAggregate >= record.cap2_cutoff : false;
    const eligibleForCap3 = record.cap3_cutoff ? studentAggregate >= record.cap3_cutoff : false;
    
    const eligible = eligibleForCap1 || eligibleForCap2 || eligibleForCap3;

    return {
      collegeName: record.college_name,
      city: record.city || 'Unknown',
      branch: record.branch_name,
      category: record.category,
      collegeType: record.college_type,
      cap1Cutoff: record.cap1_cutoff || null,
      cap2Cutoff: record.cap2_cutoff || null,
      cap3Cutoff: record.cap3_cutoff || null,
      eligible
    };
  });

  // Sort by priority: eligible first, then branch priority, then city priority, then cutoff
  return matches.sort((a, b) => {
    // First priority: eligibility
    if (a.eligible && !b.eligible) return -1;
    if (!a.eligible && b.eligible) return 1;
    
    // Second priority: branch preference order
    const aBranchIndex = preferredBranches.indexOf(a.branch);
    const bBranchIndex = preferredBranches.indexOf(b.branch);
    
    if (aBranchIndex !== -1 && bBranchIndex !== -1) {
      if (aBranchIndex !== bBranchIndex) return aBranchIndex - bBranchIndex;
    } else if (aBranchIndex !== -1) {
      return -1; // a has preferred branch, b doesn't
    } else if (bBranchIndex !== -1) {
      return 1; // b has preferred branch, a doesn't
    }
    
    // Third priority: city preference order
    const aCityIndex = selectedCities.indexOf(a.city);
    const bCityIndex = selectedCities.indexOf(b.city);
    
    if (aCityIndex !== -1 && bCityIndex !== -1) {
      if (aCityIndex !== bCityIndex) return aCityIndex - bCityIndex;
    } else if (aCityIndex !== -1) {
      return -1; // a has preferred city, b doesn't
    } else if (bCityIndex !== -1) {
      return 1; // b has preferred city, a doesn't
    }
    
    // Final priority: lowest cutoff available
    const getLowestCutoff = (college: CollegeMatch) => {
      const cutoffs = [college.cap1Cutoff, college.cap2Cutoff, college.cap3Cutoff]
        .filter(c => c !== null) as number[];
      return cutoffs.length > 0 ? Math.min(...cutoffs) : 100;
    };
    
    return getLowestCutoff(a) - getLowestCutoff(b);
  });
};
