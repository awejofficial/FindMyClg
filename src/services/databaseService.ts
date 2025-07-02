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

    if (category) {
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

    if (filters.category) {
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
