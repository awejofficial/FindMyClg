
import React, { memo } from 'react';
import { ResultsTableRow } from "./ResultsTableRow";
import { CollegeMatch } from "./FormDataTypes";

interface LazyResultsTableRowProps {
  college: CollegeMatch;
  index: number;
  studentAggregate: number;
}

export const LazyResultsTableRow = memo<LazyResultsTableRowProps>(({ 
  college, 
  index, 
  studentAggregate 
}) => {
  return (
    <ResultsTableRow
      college={college}
      index={index}
      studentAggregate={studentAggregate}
      isShortlisted={false}
      onToggleShortlist={() => {}} // Disabled
    />
  );
});

LazyResultsTableRow.displayName = 'LazyResultsTableRow';
