
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

export const CutoffButtons: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

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
    <div className="bg-card border border-border rounded-lg mb-2">
      {/* Compact Header */}
      <div className="flex items-center justify-between p-2">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs h-6 px-2"
        >
          <span className="font-medium">Data Source</span>
          {isExpanded ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </Button>
        
        {/* Quick access buttons when collapsed */}
        {!isExpanded && (
          <div className="flex items-center gap-1">
            {['CAP1', 'CAP2', 'CAP3'].map((round) => (
              <Button
                key={round}
                variant="outline"
                size="sm"
                onClick={() => openCutoffRound(round)}
                className="text-xs px-1 py-0 h-5"
              >
                {round}
                <ExternalLink className="w-2 h-2 ml-1" />
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-2 pb-2 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2">
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Official Source:</span> DTE Maharashtra CAP Cutoffs (2024-25)
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">View Rounds:</span>
              {['CAP1', 'CAP2', 'CAP3'].map((round) => (
                <Button
                  key={round}
                  variant="outline"
                  size="sm"
                  onClick={() => openCutoffRound(round)}
                  className="text-xs px-2 py-1 h-6"
                >
                  {round}
                  <ExternalLink className="w-2 h-2 ml-1" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
