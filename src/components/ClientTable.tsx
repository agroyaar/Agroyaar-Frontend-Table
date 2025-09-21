import { useState } from "react";
import { Column, TableFilters, TableSort } from "../types";
import { useClient } from "../hooks/useClient";
import { Header } from "./Header";
import React from "react";
import { Pagination } from "./Pagination";
import { Body } from "./Body";

interface ClientTableProps<T> {
  columns: Column<T>[];
  data?: T[];
  rowsPerPage: number;
  direction: "rtl" | "ltr";
}

export const ClientTable = <T,>({
  columns,
  data,
  rowsPerPage,
  direction,
}: ClientTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState<TableSort<T>>(null);
  const [filters, setFilters] = useState<TableFilters<T>>({});

  const [filteredData, paginatedData] = useClient(
    columns,
    data!,
    rowsPerPage,
    currentPage,
    currentSort,
    filters
  );

  const filterChangeHandler = (filters: TableFilters<T>) => {
    setFilters(filters);
    setCurrentPage(1);
  };

  const sortChangeHandler = (sort: TableSort<T>) => {
    setCurrentSort(sort);
    setCurrentPage(1);
  };

  const pageChangeHandler = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="table-container" dir="rtl">
      <table>
        <Header
          columns={columns}
          onFilterChange={filterChangeHandler}
          onSortChange={sortChangeHandler}
        />
        <Body columns={columns} data={paginatedData} mode="client" />
      </table>
      <Pagination
        data={filteredData}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        mode="client"
        onPageChange={pageChangeHandler}
        direction={direction}
      />
    </div>
  );
};
