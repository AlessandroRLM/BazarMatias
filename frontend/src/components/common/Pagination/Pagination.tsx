import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { iconButtonClasses } from '@mui/joy/IconButton';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  showMobile?: boolean;
  showDesktop?: boolean;
  isLoading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showMobile = true,
  showDesktop = true,
  isLoading = false,
}: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftOffset = Math.floor(maxVisiblePages / 2);
      const rightOffset = Math.ceil(maxVisiblePages / 2) - 1;

      let startPage = currentPage - leftOffset;
      let endPage = currentPage + rightOffset;

      if (startPage < 1) {
        startPage = 1;
        endPage = maxVisiblePages;
      }

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = totalPages - maxVisiblePages + 1;
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages.map((page, index) => (
      <IconButton
        key={index}
        size="sm"
        variant={page === currentPage ? 'soft' : 'plain'}
        color={page === currentPage ? 'primary' : 'neutral'}
        onClick={() => typeof page === 'number' && onPageChange(page)}
        disabled={page === '...' || isLoading}
      >
        {page}
      </IconButton>
    ));
  };

  return (
    <>
      {/* Versión móvil */}
      {showMobile && (
        <Box
          className="Pagination-mobile"
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            py: 2,
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <IconButton
            aria-label="previous page"
            variant="outlined"
            color="neutral"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 1 || isLoading}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
          <Typography level="body-sm" sx={{ mx: 'auto' }}>
            Página {currentPage} de {totalPages}
            {totalItems && itemsPerPage && (
              <Typography level="body-xs" component="span" sx={{ display: 'block', textAlign: 'center' }}>
                Mostrando {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}
              </Typography>
            )}
          </Typography>
          <IconButton
            aria-label="next page"
            variant="outlined"
            color="neutral"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages || isLoading}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Box>
      )}

      {/* Versión desktop */}
      {showDesktop && (
        <Box
          className="Pagination-laptopUp"
          sx={{
            pt: 2,
            gap: 1,
            [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
            display: {
              xs: 'none',
              md: 'flex',
            },
            justifyContent: 'center',
          }}
        >
          <Button
            size="sm"
            variant="outlined"
            color="neutral"
            startDecorator={<KeyboardArrowLeftIcon />}
            onClick={handlePrevious}
            disabled={currentPage === 1 || isLoading}
            loading={isLoading}
          >
            Anterior
          </Button>

          <Box sx={{ flex: 1 }} />
          {renderPageNumbers()}
          <Box sx={{ flex: 1 }} />

          <Button
            size="sm"
            variant="outlined"
            color="neutral"
            endDecorator={<KeyboardArrowRightIcon />}
            onClick={handleNext}
            disabled={currentPage === totalPages || isLoading}
            loading={isLoading}
          >
            Siguiente
          </Button>
        </Box>
      )}
    </>
  );
}