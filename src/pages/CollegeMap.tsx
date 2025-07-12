
import React, { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { MapPin, Navigation, Filter, Star, Building, Users, Car, Wifi } from "lucide-react";
import {
  fetchNearbyColleges,
  fetchAllCollegeDetails,
  type NearbyCollege,
  type CollegeDetails
} from "@/services/databaseService";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const CollegeMapPage = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRadius, setSearchRadius] = useState([25]);
  const [nearbyColleges, setNearbyColleges] = useState<NearbyCollege[]>([]);
  const [allColleges, setAllColleges] = useState<CollegeDetails[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<CollegeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadAllColleges();
  }, []);

  const loadAllColleges = async () => {
    try {
      const colleges = await fetchAllCollegeDetails();
      setAllColleges(colleges);
    } catch (error) {
      console.error('Failed to load colleges:', error);
    }
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        await searchNearbyColleges(location.lat, location.lng, searchRadius[0]);
        setIsLoading(false);
        
        toast({
          title: "Location Found",
          description: "Successfully detected your location and found nearby colleges"
        });
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setLocationError(errorMessage);
        setIsLoading(false);
        
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const searchNearbyColleges = async (lat: number, lng: number, radius: number) => {
    try {
      const colleges = await fetchNearbyColleges(lat, lng, radius);
      setNearbyColleges(colleges);
    } catch (error) {
      console.error('Failed to fetch nearby colleges:', error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby colleges",
        variant: "destructive"
      });
    }
  };

  const handleRadiusChange = async (newRadius: number[]) => {
    setSearchRadius(newRadius);
    if (userLocation) {
      await searchNearbyColleges(userLocation.lat, userLocation.lng, newRadius[0]);
    }
  };

  const selectCollege = (collegeName: string) => {
    const college = allColleges.find(c => c.college_name === collegeName);
    setSelectedCollege(college || null);
  };

  const filteredColleges = nearbyColleges.filter(college => {
    if (filterType === 'all') return true;
    return college.college_type.toLowerCase().includes(filterType.toLowerCase());
  });

  const getCollegeTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'government':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'government autonomous':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'private':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getNaacGradeColor = (grade: string) => {
    switch (grade) {
      case 'A++':
      case 'A+':
        return 'text-green-600';
      case 'A':
        return 'text-blue-600';
      case 'B++':
      case 'B+':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Interactive College Map</h1>
          <p className="text-muted-foreground text-lg">
            Discover colleges near you with location-based search and detailed information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Location Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Location Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Finding Location...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Get My Location
                    </>
                  )}
                </Button>
                
                {locationError && (
                  <p className="text-sm text-destructive">{locationError}</p>
                )}
                
                {userLocation && (
                  <div className="text-sm text-muted-foreground">
                    <p>📍 Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Search Radius */}
            {userLocation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Search Radius
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Radius: {searchRadius[0]} km
                    </label>
                    <Slider
                      value={searchRadius}
                      onValueChange={handleRadiusChange}
                      max={100}
                      min={5}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">College Type Filter</label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="all">All Types</option>
                      <option value="government">Government</option>
                      <option value="government autonomous">Government Autonomous</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* College Statistics */}
            {nearbyColleges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Search Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Total Colleges Found:</strong> {filteredColleges.length}</p>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(new Set(filteredColleges.map(c => c.college_type))).map(type => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}: {filteredColleges.filter(c => c.college_type === type).length}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2">
            {nearbyColleges.length === 0 && !userLocation && (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Find Colleges Near You</h3>
                  <p className="text-muted-foreground">
                    Click "Get My Location" to discover colleges in your area
                  </p>
                </CardContent>
              </Card>
            )}

            {userLocation && nearbyColleges.length === 0 && (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Colleges Found</h3>
                  <p className="text-muted-foreground">
                    Try increasing your search radius to find more colleges
                  </p>
                </CardContent>
              </Card>
            )}

            {filteredColleges.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">
                  Colleges within {searchRadius[0]}km ({filteredColleges.length} found)
                </h2>
                
                {filteredColleges.map((college, index) => (
                  <Card 
                    key={index} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => selectCollege(college.college_name)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-primary">
                            {college.college_name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4" />
                            {college.city} • {college.distance_km}km away
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getCollegeTypeColor(college.college_type)}>
                            {college.college_type}
                          </Badge>
                          {college.naac_grade && (
                            <div className={`text-sm font-medium mt-1 ${getNaacGradeColor(college.naac_grade)}`}>
                              NAAC: {college.naac_grade}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-muted-foreground">
                              Distance: {college.distance_km}km
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected College Details Modal */}
        {selectedCollege && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{selectedCollege.college_name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      {selectedCollege.city}, {selectedCollege.state}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedCollege(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedCollege.established_year && (
                    <div>
                      <span className="font-medium">Established:</span>
                      <p>{selectedCollege.established_year}</p>
                    </div>
                  )}
                  {selectedCollege.naac_grade && (
                    <div>
                      <span className="font-medium">NAAC Grade:</span>
                      <p className={getNaacGradeColor(selectedCollege.naac_grade)}>
                        {selectedCollege.naac_grade}
                      </p>
                    </div>
                  )}
                  {selectedCollege.university_affiliation && (
                    <div className="col-span-2">
                      <span className="font-medium">University:</span>
                      <p>{selectedCollege.university_affiliation}</p>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                {(selectedCollege.phone || selectedCollege.email || selectedCollege.website) && (
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="text-sm space-y-1">
                      {selectedCollege.phone && <p>📞 {selectedCollege.phone}</p>}
                      {selectedCollege.email && <p>✉️ {selectedCollege.email}</p>}
                      {selectedCollege.website && (
                        <p>
                          🌐 <a href={selectedCollege.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {selectedCollege.website}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Facilities */}
                <div>
                  <h4 className="font-medium mb-2">Facilities & Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCollege.hostel_available && (
                      <Badge variant="secondary" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        Hostel Available
                        {selectedCollege.hostel_capacity && ` (${selectedCollege.hostel_capacity})`}
                      </Badge>
                    )}
                    {selectedCollege.wifi_campus && (
                      <Badge variant="secondary" className="text-xs">
                        <Wifi className="h-3 w-3 mr-1" />
                        WiFi Campus
                      </Badge>
                    )}
                    {selectedCollege.transport_facility && (
                      <Badge variant="secondary" className="text-xs">
                        <Car className="h-3 w-3 mr-1" />
                        Transport
                      </Badge>
                    )}
                    {selectedCollege.placement_cell && (
                      <Badge variant="secondary" className="text-xs">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        Placement Cell
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Statistics */}
                {(selectedCollege.total_students || selectedCollege.faculty_count || selectedCollege.library_books) && (
                  <div>
                    <h4 className="font-medium mb-2">Statistics</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm text-center">
                      {selectedCollege.total_students && (
                        <div>
                          <p className="font-bold text-lg text-blue-600">{selectedCollege.total_students.toLocaleString()}</p>
                          <p className="text-muted-foreground">Students</p>
                        </div>
                      )}
                      {selectedCollege.faculty_count && (
                        <div>
                          <p className="font-bold text-lg text-green-600">{selectedCollege.faculty_count}</p>
                          <p className="text-muted-foreground">Faculty</p>
                        </div>
                      )}
                      {selectedCollege.library_books && (
                        <div>
                          <p className="font-bold text-lg text-purple-600">{selectedCollege.library_books.toLocaleString()}</p>
                          <p className="text-muted-foreground">Library Books</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Placement Information */}
                {(selectedCollege.placement_percentage || selectedCollege.average_package) && (
                  <div>
                    <h4 className="font-medium mb-2">Placement Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedCollege.placement_percentage && (
                        <div>
                          <span className="font-medium">Placement Rate:</span>
                          <p className="text-green-600 font-bold">{selectedCollege.placement_percentage}%</p>
                        </div>
                      )}
                      {selectedCollege.average_package && (
                        <div>
                          <span className="font-medium">Average Package:</span>
                          <p className="text-green-600 font-bold">
                            ₹{selectedCollege.average_package.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CollegeMapPage;
