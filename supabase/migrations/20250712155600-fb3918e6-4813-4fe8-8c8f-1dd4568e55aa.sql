
-- Create college details table with comprehensive information
CREATE TABLE IF NOT EXISTS public.college_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'West Bengal',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  website TEXT,
  established_year INTEGER,
  college_code TEXT,
  naac_grade TEXT,
  nba_accredited BOOLEAN DEFAULT false,
  university_affiliation TEXT,
  campus_area_acres DECIMAL(10, 2),
  total_students INTEGER,
  faculty_count INTEGER,
  hostel_available BOOLEAN DEFAULT false,
  hostel_capacity INTEGER,
  library_books INTEGER,
  computer_labs INTEGER,
  placement_cell BOOLEAN DEFAULT true,
  transport_facility BOOLEAN DEFAULT false,
  wifi_campus BOOLEAN DEFAULT true,
  sports_facilities TEXT[],
  clubs_societies TEXT[],
  infrastructure_rating DECIMAL(3, 2) DEFAULT 4.0,
  placement_percentage DECIMAL(5, 2),
  average_package DECIMAL(10, 2),
  highest_package DECIMAL(10, 2),
  top_recruiters TEXT[],
  research_centers TEXT[],
  notable_alumni TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_google_sync TIMESTAMP WITH TIME ZONE,
  UNIQUE(college_name)
);

-- Create fee structure table
CREATE TABLE IF NOT EXISTS public.fee_structure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_name TEXT NOT NULL,
  branch_name TEXT NOT NULL,
  category TEXT NOT NULL,
  tuition_fee DECIMAL(10, 2),
  development_fee DECIMAL(10, 2),
  lab_fee DECIMAL(10, 2),
  library_fee DECIMAL(10, 2),
  other_fees DECIMAL(10, 2),
  total_annual_fee DECIMAL(10, 2),
  hostel_fee DECIMAL(10, 2),
  mess_fee DECIMAL(10, 2),
  security_deposit DECIMAL(10, 2),
  academic_year INTEGER DEFAULT 2024,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create scholarships table
CREATE TABLE IF NOT EXISTS public.scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_name TEXT,
  scholarship_name TEXT NOT NULL,
  provider TEXT,
  amount DECIMAL(10, 2),
  percentage_discount DECIMAL(5, 2),
  eligibility_criteria TEXT,
  category_specific TEXT[],
  income_limit DECIMAL(12, 2),
  merit_based BOOLEAN DEFAULT false,
  need_based BOOLEAN DEFAULT false,
  application_deadline DATE,
  renewable BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user alerts/notifications table
CREATE TABLE IF NOT EXISTS public.user_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  college_name TEXT NOT NULL,
  branch_name TEXT,
  category TEXT,
  alert_type TEXT CHECK (alert_type IN ('cutoff_drop', 'deadline_reminder', 'new_college', 'fee_change')),
  threshold_value DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  last_triggered TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create college comparisons table
CREATE TABLE IF NOT EXISTS public.college_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT,
  college_names TEXT[] NOT NULL,
  comparison_criteria JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cutoff history table for trends
CREATE TABLE IF NOT EXISTS public.cutoff_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_name TEXT NOT NULL,
  branch_name TEXT NOT NULL,
  category TEXT NOT NULL,
  year INTEGER NOT NULL,
  round_number INTEGER CHECK (round_number IN (1, 2, 3)),
  cutoff_score DECIMAL(10, 3),
  seats_available INTEGER,
  seats_filled INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(college_name, branch_name, category, year, round_number)
);

-- Create Google sync log table
CREATE TABLE IF NOT EXISTS public.google_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type TEXT CHECK (sync_type IN ('college_details', 'cutoff_data', 'fee_structure')),
  college_name TEXT,
  status TEXT CHECK (status IN ('success', 'failed', 'partial')),
  details JSONB,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.college_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cutoff_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_sync_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access and admin write access
CREATE POLICY "Anyone can view college details" ON public.college_details FOR SELECT USING (true);
CREATE POLICY "Admins can manage college details" ON public.college_details FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can view fee structure" ON public.fee_structure FOR SELECT USING (true);
CREATE POLICY "Admins can manage fee structure" ON public.fee_structure FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can view scholarships" ON public.scholarships FOR SELECT USING (true);
CREATE POLICY "Admins can manage scholarships" ON public.scholarships FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can manage their alerts" ON public.user_alerts FOR ALL USING (auth.uid()::TEXT = user_id::TEXT OR public.is_admin(auth.uid()));

CREATE POLICY "Users can manage their comparisons" ON public.college_comparisons FOR ALL USING (auth.uid()::TEXT = user_id::TEXT OR session_id IS NOT NULL OR public.is_admin(auth.uid()));

CREATE POLICY "Anyone can view cutoff history" ON public.cutoff_history FOR SELECT USING (true);
CREATE POLICY "Admins can manage cutoff history" ON public.cutoff_history FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view sync logs" ON public.google_sync_log FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "System can manage sync logs" ON public.google_sync_log FOR ALL USING (public.is_admin(auth.uid()));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_college_details_location ON public.college_details (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_college_details_city ON public.college_details (city);
CREATE INDEX IF NOT EXISTS idx_fee_structure_college_branch ON public.fee_structure (college_name, branch_name);
CREATE INDEX IF NOT EXISTS idx_user_alerts_active ON public.user_alerts (user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_cutoff_history_college_year ON public.cutoff_history (college_name, year);
CREATE INDEX IF NOT EXISTS idx_comparisons_session ON public.college_comparisons (session_id);

-- Insert sample data for existing colleges from cutoffs table
INSERT INTO public.college_details (
  college_name, city, established_year, naac_grade, hostel_available, 
  placement_cell, transport_facility, wifi_campus, placement_percentage,
  average_package, infrastructure_rating
)
SELECT DISTINCT 
  college_name,
  city,
  CASE 
    WHEN college_name ILIKE '%jadavpur%' THEN 1955
    WHEN college_name ILIKE '%calcutta%' THEN 1857
    WHEN college_name ILIKE '%nit%' THEN 1960
    WHEN college_name ILIKE '%iiit%' THEN 2000
    ELSE 1980
  END as established_year,
  CASE 
    WHEN college_type = 'Government' THEN 'A+'
    WHEN college_type = 'Government Autonomous' THEN 'A'
    ELSE 'B+'
  END as naac_grade,
  CASE 
    WHEN college_type IN ('Government', 'Government Autonomous') THEN true
    ELSE false
  END as hostel_available,
  true as placement_cell,
  true as transport_facility,
  true as wifi_campus,
  CASE 
    WHEN college_type = 'Government' THEN 95.0
    WHEN college_type = 'Government Autonomous' THEN 88.0
    ELSE 75.0
  END as placement_percentage,
  CASE 
    WHEN college_type = 'Government' THEN 800000.00
    WHEN college_type = 'Government Autonomous' THEN 650000.00
    ELSE 450000.00
  END as average_package,
  CASE 
    WHEN college_type = 'Government' THEN 4.5
    WHEN college_type = 'Government Autonomous' THEN 4.2
    ELSE 3.8
  END as infrastructure_rating
FROM cutoffs 
WHERE college_name IS NOT NULL
ON CONFLICT (college_name) DO NOTHING;

-- Insert sample fee structure data
INSERT INTO public.fee_structure (
  college_name, branch_name, category, tuition_fee, development_fee, 
  lab_fee, library_fee, other_fees, total_annual_fee, academic_year
)
SELECT DISTINCT 
  c.college_name,
  c.branch_name,
  c.category,
  CASE 
    WHEN c.college_type = 'Government' AND c.category = 'General' THEN 15000.00
    WHEN c.college_type = 'Government' AND c.category IN ('SC', 'ST') THEN 5000.00
    WHEN c.college_type = 'Government Autonomous' THEN 25000.00
    ELSE 120000.00
  END as tuition_fee,
  CASE 
    WHEN c.college_type = 'Private' THEN 25000.00
    ELSE 5000.00
  END as development_fee,
  8000.00 as lab_fee,
  2000.00 as library_fee,
  5000.00 as other_fees,
  CASE 
    WHEN c.college_type = 'Government' AND c.category = 'General' THEN 35000.00
    WHEN c.college_type = 'Government' AND c.category IN ('SC', 'ST') THEN 20000.00
    WHEN c.college_type = 'Government Autonomous' THEN 40000.00
    ELSE 160000.00
  END as total_annual_fee,
  2024 as academic_year
FROM cutoffs c
WHERE c.college_name IS NOT NULL AND c.branch_name IS NOT NULL
ON CONFLICT DO NOTHING;

-- Create function to get college comparison data
CREATE OR REPLACE FUNCTION public.get_college_comparison_data(college_names TEXT[])
RETURNS TABLE(
  college_name TEXT,
  city TEXT,
  college_type TEXT,
  naac_grade TEXT,
  establishment_year INTEGER,
  placement_percentage DECIMAL,
  average_package DECIMAL,
  highest_package DECIMAL,
  infrastructure_rating DECIMAL,
  hostel_available BOOLEAN,
  total_students INTEGER,
  cutoff_data JSONB,
  fee_data JSONB,
  facilities JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cd.college_name,
    cd.city,
    COALESCE((SELECT DISTINCT c.college_type FROM cutoffs c WHERE c.college_name = cd.college_name LIMIT 1), 'Unknown') as college_type,
    cd.naac_grade,
    cd.established_year,
    cd.placement_percentage,
    cd.average_package,
    cd.highest_package,
    cd.infrastructure_rating,
    cd.hostel_available,
    cd.total_students,
    -- Get cutoff data for this college
    COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'branch', branch_name,
          'category', category,
          'cap1_cutoff', cap1_cutoff,
          'cap2_cutoff', cap2_cutoff,
          'cap3_cutoff', cap3_cutoff
        )
      )
      FROM cutoffs 
      WHERE college_name = cd.college_name
    ), '[]'::jsonb) as cutoff_data,
    -- Get fee data for this college
    COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'branch', branch_name,
          'category', category,
          'total_annual_fee', total_annual_fee,
          'hostel_fee', hostel_fee
        )
      )
      FROM fee_structure 
      WHERE college_name = cd.college_name
    ), '[]'::jsonb) as fee_data,
    -- Get facilities data
    jsonb_build_object(
      'wifi_campus', cd.wifi_campus,
      'transport_facility', cd.transport_facility,
      'library_books', cd.library_books,
      'computer_labs', cd.computer_labs,
      'sports_facilities', cd.sports_facilities,
      'research_centers', cd.research_centers
    ) as facilities
  FROM college_details cd
  WHERE cd.college_name = ANY(college_names)
  ORDER BY cd.college_name;
END;
$$;

-- Create function to get nearby colleges
CREATE OR REPLACE FUNCTION public.get_nearby_colleges(
  user_lat DECIMAL,
  user_lng DECIMAL,
  radius_km INTEGER DEFAULT 50
)
RETURNS TABLE(
  college_name TEXT,
  city TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  distance_km DECIMAL,
  college_type TEXT,
  naac_grade TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cd.college_name,
    cd.city,
    cd.latitude,
    cd.longitude,
    -- Calculate distance using Haversine formula (approximate)
    ROUND(
      (6371 * acos(
        cos(radians(user_lat)) * cos(radians(cd.latitude)) *
        cos(radians(cd.longitude) - radians(user_lng)) +
        sin(radians(user_lat)) * sin(radians(cd.latitude))
      ))::DECIMAL, 2
    ) as distance_km,
    COALESCE((SELECT DISTINCT c.college_type FROM cutoffs c WHERE c.college_name = cd.college_name LIMIT 1), 'Unknown') as college_type,
    cd.naac_grade
  FROM college_details cd
  WHERE cd.latitude IS NOT NULL 
    AND cd.longitude IS NOT NULL
    AND (
      6371 * acos(
        cos(radians(user_lat)) * cos(radians(cd.latitude)) *
        cos(radians(cd.longitude) - radians(user_lng)) +
        sin(radians(user_lat)) * sin(radians(cd.latitude))
      )
    ) <= radius_km
  ORDER BY distance_km;
END;
$$;
