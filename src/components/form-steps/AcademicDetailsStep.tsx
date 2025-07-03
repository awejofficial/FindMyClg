
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AcademicDetailsStepProps {
  aggregate: string;
  category: string;
  availableCategories: string[];
  onAggregateChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

// Category information mapping
const categoryInfo: Record<string, string> = {
  'OPEN': 'General Open - No reservation',
  'GOPEN': 'General Open - No reservation',
  'OBC': 'Other Backward Classes',
  'GOBC': 'General Other Backward Classes',
  'LOBC': 'Local Other Backward Classes',
  'SC': 'Scheduled Caste',
  'GSC': 'General Scheduled Caste',
  'LSC': 'Local Scheduled Caste',
  'ST': 'Scheduled Tribe',
  'GST': 'General Scheduled Tribe',
  'LST': 'Local Scheduled Tribe',
  'NT': 'Nomadic Tribe',
  'GNT': 'General Nomadic Tribe',
  'GNTA': 'General Nomadic Tribe A',
  'GNTB': 'General Nomadic Tribe B',
  'GNTC': 'General Nomadic Tribe C',
  'GNTD': 'General Nomadic Tribe D',
  'LNT': 'Local Nomadic Tribe',
  'LNTA': 'Local Nomadic Tribe A',
  'LNTB': 'Local Nomadic Tribe B',
  'LNTC': 'Local Nomadic Tribe C',
  'LNTD': 'Local Nomadic Tribe D',
  'SEBC': 'Socially and Educationally Backward Classes',
  'GSEBC': 'General Socially and Educationally Backward Classes',
  'LSEBC': 'Local Socially and Educationally Backward Classes',
  'EWS': 'Economically Weaker Section',
  'CEWS': 'Central Economically Weaker Section',
  'PWD': 'Person with Disability',
  'PWD-O': 'Person with Disability - Open',
  'PWD-OBC': 'Person with Disability - OBC',
  'PWDR-OBC': 'Person with Disability Reserved - OBC',
  'PWDR-SC': 'Person with Disability Reserved - SC',
  'PWDR-SEBC': 'Person with Disability Reserved - SEBC',
  'MI': 'Minority',
  'MI-MH': 'Minority - Maharashtra',
  'DEF': 'Defense',
  'DEF-O': 'Defense - Open',
  'DEF-OBC': 'Defense - OBC',
  'DEFR-OBC': 'Defense Reserved - OBC',
  'DEFR-SEBC': 'Defense Reserved - SEBC'
};

export const AcademicDetailsStep: React.FC<AcademicDetailsStepProps> = ({
  aggregate,
  category,
  availableCategories,
  onAggregateChange,
  onCategoryChange
}) => {
  // Filter out any empty or invalid categories
  const validCategories = availableCategories.filter(cat => cat && cat.trim() !== '');

  const getCategoryInfo = (cat: string) => {
    return categoryInfo[cat] || `${cat} category`;
  };

  return (
    <Card className="bg-card border-border shadow-sm text-card-foreground">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-card-foreground">Academic Details</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your percentage and category.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="grid gap-2">
            <Label htmlFor="aggregate" className="text-card-foreground">Aggregate Percentage</Label>
            <Input
              id="aggregate"
              type="number"
              step="0.01"
              placeholder="Enter your percentage (e.g., 82.02)"
              value={aggregate}
              onChange={(e) => onAggregateChange(e.target.value)}
              className="bg-input border-border text-foreground focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="category" className="text-card-foreground">Category</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">Select your reservation category. Each category has specific eligibility criteria and cutoff requirements.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <select
              id="category"
              className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="" disabled>Select your category</option>
              <option value="ALL">All Categories (Show all cutoffs)</option>
              {validCategories.map((cat) => (
                <option key={cat} value={cat} title={getCategoryInfo(cat)}>
                  {cat} - {getCategoryInfo(cat)}
                </option>
              ))}
            </select>
            {validCategories.length === 0 && (
              <p className="text-sm text-destructive bg-destructive/10 p-2 rounded border border-destructive/30">
                No categories available. Please contact admin to upload cutoff data.
              </p>
            )}
            {category && category !== "ALL" && (
              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border">
                <strong>{category}:</strong> {getCategoryInfo(category)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
