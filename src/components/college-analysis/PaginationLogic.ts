
import { useState, useEffect } from 'react';
import { CollegeMatch } from "./FormDataTypes";

export const usePaginationLogic = (
  filteredResults: CollegeMatch[], 
  resultsPerPage: number = 50
) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when filtered results change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredResults]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = filteredResults.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Smooth scroll to top of results
      const resultsElement = document.querySelector('[data-results-table]');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return {
    currentPage,
    totalPages,
    currentResults,
    handlePageChange,
    hasResults: filteredResults.length > 0
  };
};
