import { useEffect, useState } from "react";
import { Column, TableFilters, TableSort } from "../types";
import { paginateData } from "../utils/paginateData";
import { sortData } from "../utils/sortData";
import { filterData } from "../utils/filterData";

export const useClient = <T>(
  columns: Column<T>[],
  data: T[],
  rowsPerPage: number,
  currentPage: number,
  currentSort: TableSort<T>,
  filters: TableFilters<T>
) => {
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [sortedData, setSortData] = useState<T[]>(data);
  const [paginatedData, setPaginatedData] = useState<T[]>(
    data.slice(0, rowsPerPage)
  );

  useEffect(() => {
    paginateData(sortedData, currentPage, rowsPerPage, (paginateData) =>
      setPaginatedData(paginateData)
    );
  }, [currentPage, sortedData, filteredData]);

  useEffect(() => {
    sortData(filteredData, currentSort, (sortedData) =>
      setSortData(sortedData)
    );
  }, [currentSort, filteredData]);

  useEffect(() => {
    filterData(columns, data, filters, (filteredData) =>
      setFilteredData(filteredData)
    );
  }, [filters]);

  return [filteredData, paginatedData];
};
