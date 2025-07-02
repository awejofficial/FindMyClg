
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AcademicDetailsStepProps {
  aggregate: string;
  category: string;
  availableCategories: string[];
  onAggregateChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export const AcademicDetailsStep: React.FC<AcademicDetailsStepProps> = ({
  aggregate,
  category,
  availableCategories,
  onAggregateChange,
  onCategoryChange
}) => {
  // Filter out any empty or invalid categories
  const validCategories = availableCategories.filter(cat => cat && cat.trim() !== '');

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
            <Label htmlFor="category" className="text-card-foreground">Category</Label>
            <select
              id="category"
              className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="" disabled>Select your category</option>
              {validCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {validCategories.length === 0 && (
              <p className="text-sm text-destructive bg-destructive/10 p-2 rounded border border-destructive/30">
                No categories available. Please contact admin to upload cutoff data.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
