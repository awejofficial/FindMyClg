
import { useState, useEffect, useMemo } from 'react';
import { CollegeMatch } from "./FormDataTypes";

export const usePaginationLogic = (
  filteredResults: CollegeMatch[], 
  resultsPerPage: number = 35
) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when filtered results change
  useEffect(() => {
    console.log('Filtered results changed, resetting to page 1');
    setCurrentPage(1);
  }, [filteredResults.length]);

  // Memoize pagination calculations for performance
  const paginationData = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filteredResults.length / resultsPerPage));
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const currentResults = filteredResults.slice(startIndex, endIndex);

    console.log('Pagination Data:', {
      totalResults: filteredResults.length,
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      currentResultsLength: currentResults.length,
      resultsPerPage
    });

    return {
      totalPages,
      startIndex,
      endIndex,
      currentResults
    };
  }, [filteredResults, currentPage, resultsPerPage]);

  const handlePageChange = (page: number) => {
    console.log('Page change requested:', page, 'of', paginationData.totalPages);
    
    if (page >= 1 && page <= paginationData.totalPages && page !== currentPage) {
      console.log('Setting current page to:', page);
      setCurrentPage(page);
      
      // Smooth scroll to top of results
      setTimeout(() => {
        const resultsElement = document.querySelector('[data-results-table]');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      console.log('Invalid page change request:', page);
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
