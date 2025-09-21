import React from "react";
import { useMemo } from "react";
import { AsyncResult, ListServerResponse } from "../types";

interface PaginatorProps<T> {
  data?: T[];
  queryResult?: AsyncResult<ListServerResponse<T> | undefined>;
  rowsPerPage: number;
  currentPage: number;
  mode: "client" | "server";
  onPageChange: (_page: number) => void;
  direction?: "ltr" | "rtl";
}

export const Pagination = <T,>({
  data,
  queryResult,
  currentPage,
  rowsPerPage,
  mode,
  onPageChange,
  direction = "ltr",
}: PaginatorProps<T>) => {
  const isServer = mode === "server";

  const items: T[] = isServer
    ? useMemo(() => {
      if (!queryResult?.data) {
        return [];
      }
      const entry = Object.entries(queryResult.data).find(([_k, v]) =>
        Array.isArray(v)
      );
      return (entry?.[1] ?? []) as T[];
    }, [queryResult?.data])
    : data ?? [];

  const totalItems: number = isServer
    ? queryResult?.data?.totalItems ?? 0
    : items.length;

  // Handle page change with direction awareness
  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
  };

  return (
    <div className={`pagination-container ${direction}`}>
      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label={direction === "rtl" ? "Next page" : "Previous page"}
        >
          {direction === "rtl" ? "→" : "←"}
        </button>
        <span>{currentPage}</span>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={rowsPerPage * currentPage >= totalItems}
          aria-label={direction === "rtl" ? "Previous page" : "Next page"}
        >
          {direction === "rtl" ? "←" : "→"}
        </button>
      </div>
      <div className="pagination-info">
        <p>در حال حاضر شاهد نمایش رکوردهای</p>
        <p className="from-to-text">{`${rowsPerPage * currentPage - (rowsPerPage - 1)} تا ${rowsPerPage * currentPage > totalItems
          ? totalItems
          : rowsPerPage * currentPage
          }`}</p>
        <p>از</p>
        <p className="total-items-text">{totalItems}</p>
        <p>رکورد موجود هستید</p>
      </div>
    </div>
  );
};