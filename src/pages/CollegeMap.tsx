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
import { databaseService } from "@/services/databaseService";

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

  const { data: colleges, isLoading, isError, error } = useQuery<College[]>('colleges', () => databaseService.getColleges());

  useEffect(() => {
    if (colleges) {
      setFilteredColleges(colleges);
    }
  }, [colleges]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (colleges) {
      const filtered = colleges.filter(college =>
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
                <div className="mt-4 space-y-2">
                  {filteredColleges.map((college) => (
                    <Button
                      key={college.college_name}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleCollegeSelection(college)}
                    >
                      {college.college_name}, {college.city}
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
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{selectedCollege.contact_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{selectedCollege.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a href={selectedCollege.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Website
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{selectedCollege.student_count} Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>Established in {selectedCollege.establishment_year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{selectedCollege.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>Rating: {selectedCollege.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center">
                  Select a college to view details.
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
