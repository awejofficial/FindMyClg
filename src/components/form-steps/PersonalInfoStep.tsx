
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PersonalInfoStepProps {
  fullName: string;
  onFullNameChange: (value: string) => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  fullName,
  onFullNameChange
}) => {
  return (
    <Card className="bg-card border-border text-card-foreground hover:border-secondary/50">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-card-foreground">Personal Information</CardTitle>
        <CardDescription className="text-muted-foreground">
          Tell us about yourself for personalized college recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-card-foreground">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              className="bg-input border-border text-foreground focus:border-primary focus:ring-primary hover:border-secondary/50"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
