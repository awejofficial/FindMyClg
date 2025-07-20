import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle, AlertTriangle, Heart, Download, Filter } from "lucide-react";
import { CollegeMatch } from "./FormDataTypes";
import { exportSmartStrategyToPDF } from "./SmartStrategyPDFExporter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SmartStrategyProps {
  results: CollegeMatch[];
  studentName: string;
  studentAggregate: number;
  onClose: () => void;
}

interface StrategyMatch extends CollegeMatch {
  tag: 'best-fit' | 'safe' | 'low-quality' | 'dream';
  qualityRatio: number;
  cutoffDifference: number;
  bestCutoff: number;
}

export const SmartStrategy: React.FC<SmartStrategyProps> = ({
  results,
  studentName,
  studentAggregate,
  onClose
}) => {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedCollegeTypes, setSelectedCollegeTypes] = useState<string[]>([]);

  // Calculate strategy matches
  const strategyMatches = useMemo(() => {
    return results.map(college => {
      const bestCutoff = college.cap1Cutoff || college.cap2Cutoff || college.cap3Cutoff || 0;
      const cutoffDifference = studentAggregate - bestCutoff;
      const qualityRatio = bestCutoff > 0 ? studentAggregate / bestCutoff : 0;
      
      let tag: 'best-fit' | 'safe' | 'low-quality' | 'dream';
      
      if (Math.abs(cutoffDifference) <= 2) {
        tag = 'best-fit';
      } else if (cutoffDifference >= 3 && cutoffDifference <= 7) {
        tag = 'safe';
      } else if (cutoffDifference >= 10) {
        tag = 'low-quality';
      } else {
        tag = 'dream';
      }

      return {
        ...college,
        tag,
        qualityRatio,
        cutoffDifference,
        bestCutoff
      } as StrategyMatch;
    });
  }, [results, studentAggregate]);

  // Get unique options for filters
  const uniqueCities = Array.from(new Set(strategyMatches.map(m => m.city))).sort();
  const uniqueBranches = Array.from(new Set(strategyMatches.map(m => m.branch))).sort();
  const uniqueCollegeTypes = Array.from(new Set(strategyMatches.map(m => m.collegeType))).sort();

  // Apply filters
  const filteredMatches = strategyMatches.filter(match => {
    if (selectedCities.length > 0 && !selectedCities.includes(match.city)) return false;
    if (selectedBranches.length > 0 && !selectedBranches.includes(match.branch)) return false;
    if (selectedCollegeTypes.length > 0 && !selectedCollegeTypes.includes(match.collegeType)) return false;
    return true;
  });

  // Group by strategy tag
  const groupedMatches = {
    'best-fit': filteredMatches.filter(m => m.tag === 'best-fit'),
    'safe': filteredMatches.filter(m => m.tag === 'safe'),
    'low-quality': filteredMatches.filter(m => m.tag === 'low-quality'),
    'dream': filteredMatches.filter(m => m.tag === 'dream')
  };

  const getTagConfig = (tag: string) => {
    switch (tag) {
      case 'best-fit':
        return { 
          icon: Target, 
          color: 'bg-green-500/10 text-green-700 border-green-200',
          title: '🎯 Best Fit',
          description: 'Perfect academic match. Highly recommended.'
        };
      case 'safe':
        return { 
          icon: CheckCircle, 
          color: 'bg-blue-500/10 text-blue-700 border-blue-200',
          title: '🟢 Safe Option',
          description: 'Easier to get in, still relevant to your level.'
        };
      case 'low-quality':
        return { 
          icon: AlertTriangle, 
          color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
          title: '⚠️ Low Quality Match',
          description: 'Too easy. Eligible but not recommended due to low-quality peer group.'
        };
      case 'dream':
        return { 
          icon: Heart, 
          color: 'bg-red-500/10 text-red-700 border-red-200',
          title: '🔴 Dream Option',
          description: 'Cutoff is higher than your marks. Risky.'
        };
      default:
        return { 
          icon: Target, 
          color: 'bg-gray-500/10 text-gray-700 border-gray-200',
          title: 'Unknown',
          description: ''
        };
    }
  };

  const handleExportPDF = () => {
    exportSmartStrategyToPDF(studentName, studentAggregate, filteredMatches);
  };

  const toggleCityFilter = (city: string) => {
    setSelectedCities(prev => 
      prev.includes(city) 
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  const toggleBranchFilter = (branch: string) => {
    setSelectedBranches(prev => 
      prev.includes(branch) 
        ? prev.filter(b => b !== branch)
        : [...prev, branch]
    );
  };

  const toggleCollegeTypeFilter = (type: string) => {
    setSelectedCollegeTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002C3E] to-[#78BCC4] text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">🎯 Smart DSE Strategy Report - 2024</h2>
              <p className="text-white/90">Personalized recommendations for {studentName} (Your Score: {studentAggregate}%)</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleExportPDF}
                variant="secondary" 
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button 
                onClick={onClose}
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                Close
              </Button>
            </div>
          </div>
        </div>

        {/* Strategy Explanation */}
        <div className="p-6 bg-[#F7F8F3] border-b">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Strategy Categories Explained
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {Object.entries(getTagConfig('')).slice(0, 4).map((_, idx) => {
              const tags = ['best-fit', 'safe', 'low-quality', 'dream'];
              const config = getTagConfig(tags[idx]);
              return (
                <div key={tags[idx]} className={`p-3 rounded border ${config.color}`}>
                  <div className="font-medium">{config.title}</div>
                  <div className="text-xs mt-1">{config.description}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 bg-white border-b">
          <h3 className="font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* City Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Cities</Label>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {uniqueCities.map(city => (
                  <div key={city} className="flex items-center space-x-2">
                    <Checkbox
                      id={`city-${city}`}
                      checked={selectedCities.includes(city)}
                      onCheckedChange={() => toggleCityFilter(city)}
                    />
                    <Label htmlFor={`city-${city}`} className="text-sm">{city}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Branch Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Branches</Label>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {uniqueBranches.map(branch => (
                  <div key={branch} className="flex items-center space-x-2">
                    <Checkbox
                      id={`branch-${branch}`}
                      checked={selectedBranches.includes(branch)}
                      onCheckedChange={() => toggleBranchFilter(branch)}
                    />
                    <Label htmlFor={`branch-${branch}`} className="text-sm">{branch}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* College Type Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">College Types</Label>
              <div className="space-y-2">
                {uniqueCollegeTypes.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={selectedCollegeTypes.includes(type)}
                      onCheckedChange={() => toggleCollegeTypeFilter(type)}
                    />
                    <Label htmlFor={`type-${type}`} className="text-sm">{type}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results by Category */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {Object.entries(groupedMatches).map(([tag, matches]) => {
            if (matches.length === 0) return null;
            
            const config = getTagConfig(tag);
            const IconComponent = config.icon;
            
            return (
              <Card key={tag} className="mb-6">
                <CardHeader className={`${config.color} rounded-t-lg`}>
                  <CardTitle className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5" />
                    {config.title} ({matches.length} colleges)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">College</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Branch</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">City</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Cutoff %</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Your %</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Ratio</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Warning</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matches.map((match, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm">{match.collegeName}</td>
                            <td className="px-4 py-2 text-sm">{match.branch}</td>
                            <td className="px-4 py-2 text-sm">{match.city}</td>
                            <td className="px-4 py-2 text-sm">{match.collegeType}</td>
                            <td className="px-4 py-2 text-sm font-medium">{match.bestCutoff}%</td>
                            <td className="px-4 py-2 text-sm font-medium text-blue-600">{studentAggregate}%</td>
                            <td className="px-4 py-2 text-sm">{match.qualityRatio.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm">
                              {match.tag === 'low-quality' && match.qualityRatio >= 1.3 && (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  Too Low Cutoff for You
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};