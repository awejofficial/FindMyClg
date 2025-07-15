
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, Check, User } from "lucide-react";
import { FormData } from "./FormDataTypes";
import { fetchAvailableBranches, fetchAvailableCategories } from "@/services/databaseService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface SinglePageFormProps {
  formData: FormData;
  availableCategories: string[];
  onFormDataChange: (updates: Partial<FormData>) => void;
  onBranchChange: (branch: string, checked: boolean) => void;
  onCollegeTypeChange: (collegeType: string, checked: boolean) => void;
  onCityChange: (cities: string[]) => void;
  onSubmit: () => void;
  isAnalyzing: boolean;
  isGuest: boolean;
  onGuestAccess: () => void;
}

export const SinglePageForm: React.FC<SinglePageFormProps> = ({
  formData,
  availableCategories,
  onFormDataChange,
  onBranchChange,
  onCollegeTypeChange,
  onCityChange,
  onSubmit,
  isAnalyzing,
  isGuest,
  onGuestAccess
}) => {
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<string[]>([]);
  const [branchSearchTerm, setBranchSearchTerm] = useState('');
  const [isBranchPopoverOpen, setIsBranchPopoverOpen] = useState(false);
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const branches = await fetchAvailableBranches();
        setAvailableBranches(branches);
        setFilteredBranches(branches);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const filtered = availableBranches.filter(branch =>
      branch.toLowerCase().includes(branchSearchTerm.toLowerCase())
    );
    setFilteredBranches(filtered);
  }, [branchSearchTerm, availableBranches]);

  const handleBranchToggle = (branch: string) => {
    onBranchChange(branch, !formData.preferredBranches.includes(branch));
  };

  const handleCategoryToggle = (category: string) => {
    const currentCategories = Array.isArray(formData.category) ? formData.category : 
                             formData.category ? [formData.category] : [];
    
    if (currentCategories.includes(category)) {
      // Remove category
      const newCategories = currentCategories.filter(c => c !== category);
      onFormDataChange({ category: newCategories.length === 1 ? newCategories[0] : newCategories });
    } else if (currentCategories.length < 2) {
      // Add category (max 2)
      const newCategories = [...currentCategories, category];
      onFormDataChange({ category: newCategories.length === 1 ? newCategories[0] : newCategories });
    }
  };

  const removeBranch = (branch: string) => {
    onBranchChange(branch, false);
  };

  const removeCategory = (category: string) => {
    const currentCategories = Array.isArray(formData.category) ? formData.category : 
                             formData.category ? [formData.category] : [];
    const newCategories = currentCategories.filter(c => c !== category);
    onFormDataChange({ category: newCategories.length === 1 ? newCategories[0] : newCategories });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const getSelectedCategories = () => {
    if (Array.isArray(formData.category)) {
      return formData.category;
    }
    return formData.category ? [formData.category] : [];
  };

  const selectedCategories = getSelectedCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            FindMyClg - DSE College Finder 2024
          </h1>
          <p className="text-lg text-gray-600">
            Find your perfect college match based on your diploma aggregate
          </p>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6" />
              College Analysis Form
            </CardTitle>
            <CardDescription className="text-blue-100">
              Fill out your academic details to find matching colleges
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="fullName" className="text-base font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => onFormDataChange({ fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="mt-2 h-12 text-base bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="aggregate" className="text-base font-medium text-gray-700">
                    Diploma Aggregate Percentage *
                  </Label>
                  <Input
                    id="aggregate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.aggregate}
                    onChange={(e) => onFormDataChange({ aggregate: e.target.value })}
                    placeholder="Enter your aggregate percentage"
                    className="mt-2 h-12 text-base bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <Label className="text-base font-medium text-gray-700 mb-3 block">
                  Category * (Select up to 2)
                </Label>
                <Popover open={isCategoryPopoverOpen} onOpenChange={setIsCategoryPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isCategoryPopoverOpen}
                      className="w-full justify-between h-12 text-base bg-white border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
                    >
                      {selectedCategories.length === 0 ? "Select categories..." : 
                       `${selectedCategories.length} category${selectedCategories.length > 1 ? 'ies' : ''} selected`}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-white border border-gray-200 shadow-lg z-50" align="start">
                    <Command className="bg-white">
                      <CommandInput placeholder="Search categories..." className="bg-white border-none" />
                      <CommandList className="bg-white max-h-60 overflow-y-auto">
                        <CommandEmpty className="bg-white p-4 text-gray-500">No categories found.</CommandEmpty>
                        <CommandGroup className="bg-white">
                          {availableCategories.map((category) => (
                            <CommandItem
                              key={category}
                              value={category}
                              onSelect={() => handleCategoryToggle(category)}
                              className="flex items-center gap-2 cursor-pointer bg-white hover:bg-gray-50 p-3 border-b border-gray-100"
                            >
                              <div className="flex h-4 w-4 items-center justify-center">
                                {selectedCategories.includes(category) && (
                                  <Check className="h-4 w-4 text-blue-600" />
                                )}
                              </div>
                              <span className="text-gray-700">{category}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Selected Categories */}
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedCategories.map((category) => (
                      <Badge key={category} variant="secondary" className="px-3 py-1">
                        {category}
                        <button
                          type="button"
                          onClick={() => removeCategory(category)}
                          className="ml-2 hover:bg-gray-200 rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Branch Selection */}
              <div>
                <Label className="text-base font-medium text-gray-700 mb-3 block">
                  Preferred Branches *
                </Label>
                <Popover open={isBranchPopoverOpen} onOpenChange={setIsBranchPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isBranchPopoverOpen}
                      className="w-full justify-between h-12 text-base bg-white border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
                    >
                      {formData.preferredBranches.length === 0 ? "Select branches..." : 
                       `${formData.preferredBranches.length} branch${formData.preferredBranches.length > 1 ? 'es' : ''} selected`}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-white border border-gray-200 shadow-lg z-50" align="start">
                    <Command className="bg-white">
                      <CommandInput placeholder="Search branches..." className="bg-white border-none" />
                      <CommandList className="bg-white max-h-60 overflow-y-auto">
                        <CommandEmpty className="bg-white p-4 text-gray-500">No branches found.</CommandEmpty>
                        <CommandGroup className="bg-white">
                          {filteredBranches.map((branch) => (
                            <CommandItem
                              key={branch}
                              value={branch}
                              onSelect={() => handleBranchToggle(branch)}
                              className="flex items-center gap-2 cursor-pointer bg-white hover:bg-gray-50 p-3 border-b border-gray-100"
                            >
                              <div className="flex h-4 w-4 items-center justify-center">
                                {formData.preferredBranches.includes(branch) && (
                                  <Check className="h-4 w-4 text-blue-600" />
                                )}
                              </div>
                              <span className="text-gray-700">{branch}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Selected Branches */}
                {formData.preferredBranches.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.preferredBranches.map((branch) => (
                      <Badge key={branch} variant="secondary" className="px-3 py-1">
                        {branch}
                        <button
                          type="button"
                          onClick={() => removeBranch(branch)}
                          className="ml-2 hover:bg-gray-200 rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* College Type Selection */}
              <div>
                <Label className="text-base font-medium text-gray-700 mb-3 block">
                  College Types
                </Label>
                <div className="flex flex-wrap gap-3">
                  {/* Example College Types */}
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.collegeTypes.includes('Government')}
                      onChange={(e) => onCollegeTypeChange('Government', e.target.checked)}
                    />
                    <span className="text-gray-700">Government</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.collegeTypes.includes('Government Autonomous')}
                      onChange={(e) => onCollegeTypeChange('Government Autonomous', e.target.checked)}
                    />
                    <span className="text-gray-700">Government Autonomous</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.collegeTypes.includes('Private')}
                      onChange={(e) => onCollegeTypeChange('Private', e.target.checked)}
                    />
                    <span className="text-gray-700">Private</span>
                  </label>
                </div>
              </div>

              {/* City Selection */}
              <div>
                <Label className="text-base font-medium text-gray-700 mb-3 block">
                  Preferred Cities
                </Label>
                <div className="flex flex-wrap gap-3">
                  {/* Example Cities */}
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.selectedCities.includes('Mumbai')}
                      onChange={(e) => {
                        const city = 'Mumbai';
                        const isChecked = e.target.checked;
                        const updatedCities = isChecked
                          ? [...formData.selectedCities, city]
                          : formData.selectedCities.filter((c) => c !== city);
                        onCityChange(updatedCities);
                      }}
                    />
                    <span className="text-gray-700">Mumbai</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.selectedCities.includes('Pune')}
                      onChange={(e) => {
                        const city = 'Pune';
                        const isChecked = e.target.checked;
                        const updatedCities = isChecked
                          ? [...formData.selectedCities, city]
                          : formData.selectedCities.filter((c) => c !== city);
                        onCityChange(updatedCities);
                      }}
                    />
                    <span className="text-gray-700">Pune</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.selectedCities.includes('Nagpur')}
                      onChange={(e) => {
                        const city = 'Nagpur';
                        const isChecked = e.target.checked;
                        const updatedCities = isChecked
                          ? [...formData.selectedCities, city]
                          : formData.selectedCities.filter((c) => c !== city);
                        onCityChange(updatedCities);
                      }}
                    />
                    <span className="text-gray-700">Nagpur</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isAnalyzing}
                className="w-full h-14 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg transition-all duration-200"
              >
                {isAnalyzing ? "Analyzing..." : "Find My Colleges"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
