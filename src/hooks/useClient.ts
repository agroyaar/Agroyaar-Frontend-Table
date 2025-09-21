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

  // if page changed, data sorted or filtered paginated handler must be run (in filter and sort page must be reset to 1)
  useEffect(() => {
    paginateData(sortedData, currentPage, rowsPerPage, (paginateData) =>
      setPaginatedData(paginateData)
    );
  }, [currentPage, sortedData, filteredData]);

  // if filter changed sort also must be rerurn again to re sort new filtered items
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
