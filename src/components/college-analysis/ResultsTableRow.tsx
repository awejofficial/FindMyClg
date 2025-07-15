
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { CollegeMatch } from "./FormDataTypes";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResultsTableRowProps {
  college: CollegeMatch;
  index: number;
  studentAggregate: number;
  isShortlisted: boolean;
  onToggleShortlist: (collegeKey: string) => void;
}

export const ResultsTableRow: React.FC<ResultsTableRowProps> = ({
  college,
  index,
  studentAggregate,
  isShortlisted,
  onToggleShortlist
}) => {
  const isMobile = useIsMobile();
  
  return (
    <TableRow 
      className={`
        ${college.eligible ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'}
        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
        transition-colors duration-150
      `}
    >
      <TableCell className={`${isMobile ? 'p-2 text-xs' : 'p-3 text-sm'} font-medium`}>
        <div className="max-w-full">
          <div className="font-semibold text-foreground leading-tight break-words">
            {college.collegeName}
          </div>
        </div>
      </TableCell>
      
      <TableCell className={`${isMobile ? 'p-2 text-xs' : 'p-3 text-sm'}`}>
        <div className="font-medium text-foreground">
          {college.city}
        </div>
      </TableCell>
      
      <TableCell className={`${isMobile ? 'p-2 text-xs' : 'p-3 text-sm'}`}>
        <Badge variant="outline" className={`${isMobile ? 'text-xs px-2 py-1' : 'text-sm px-2 py-1'}`}>
          {college.collegeType}
        </Badge>
      </TableCell>
      
      <TableCell className={`${isMobile ? 'p-2 text-xs' : 'p-3 text-sm'}`}>
        <div className="max-w-full">
          <span className="font-medium text-foreground leading-tight break-words">
            {college.branch}
          </span>
        </div>
      </TableCell>

      <TableCell className={`${isMobile ? 'p-2 text-xs' : 'p-3 text-sm'}`}>
        <Badge variant="secondary" className={`${isMobile ? 'text-xs px-2 py-1' : 'text-sm px-2 py-1'}`}>
          {college.category}
        </Badge>
      </TableCell>
      
      <TableCell className={`text-center ${isMobile ? 'p-2 text-xs' : 'p-3 text-sm'}`}>
        {college.cap1Cutoff ? (
          <span className={`font-semibold ${
            college.cap1Cutoff <= studentAggregate ? 'text-green-600' : 'text-gray-600'
          }`}>
            {college.cap1Cutoff}%
          </span>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </TableCell>
      
      <TableCell className={`text-center ${isMobile ? 'p-2 text-xs' : 'p-3 text-sm'}`}>
        {college.cap2Cutoff ? (
          <span className={`font-semibold ${
            college.cap2Cutoff <= studentAggregate ? 'text-green-600' : 'text-gray-600'
          }`}>
            {college.cap2Cutoff}%
          </span>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </TableCell>
      
      <TableCell className={`text-center ${isMobile ? 'p-2 text-xs' : 'p-3 text-sm'}`}>
        {college.cap3Cutoff ? (
          <span className={`font-semibold ${
            college.cap3Cutoff <= studentAggregate ? 'text-green-600' : 'text-gray-600'
          }`}>
            {college.cap3Cutoff}%
          </span>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </TableCell>
      
      <TableCell className={`text-center ${isMobile ? 'p-2' : 'p-3'}`}>
        {college.eligible ? (
          <div className="flex items-center justify-center">
            <Check className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-green-600`} />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <X className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-red-500`} />
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};
