import { useMemo } from "react";
import React from "react";
import {
  AsyncResult,
  Column,
  ListServerResponse,
} from "../types";

interface TBodyProps<T> {
  columns: Column<T>[];
  data?: T[];
  queryResult?: AsyncResult<ListServerResponse<T> | undefined>;
  mode: "client" | "server";
}

export const Body = <T,>({
  columns,
  data,
  queryResult,
  mode,
}: TBodyProps<T>) => {
  const isServer = mode === "server";

  const items: T[] = useMemo(() => {
    if (isServer) {
      if (!queryResult?.data) {
        return [];
      }
      const entry = Object.entries(queryResult.data).find(([_, v]) =>
        Array.isArray(v)
      );
      return (entry?.[1] ?? []) as T[];
    }
    return data ?? [];
  }, [isServer, queryResult?.data, data]);

  const loading = queryResult?.isLoading;

  if (loading) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length} className="loading-state">
            در حال دریافت اطلاعات
          </td>
        </tr>
      </tbody>
    );
  }

  if (items.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length} className="empty-state">
            فاقد اطلاعات
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {items.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((column, colIndex) => {
            if ("accessor" in column) {
              const value = row[column.accessor];
              return (
                <td key={colIndex}>
                  <span className="cell-text">
                    {column.render ? column.render(value, row) : String(value ?? "")}
                  </span>
                </td>
              );
            }
            return (
              <td key={colIndex}>
                <span className="cell-text">
                  {column.render ? column.render(row) : null}
                </span>
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};
