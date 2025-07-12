
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  Building2, 
  GraduationCap, 
  X, 
  Check, 
  Filter,
  Star,
  BookOpen,
  Users,
  Target,
  Zap,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react";
import { 
  fetchAvailableBranches, 
  fetchAvailableCollegeTypes,
  fetchAvailableCities,
  fetchAllCollegeNames
} from "@/services/databaseService";
import { CollegeType } from "../college-analysis/FormDataTypes";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MinimalPreferencesStepProps {
  preferredBranches: string[];
  collegeTypes: string[];
  selectedColleges: string[];
  category: string;
  selectedCities: string[];
  onBranchChange: (branch: string, checked: boolean) => void;
  onCollegeTypeChange: (collegeType: string, checked: boolean) => void;
  onCollegeSelectionChange: (colleges: string[]) => void;
  onCategoryChange: (category: string) => void;
  onCityChange: (cities: string[]) => void;
}

export const MinimalPreferencesStep: React.FC<MinimalPreferencesStepProps> = ({
  preferredBranches,
  collegeTypes,
  selectedColleges,
  selectedCities,
  onBranchChange,
  onCollegeTypeChange,
  onCollegeSelectionChange,
  onCityChange
}) => {
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);
  const [availableCollegeTypes, setAvailableCollegeTypes] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [allColleges, setAllColleges] = useState<string[]>([]);
  const [collegeSearchTerm, setCollegeSearchTerm] = useState('');
  const [branchSearchTerm, setBranchSearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    branches: true,
    collegeTypes: true,
    cities: false,
    colleges: false
  });

  useEffect(() => {
    const loadOptions = async () => {
      const [branches, types, cities, colleges] = await Promise.all([
        fetchAvailableBranches(),
        fetchAvailableCollegeTypes(),
        fetchAvailableCities(),
        fetchAllCollegeNames()
      ]);
      
      setAvailableBranches(branches);
      setAvailableCollegeTypes(types);
      setAvailableCities(cities);
      setAllColleges(colleges);
    };
    
    loadOptions();
  }, []);

  const collegeTypeOptions: CollegeType[] = availableCollegeTypes.map(type => ({
    value: type,
    label: type
  }));

  const handleSelectAllBranches = () => {
    const allSelected = availableBranches.length === preferredBranches.length;
    if (allSelected) {
      preferredBranches.forEach(branch => onBranchChange(branch, false));
    } else {
      availableBranches.forEach(branch => {
        if (!preferredBranches.includes(branch)) {
          onBranchChange(branch, true);
        }
      });
    }
  };

  const handleSelectAllCollegeTypes = () => {
    const allSelected = availableCollegeTypes.length === collegeTypes.length;
    if (allSelected) {
      collegeTypes.forEach(type => onCollegeTypeChange(type, false));
    } else {
      availableCollegeTypes.forEach(type => {
        if (!collegeTypes.includes(type)) {
          onCollegeTypeChange(type, true);
        }
      });
    }
  };

  const handleSelectAllCities = () => {
    const allSelected = availableCities.length === selectedCities.length;
    if (allSelected) {
      onCityChange([]);
    } else {
      onCityChange(availableCities);
    }
  };

  const handleCityToggle = (city: string) => {
    const newCities = selectedCities.includes(city)
      ? selectedCities.filter(c => c !== city)
      : [...selectedCities, city];
    onCityChange(newCities);
  };

  const handleSelectAllColleges = () => {
    const allSelected = allColleges.length === selectedColleges.length;
    if (allSelected) {
      onCollegeSelectionChange([]);
    } else {
      onCollegeSelectionChange(allColleges);
    }
  };

  const handleCollegeToggle = (college: string) => {
    const newColleges = selectedColleges.includes(college)
      ? selectedColleges.filter(c => c !== college)
      : [...selectedColleges, college];
    onCollegeSelectionChange(newColleges);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const filteredBranches = availableBranches.filter(branch =>
    branch.toLowerCase().includes(branchSearchTerm.toLowerCase())
  );

  const filteredColleges = allColleges.filter(college =>
    college.toLowerCase().includes(collegeSearchTerm.toLowerCase())
  );

  const filteredCities = availableCities.filter(city =>
    city.toLowerCase().includes(citySearchTerm.toLowerCase())
  );

  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 4;
    
    if (preferredBranches.length > 0) completed++;
    if (collegeTypes.length > 0) completed++;
    if (selectedCities.length > 0 || selectedCities.length === 0) completed++; // Cities are optional
    if (selectedColleges.length > 0 || selectedColleges.length === 0) completed++; // Colleges are optional
    
    return Math.round((completed / total) * 100);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Progress Header */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-card-foreground">Your Preferences</CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    Customize your search to find the perfect colleges for you
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{getCompletionPercentage()}%</div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
            </div>
            <div className="w-full bg-secondary/20 rounded-full h-2 mt-4">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
          </CardHeader>
        </Card>

        {/* Engineering Branches Section */}
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader 
            className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg"
            onClick={() => toggleSection('branches')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <BookOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Engineering Branches
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select the engineering branches you're interested in</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <CardDescription>
                    {preferredBranches.length} of {availableBranches.length} branches selected
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {preferredBranches.length > 0 && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                    {preferredBranches.length}
                  </Badge>
                )}
                {expandedSections.branches ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </div>
          </CardHeader>
          
          {expandedSections.branches && (
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllBranches}
                  className="flex items-center gap-2"
                >
                  {preferredBranches.length === availableBranches.length ? (
                    <>
                      <X className="h-4 w-4" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Select All
                    </>
                  )}
                </Button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search branches..."
                  value={branchSearchTerm}
                  onChange={(e) => setBranchSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <ScrollArea className="h-40 w-full border rounded-lg">
                <div className="p-4 space-y-3">
                  {filteredBranches.map((branch) => (
                    <div key={branch} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md transition-colors">
                      <Checkbox
                        id={`branch-${branch}`}
                        checked={preferredBranches.includes(branch)}
                        onCheckedChange={(checked) => onBranchChange(branch, checked as boolean)}
                      />
                      <Label
                        htmlFor={`branch-${branch}`}
                        className="text-sm cursor-pointer flex-1 font-medium"
                      >
                        {branch}
                      </Label>
                      {preferredBranches.includes(branch) && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {preferredBranches.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {preferredBranches.slice(0, 3).map((branch) => (
                    <Badge key={branch} variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                      {branch.length > 20 ? branch.substring(0, 20) + '...' : branch}
                      <button 
                        className="ml-2 hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5" 
                        onClick={() => onBranchChange(branch, false)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {preferredBranches.length > 3 && (
                    <Badge variant="outline" className="border-orange-300 text-orange-600">
                      +{preferredBranches.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* College Types Section */}
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader 
            className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg"
            onClick={() => toggleSection('collegeTypes')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    College Types
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Filter by college type (Government, Private, etc.)</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <CardDescription>
                    {collegeTypes.length} of {availableCollegeTypes.length} types selected
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {collegeTypes.length > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {collegeTypes.length}
                  </Badge>
                )}
                {expandedSections.collegeTypes ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </div>
          </CardHeader>
          
          {expandedSections.collegeTypes && (
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllCollegeTypes}
                  className="flex items-center gap-2"
                >
                  {collegeTypes.length === availableCollegeTypes.length ? (
                    <>
                      <X className="h-4 w-4" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Select All
                    </>
                  )}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {collegeTypeOptions.map((type) => (
                  <div key={type.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Checkbox
                      id={`type-${type.value}`}
                      checked={collegeTypes.includes(type.value)}
                      onCheckedChange={(checked) => onCollegeTypeChange(type.value, checked as boolean)}
                    />
                    <Label
                      htmlFor={`type-${type.value}`}
                      className="text-sm cursor-pointer font-medium flex-1"
                    >
                      {type.label}
                    </Label>
                    {collegeTypes.includes(type.value) && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                ))}
              </div>

              {collegeTypes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {collegeTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {type}
                      <button 
                        className="ml-2 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5" 
                        onClick={() => onCollegeTypeChange(type, false)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Cities Section */}
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader 
            className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg"
            onClick={() => toggleSection('cities')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Preferred Cities
                    <Badge variant="outline" className="text-xs">Optional</Badge>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Filter colleges by city. Leave empty to include all cities.</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <CardDescription>
                    {selectedCities.length === 0 ? 'All cities included' : `${selectedCities.length} cities selected`}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedCities.length > 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    {selectedCities.length}
                  </Badge>
                )}
                {expandedSections.cities ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </div>
          </CardHeader>
          
          {expandedSections.cities && (
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllCities}
                  className="flex items-center gap-2"
                >
                  {selectedCities.length === availableCities.length ? (
                    <>
                      <X className="h-4 w-4" />
                      Clear All
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Select All
                    </>
                  )}
                </Button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cities..."
                  value={citySearchTerm}
                  onChange={(e) => setCitySearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <ScrollArea className="h-32 w-full border rounded-lg">
                <div className="p-4 grid grid-cols-2 gap-2">
                  {filteredCities.map((city) => (
                    <div key={city} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md transition-colors">
                      <Checkbox
                        id={`city-${city}`}
                        checked={selectedCities.includes(city)}
                        onCheckedChange={() => handleCityToggle(city)}
                      />
                      <Label
                        htmlFor={`city-${city}`}
                        className="text-sm cursor-pointer font-medium"
                      >
                        {city}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {selectedCities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedCities.slice(0, 5).map((city) => (
                    <Badge key={city} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      {city}
                      <button 
                        className="ml-2 hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5" 
                        onClick={() => handleCityToggle(city)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {selectedCities.length > 5 && (
                    <Badge variant="outline" className="border-green-300 text-green-600">
                      +{selectedCities.length - 5} more
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Specific Colleges Section */}
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader 
            className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg"
            onClick={() => toggleSection('colleges')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Specific Colleges
                    <Badge variant="outline" className="text-xs">Optional</Badge>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Target specific colleges. Leave empty to search all colleges.</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <CardDescription>
                    {selectedColleges.length === 0 ? 'All colleges included' : `${selectedColleges.length} colleges selected`}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedColleges.length > 0 && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    {selectedColleges.length}
                  </Badge>
                )}
                {expandedSections.colleges ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </div>
          </CardHeader>
          
          {expandedSections.colleges && (
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllColleges}
                  className="flex items-center gap-2"
                >
                  {selectedColleges.length === allColleges.length ? (
                    <>
                      <X className="h-4 w-4" />
                      Clear All
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Select All
                    </>
                  )}
                </Button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search colleges..."
                  value={collegeSearchTerm}
                  onChange={(e) => setCollegeSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <ScrollArea className="h-40 w-full border rounded-lg">
                <div className="p-4 space-y-2">
                  {filteredColleges.slice(0, 50).map((college) => (
                    <div key={college} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md transition-colors">
                      <Checkbox
                        id={`college-${college}`}
                        checked={selectedColleges.includes(college)}
                        onCheckedChange={() => handleCollegeToggle(college)}
                      />
                      <Label
                        htmlFor={`college-${college}`}
                        className="text-sm cursor-pointer flex-1 font-medium"
                      >
                        {college}
                      </Label>
                      {selectedColleges.includes(college) && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  ))}
                  {filteredColleges.length > 50 && (
                    <div className="text-xs text-muted-foreground p-2 text-center border-t">
                      Showing first 50 results. Use search to find specific colleges.
                    </div>
                  )}
                </div>
              </ScrollArea>

              {selectedColleges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedColleges.slice(0, 3).map((college) => (
                    <Badge key={college} variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                      {college.length > 25 ? college.substring(0, 25) + '...' : college}
                      <button 
                        className="ml-2 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5" 
                        onClick={() => handleCollegeToggle(college)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {selectedColleges.length > 3 && (
                    <Badge variant="outline" className="border-purple-300 text-purple-600">
                      +{selectedColleges.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Enhanced Selection Summary */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-semibold text-lg">Selection Summary</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">Branches</span>
                  </div>
                  <Badge variant={preferredBranches.length > 0 ? "default" : "secondary"}>
                    {preferredBranches.length}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">College Types</span>
                  </div>
                  <Badge variant={collegeTypes.length > 0 ? "default" : "secondary"}>
                    {collegeTypes.length}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Cities</span>
                  </div>
                  <Badge variant="secondary">
                    {selectedCities.length === 0 ? 'All' : selectedCities.length}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Colleges</span>
                  </div>
                  <Badge variant="secondary">
                    {selectedColleges.length === 0 ? 'All' : selectedColleges.length}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-primary" />
                <span className="font-medium">Ready to search:</span>
                <span className="text-muted-foreground">
                  {preferredBranches.length > 0 && collegeTypes.length > 0 
                    ? "All required preferences selected!" 
                    : "Please select at least one branch and college type to continue."}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};
