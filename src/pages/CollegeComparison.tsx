
import React, { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, X, MapPin, Users, GraduationCap, DollarSign, Star, Building, Wifi, Car } from "lucide-react";
import {
  fetchAllCollegeNames,
  fetchCollegeComparison,
  saveCollegeComparison,
  type CollegeComparison
} from "@/services/databaseService";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const CollegeComparisonPage = () => {
  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);
  const [availableColleges, setAvailableColleges] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [comparisonData, setComparisonData] = useState<CollegeComparison[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingColleges, setIsLoadingColleges] = useState(true);

  useEffect(() => {
    loadAvailableColleges();
  }, []);

  const loadAvailableColleges = async () => {
    try {
      const colleges = await fetchAllCollegeNames();
      setAvailableColleges(colleges);
    } catch (error) {
      console.error('Failed to load colleges:', error);
      toast({
        title: "Error",
        description: "Failed to load colleges list",
        variant: "destructive"
      });
    } finally {
      setIsLoadingColleges(false);
    }
  };

  const filteredColleges = availableColleges.filter(college =>
    college.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedColleges.includes(college)
  );

  const addCollege = (college: string) => {
    if (selectedColleges.length < 3) {
      setSelectedColleges([...selectedColleges, college]);
      setSearchTerm('');
    } else {
      toast({
        title: "Maximum Limit Reached",
        description: "You can compare up to 3 colleges at a time",
        variant: "destructive"
      });
    }
  };

  const removeCollege = (college: string) => {
    setSelectedColleges(selectedColleges.filter(c => c !== college));
    setComparisonData([]);
  };

  const compareColleges = async () => {
    if (selectedColleges.length < 2) {
      toast({
        title: "Select More Colleges",
        description: "Please select at least 2 colleges to compare",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchCollegeComparison(selectedColleges);
      setComparisonData(data);
      
      // Save comparison for future reference
      await saveCollegeComparison(selectedColleges, undefined, `session_${Date.now()}`);
      
      toast({
        title: "Comparison Generated",
        description: `Successfully compared ${selectedColleges.length} colleges`
      });
    } catch (error) {
      console.error('Failed to compare colleges:', error);
      toast({
        title: "Error",
        description: "Failed to generate comparison",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetComparison = () => {
    setSelectedColleges([]);
    setComparisonData([]);
    setSearchTerm('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderComparisonCard = (college: CollegeComparison, index: number) => (
    <Card key={index} className="w-full min-w-[350px]">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
          <Building className="h-5 w-5" />
          {college.college_name}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {college.city}
          <Badge variant="outline">{college.college_type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Established:</span>
            <p>{college.establishment_year || 'N/A'}</p>
          </div>
          <div>
            <span className="font-medium">NAAC Grade:</span>
            <p>{college.naac_grade || 'N/A'}</p>
          </div>
        </div>

        <Separator />

        {/* Placement Stats */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Placement Statistics
          </h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Placement Rate:</span>
              <span className="font-medium">{college.placement_percentage || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span>Average Package:</span>
              <span className="font-medium text-green-600">
                {college.average_package ? formatCurrency(college.average_package) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Highest Package:</span>
              <span className="font-medium text-green-700">
                {college.highest_package ? formatCurrency(college.highest_package) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Infrastructure */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <Star className="h-4 w-4" />
            Infrastructure
          </h4>
          <div className="flex justify-between text-sm">
            <span>Rating:</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{college.infrastructure_rating || 'N/A'}/5</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Facilities */}
        <div className="space-y-2">
          <h4 className="font-medium">Facilities</h4>
          <div className="flex flex-wrap gap-2">
            {college.hostel_available && (
              <Badge variant="secondary" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                Hostel
              </Badge>
            )}
            {college.facilities?.wifi_campus && (
              <Badge variant="secondary" className="text-xs">
                <Wifi className="h-3 w-3 mr-1" />
                WiFi
              </Badge>
            )}
            {college.facilities?.transport_facility && (
              <Badge variant="secondary" className="text-xs">
                <Car className="h-3 w-3 mr-1" />
                Transport
              </Badge>
            )}
          </div>
        </div>

        {/* Sample Cutoff Data */}
        {college.cutoff_data && college.cutoff_data.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Sample Cutoffs</h4>
              <div className="text-xs space-y-1">
                {college.cutoff_data.slice(0, 3).map((cutoff: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>{cutoff.branch} ({cutoff.category}):</span>
                    <span className="font-medium">{cutoff.cap1_cutoff}</span>
                  </div>
                ))}
                {college.cutoff_data.length > 3 && (
                  <p className="text-muted-foreground">+{college.cutoff_data.length - 3} more branches</p>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">College Comparison Tool</h1>
          <p className="text-muted-foreground text-lg">
            Compare up to 3 colleges side-by-side to make an informed decision
          </p>
        </div>

        {/* College Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Colleges to Compare</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selected Colleges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedColleges.map((college, index) => (
                <Badge key={index} variant="default" className="px-3 py-1">
                  {college}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-auto p-0"
                    onClick={() => removeCollege(college)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>

            {/* Search Box */}
            {selectedColleges.length < 3 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for colleges to add..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {searchTerm && filteredColleges.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-background border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    {filteredColleges.slice(0, 10).map((college, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
                        onClick={() => addCollege(college)}
                      >
                        {college}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={compareColleges}
                disabled={selectedColleges.length < 2 || isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Comparing...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Compare Colleges
                  </>
                )}
              </Button>
              
              {(selectedColleges.length > 0 || comparisonData.length > 0) && (
                <Button variant="outline" onClick={resetComparison}>
                  Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Results */}
        {comparisonData.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Comparison Results</h2>
            
            <div className="flex gap-6 overflow-x-auto pb-4">
              {comparisonData.map((college, index) => renderComparisonCard(college, index))}
            </div>

            {/* Quick Comparison Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Comparison Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">HIGHEST PLACEMENT RATE</h4>
                    {(() => {
                      const highest = comparisonData.reduce((prev, curr) => 
                        (curr.placement_percentage || 0) > (prev.placement_percentage || 0) ? curr : prev
                      );
                      return (
                        <div>
                          <p className="font-bold text-lg text-green-600">{highest.placement_percentage || 0}%</p>
                          <p className="text-sm">{highest.college_name}</p>
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div className="text-center">
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">HIGHEST AVERAGE PACKAGE</h4>
                    {(() => {
                      const highest = comparisonData.reduce((prev, curr) => 
                        (curr.average_package || 0) > (prev.average_package || 0) ? curr : prev
                      );
                      return (
                        <div>
                          <p className="font-bold text-lg text-green-600">
                            {highest.average_package ? formatCurrency(highest.average_package) : 'N/A'}
                          </p>
                          <p className="text-sm">{highest.college_name}</p>
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div className="text-center">
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">BEST INFRASTRUCTURE</h4>
                    {(() => {
                      const highest = comparisonData.reduce((prev, curr) => 
                        (curr.infrastructure_rating || 0) > (prev.infrastructure_rating || 0) ? curr : prev
                      );
                      return (
                        <div>
                          <p className="font-bold text-lg text-orange-600">{highest.infrastructure_rating || 'N/A'}/5</p>
                          <p className="text-sm">{highest.college_name}</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CollegeComparisonPage;
