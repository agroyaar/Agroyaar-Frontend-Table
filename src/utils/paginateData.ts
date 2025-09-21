export const paginateData = <T>(
  data: T[],
  currentPage: number,
  itemsPerPage: number,
  onPagingDone: (_paginatedData: T[]) => void
) => {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const paginatedData = data.slice(start, end);

  onPagingDone(paginatedData);
};
