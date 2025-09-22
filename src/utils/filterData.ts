import { Column, DataColumn, TableFilters } from "../types";

export const filterData = <T>(
  columns: Column<T>[],
  data: T[],
  filters: TableFilters<T>,
  onFilterDone: (_filteredData: T[]) => void
) => {
  const filteredData = data.filter((row) => {
    return columns.every((column) => {
      const filterValue = filters[(column as DataColumn<T>).accessor];
      if (!filterValue) {
        return true;
      }
      const cellValue = row[(column as DataColumn<T>).accessor];
      if ((column as DataColumn<T>).filterType === "range") {
        const { min, max } = filterValue as { min?: number; max?: number };
        if (min !== undefined && Number(cellValue) < min) {
          return false;
        }
        if (max !== undefined && Number(cellValue) > max) {
          return false;
        }
        return true;
      } else {
        return String(cellValue)
          .toLowerCase()
          .includes(filterValue.toString().toLowerCase());
      }
    });
  });

  onFilterDone(filteredData);
};
