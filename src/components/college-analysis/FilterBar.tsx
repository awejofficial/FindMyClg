
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RefreshCw, Download, Search, X, Filter, SortAsc, SortDesc } from "lucide-react";
import { FilterState } from "./FilterLogic";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  onSortChange?: (sortBy: string) => void;
  currentSort?: string;
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
  onSearchChange,
  onSortChange,
  currentSort = 'eligible'
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleSortChange = (value: string) => {
    if (onSortChange) {
      onSortChange(value);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm mb-6">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Results for {studentName}
              </h2>
              <p className="text-sm text-gray-600">
                {filteredResultsLength} colleges found • {eligibleCount} eligible branches
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onRefillForm}>
              <RefreshCw className="w-4 h-4 mr-1" />
              New Search
            </Button>
            <Button onClick={onExportToPDF} size="sm" className="bg-[#F7444E] hover:bg-[#F7444E]/90">
              <Download className="w-4 h-4 mr-1" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search colleges, branches, or cities..."
              value={filters.searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Sort Dropdown */}
          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-lg z-50">
              <SelectItem value="eligible" className="bg-white hover:bg-gray-50">
                Eligibility First
              </SelectItem>
              <SelectItem value="cutoff-asc" className="bg-white hover:bg-gray-50">
                Cutoff: Low to High
              </SelectItem>
              <SelectItem value="cutoff-desc" className="bg-white hover:bg-gray-50">
                Cutoff: High to Low
              </SelectItem>
              <SelectItem value="name-asc" className="bg-white hover:bg-gray-50">
                Name: A to Z
              </SelectItem>
              <SelectItem value="name-desc" className="bg-white hover:bg-gray-50">
                Name: Z to A
              </SelectItem>
              <SelectItem value="city-asc" className="bg-white hover:bg-gray-50">
                City: A to Z
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Eligible Only */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={filters.eligibleOnly}
                    onChange={(e) => onToggleFilter('eligibleOnly', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Show Only Eligible
                </label>
              </div>

              {/* City Filter */}
              <div>
                <Select 
                  value={filters.cities.length > 0 ? filters.cities[0] : "all"}
                  onValueChange={(value) => onToggleFilter('cities', value)}
                >
                  <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg z-50">
                    <SelectItem value="all" className="bg-white hover:bg-gray-50">All Cities</SelectItem>
                    {uniqueCities.map(city => (
                      <SelectItem key={city} value={city} className="bg-white hover:bg-gray-50">
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Branch Filter */}
              <div>
                <Select 
                  value={filters.branches.length > 0 ? filters.branches[0] : "all"}
                  onValueChange={(value) => onToggleFilter('branches', value)}
                >
                  <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg z-50">
                    <SelectItem value="all" className="bg-white hover:bg-gray-50">All Branches</SelectItem>
                    {uniqueBranches.map(branch => (
                      <SelectItem key={branch} value={branch} className="bg-white hover:bg-gray-50">
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div>
                <Select 
                  value={filters.categories.length > 0 ? filters.categories[0] : "all"}
                  onValueChange={(value) => onToggleFilter('categories', value)}
                >
                  <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg z-50">
                    <SelectItem value="all" className="bg-white hover:bg-gray-50">All Categories</SelectItem>
                    {uniqueCategories.map(category => (
                      <SelectItem key={category} value={category} className="bg-white hover:bg-gray-50">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.eligibleOnly && (
            <Badge variant="secondary" className="px-2 py-1">
              Eligible Only
              <button
                onClick={() => onToggleFilter('eligibleOnly', false)}
                className="ml-2 hover:bg-gray-200 rounded-full p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.cities.map(city => (
            <Badge key={city} variant="secondary" className="px-2 py-1">
              City: {city}
              <button
                onClick={() => onToggleFilter('cities', city)}
                className="ml-2 hover:bg-gray-200 rounded-full p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.branches.map(branch => (
            <Badge key={branch} variant="secondary" className="px-2 py-1">
              Branch: {branch}
              <button
                onClick={() => onToggleFilter('branches', branch)}
                className="ml-2 hover:bg-gray-200 rounded-full p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.categories.map(category => (
            <Badge key={category} variant="secondary" className="px-2 py-1">
              Category: {category}
              <button
                onClick={() => onToggleFilter('categories', category)}
                className="ml-2 hover:bg-gray-200 rounded-full p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
