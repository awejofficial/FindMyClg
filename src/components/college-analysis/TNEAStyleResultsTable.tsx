
import React, { useState, useEffect } from 'react';
import { CollegeMatch } from "./FormDataTypes";
import { FilterBar } from "./FilterBar";
import { ResultsTableCore } from "./ResultsTableCore";
import { GoToTopButton } from "./GoToTopButton";
import { SummaryCard } from "./SummaryCard";
import { exportToPDF } from "./PDFExporter";
import { useFilterLogic } from "./FilterLogic";
import { usePaginationLogic } from "./PaginationLogic";

interface TNEAStyleResultsTableProps {
  results: CollegeMatch[];
  studentName: string;
  studentAggregate: number;
  onRefillForm: () => void;
}

export const TNEAStyleResultsTable: React.FC<TNEAStyleResultsTableProps> = ({ 
  results, 
  studentName,
  studentAggregate,
  onRefillForm 
}) => {
  const [showGoToTop, setShowGoToTop] = useState(false);
  const resultsPerPage = 15;

  // Use the filter logic hook
  const {
    filters,
    filteredResults,
    uniqueCities,
    uniqueBranches,
    uniqueCategories,
    eligibleCount,
    toggleFilter,
    handleSearchChange,
    clearFilters
  } = useFilterLogic(results);

  // Use the pagination logic hook
  const {
    currentPage,
    totalPages,
    currentResults,
    handlePageChange,
    totalResults,
    startIndex,
    endIndex
  } = usePaginationLogic(filteredResults, resultsPerPage);

  // Scroll detection for go-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowGoToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportToPDF = () => {
    exportToPDF(studentName, studentAggregate, filteredResults);
  };

  // Debug log to check pagination
  console.log('Pagination Debug:', {
    totalResults: filteredResults.length,
    currentPage,
    totalPages,
    currentResultsLength: currentResults.length,
    startIndex,
    endIndex,
    resultsPerPage
  });

  return (
    <div className="space-y-4">
      <FilterBar
        studentName={studentName}
        filteredResultsLength={filteredResults.length}
        eligibleCount={eligibleCount}
        filters={filters}
        uniqueCities={uniqueCities}
        uniqueBranches={uniqueBranches}
        uniqueCategories={uniqueCategories}
        onRefillForm={onRefillForm}
        onExportToPDF={handleExportToPDF}
        onToggleFilter={toggleFilter}
        onClearFilters={clearFilters}
        onSearchChange={handleSearchChange}
      />

      {/* Results Table */}
      <div className="max-w-7xl mx-auto px-2 md:px-4">
        <ResultsTableCore
          currentResults={currentResults}
          studentAggregate={studentAggregate}
          currentPage={currentPage}
          totalPages={totalPages}
          filteredResultsLength={filteredResults.length}
          resultsPerPage={resultsPerPage}
          onPageChange={handlePageChange}
        />

        <SummaryCard eligibleCount={eligibleCount} studentAggregate={studentAggregate} />
      </div>

      <GoToTopButton show={showGoToTop} onClick={scrollToTop} />
    </div>
  );
};
