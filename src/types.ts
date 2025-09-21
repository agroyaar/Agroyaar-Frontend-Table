import React from "react";

export type DataColumn<T> = {
  accessor: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: "text" | "range" | "select";
  filterOptions?: { label: string; value: string }[];
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

export type ActionColumn<T> = {
  label: string;
  render: (row: T) => React.ReactNode;
};

export type Column<T> = DataColumn<T> | ActionColumn<T>;

export interface AsyncResult<T> {
  data?: T;
  error?: any;
  isLoading?: boolean;
}

export interface ListServerResponse<T> {
  totalItems: number;
  [key: string]: T[] | number;
}

export type TableFilters<T> = {
  [_K in keyof T]?: string | { min?: number; max?: number };
};

export type TableSort<T> = { key: keyof T; direction: "asc" | "desc" } | null;

export type CommonTableProps<T> = {
  columns: Column<T>[];
  rowsPerPage: number;
  queryResult: AsyncResult<ListServerResponse<T>>;
  direction?: "rtl" | "ltr";
};

export type ClientTableProps<T> = {
  mode: "client";
  dataKey: string;
} & CommonTableProps<T>;

export type ServerTableProps<T> = {
  mode: "server";
  onFilterChange: (_filter: any) => void;
  onSortChange: (_sort: any) => void;
  onPageChange: (_page: number) => void;
} & CommonTableProps<T>;

export type TableProps<T> = ClientTableProps<T> | ServerTableProps<T>;
