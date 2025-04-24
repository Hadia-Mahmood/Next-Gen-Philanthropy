import { useEffect, useState } from "react";

const usePagination = (initialPage = 1, initialItemsPerPage = 5) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const changeItemsPerPage = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to the first page when changing items per page
  };

  const paginate = (data) => {
    const totalItems = data?.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const visibleItems =
      data !== undefined ? data?.slice(startIndex, endIndex) : [];

    return {
      currentPage,
      totalPages,
      visibleItems,
      goToPage,
      changeItemsPerPage,
    };
  };

  return paginate;
};

export default usePagination;
