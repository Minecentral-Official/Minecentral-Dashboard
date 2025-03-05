import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useResourceFilterContext } from '@/features/resources/context/resource-filter.context';

export function ResourceFilterPage() {
  const {
    page: currentPage,
    setPage: setCurrentPage,
    totalPages,
  } = useResourceFilterContext();

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    // Add current page and surrounding pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 2 && currentPage > 3) {
        pageNumbers.push('ellipsis-start');
      } else if (!pageNumbers.includes(i) && i !== 1 && i !== totalPages) {
        pageNumbers.push(i);
      }
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2 && totalPages > 4) {
      pageNumbers.push('ellipsis-end');
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  if (pageNumbers.length <= 1) return <></>;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href='#'
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) setCurrentPage(currentPage - 1);
            }}
            className={
              currentPage === 1 ? 'pointer-events-none opacity-50' : ''
            }
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href='#'
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(page as number);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href='#'
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
            }}
            className={
              currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
