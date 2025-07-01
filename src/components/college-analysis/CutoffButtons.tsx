
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const CutoffButtons: React.FC = () => {
  const openCutoffRound = (round: string) => {
    // These would be the actual DTE Maharashtra cutoff URLs
    const urls = {
      'CAP1': 'https://dte.maharashtra.gov.in',
      'CAP2': 'https://dte.maharashtra.gov.in', 
      'CAP3': 'https://dte.maharashtra.gov.in'
    };
    
    window.open(urls[round as keyof typeof urls], '_blank');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Data Source:</span> Official DTE Maharashtra CAP Cutoffs (2024-25)
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:block">View Official Cutoffs:</span>
          {['CAP1', 'CAP2', 'CAP3'].map((round) => (
            <Button
              key={round}
              variant="outline"
              size="sm"
              onClick={() => openCutoffRound(round)}
              className="text-xs px-3 py-1 h-8"
            >
              {round}
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
