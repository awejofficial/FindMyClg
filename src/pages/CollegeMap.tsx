
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Navigation, Phone, Mail, Globe, Users, GraduationCap, Star } from "lucide-react";
import { fetchAllCollegeDetails } from "@/services/databaseService";

interface College {
  college_name: string;
  city: string;
  latitude: number;
  longitude: number;
  contact_number: string;
  email: string;
  website: string;
  student_count: number;
  establishment_year: number;
  type: string;
  rating: number;
}

const CollegeMap: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

  const { data: collegeDetails, isLoading, isError, error } = useQuery({
    queryKey: ['colleges'],
    queryFn: fetchAllCollegeDetails,
  });

  useEffect(() => {
    if (collegeDetails) {
      // Transform college details to match the College interface
      const transformedColleges: College[] = collegeDetails.map(college => ({
        college_name: college.college_name,
        city: college.city || 'Unknown',
        latitude: Number(college.latitude) || 0,
        longitude: Number(college.longitude) || 0,
        contact_number: college.phone || 'Not available',
        email: college.email || 'Not available',
        website: college.website || 'Not available',
        student_count: college.total_students || 0,
        establishment_year: college.established_year || 0,
        type: 'Government', // This would come from cutoffs table join
        rating: Number(college.infrastructure_rating) || 0,
      }));
      setFilteredColleges(transformedColleges);
    }
  }, [collegeDetails]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (collegeDetails) {
      const transformedColleges: College[] = collegeDetails.map(college => ({
        college_name: college.college_name,
        city: college.city || 'Unknown',
        latitude: Number(college.latitude) || 0,
        longitude: Number(college.longitude) || 0,
        contact_number: college.phone || 'Not available',
        email: college.email || 'Not available',
        website: college.website || 'Not available',
        student_count: college.total_students || 0,
        establishment_year: college.established_year || 0,
        type: 'Government',
        rating: Number(college.infrastructure_rating) || 0,
      }));

      const filtered = transformedColleges.filter(college =>
        college.college_name.toLowerCase().includes(query.toLowerCase()) ||
        college.city.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredColleges(filtered);
    }
  };

  const handleCollegeSelection = (college: College) => {
    setSelectedCollege(college);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error: {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* College List */}
          <div className="md:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Colleges</CardTitle>
                <CardDescription>Search and select a college</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="text"
                  placeholder="Search colleges..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                  {filteredColleges.map((college) => (
                    <Button
                      key={college.college_name}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => handleCollegeSelection(college)}
                    >
                      <div>
                        <div className="font-medium">{college.college_name}</div>
                        <div className="text-sm text-muted-foreground">{college.city}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* College Details */}
          <div className="md:w-2/3">
            {selectedCollege ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedCollege.college_name}</CardTitle>
                  <CardDescription>Details of the selected college</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedCollege.city}</span>
                  </div>
                  {selectedCollege.contact_number !== 'Not available' && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{selectedCollege.contact_number}</span>
                    </div>
                  )}
                  {selectedCollege.email !== 'Not available' && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{selectedCollege.email}</span>
                    </div>
                  )}
                  {selectedCollege.website !== 'Not available' && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <a href={selectedCollege.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                  {selectedCollege.student_count > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{selectedCollege.student_count} Students</span>
                    </div>
                  )}
                  {selectedCollege.establishment_year > 0 && (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>Established in {selectedCollege.establishment_year}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge>{selectedCollege.type}</Badge>
                  </div>
                  {selectedCollege.rating > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <span>Rating: {selectedCollege.rating}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">Select a college to view details.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollegeMap;
