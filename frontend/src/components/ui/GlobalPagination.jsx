import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function GlobalPagination({
  query,
  renderContent,
  extractKey = 'data', // Default extraction key
  pageSize = 10,
  onPageChange,
  showPageNumbers = true,
  paginationControles = true,
  paginationClassName = '',
  loadingComponent = <div className="py-8 text-center">Loading...</div>,
  emptyComponent = <div className="py-8 text-center">No items found</div>,
  errorComponent = <div className="py-8 text-center text-red-500">Error loading data</div>,
}) {
  const { data, isLoading, isError, error } = query;

  // Extract items dynamically based on the extractKey
  const extractedItems = data?.[extractKey] || data || [];

  // Use pagination from data or calculate based on extracted items
  const pagination = data?.pagination || {};
  const totalItems = pagination.total || extractedItems.length;
  const totalPages = pagination.pages || Math.ceil(totalItems / pageSize);
  const currentPage = pagination.page || 1;

  // Page navigation handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  // Generate page numbers
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  // Render content based on query state
  const renderQueryContent = () => {
    if (isLoading) return loadingComponent;
    if (isError)
      return typeof errorComponent === 'function' ? errorComponent(error) : errorComponent;

    if (extractedItems.length === 0) return emptyComponent;

    return renderContent(extractedItems);
  };

  // Don't render pagination if no data or single page
  if (totalPages <= 1) {
    return renderQueryContent();
  }

  return (
    <div className="w-full">
      {/* Content area */}
      <div className="w-full">{renderQueryContent()}</div>

      {/* Pagination controls */}
      {paginationControles && (
        <div
          className={`flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 ${paginationClassName}`}
        >
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{extractedItems.length}</span> results
                {totalItems > 0 && (
                  <>
                    {' '}
                    of <span className="font-medium">{totalItems}</span>
                  </>
                )}
                , page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                {/* Previous button */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                    currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Page numbers */}
                {showPageNumbers &&
                  generatePageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === '...' ? (
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                          ...
                        </span>
                      ) : (
                        <button
                          onClick={() => goToPage(page)}
                          className={`relative mx-1 inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === page
                              ? 'border-2 border-orange-500 text-black'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}

                {/* Next button */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                    currentPage >= totalPages ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GlobalPagination;
