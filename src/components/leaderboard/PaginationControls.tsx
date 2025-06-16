
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false
}) => {
  const handlePageChange = (page: number) => {
    if (!isLoading && page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className={`cursor-pointer ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Smart pagination with ellipsis
      if (currentPage <= 4) {
        // Show first 5 pages, ellipsis, last page
        for (let i = 1; i <= 5; i++) {
          pages.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                className={`cursor-pointer ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        pages.push(<PaginationEllipsis key="ellipsis1" />);
        pages.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              className={`cursor-pointer ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (currentPage >= totalPages - 3) {
        // Show first page, ellipsis, last 5 pages
        pages.push(
          <PaginationItem key={1}>
            <PaginationLink
              onClick={() => handlePageChange(1)}
              className={`cursor-pointer ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              1
            </PaginationLink>
          </PaginationItem>
        );
        pages.push(<PaginationEllipsis key="ellipsis2" />);
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                className={`cursor-pointer ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      } else {
        // Show first page, ellipsis, current page +/- 1, ellipsis, last page
        pages.push(
          <PaginationItem key={1}>
            <PaginationLink
              onClick={() => handlePageChange(1)}
              className={`cursor-pointer ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              1
            </PaginationLink>
          </PaginationItem>
        );
        pages.push(<PaginationEllipsis key="ellipsis3" />);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                className={`cursor-pointer ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        pages.push(<PaginationEllipsis key="ellipsis4" />);
        pages.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              className={`cursor-pointer ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              className={`cursor-pointer ${
                currentPage === 1 || isLoading 
                  ? 'opacity-50 pointer-events-none' 
                  : 'hover:bg-gray-100'
              }`}
            />
          </PaginationItem>
          
          {renderPageNumbers()}
          
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={`cursor-pointer ${
                currentPage === totalPages || isLoading 
                  ? 'opacity-50 pointer-events-none' 
                  : 'hover:bg-gray-100'
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationControls;
