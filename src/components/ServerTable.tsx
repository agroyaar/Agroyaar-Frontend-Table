import { useState } from "react";
import React from "react";
import {
  AsyncResult,
  Column,
  ListServerResponse,
  TableFilters,
  TableSort,
} from "../types";
import { Header } from "./Header";
import { Body } from "./Body";
import { Pagination } from "./Pagination";

interface ServerTableProps<T> {
  columns: Column<T>[];
  queryResult?: AsyncResult<ListServerResponse<T> | undefined>;
  rowsPerPage?: number;
  direction: "rtl" | "ltr";
  onFilterChange: (_filters: TableFilters<T>) => void;
  onSortChange: (_sort: TableSort<T>) => void;
  onPageChange: (_page: number) => void;
}

export const ServerTable = <T,>({
  columns,
  queryResult,
  rowsPerPage = 5,
  direction,
  onFilterChange,
  onSortChange,
  onPageChange,
}: ServerTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const filterChangeHandler = (filters: TableFilters<T>) => {
    onFilterChange(filters);
    setCurrentPage(1);
  };

  const sortChangeHandler = (sort: TableSort<T>) => {
    onSortChange(sort);
    setCurrentPage(1);
  };

  const pageChangeHandler = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  return (
    <div className="table-container" dir="rtl">
      <Header
        columns={columns}
        onFilterChange={filterChangeHandler}
        onSortChange={sortChangeHandler}
      />
      <Body columns={columns} queryResult={queryResult} mode="server" />
      <Pagination
        queryResult={queryResult}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        mode="server"
        onPageChange={pageChangeHandler}
        direction={direction}
      />
    </div>
  );
};