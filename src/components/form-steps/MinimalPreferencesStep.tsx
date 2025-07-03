
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Building2, GraduationCap, X } from "lucide-react";
import { 
  fetchAvailableBranches, 
  fetchAvailableCollegeTypes,
  fetchAvailableCities,
  fetchAllCollegeNames
} from "@/services/databaseService";
import { CollegeType } from "../college-analysis/FormDataTypes";

interface MinimalPreferencesStepProps {
  preferredBranches: string[];
  collegeTypes: string[];
  selectedColleges: string[];
  collegeSelections: Array<{ collegeName: string; selected: boolean }>;
  category: string;
  selectedCities: string[];
  onBranchChange: (branch: string, checked: boolean) => void;
  onCollegeTypeChange: (collegeType: string, checked: boolean) => void;
  onCollegeSelectionChange: (colleges: string[]) => void;
  onCollegeSelectionsChange: (selections: Array<{ collegeName: string; selected: boolean }>) => void;
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
      // Deselect all
      preferredBranches.forEach(branch => onBranchChange(branch, false));
    } else {
      // Select all
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
      // Deselect all
      collegeTypes.forEach(type => onCollegeTypeChange(type, false));
    } else {
      // Select all
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

  const filteredBranches = availableBranches.filter(branch =>
    branch.toLowerCase().includes(branchSearchTerm.toLowerCase())
  );

  const filteredColleges = allColleges.filter(college =>
    college.toLowerCase().includes(collegeSearchTerm.toLowerCase())
  );

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-card-foreground flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          Your Preferences
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Select your preferred branches, college types, and locations. You can select multiple options or choose "All" for comprehensive results.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Engineering Branches */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium text-card-foreground">Engineering Branches</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAllBranches}
              className="text-xs"
            >
              {preferredBranches.length === availableBranches.length ? 'Deselect All' : 'Select All Branches'}
            </Button>
          </div>
          
          {/* Branch Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search branches..."
              value={branchSearchTerm}
              onChange={(e) => setBranchSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <ScrollArea className="h-32 w-full border rounded-md p-3">
            <div className="grid grid-cols-1 gap-2">
              {filteredBranches.map((branch) => (
                <div key={branch} className="flex items-center space-x-2">
                  <Checkbox
                    id={`branch-${branch}`}
                    checked={preferredBranches.includes(branch)}
                    onCheckedChange={(checked) => onBranchChange(branch, checked as boolean)}
                  />
                  <Label
                    htmlFor={`branch-${branch}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {branch}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {preferredBranches.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {preferredBranches.slice(0, 3).map((branch) => (
                <Badge key={branch} variant="secondary" className="text-xs">
                  {branch.length > 20 ? branch.substring(0, 20) + '...' : branch}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => onBranchChange(branch, false)}
                  />
                </Badge>
              ))}
              {preferredBranches.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{preferredBranches.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* College Types */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium text-card-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              College Types
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAllCollegeTypes}
              className="text-xs"
            >
              {collegeTypes.length === availableCollegeTypes.length ? 'Deselect All' : 'Select All Types'}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {collegeTypeOptions.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type.value}`}
                  checked={collegeTypes.includes(type.value)}
                  onCheckedChange={(checked) => onCollegeTypeChange(type.value, checked as boolean)}
                />
                <Label
                  htmlFor={`type-${type.value}`}
                  className="text-sm cursor-pointer"
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </div>

          {collegeTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {collegeTypes.map((type) => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {type}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => onCollegeTypeChange(type, false)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Cities Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium text-card-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Preferred Cities (Optional)
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAllCities}
              className="text-xs"
            >
              {selectedCities.length === availableCities.length ? 'Deselect All' : 'Select All Cities'}
            </Button>
          </div>
          
          <ScrollArea className="h-24 w-full border rounded-md p-3">
            <div className="grid grid-cols-2 gap-2">
              {availableCities.map((city) => (
                <div key={city} className="flex items-center space-x-2">
                  <Checkbox
                    id={`city-${city}`}
                    checked={selectedCities.includes(city)}
                    onCheckedChange={() => handleCityToggle(city)}
                  />
                  <Label
                    htmlFor={`city-${city}`}
                    className="text-sm cursor-pointer"
                  >
                    {city}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>

          {selectedCities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCities.slice(0, 5).map((city) => (
                <Badge key={city} variant="secondary" className="text-xs">
                  {city}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => handleCityToggle(city)}
                  />
                </Badge>
              ))}
              {selectedCities.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{selectedCities.length - 5} more
                </Badge>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Specific Colleges */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium text-card-foreground">
              Specific Colleges (Optional)
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAllColleges}
              className="text-xs"
            >
              {selectedColleges.length === allColleges.length ? 'Deselect All' : 'Select All Colleges'}
            </Button>
          </div>
          
          {/* College Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search colleges..."
              value={collegeSearchTerm}
              onChange={(e) => setCollegeSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <ScrollArea className="h-32 w-full border rounded-md p-3">
            <div className="grid grid-cols-1 gap-2">
              {filteredColleges.slice(0, 50).map((college) => (
                <div key={college} className="flex items-center space-x-2">
                  <Checkbox
                    id={`college-${college}`}
                    checked={selectedColleges.includes(college)}
                    onCheckedChange={() => handleCollegeToggle(college)}
                  />
                  <Label
                    htmlFor={`college-${college}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {college}
                  </Label>
                </div>
              ))}
              {filteredColleges.length > 50 && (
                <div className="text-xs text-muted-foreground p-2">
                  Showing first 50 results. Use search to find specific colleges.
                </div>
              )}
            </div>
          </ScrollArea>

          {selectedColleges.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedColleges.slice(0, 3).map((college) => (
                <Badge key={college} variant="secondary" className="text-xs">
                  {college.length > 25 ? college.substring(0, 25) + '...' : college}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => handleCollegeToggle(college)}
                  />
                </Badge>
              ))}
              {selectedColleges.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{selectedColleges.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Selection Summary */}
        <div className="bg-muted/50 p-3 rounded-lg text-sm">
          <h4 className="font-medium mb-2">Selection Summary:</h4>
          <div className="space-y-1 text-muted-foreground">
            <p>• <strong>{preferredBranches.length}</strong> branches selected</p>
            <p>• <strong>{collegeTypes.length}</strong> college types selected</p>
            <p>• <strong>{selectedCities.length}</strong> cities selected {selectedCities.length === 0 && "(all cities will be shown)"}</p>
            <p>• <strong>{selectedColleges.length}</strong> specific colleges selected {selectedColleges.length === 0 && "(all colleges will be searched)"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
