import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  pageNumbersToShow,
}) => {
  return (
    <div className="my-4 md:my-12 flex justify-center py-2">
      <nav
        className="relative z-0 inline-flex -space-x-px"
        aria-label="Pagination"
      >
        <button
          className="relative inline-flex items-center px-4 py-2 bg-white text-lg font-medium text-gray-500 hover:text-white"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft
            className={`w-4 h-[12px] ${
              currentPage === 1 ? "text-[#00000080]" : "text-[#000000]"
            }`}
          />
        </button>

        {pageNumbersToShow?.map((number) => (
          <button
            key={number}
            className={`${
              currentPage === number
                ? "text-[#00CE3A]"
                : "text-black hover:text-[#00CE3A]"
            } relative inline-flex items-center px-4 py-2 bg-white font-semibold text-[16px]`}
            onClick={() => onPageChange(number)}
          >
            {number}
          </button>
        ))}

        <button
          className="relative inline-flex items-center px-4 py-2 bg-white text-lg font-medium text-gray-500 hover:text-white"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight
            className={`w-4 h-[12px] ${
              currentPage === totalPages ? "text-[#00000080]" : "text-[#000000]"
            }`}
          />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
