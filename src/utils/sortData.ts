import { TableSort } from "../types";

export const sortData = <T>(
  data: T[],
  sort: TableSort<T>,
  onSortDone: (_sortedData: T[]) => void
) => {
  if (!sort) {
    onSortDone(data);
  } else {
    const { key, direction } = sort;
    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      } 
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    onSortDone(sortedData);
  }
};
