import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const btnBase =
    'flex items-center justify-center size-9 rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-primary-700 focus-visible:ring-offset-2';
  const btnNav = `${btnBase} border-custom-neutral-300 text-custom-neutral-800 hover:bg-custom-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-custom-neutral-500 dark:text-custom-neutral-100 dark:hover:bg-custom-neutral-700`;
  const btnPage = (p: number) =>
    p === page
      ? `${btnBase} border-custom-primary-700 bg-custom-primary-700 text-white`
      : `${btnBase} border-custom-neutral-300 text-custom-neutral-800 text-sm font-semibold hover:bg-custom-neutral-100 dark:border-custom-neutral-500 dark:text-custom-neutral-100 dark:hover:bg-custom-neutral-700`;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={btnNav}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={btnPage(p)}
          aria-label={`Page ${p}`}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={btnNav}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </nav>
  );
};

export { Pagination };
