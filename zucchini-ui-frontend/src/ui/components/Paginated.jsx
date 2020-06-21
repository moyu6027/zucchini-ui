import React, { memo, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Pagination from "react-bootstrap/Pagination";
import range from "lodash/range";

export default function Paginated({ itemsPerPage = 20, items, render }) {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsCount = items.length;

  const maxPage = useMemo(() => {
    return Math.max(1, Math.ceil(itemsCount / itemsPerPage));
  }, [itemsPerPage, itemsCount]);

  useEffect(() => {
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [currentPage, maxPage]);

  const selectedItems = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return items.slice(firstPageIndex, lastPageIndex);
  }, [items, itemsPerPage, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {render(selectedItems)}
      <Pager currentPage={currentPage} maxPage={maxPage} onPageChange={handlePageChange} />
    </>
  );
}

Paginated.propTypes = {
  items: PropTypes.array.isRequired,
  itemsPerPage: PropTypes.number,
  render: PropTypes.func.isRequired
};

const Pager = memo(function Pager({ currentPage, maxPage, onPageChange }) {
  const handleItemClick = (page) => (event) => {
    event.preventDefault();

    onPageChange(page);
  };

  return (
    <Pagination className="justify-content-center">
      <Pagination.First disabled={currentPage === 1} onClick={handleItemClick(1)} />
      <Pagination.Prev disabled={currentPage === 1} onClick={handleItemClick(currentPage - 1)} />
      {range(1, maxPage + 1).map((page) => (
        <Pagination.Item key={page} active={page === currentPage} onClick={handleItemClick(page)}>
          {page}
        </Pagination.Item>
      ))}
      <Pagination.Next disabled={currentPage === maxPage} onClick={handleItemClick(currentPage + 1)} />
      <Pagination.Last disabled={currentPage === maxPage} onClick={handleItemClick(maxPage)} />
    </Pagination>
  );
});

Pager.propTypes = {
  currentPage: PropTypes.number.isRequired,
  maxPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};
