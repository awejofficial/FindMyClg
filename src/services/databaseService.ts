import { supabase } from "@/integrations/supabase/client";

export interface CutoffRecord {
  id: string;
  college_name: string;
  branch_name: string;
  category: string;
  cap1_cutoff: number;
  cap2_cutoff?: number | null;
  cap3_cutoff?: number | null;  
  city?: string;
  college_type: string;
  year?: number;
}

export interface CollegeWithBranches {
  college_id: string;
  college_name: string;
  college_type: string;
  branches: Array<{
    branch_id: string;
    branch_name: string;
  }>;
}

export interface CollegeTypeInfo {
  college_name: string;
  college_type: string;
}

export interface CollegeBranchInfo {
  college_name: string;
  branch_name: string;
}

export interface CollegeDetails {
  id: string;
  college_name: string;
  address?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  established_year?: number;
  college_code?: string;
  naac_grade?: string;
  nba_accredited?: boolean;
  university_affiliation?: string;
  campus_area_acres?: number;
  total_students?: number;
  faculty_count?: number;
  hostel_available?: boolean;
  hostel_capacity?: number;
  library_books?: number;
  computer_labs?: number;
  placement_cell?: boolean;
  transport_facility?: boolean;
  wifi_campus?: boolean;
  sports_facilities?: string[];
  clubs_societies?: string[];
  infrastructure_rating?: number;
  placement_percentage?: number;
  average_package?: number;
  highest_package?: number;
  top_recruiters?: string[];
  research_centers?: string[];
  notable_alumni?: string[];
  created_at?: string;
  updated_at?: string;
  last_google_sync?: string;
}

export interface CollegeComparison {
  college_name: string;
  city: string;
  college_type: string;
  naac_grade: string;
  establishment_year: number;
  placement_percentage: number;
  average_package: number;
  highest_package: number;
  infrastructure_rating: number;
  hostel_available: boolean;
  total_students: number;
  cutoff_data: any[];
  fee_data: any[];
  facilities: {
    wifi_campus: boolean;
    transport_facility: boolean;
    library_books: number;
    computer_labs: number;
    sports_facilities: string[];
    research_centers: string[];
  };
}

export interface UserAlert {
  id: string;
  user_id?: string;
  college_name: string;
  branch_name?: string;
  category?: string;
  alert_type?: string;
  threshold_value?: number;
  is_active?: boolean;
  last_triggered?: string;
  created_at?: string;
}

export interface NearbyCollege {
  college_name: string;
  city: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  college_type: string;
  naac_grade: string;
}

// Add UploadRecord interface for compatibility
export interface UploadRecord {
  id: string;
  filename: string;
  category: string;
  uploaded_at: string;
  status: string;
  uploaded_by?: string;
}

export const fetchCutoffData = async (
  category?: string,
  branch?: string,
  collegeTypes?: string[],
  cities?: string[]
): Promise<CutoffRecord[]> => {
  try {
    let query = supabase
      .from('cutoffs')
      .select('*')
      .order('cap1_cutoff', { ascending: true });

    // Only filter by category if it's not "ALL"
    if (category && category !== "ALL") {
      query = query.eq('category', category);
    }

    if (branch) {
      query = query.eq('branch_name', branch);
    }

    if (collegeTypes && collegeTypes.length > 0) {
      query = query.in('college_type', collegeTypes);
    }

    if (cities && cities.length > 0) {
      query = query.in('city', cities);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch cutoff data:', error);
    return [];
  }
};

export const fetchPaginatedCutoffs = async (
  page: number = 1,
  limit: number = 20,
  filters: {
    category?: string;
    branch?: string;
    collegeTypes?: string[];
    minScore?: number;
  } = {}
): Promise<{ data: CutoffRecord[]; total: number; totalPages: number }> => {
  try {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('cutoffs')
      .select('*', { count: 'exact' })
      .order('cap1_cutoff', { ascending: true })
      .range(offset, offset + limit - 1);

    // Only filter by category if it's not "ALL"
    if (filters.category && filters.category !== "ALL") {
      query = query.eq('category', filters.category);
    }

    if (filters.branch) {
      query = query.eq('branch_name', filters.branch);
    }

    if (filters.collegeTypes && filters.collegeTypes.length > 0) {
      query = query.in('college_type', filters.collegeTypes);
    }

    if (filters.minScore) {
      query = query.lte('cap1_cutoff', filters.minScore);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return { data: [], total: 0, totalPages: 0 };
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: data || [],
      total,
      totalPages
    };
  } catch (error) {
    console.error('Failed to fetch paginated cutoffs:', error);
    return { data: [], total: 0, totalPages: 0 };
  }
};

// Updated to use the new database function
export const fetchAvailableCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.rpc('get_available_categories');

    if (error) {
      console.error('Database error:', error);
      return [];
    }

    // Filter out any empty, null, or undefined categories and ensure uniqueness
    const validCategories = data
      ?.map((item: { category: string }) => item.category)
      .filter((category: string) => category && category.trim() !== '')
      .filter((category: string, index: number, array: string[]) => array.indexOf(category) === index) || [];

    return validCategories.sort();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
};

// Updated to fetch from branch_ids table (now automatically populated)
export const fetchAvailableBranches = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('branch_ids')
      .select('branch_name')
      .order('branch_name', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return [];
    }

    const branches = [...new Set(data?.map(item => item.branch_name) || [])];
    return branches;
  } catch (error) {
    console.error('Failed to fetch branches:', error);
    return [];
  }
};

export const fetchAvailableCollegeTypes = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('cutoffs')
      .select('college_type')
      .not('college_type', 'is', null);

    if (error) {
      console.error('Database error:', error);
      return [];
    }

    const types = [...new Set(data?.map(item => item.college_type) || [])];
    return types.sort();
  } catch (error) {
    console.error('Failed to fetch college types:', error);
    return [];
  }
};

// New function to get all college names
export const fetchAllCollegeNames = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.rpc('get_all_college_names');

    if (error) {
      console.error('Database error:', error);
      return [];
    }

    return data?.map((item: { college_name: string }) => item.college_name) || [];
  } catch (error) {
    console.error('Failed to fetch college names:', error);
    return [];
  }
};

// New function to get college types for selected colleges
export const fetchCollegeTypesForColleges = async (collegeNames: string[]): Promise<CollegeTypeInfo[]> => {
  try {
    const { data, error } = await supabase.rpc('get_college_types_for_colleges', {
      college_names: collegeNames
    });

    if (error) {
      console.error('Database error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch college types:', error);
    return [];
  }
};

// New function to get branches for selected colleges
export const fetchBranchesForColleges = async (collegeNames: string[]): Promise<CollegeBranchInfo[]> => {
  try {
    const { data, error } = await supabase.rpc('get_branches_for_colleges', {
      college_names: collegeNames
    });

    if (error) {
      console.error('Database error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch branches for colleges:', error);
    return [];
  }
};

// Updated to use the new database function for hierarchical structure
export const fetchCollegesWithBranches = async (): Promise<CollegeWithBranches[]> => {
  try {
    const { data, error } = await supabase.rpc('get_colleges_with_branches_and_types');

    if (error) {
      console.error('Database error:', error);
      return [];
    }

    return (data || []).map(item => ({
      college_id: item.college_id,
      college_name: item.college_name,
      college_type: item.college_type,
      branches: Array.isArray(item.branches) ? item.branches.map(branch => ({
        branch_id: typeof branch === 'object' && branch !== null && 'branch_id' in branch ? String(branch.branch_id) : '',
        branch_name: typeof branch === 'object' && branch !== null && 'branch_name' in branch ? String(branch.branch_name) : ''
      })) : []
    }));
  } catch (error) {
    console.error('Failed to fetch colleges with branches:', error);
    return [];
  }
};

// New function to add cutoff data (will automatically sync college_ids and branch_ids)
export const addCutoffRecord = async (cutoffData: Omit<CutoffRecord, 'id'>): Promise<CutoffRecord | null> => {
  try {
    const { data, error } = await supabase
      .from('cutoffs')
      .insert([cutoffData])
      .select()
      .single();

    if (error) {
      console.error('Error adding cutoff record:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to add cutoff record:', error);
    return null;
  }
};

// New function to get college type for a specific college
export const getCollegeType = async (collegeName: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc('get_college_type', {
      college_name_param: collegeName
    });

    if (error) {
      console.error('Error fetching college type:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch college type:', error);
    return null;
  }
};

// Add fetchUploadHistory function for compatibility (returns empty array since uploads table doesn't exist)
export const fetchUploadHistory = async (userId?: string): Promise<UploadRecord[]> => {
  console.log('Upload history functionality not implemented - uploads table does not exist');
  return [];
};

// Add new function to get available cities
export const fetchAvailableCities = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('cutoffs')
      .select('city')
      .not('city', 'is', null);

    if (error) {
      console.error('Database error:', error);
      return [];
    }

    const cities = [...new Set(data?.map(item => item.city) || [])];
    return cities.sort();
  } catch (error) {
    console.error('Failed to fetch cities:', error);
    return [];
  }
};

// NEW FEATURES FUNCTIONS

// College Comparison Functions
export const fetchCollegeComparison = async (collegeNames: string[]): Promise<CollegeComparison[]> => {
  const { data, error } = await supabase.rpc('get_college_comparison_data', {
    college_names: collegeNames
  });

  if (error) {
    console.error('Error fetching college comparison:', error);
    throw error;
  }

  // Transform the data to match our interface
  return data.map((item: any) => ({
    college_name: item.college_name,
    city: item.city,
    college_type: item.college_type,
    naac_grade: item.naac_grade,
    establishment_year: item.establishment_year,
    placement_percentage: item.placement_percentage,
    average_package: item.average_package,
    highest_package: item.highest_package,
    infrastructure_rating: item.infrastructure_rating,
    hostel_available: item.hostel_available,
    total_students: item.total_students,
    cutoff_data: Array.isArray(item.cutoff_data) ? item.cutoff_data : [],
    fee_data: Array.isArray(item.fee_data) ? item.fee_data : [],
    facilities: typeof item.facilities === 'object' ? item.facilities : {
      wifi_campus: false,
      transport_facility: false,
      library_books: 0,
      computer_labs: 0,
      sports_facilities: [],
      research_centers: []
    }
  }));
};

export const saveCollegeComparison = async (
  collegeNames: string[],
  userId?: string,
  sessionId?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('college_comparisons')
      .insert([{
        college_names: collegeNames,
        user_id: userId,
        session_id: sessionId,
        comparison_criteria: {}
      }]);

    if (error) {
      console.error('Error saving college comparison:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to save college comparison:', error);
    return false;
  }
};

// User Alerts Functions
export const createUserAlert = async (alert: Omit<UserAlert, 'id'>): Promise<UserAlert | null> => {
  try {
    const { data, error } = await supabase
      .from('user_alerts')
      .insert([alert])
      .select()
      .single();

    if (error) {
      console.error('Error creating user alert:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to create user alert:', error);
    return null;
  }
};

export const fetchUserAlerts = async (userId?: string): Promise<UserAlert[]> => {
  try {
    let query = supabase
      .from('user_alerts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user alerts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch user alerts:', error);
    return [];
  }
};

export const updateUserAlert = async (alertId: string, updates: Partial<UserAlert>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_alerts')
      .update(updates)
      .eq('id', alertId);

    if (error) {
      console.error('Error updating user alert:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to update user alert:', error);
    return false;
  }
};

// College Details Functions
export const fetchCollegeDetails = async (collegeName: string): Promise<CollegeDetails | null> => {
  try {
    const { data, error } = await supabase
      .from('college_details')
      .select('*')
      .eq('college_name', collegeName)
      .single();

    if (error) {
      console.error('Error fetching college details:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch college details:', error);
    return null;
  }
};

export const fetchAllCollegeDetails = async (): Promise<CollegeDetails[]> => {
  try {
    const { data, error } = await supabase
      .from('college_details')
      .select('*')
      .order('college_name', { ascending: true });

    if (error) {
      console.error('Error fetching all college details:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch all college details:', error);
    return [];
  }
};

// Nearby Colleges Function
export const fetchNearbyColleges = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 50
): Promise<NearbyCollege[]> => {
  try {
    const { data, error } = await supabase.rpc('get_nearby_colleges', {
      user_lat: latitude,
      user_lng: longitude,
      radius_km: radiusKm
    });

    if (error) {
      console.error('Error fetching nearby colleges:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch nearby colleges:', error);
    return [];
  }
};

// Fee Structure Functions
export const fetchFeeStructure = async (collegeName: string, branchName?: string): Promise<any[]> => {
  try {
    let query = supabase
      .from('fee_structure')
      .select('*')
      .eq('college_name', collegeName)
      .order('academic_year', { ascending: false });

    if (branchName) {
      query = query.eq('branch_name', branchName);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching fee structure:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch fee structure:', error);
    return [];
  }
};

// Scholarships Functions
export const fetchScholarships = async (collegeName?: string): Promise<any[]> => {
  try {
    let query = supabase
      .from('scholarships')
      .select('*')
      .order('created_at', { ascending: false });

    if (collegeName) {
      query = query.or(`college_name.eq.${collegeName},college_name.is.null`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching scholarships:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch scholarships:', error);
    return [];
  }
};

// Cutoff History Functions
export const fetchCutoffHistory = async (
  collegeName: string,
  branchName: string,
  category: string
): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('cutoff_history')
      .select('*')
      .eq('college_name', collegeName)
      .eq('branch_name', branchName)
      .eq('category', category)
      .order('year', { ascending: false })
      .order('round_number', { ascending: true });

    if (error) {
      console.error('Error fetching cutoff history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch cutoff history:', error);
    return [];
  }
};
