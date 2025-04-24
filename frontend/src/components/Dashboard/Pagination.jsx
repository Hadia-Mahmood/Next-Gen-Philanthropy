import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-end mt-3 font-poppins">
      <button
        className="mr-2 py-[10px] pr-[11px] pl-[10px] text-[18px] text-[#fff] bg-[#296d8d] rounded-full"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaChevronLeft />
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          className={`mx-2 text-[15px] py-[8px] px-[15px] rounded-full ${
            currentPage === number ? "bg-[#b6b6b6] " : ""
          }`}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}

      <button
        className="ml-2 py-[10px] pr-[10px] pl-[11px] text-[18px] text-[#fff] bg-[#296d8d] border rounded-full"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
