
import { useState, useEffect, useMemo } from 'react';
import { CollegeMatch } from "./FormDataTypes";

export const usePaginationLogic = (
  filteredResults: CollegeMatch[], 
  resultsPerPage: number = 35
) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when filtered results change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredResults]);

  // Memoize pagination calculations for performance
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const currentResults = filteredResults.slice(startIndex, endIndex);

    return {
      totalPages,
      startIndex,
      endIndex,
      currentResults
    };
  }, [filteredResults, currentPage, resultsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= paginationData.totalPages) {
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
    totalPages: paginationData.totalPages,
    currentResults: paginationData.currentResults,
    handlePageChange,
    hasResults: filteredResults.length > 0,
    totalResults: filteredResults.length,
    startIndex: paginationData.startIndex + 1,
    endIndex: Math.min(paginationData.endIndex, filteredResults.length)
  };
};
