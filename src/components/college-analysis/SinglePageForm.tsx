import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { 
  Search, 
  MapPin, 
  Building2, 
  GraduationCap, 
  X, 
  Check, 
  User,
  Target,
  Star,
  Info,
  ChevronRight,
  ChevronDown,
  Plus
} from "lucide-react";
import { 
  fetchAvailableBranches, 
  fetchAvailableCollegeTypes,
  fetchAvailableCities,
  fetchAllCollegeNames
} from "@/services/databaseService";
import { FormData } from "./FormDataTypes";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface SinglePageFormProps {
  formData: FormData;
  availableCategories: string[];
  isAnalyzing: boolean;
  onFormDataChange: (updates: Partial<FormData>) => void;
  onSubmit: () => void;
}

const categoryInfo: Record<string, string> = {
  'OPEN': 'General Open',
  'GOPEN': 'General Open',
  'OBC': 'Other Backward Classes',
  'GOBC': 'General Other Backward Classes',
  'SC': 'Scheduled Caste',
  'ST': 'Scheduled Tribe',
  'EWS': 'Economically Weaker Section',
  'PWD': 'Person with Disability',
  'MI': 'Minority',
  'DEF': 'Defense'
};

export const SinglePageForm: React.FC<SinglePageFormProps> = ({
  formData,
  availableCategories,
  isAnalyzing,
  onFormDataChange,
  onSubmit
}) => {
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);
  const [availableCollegeTypes, setAvailableCollegeTypes] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [allColleges, setAllColleges] = useState<string[]>([]);
  
  const [branchSearch, setBranchSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [collegeSearch, setCollegeSearch] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      try {
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
      } catch (error) {
        console.error('Error loading form data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOptions();
  }, []);

  const handleBranchToggle = (branch: string) => {
    const newBranches = formData.preferredBranches.includes(branch)
      ? formData.preferredBranches.filter(b => b !== branch)
      : [...formData.preferredBranches, branch];
    onFormDataChange({ preferredBranches: newBranches });
  };

  const handleCollegeTypeToggle = (type: string) => {
    const newTypes = formData.collegeTypes.includes(type)
      ? formData.collegeTypes.filter(t => t !== type)
      : [...formData.collegeTypes, type];
    onFormDataChange({ collegeTypes: newTypes });
  };

  const handleCityToggle = (city: string) => {
    const newCities = formData.selectedCities.includes(city)
      ? formData.selectedCities.filter(c => c !== city)
      : [...formData.selectedCities, city];
    onFormDataChange({ selectedCities: newCities });
  };

  const filteredBranches = availableBranches.filter(branch =>
    branch.toLowerCase().includes(branchSearch.toLowerCase())
  );

  const filteredCities = availableCities.filter(city =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const isFormValid = () => {
    return formData.fullName.trim() !== '' && 
           formData.aggregate !== '' && 
           formData.category !== '' &&
           formData.preferredBranches.length > 0 &&
           formData.collegeTypes.length > 0;
  };

  const getCompletionPercentage = () => {
    let completed = 0;
    const total = 5;
    
    if (formData.fullName.trim() !== '') completed++;
    if (formData.aggregate !== '') completed++;
    if (formData.category !== '') completed++;
    if (formData.preferredBranches.length > 0) completed++;
    if (formData.collegeTypes.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-muted-foreground">Loading form...</span>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Header */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Find Your Perfect College</CardTitle>
                  <CardDescription>Complete all fields to get personalized recommendations</CardDescription>
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

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Personal & Academic Details */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                    <CardDescription>Your basic details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => onFormDataChange({ fullName: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Academic Details */}
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Academic Details</CardTitle>
                    <CardDescription>Your academic performance</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="aggregate">Aggregate Percentage</Label>
                  <Input
                    id="aggregate"
                    type="number"
                    step="0.01"
                    placeholder="Enter your percentage (e.g., 82.02)"
                    value={formData.aggregate}
                    onChange={(e) => onFormDataChange({ aggregate: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="category">Category</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select your reservation category</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    value={formData.category}
                    onChange={(e) => onFormDataChange({ category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    <option value="ALL">All Categories</option>
                    {availableCategories.filter(cat => cat && cat.trim()).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat} - {categoryInfo[cat] || cat}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preferences */}
          <div className="space-y-6">
            {/* Engineering Branches */}
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Engineering Branches</CardTitle>
                      <CardDescription>{formData.preferredBranches.length} selected</CardDescription>
                    </div>
                  </div>
                  {formData.preferredBranches.length > 0 && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {formData.preferredBranches.length}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Engineering Branches</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between h-auto min-h-[40px] text-left font-normal"
                      >
                        <div className="flex flex-wrap gap-1">
                          {formData.preferredBranches.length === 0 ? (
                            <span className="text-muted-foreground">Select branches...</span>
                          ) : (
                            <>
                              {formData.preferredBranches.slice(0, 2).map((branch) => (
                                <Badge key={branch} variant="secondary" className="text-xs">
                                  {branch.length > 12 ? branch.substring(0, 12) + '...' : branch}
                                </Badge>
                              ))}
                              {formData.preferredBranches.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{formData.preferredBranches.length - 2} more
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-white border-border shadow-md" align="start">
                      <Command className="bg-white">
                        <CommandInput placeholder="Search branches..." className="bg-white" />
                        <CommandList className="bg-white">
                          <CommandEmpty className="bg-white">No branches found.</CommandEmpty>
                          <CommandGroup className="bg-white">
                            {filteredBranches.map((branch) => (
                              <CommandItem
                                key={branch}
                                value={branch}
                                onSelect={() => handleBranchToggle(branch)}
                                className="flex items-center gap-2 cursor-pointer bg-white hover:bg-gray-50"
                              >
                                <div className="flex h-4 w-4 items-center justify-center">
                                  {formData.preferredBranches.includes(branch) && (
                                    <Check className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                                <span className="flex-1">{branch}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {formData.preferredBranches.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Selected Branches:</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.preferredBranches.map((branch) => (
                        <Badge key={branch} variant="secondary" className="text-xs">
                          {branch}
                          <button 
                            onClick={() => handleBranchToggle(branch)} 
                            className="ml-2 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* College Types */}
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">College Types</CardTitle>
                      <CardDescription>{formData.collegeTypes.length} selected</CardDescription>
                    </div>
                  </div>
                  {formData.collegeTypes.length > 0 && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {formData.collegeTypes.length}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {availableCollegeTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2 p-2 border rounded hover:bg-muted/50">
                      <Checkbox
                        checked={formData.collegeTypes.includes(type)}
                        onCheckedChange={() => handleCollegeTypeToggle(type)}
                      />
                      <Label className="text-sm cursor-pointer font-medium flex-1">{type}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cities (Optional) */}
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                      <MapPin className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Preferred Cities</CardTitle>
                      <CardDescription>Optional - Leave empty for all cities</CardDescription>
                    </div>
                  </div>
                  {formData.selectedCities.length > 0 && (
                    <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                      {formData.selectedCities.length}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cities..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <ScrollArea className="h-24 border rounded-lg">
                  <div className="p-3 space-y-2">
                    {filteredCities.slice(0, 10).map((city) => (
                      <div key={city} className="flex items-center space-x-2 hover:bg-muted/50 p-1 rounded">
                        <Checkbox
                          checked={formData.selectedCities.includes(city)}
                          onCheckedChange={() => handleCityToggle(city)}
                        />
                        <Label className="text-sm cursor-pointer flex-1">{city}</Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <Button 
              onClick={onSubmit}
              disabled={!isFormValid() || isAnalyzing}
              className="w-full h-12 text-lg font-semibold"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Analyzing Colleges...</span>
                </>
              ) : (
                <>
                  Find My Perfect Colleges
                  <ChevronRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
            {!isFormValid() && (
              <p className="text-sm text-muted-foreground text-center mt-2">
                Please fill in all required fields to continue
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};