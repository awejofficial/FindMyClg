
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CollegeMatch } from "./FormDataTypes";
import { useIsMobile } from "@/hooks/use-mobile";
import { LazyResultsTableRow } from "./LazyResultsTableRow";
import { PaginationControls } from "@/components/PaginationControls";

interface ResultsTableCoreProps {
  currentResults: CollegeMatch[];
  studentAggregate: number;
  currentPage: number;
  totalPages: number;
  filteredResultsLength: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
}

export const ResultsTableCore: React.FC<ResultsTableCoreProps> = ({
  currentResults,
  studentAggregate,
  currentPage,
  totalPages,
  filteredResultsLength,
  resultsPerPage,
  onPageChange
}) => {
  const isMobile = useIsMobile();

  console.log('ResultsTableCore render:', {
    currentResultsLength: currentResults.length,
    totalPages,
    currentPage,
    filteredResultsLength,
    resultsPerPage
  });

  return (
    <div className="bg-white rounded-lg border overflow-hidden" data-results-table>
      {/* Mobile: Horizontal scroll container */}
      <div className="overflow-x-auto">
        <div className={isMobile ? "min-w-[800px]" : ""}>
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow>
                <TableHead className={`font-medium ${isMobile ? 'min-w-[200px]' : ''} p-1 md:p-2`}>College</TableHead>
                <TableHead className={`font-medium ${isMobile ? 'w-16' : 'w-24'} p-1 md:p-2`}>City</TableHead>
                <TableHead className={`font-medium ${isMobile ? 'w-16' : 'w-20'} p-1 md:p-2`}>Type</TableHead>
                <TableHead className={`font-medium ${isMobile ? 'min-w-[120px]' : ''} p-1 md:p-2`}>Branch</TableHead>
                <TableHead className={`font-medium ${isMobile ? 'w-16' : 'w-20'} p-1 md:p-2`}>Category</TableHead>
                <TableHead className={`text-center font-medium ${isMobile ? 'w-12' : 'w-16'} p-1 md:p-2`}>CAP1</TableHead>
                <TableHead className={`text-center font-medium ${isMobile ? 'w-12' : 'w-16'} p-1 md:p-2`}>CAP2</TableHead>
                <TableHead className={`text-center font-medium ${isMobile ? 'w-12' : 'w-16'} p-1 md:p-2`}>CAP3</TableHead>
                <TableHead className={`text-center font-medium ${isMobile ? 'w-16' : 'w-20'} p-1 md:p-2`}>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentResults.length > 0 ? (
                currentResults.map((college, index) => {
                  const globalIndex = ((currentPage - 1) * resultsPerPage) + index;
                  const collegeKey = `${college.collegeName}-${college.branch}-${college.category}-${globalIndex}`;
                  
                  return (
                    <LazyResultsTableRow
                      key={collegeKey}
                      college={college}
                      index={globalIndex}
                      studentAggregate={studentAggregate}
                    />
                  );
                })
              ) : (
                <TableRow>
                  <td colSpan={9} className="text-center py-8 text-gray-500">
                    No results found. Try adjusting your filters.
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls - Always show when there are results */}
      {filteredResultsLength > 0 && (
        <div className="p-4 border-t bg-gray-50">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalResults={filteredResultsLength}
            resultsPerPage={resultsPerPage}
          />
        </div>
      )}
    </div>
  );
};
