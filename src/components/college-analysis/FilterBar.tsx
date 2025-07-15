
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Search, X } from "lucide-react";

interface FilterState {
  cities: string[];
  branches: string[];
  categories: string[];
  eligibleOnly: boolean;
  searchTerm: string;
}

interface FilterBarProps {
  studentName: string;
  filteredResultsLength: number;
  eligibleCount: number;
  filters: FilterState;
  uniqueCities: string[];
  uniqueBranches: string[];
  uniqueCategories: string[];
  onRefillForm: () => void;
  onExportToPDF: () => void;
  onToggleFilter: (type: keyof FilterState, value: string | boolean) => void;
  onClearFilters: () => void;
  onSearchChange: (searchTerm: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  studentName,
  filteredResultsLength,
  eligibleCount,
  filters,
  uniqueCities,
  uniqueBranches,
  uniqueCategories,
  onRefillForm,
  onExportToPDF,
  onToggleFilter,
  onClearFilters,
  onSearchChange
}) => {
  // Filter out empty values and ensure all values are valid strings
  const validCities = uniqueCities.filter(city => city && city.trim() !== '');
  const validBranches = uniqueBranches.filter(branch => branch && branch.trim() !== '');
  const validCategories = uniqueCategories.filter(category => category && category.trim() !== '');

  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm mb-3">
      {/* Compact Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Results for {studentName}
            </h2>
            <p className="text-xs text-gray-600">
              {filteredResultsLength} total • {eligibleCount} eligible
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="outline" onClick={onRefillForm} size="sm" className="text-xs px-2 py-1 h-7">
            <RefreshCw className="w-3 h-3 mr-1" />
            New
          </Button>
          <Button onClick={onExportToPDF} size="sm" className="text-xs px-2 py-1 h-7">
            <Download className="w-3 h-3 mr-1" />
            PDF
          </Button>
        </div>
      </div>

      {/* Compact Search Bar */}
      <div className="relative mb-3">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
        <Input
          placeholder="Search colleges, branches, or cities..."
          value={filters.searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-7 h-8 text-sm"
        />
      </div>

      {/* Compact Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        {/* City Filter */}
        <div>
          <Select 
            value={filters.cities.length > 0 ? filters.cities[0] : ""} 
            onValueChange={(value) => onToggleFilter('cities', value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {validCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Branch Filter */}
        <div>
          <Select 
            value={filters.branches.length > 0 ? filters.branches[0] : ""} 
            onValueChange={(value) => onToggleFilter('branches', value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {validBranches.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div>
          <Select 
            value={filters.categories.length > 0 ? filters.categories[0] : ""} 
            onValueChange={(value) => onToggleFilter('categories', value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {validCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Eligible Only Toggle */}
        <div>
          <Button
            variant={filters.eligibleOnly ? "default" : "outline"}
            onClick={() => onToggleFilter('eligibleOnly', !filters.eligibleOnly)}
            className="w-full h-8 text-xs"
          >
            {filters.eligibleOnly ? 'Eligible ✓' : 'Show All'}
          </Button>
        </div>
      </div>

      {/* Compact Active Filters */}
      {(filters.cities.length > 0 || filters.branches.length > 0 || filters.categories.length > 0 || filters.eligibleOnly || filters.searchTerm) && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs font-medium text-gray-700">Filters:</span>
          
          {filters.searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1 text-xs px-1 py-0">
              "{filters.searchTerm}"
              <X 
                className="w-2 h-2 cursor-pointer" 
                onClick={() => onSearchChange('')}
              />
            </Badge>
          )}
          
          {filters.cities.map(city => (
            <Badge key={city} variant="secondary" className="flex items-center gap-1 text-xs px-1 py-0">
              {city}
              <X 
                className="w-2 h-2 cursor-pointer" 
                onClick={() => onToggleFilter('cities', city)}
              />
            </Badge>
          ))}
          
          {filters.branches.map(branch => (
            <Badge key={branch} variant="secondary" className="flex items-center gap-1 text-xs px-1 py-0">
              {branch}
              <X 
                className="w-2 h-2 cursor-pointer" 
                onClick={() => onToggleFilter('branches', branch)}
              />
            </Badge>
          ))}
          
          {filters.categories.map(category => (
            <Badge key={category} variant="secondary" className="flex items-center gap-1 text-xs px-1 py-0">
              {category}
              <X 
                className="w-2 h-2 cursor-pointer" 
                onClick={() => onToggleFilter('categories', category)}
              />
            </Badge>
          ))}
          
          {filters.eligibleOnly && (
            <Badge variant="secondary" className="flex items-center gap-1 text-xs px-1 py-0">
              Eligible Only
              <X 
                className="w-2 h-2 cursor-pointer" 
                onClick={() => onToggleFilter('eligibleOnly', false)}
              />
            </Badge>
          )}
          
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-5 text-xs px-1">
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};
